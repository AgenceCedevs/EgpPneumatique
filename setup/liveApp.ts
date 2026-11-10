// npx tsx setup/liveApp.ts [--reset-db] [--free-ports] [--repair-wsl] [--reset-wsl]
import "dotenv/config";
import { type ExecSyncOptions, execSync, spawn } from "node:child_process";

// ---------------------------------------------------------
// Configuration
// ---------------------------------------------------------
const CONFIG = {
	dockerPath: process.env.DOCKER_DESKTOP_PATH || "C:/Program Files/Docker/Docker/Docker Desktop.exe",
	dockerWaitAttempts: Number(process.env.DOCKER_WAIT_ATTEMPTS) || 40,
	dockerWaitInterval: Number(process.env.DOCKER_WAIT_INTERVAL_MS) || 3000,
	dbWaitAttempts: Number(process.env.DB_WAIT_ATTEMPTS) || 40,
	dbWaitInterval: Number(process.env.DB_WAIT_INTERVAL_MS) || 2500,
	dbInitScript: "npm run db:init",
	criticalPorts: [5432, 5050],
	// Services Windows connus pouvant occuper les ports (uniquement avec --free-ports)
	knownWindowsServices: ["postgresql-x64-16", "postgresql-x64-15", "pgadmin4"],
	// Processus que --free-ports a le droit de tuer (jamais Docker lui-même)
	killableProcesses: ["postgres.exe", "pgadmin4.exe"],
} as const;

const DEBUG = process.env.DEBUG === "1";

// ---------------------------------------------------------
// Options de la ligne de commande
// ---------------------------------------------------------
const ARGS = new Set(process.argv.slice(2));
const OPTIONS = {
	/** Supprime aussi les volumes du projet (base de données vidée) */
	resetDb: ARGS.has("--reset-db"),
	/** Arrête les services/processus PostgreSQL Windows qui bloquent les ports */
	freePorts: ARGS.has("--free-ports"),
	/** Autorise la réparation WSL (destructive) si Docker ne démarre pas */
	repairWsl: ARGS.has("--repair-wsl"),
	/** Ferme Docker Desktop puis fait un wsl --shutdown avant le build */
	resetWsl: ARGS.has("--reset-wsl"),
} as const;

// ---------------------------------------------------------
// Processus enfants à nettoyer au CTRL+C
// ---------------------------------------------------------
const childProcesses: ReturnType<typeof spawn>[] = [];

const cleanExit = (): void => {
	console.log("\n\n🔴 Interruption reçue — arrêt propre des processus...");
	for (const child of childProcesses) {
		if (child.pid && !child.killed) {
			try {
				// /T : tue aussi l'arbre de processus lancé via cmd.exe
				execSync(`taskkill /PID ${child.pid} /T /F`, {
					stdio: "ignore",
					shell: "cmd.exe",
				});
			} catch {
				// Processus déjà terminé
			}
		}
	}
	process.exit(0);
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);

// ---------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------
type LogLevel = "info" | "success" | "warn" | "error" | "debug";

const COLORS: Record<LogLevel | "reset", string> = {
	info: "\x1b[34m",
	success: "\x1b[32m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
	debug: "\x1b[90m",
	reset: "\x1b[0m",
};

function log(message: string, level: LogLevel = "info"): void {
	if (level === "debug" && !DEBUG) return;
	console.log(`${COLORS[level]}${message}${COLORS.reset}`);
}

function step(label: string, title: string): void {
	console.log("══════════════════════════════════════════════════");
	console.log(`Étape ${label}`);
	console.log(`🔵 ${title}`);
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function run(cmd: string, opts: ExecSyncOptions = {}): void {
	log(`▶ ${cmd}`, "debug");
	try {
		execSync(cmd, {
			stdio: "inherit",
			shell: "cmd.exe",
			...opts,
		});
	} catch (err) {
		const { status, signal } = err as {
			status?: number | null;
			signal?: string | null;
		};
		throw new Error(`Commande échouée : ${cmd} (code ${status ?? "aucun"}, signal ${signal ?? "aucun"})`);
	}
}

function tryRun(cmd: string, opts: ExecSyncOptions = {}): boolean {
	try {
		log(`▶ ${cmd}`, "debug");
		execSync(cmd, {
			stdio: "ignore",
			shell: "cmd.exe",
			...opts,
		});
		return true;
	} catch {
		return false;
	}
}

function capture(cmd: string): string {
	try {
		log(`▶ ${cmd}`, "debug");
		return execSync(cmd, {
			encoding: "utf8",
			shell: "cmd.exe",
			stdio: ["ignore", "pipe", "ignore"],
		});
	} catch {
		return "";
	}
}

// ---------------------------------------------------------
// Docker
// ---------------------------------------------------------
const isDockerUp = (): boolean => tryRun("docker version");

function startDockerDesktop(): void {
	log("🔵 Démarrage de Docker Desktop...", "info");
	tryRun(`start "" "${CONFIG.dockerPath}"`);
}

async function waitUntilDockerUp(): Promise<boolean> {
	for (let i = 0; i < CONFIG.dockerWaitAttempts; i++) {
		if (isDockerUp()) return true;
		log(`🟡 Docker en attente (${i + 1}/${CONFIG.dockerWaitAttempts})`, "warn");
		await sleep(CONFIG.dockerWaitInterval);
	}
	return false;
}

async function repairWSL(): Promise<void> {
	log("🔴 Réparation forcée du moteur WSL (destructive)...", "error");
	tryRun("wsl --shutdown");
	await sleep(2000);
	tryRun("wsl --unregister docker-desktop");
	tryRun("wsl --unregister docker-desktop-data");
	await sleep(2000);
	tryRun("wsl --update");
	log("🔵 WSL a été mis à jour et réinitialisé", "info");
	await sleep(3000);
}

// ---------------------------------------------------------
// Ports
// ---------------------------------------------------------
type PortOwner = { port: number; pid: number; name: string };

function getProcessName(pid: number): string {
	const out = capture(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
	const match = out.match(/^"([^"]+)"/m);
	return match?.[1] ?? "inconnu";
}

function getPortOwners(port: number): PortOwner[] {
	const stdout = capture(`netstat -ano | findstr :${port}`);
	const pids = new Set<number>();

	for (const line of stdout.split(/\r?\n/)) {
		const cols = line.trim().split(/\s+/);
		const local = cols[1];
		const state = cols[3];
		const pid = Number(cols[4]);
		if (state !== "LISTENING" || !local?.endsWith(`:${port}`)) continue;
		if (Number.isNaN(pid) || pid <= 0) continue;
		pids.add(pid);
	}

	return [...pids].map((pid) => ({ port, pid, name: getProcessName(pid) }));
}

function findPortConflicts(): PortOwner[] {
	return CONFIG.criticalPorts.flatMap((port) => getPortOwners(port));
}

type DockerContainer = { id: string; name: string };

function getDockerContainersOnPort(port: number): DockerContainer[] {
	const out = capture(`docker ps --filter "publish=${port}" --format "{{.ID}}|{{.Names}}"`);
	return out
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.map((line) => {
			const [id = "", name = ""] = line.split("|");
			return { id, name };
		});
}

// ---------------------------------------------------------
// Étapes du Pipeline
// ---------------------------------------------------------
async function ensureDocker(): Promise<void> {
	step("3/8 - 37.5%", "Vérification de Docker Desktop...");

	if (isDockerUp()) {
		log("🟢 Docker est déjà opérationnel !", "success");
		return;
	}

	startDockerDesktop();
	if (await waitUntilDockerUp()) {
		log("🟢 Docker est opérationnel !", "success");
		return;
	}

	if (!OPTIONS.repairWsl) {
		throw new Error(`Docker reste indisponible après ${CONFIG.dockerWaitAttempts} tentatives. Vérifiez Docker Desktop, ou relancez avec --repair-wsl (destructif : réinitialise les distributions WSL de Docker).`);
	}

	await repairWSL();
	startDockerDesktop();
	if (!(await waitUntilDockerUp())) {
		throw new Error("Échec critique : Docker ne peut pas démarrer.");
	}
	log("🟢 Docker est opérationnel après réparation WSL !", "success");
}

async function stopProjectContainers(): Promise<void> {
	step("4/8 - 50%", "Arrêt des conteneurs du projet...");

	if (OPTIONS.resetDb) {
		log("🟡 --reset-db : les volumes du projet seront supprimés.", "warn");
		tryRun("docker compose --progress quiet down --remove-orphans -v");
	} else {
		tryRun("docker compose --progress quiet down --remove-orphans");
	}
	log("🟢 Conteneurs du projet arrêtés (autres projets préservés).", "success");
}

async function stopDockerContainersOnPorts(ports: number[]): Promise<void> {
	// docker stop = arrêt sans suppression : conteneurs et volumes restent intacts
	for (const port of ports) {
		for (const container of getDockerContainersOnPort(port)) {
			log(`🟡 Port ${port} publié par le conteneur "${container.name}" (${container.id}) : arrêt...`, "warn");
			if (tryRun(`docker stop ${container.id}`)) {
				log(`🟢 Conteneur "${container.name}" arrêté`, "success");
			}
		}
	}
}

async function waitForPortsFree(): Promise<PortOwner[]> {
	let conflicts = findPortConflicts();
	for (let i = 0; i < 10 && conflicts.length > 0; i++) {
		await sleep(1000);
		conflicts = findPortConflicts();
	}
	return conflicts;
}

async function ensurePortsFree(): Promise<void> {
	step("5/8 - 62.5%", `Vérification des ports ${CONFIG.criticalPorts.join(", ")}...`);

	let conflicts = findPortConflicts();
	if (conflicts.length === 0) {
		log("🟢 Ports disponibles.", "success");
		return;
	}

	// 1. Conteneurs Docker d'un autre projet (arrêtés automatiquement, sans perte de données)
	await stopDockerContainersOnPorts(CONFIG.criticalPorts.slice());
	conflicts = await waitForPortsFree();

	// 2. Processus Windows locaux (PostgreSQL, pgAdmin) : uniquement avec --free-ports
	if (conflicts.length > 0 && OPTIONS.freePorts) {
		log("🟡 --free-ports : arrêt des services Windows bloquants...", "warn");

		for (const service of CONFIG.knownWindowsServices) {
			tryRun(`net stop ${service} /y`);
		}

		for (const owner of conflicts) {
			if ((CONFIG.killableProcesses as readonly string[]).includes(owner.name.toLowerCase())) {
				tryRun(`taskkill /F /T /PID ${owner.pid}`);
				log(`🟢 ${owner.name} (PID ${owner.pid}) arrêté`, "success");
			}
		}

		conflicts = await waitForPortsFree();
	}

	if (conflicts.length > 0) {
		for (const c of conflicts) {
			log(`🔴 Port ${c.port} occupé par ${c.name} (PID ${c.pid})`, "error");
		}
		throw new Error("Ports toujours occupés. Si c'est un PostgreSQL/pgAdmin Windows, relancez avec --free-ports. Sinon, redémarrez Docker Desktop.");
	}

	log("🟢 Ports libérés.", "success");
}

async function freeMemoryBeforeBuild(): Promise<void> {
	step("1/8 - 12.5%", "Libération de la mémoire WSL avant le build...");

	if (isDockerUp() && !OPTIONS.resetWsl) {
		log("🟡 Docker est déjà actif : wsl --shutdown ignoré (utilisez --reset-wsl pour forcer).", "warn");
		return;
	}

	if (OPTIONS.resetWsl) {
		log("🟡 --reset-wsl : fermeture de Docker Desktop...", "warn");
		tryRun('taskkill /F /T /IM "Docker Desktop.exe"');
		tryRun("taskkill /F /T /IM com.docker.backend.exe");
		await sleep(2000);
	}

	tryRun("wsl --shutdown");
	await sleep(3000);
	log("🟢 WSL arrêté, mémoire libérée.", "success");
}

async function buildProject(): Promise<void> {
	step("2/8 - 25%", "Compilation des applications (avant Docker, pour limiter la RAM)...");
	run("npm run build:shared");
	run("npm run build -w web");
	log("🟢 Builds terminés avec succès", "success");
}

async function startContainers(): Promise<void> {
	step("6/8 - 75%", "Déploiement des conteneurs...");
	run("docker compose --progress quiet up -d --build");
	log("🟢 Services démarrés", "success");
}

async function waitForDB(): Promise<void> {
	step("7/8 - 87.5%", "Attente de la base de données...");

	const PROJECT_NAME = process.env.PROJECT_NAME;
	if (!PROJECT_NAME) {
		throw new Error("PROJECT_NAME manquant dans le fichier .env racine.");
	}

	const container = `${PROJECT_NAME}_db`;
	for (let i = 0; i < CONFIG.dbWaitAttempts; i++) {
		if (tryRun(`docker exec ${container} pg_isready`)) {
			log("🟢 PostgreSQL est prêt à accepter les connexions !", "success");
			log("🔵 Stabilisation de la base de données...", "info");
			await sleep(3000);
			return;
		}
		log(`🟡 Base de données indisponible (${i + 1}/${CONFIG.dbWaitAttempts})`, "warn");
		await sleep(CONFIG.dbWaitInterval);
	}
	throw new Error(`PostgreSQL ne répond pas après ${CONFIG.dbWaitAttempts} tentatives. Vérifiez le conteneur ${container} et ses variables d'environnement.`);
}

async function startDev(): Promise<void> {
	step("8/8 - 100%", "Lancement de l'environnement Dev");

	const spawnService = (name: string, cmd: string) => {
		log(`\n🔵 [${name}] Démarrage...`, "info");
		const proc = spawn("cmd.exe", ["/c", cmd], {
			stdio: "inherit",
			detached: false,
		});
		childProcesses.push(proc);
		return proc;
	};

	spawnService("Web", "npm run dev -w web");
	const server = spawnService("Server", "npm run dev -w server");

	await new Promise<void>((resolve, reject) => {
		server.on("exit", (code) => {
			if (code === 0 || code === null) resolve();
			else reject(new Error(`Le serveur s'est arrêté brusquement (code ${code})`));
		});
	});
}

async function main(): Promise<void> {
	console.log("══════════════════════════════════════════════════");
	console.log("🔵 LAUNCHER — liveApp");
	console.log("   Simulator live Local");

	const start = Date.now();

	try {
		await freeMemoryBeforeBuild();
		await buildProject();
		await ensureDocker();
		await stopProjectContainers();
		await ensurePortsFree();
		await startContainers();
		await waitForDB();

		log("🔵 Initialisation du schéma de données...", "info");
		run(CONFIG.dbInitScript);

		const totalTime = ((Date.now() - start) / 1000).toFixed(1);
		log(`\n🟢 Pipeline validé en ${totalTime}s`, "success");

		await startDev();
	} catch (err) {
		log(`\n🔴 ERREUR PIPELINE : ${err instanceof Error ? err.message : String(err)}`, "error");
		process.exit(1);
	}
}

main();
