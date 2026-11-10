// Lancement depuis la racine, lorsque l'application est prête :
// npx tsx setup/verify_monorepo/verify_monorepo.ts
import { execSync } from "node:child_process";
import fs, { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envContent = existsSync(".env") ? readFileSync(".env", "utf-8") : "";
const getEnv = (key: string): string => envContent.match(new RegExp(`^${key}=(.+)`, "m"))?.[1]?.trim() ?? "";
const POSTGRES_USER = getEnv("POSTGRES_USER");
const PGDATABASE = getEnv("POSTGRES_DB");

const colors = { reset: "\x1b[0m", bright: "\x1b[1m", dim: "\x1b[2m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", blue: "\x1b[34m", cyan: "\x1b[36m" };
const emoji = { check: "✓", cross: "✗", warning: "⚠", info: "ℹ", rocket: "🚀", docker: "🐳", database: "🗄", api: "🔌", frontend: "🎨", gear: "⚙", folder: "📁", chart: "📊", boom: "💥", party: "🎉", sad: "😞", stack: "📚" };

const PROJECT_NAME = (() => {
	const fromEnv = getEnv("PROJECT_NAME");
	if (fromEnv) return fromEnv;
	try {
		const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
		return pkg.name as string;
	} catch {
		return "app";
	}
})();

let totalPass = 0,
	totalFail = 0,
	totalIgnored = 0,
	totalGenerated = 0,
	reportMarkdown = "",
	currentSectionTests: Array<{ name: string; status: "✓" | "✗" | "⚠" | "⬡" }> = [],
	currentSectionTitle = "";
const allFailedTests: Array<{ section: string; name: string }> = [];
const timestamp = new Date().toLocaleString("fr-FR");
const projectStack: Record<string, unknown> = {};

const log = (message: string, color: keyof typeof colors = "reset"): void => console.log(`${colors[color]}${message}${colors.reset}`);
const logTitle = (title: string): void => {
	console.log("");
	log(`╔${"═".repeat(title.length + 2)}╗`, "blue");
	log(`║ ${title} ║`, "bright");
	log(`╚${"═".repeat(title.length + 2)}╝`, "blue");
	console.log("");
	reportMarkdown += `# ${title}\n\n**Heure du test :** ${timestamp}\n\n`;
};
const logSection = (title: string, icon: keyof typeof emoji = "gear"): void => {
	if (currentSectionTitle && currentSectionTests.length > 0) addSectionToMarkdown();
	console.log("");
	log(`${emoji[icon]}  ${title}`, "cyan");
	log("-".repeat(50), "dim");
	currentSectionTitle = title;
	currentSectionTests = [];
	reportMarkdown += `## ${emoji[icon]}  ${title}\n\n`;
};
const addSectionToMarkdown = (): void => {
	if (currentSectionTests.length === 0) return;
	reportMarkdown += `| Test | Statut |\n|------|--------|\n`;
	for (const test of currentSectionTests) {
		let status = "";
		if (test.status === "✓") {
			status = `<span class="ok"><span class="dot dot-ok"></span> OK</span>`;
		} else if (test.status === "✗") {
			status = `<span class="fail"><span class="dot dot-fail"></span> FAIL</span>`;
			allFailedTests.push({ section: currentSectionTitle, name: test.name });
		} else if (test.status === "⚠") {
			status = `<span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span>`;
		} else if (test.status === "⬡") {
			status = `<span class="generated"><span class="dot dot-generated"></span> GÉNÉRÉ</span>`;
		}
		reportMarkdown += `| ${test.name} | ${status} |\n`;
	}
	reportMarkdown += `\n`;
	currentSectionTests = [];
};

async function test(testName: string, command: string): Promise<{ success: boolean; output: string }> {
	process.stdout.write(`  ${testName} ... `);
	try {
		let output: string;
		if (testName === "web → server (GET /api/health)") {
			const response = await fetch(getHealthUrl(), { signal: AbortSignal.timeout(3000) });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			output = await response.text();
		} else {
			output = execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
		}

		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: testName, status: "✓" });
		totalPass++;
		return { success: true, output: output.trim() };
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		currentSectionTests.push({ name: testName, status: "✗" });
		totalFail++;
		return { success: false, output: "" };
	}
}

function testFile(filePath: string, displayPath: string = filePath): boolean {
	process.stdout.write(`  ${displayPath} ... `);
	const fullPath = resolve(filePath);
	if (existsSync(fullPath)) {
		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: displayPath, status: "✓" });
		totalPass++;
		return true;
	}
	log(`${emoji.cross} FAIL`, "red");
	currentSectionTests.push({ name: displayPath, status: "✗" });
	totalFail++;
	return false;
}

function markGenerated(label: string): void {
	process.stdout.write(`  ${label} ... `);
	log(`⬡ GÉNÉRÉ`, "blue");
	currentSectionTests.push({ name: label, status: "⬡" });
	totalGenerated++;
}

function hasFilesWithExtension(dir: string, extensions: string[]): boolean {
	try {
		const walk = (path: string): boolean => {
			if (!existsSync(path)) return false;
			const files = readdirSync(path, { withFileTypes: true });
			for (const file of files) {
				if (["node_modules", ".git", "dist", "build"].includes(file.name)) continue;
				if (file.isDirectory()) {
					if (walk(resolve(path, file.name))) return true;
				} else if (extensions.some((ext) => file.name.endsWith(ext))) {
					return true;
				}
			}
			return false;
		};
		return walk(dir);
	} catch {
		return false;
	}
}

function extractDependencies(pkgPath: string): Record<string, string> {
	try {
		const content = readFileSync(pkgPath, "utf-8");
		const pkg = JSON.parse(content);
		const declared = { ...pkg.dependencies, ...pkg.devDependencies };
		const workspaceDir = pkgPath.replace("/package.json", "");
		const resolved: Record<string, string> = {};
		for (const name of Object.keys(declared)) {
			const localPath = `${workspaceDir}/node_modules/${name}/package.json`;
			const rootPath = `node_modules/${name}/package.json`;
			try {
				const modulePkg = readFileSync(existsSync(resolve(localPath)) ? localPath : rootPath, "utf-8");
				resolved[name] = JSON.parse(modulePkg).version ?? declared[name];
			} catch {
				resolved[name] = declared[name];
			}
		}
		return resolved;
	} catch {
		return {};
	}
}

function buildProjectTree(dir: string, prefix = ""): string {
	const ignored = ["node_modules", ".git", "dist", "build"];
	let result = "";
	try {
		const entries = readdirSync(dir, { withFileTypes: true });
		const filtered = entries.filter((e) => !ignored.includes(e.name));
		filtered.forEach((entry, index) => {
			const isLast = index === filtered.length - 1;
			const connector = isLast ? "└── " : "├── ";
			const childPrefix = isLast ? "    " : "│   ";
			result += `${prefix}${connector}${entry.name}\n`;
			if (entry.isDirectory()) {
				result += buildProjectTree(resolve(dir, entry.name), prefix + childPrefix);
			}
		});
	} catch {}
	return result;
}

function checkEnvValue(envPath: string, key: string, weakValues: string[], label: string): void {
	process.stdout.write(`  ${label} ... `);
	try {
		const content = readFileSync(envPath, "utf-8");
		const match = content.match(new RegExp(`^${key}=(.+)`, "m"));
		const value = match?.[1]?.trim();
		if (!value) {
			log(`${emoji.cross} FAIL (valeur absente)`, "red");
			currentSectionTests.push({ name: label, status: "✗" });
			totalFail++;
			return;
		}

		const normalized = value.toLowerCase();
		const weak = weakValues.some((candidate) => normalized.includes(candidate.toLowerCase())) || (key === "JWT_SECRET" && value.length < 32);
		if (weak) {
			log(`${emoji.cross} FAIL (valeur faible ou trop courte)`, "red");
			currentSectionTests.push({ name: label, status: "✗" });
			totalFail++;
			return;
		}

		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: label, status: "✓" });
		totalPass++;
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		currentSectionTests.push({ name: label, status: "✗" });
		totalFail++;
	}
}

function checkScriptExists(pkgPath: string, scriptName: string): void {
	const label = `Script "${scriptName}" dans ${pkgPath}`;
	process.stdout.write(`  ${label} ... `);
	try {
		const content = readFileSync(pkgPath, "utf-8");
		const pkg = JSON.parse(content);
		if (pkg.scripts?.[scriptName]) {
			log(`${emoji.check} OK`, "green");
			currentSectionTests.push({ name: label, status: "✓" });
			totalPass++;
		} else {
			log(`${emoji.cross} FAIL`, "red");
			currentSectionTests.push({ name: label, status: "✗" });
			totalFail++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: label, status: "✗" });
		totalFail++;
	}
}

async function verifyProject(): Promise<void> {
	logSection("INFORMATION DU PROJET", "info");
	try {
		const pkgContent = readFileSync("package.json", "utf-8");
		const pkg = JSON.parse(pkgContent);
		projectStack.PROJECT_NAME = pkg.name;
		projectStack.projectVersion = pkg.version;
		projectStack.projectDescription = pkg.description;
		process.stdout.write(`  Nom du projet : ${pkg.name} ... `);
		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: `Nom du projet : ${pkg.name}`, status: "✓" });
		totalPass++;
		process.stdout.write(`  Version : ${pkg.version} ... `);
		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: `Version : ${pkg.version}`, status: "✓" });
		totalPass++;
	} catch {
		process.stdout.write(`  Lecture package.json ... `);
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: "Lecture package.json", status: "✗" });
		totalFail++;
	}
}

async function verifyVersions(): Promise<void> {
	const nodeResult = await test("Node.js", "node --version");
	if (nodeResult.success) projectStack.nodeVersion = nodeResult.output;
	const npmResult = await test("npm", "npm --version");
	if (npmResult.success) projectStack.npmVersion = npmResult.output;
	const biomeResult = await test("Biome", "npx biome --version");
	if (biomeResult.success) projectStack.biomeVersion = biomeResult.output.replace("Version: ", "").trim();
	const frameworks: Record<string, string> = {};
	const toCheck = [
		{ name: "react", path: "node_modules/react/package.json" },
		{ name: "react", path: "web/node_modules/react/package.json" },
		{ name: "express", path: "node_modules/express/package.json" },
		{ name: "express", path: "server/node_modules/express/package.json" },
		{ name: "typescript", path: "node_modules/typescript/package.json" },
		{ name: "vite", path: "node_modules/vite/package.json" },
		{ name: "vite", path: "web/node_modules/vite/package.json" },
	];
	for (const { name, path } of toCheck) {
		if (!frameworks[name] && existsSync(resolve(path))) {
			try {
				const pkg = JSON.parse(readFileSync(path, "utf-8"));
				frameworks[name] = pkg.version;
			} catch {}
		}
	}
	projectStack.frameworkVersions = frameworks;
}

async function verifyDocker(): Promise<void> {
	logSection("VÉRIFICATION DOCKER", "docker");
	await test("Docker installé", "docker --version");
	await test("Docker Compose", "docker compose version");

	process.stdout.write("  PostgreSQL en cours d'exécution ... ");
	try {
		const containers = execSync('docker ps --format "{{.Names}}"', { encoding: "utf-8" });
		if (!containers.split(/\r?\n/).some((name) => name === `${PROJECT_NAME}_db`)) {
			throw new Error(`Conteneur ${PROJECT_NAME}_db absent ou arrêté`);
		}

		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: "PostgreSQL en cours d'exécution", status: "✓" });
		totalPass++;
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		currentSectionTests.push({ name: "PostgreSQL en cours d'exécution", status: "✗" });
		totalFail++;
	}
}

async function verifyDatabase(): Promise<void> {
	logSection("VÉRIFICATION BASE DE DONNÉES", "database");
	await test("Connexion à PostgreSQL", `docker exec ${PROJECT_NAME}_db psql -U ${POSTGRES_USER} -d ${PGDATABASE} -c "SELECT 1"`);
	await test("Table 'users' existe", `docker exec ${PROJECT_NAME}_db psql -U ${POSTGRES_USER} -d ${PGDATABASE} -c "SELECT 1 FROM users LIMIT 1"`);
}

async function verifyBackend(): Promise<void> {
	logSection("VÉRIFICATION SERVER", "gear");
	testFile("server/.env", "server/.env");
	testFile("server/src/index.ts", "server/src/index.ts");
	await test("Package 'express' installé", "npm list express -w server");
	await test("Package 'pg' installé", "npm list pg -w server");
	projectStack.serverDependencies = extractDependencies("server/package.json");
}

async function verifyFrontends(): Promise<void> {
	logSection("VÉRIFICATION FRONTEND (Web)", "frontend");
	testFile("web", "Dossier web/");
	process.stdout.write(`  Fichiers TypeScript/TSX ... `);
	if (hasFilesWithExtension("web", [".tsx", ".ts"])) {
		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: "Fichiers TypeScript/TSX", status: "✓" });
		totalPass++;
	} else {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: "Fichiers TypeScript/TSX", status: "✗" });
		totalFail++;
	}
	testFile("web/package.json", "package.json");
	const webDeps = extractDependencies("web/package.json");
	projectStack.webDependencies = webDeps;
	logSection("VÉRIFICATION FRONTEND (Mobile)", "frontend");
	testFile("mobile", "Dossier mobile/");
	testFile("mobile/package.json", "package.json");
	const mobileDeps = extractDependencies("mobile/package.json");
	projectStack.mobileDependencies = mobileDeps;
}

async function verifyConfig(): Promise<void> {
	logSection("VÉRIFICATION CONFIGURATION", "gear");
	testFile("docker-compose.yml", "docker-compose.yml");
	testFile(".gitignore", ".gitignore");
}

async function verifyMonorepo(): Promise<void> {
	logSection("VÉRIFICATION MONOREPO", "folder");
	try {
		let count = 0;
		const walk = (path: string) => {
			const files = readdirSync(path, { withFileTypes: true });
			for (const file of files) {
				if (["node_modules", ".git"].includes(file.name)) continue;
				if (file.isDirectory()) {
					walk(resolve(path, file.name));
				} else if (file.name === "package.json") {
					count++;
				}
			}
		};
		walk(".");
		process.stdout.write(`  Détection monorepo : ${count} package.json ... `);
		if (count >= 2) {
			log(`${emoji.check} OK`, "green");
			currentSectionTests.push({ name: `${count} package.json détectés`, status: "✓" });
			totalPass++;
		} else {
			log(`${emoji.cross} FAIL`, "red");
			currentSectionTests.push({ name: "Monorepo structure", status: "✗" });
			totalFail++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		totalFail++;
	}
}

function getHealthUrl(): string {
	const serverEnv = readFileSync("server/.env", "utf-8");
	const webEnv = readFileSync("web/.env", "utf-8");
	const port = serverEnv.match(/^PORT=(.+)$/m)?.[1]?.trim();
	const configuredUrl = webEnv.match(/^VITE_API_URL=(.+)$/m)?.[1]?.trim();
	const baseUrl = configuredUrl || `http://localhost:${port || "3310"}/api`;
	return `${baseUrl.replace(/\/+$/, "")}/health`;
}

async function verifyAPI(): Promise<void> {
	logSection("VÉRIFICATION API", "api");
	process.stdout.write("  Serveur backend ... ");
	try {
		const response = await fetch(getHealthUrl(), { signal: AbortSignal.timeout(3000) });
		const data = (await response.json()) as { status?: string };
		if (!response.ok || data.status !== "ok") {
			throw new Error(`L'API répond avec le statut HTTP ${response.status}`);
		}

		log(`${emoji.check} OK`, "green");
		currentSectionTests.push({ name: "Backend accessible", status: "✓" });
		totalPass++;
		projectStack.apiStatus = "running";
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		totalFail++;
		currentSectionTests.push({ name: "Backend accessible", status: "✗" });
		projectStack.apiStatus = "not_running";
	}
}

async function verifyWorkspaceLinks(): Promise<void> {
	logSection("LIAISONS ENTRE WORKSPACES", "rocket");
	testFile("server/.env", "server/.env présent");
	testFile("web/.env", "web/.env présent");
	testFile(".env", ".env (racine) présent");
	process.stdout.write("  Cohérence PORT server/.env vs VITE_API_URL web/.env ... ");
	try {
		const serverEnv = readFileSync("server/.env", "utf-8");
		const webEnv = readFileSync("web/.env", "utf-8");
		const serverPort = serverEnv.match(/^PORT=(\d+)/m)?.[1];
		const webApiUrl = webEnv.match(/^VITE_API_URL=.*:(\d+)/m)?.[1];
		if (serverPort && webApiUrl && serverPort === webApiUrl) {
			log(`${emoji.check} OK (port ${serverPort})`, "green");
			currentSectionTests.push({ name: "Cohérence ports server ↔ web", status: "✓" });
			totalPass++;
		} else {
			log(`${emoji.cross} FAIL (server:${serverPort} ≠ web:${webApiUrl})`, "red");
			currentSectionTests.push({ name: "Cohérence ports server ↔ web", status: "✗" });
			totalFail++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: "Cohérence ports server ↔ web", status: "✗" });
		totalFail++;
	}
	process.stdout.write("  Cohérence PGDATABASE server/.env vs .env racine ... ");
	try {
		const serverEnv = readFileSync("server/.env", "utf-8");
		const rootEnv = readFileSync(".env", "utf-8");
		const serverDb = serverEnv.match(/^PGDATABASE=(.+)/m)?.[1];
		const rootDb = rootEnv.match(/^POSTGRES_DB=(.+)/m)?.[1];
		if (serverDb && rootDb && serverDb === rootDb) {
			log(`${emoji.check} OK (${serverDb})`, "green");
			currentSectionTests.push({ name: "Cohérence PGDATABASE server ↔ docker", status: "✓" });
			totalPass++;
		} else {
			log(`${emoji.cross} FAIL (server:${serverDb} ≠ docker:${rootDb})`, "red");
			currentSectionTests.push({ name: "Cohérence PGDATABASE server ↔ docker", status: "✗" });
			totalFail++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: "Cohérence PGDATABASE server ↔ docker", status: "✗" });
		totalFail++;
	}
	await test("server → DB (SELECT 1)", `docker exec ${PROJECT_NAME}_db psql -U ${POSTGRES_USER} -d ${PGDATABASE} -c "SELECT 1"`);
	await test("server → DB (table users)", `docker exec ${PROJECT_NAME}_db psql -U ${POSTGRES_USER} -d ${PGDATABASE} -c "SELECT COUNT(*) FROM users"`);
	await test("web → server (GET /api/health)", "curl -s http://localhost:3310/api/health --connect-timeout 3");
	await test("express installé (server)", "npm list express -w server");
	await test("pg installé (server)", "npm list pg -w server");
	await test("react installé (web)", "npm list react -w web");
	process.stdout.write("  React Native installé (mobile) ... ");
	log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
	totalIgnored++;
	currentSectionTests.push({ name: "React Native (non configuré)", status: "⚠" });
	process.stdout.write("  Cloudinary configuré (server/.env) ... ");
	try {
		const serverEnv = readFileSync("server/.env", "utf-8");
		if (serverEnv.match(/CLOUDINARY.*=PENDING/)) {
			log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
			totalIgnored++;
			currentSectionTests.push({ name: "Cloudinary configuré", status: "⚠" });
		} else {
			log(`${emoji.check} OK`, "green");
			totalPass++;
			currentSectionTests.push({ name: "Cloudinary configuré", status: "✓" });
		}
	} catch {
		log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
		totalIgnored++;
		currentSectionTests.push({ name: "Cloudinary configuré", status: "⚠" });
	}
	process.stdout.write("  EmailJS configuré (server/.env) ... ");
	try {
		const serverEnv = readFileSync("server/.env", "utf-8");
		if (serverEnv.match(/EMAILJS.*=PENDING/)) {
			log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
			totalIgnored++;
			currentSectionTests.push({ name: "EmailJS configuré", status: "⚠" });
		} else {
			log(`${emoji.check} OK`, "green");
			totalPass++;
			currentSectionTests.push({ name: "EmailJS configuré", status: "✓" });
		}
	} catch {
		log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
		totalIgnored++;
		currentSectionTests.push({ name: "EmailJS configuré", status: "⚠" });
	}
}

async function verifySecurity(): Promise<void> {
	logSection("SÉCURITÉ", "warning" as keyof typeof emoji);
	checkEnvValue("server/.env", "JWT_SECRET", ["changeme", "secret", "password", "123456", "jwt_secret"], "JWT_SECRET robuste");
	checkEnvValue("server/.env", "NODE_ENV", [], "NODE_ENV défini (server)");
	process.stdout.write("  .env dans .gitignore ... ");
	try {
		const gitignore = readFileSync(".gitignore", "utf-8");
		if (gitignore.includes(".env")) {
			log(`${emoji.check} OK`, "green");
			currentSectionTests.push({ name: ".env dans .gitignore", status: "✓" });
			totalPass++;
		} else {
			log(`${emoji.cross} FAIL`, "red");
			currentSectionTests.push({ name: ".env dans .gitignore", status: "✗" });
			totalFail++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: ".env dans .gitignore", status: "✗" });
		totalFail++;
	}
	testFile(".env.sample", ".env.sample présent");
	process.stdout.write("  CORS CLIENT_URL non wildcard ... ");
	try {
		const serverEnv = readFileSync("server/.env", "utf-8");
		const match = serverEnv.match(/^CLIENT_URL=(.+)/m);
		const value = match?.[1]?.trim();
		if (!value) {
			log(`${emoji.warning} Non configuré (ignoré)`, "yellow");
			totalIgnored++;
			currentSectionTests.push({ name: "CORS CLIENT_URL défini", status: "⚠" });
		} else if (value === "*") {
			log(`${emoji.cross} FAIL (wildcard dangereux)`, "red");
			currentSectionTests.push({ name: "CORS CLIENT_URL non wildcard", status: "✗" });
			totalFail++;
		} else {
			log(`${emoji.check} OK (${value})`, "green");
			currentSectionTests.push({ name: "CORS CLIENT_URL non wildcard", status: "✓" });
			totalPass++;
		}
	} catch {
		log(`${emoji.cross} FAIL`, "red");
		currentSectionTests.push({ name: "CORS CLIENT_URL non wildcard", status: "✗" });
		totalFail++;
	}
}

async function verifyCodeQuality(): Promise<void> {
	logSection("QUALITÉ DU CODE", "gear");
	await test("Biome check", "npx biome check --files-ignore-unknown=true");
	await test("TypeScript", "npm run tsc");

	const packages = [
		["package.json", ["dev", "start"]],
		["server/package.json", ["dev", "build", "start"]],
		["web/package.json", ["dev", "build"]],
	] as [string, string[]][];

	for (const [pkg, scripts] of packages) {
		for (const script of scripts) {
			checkScriptExists(pkg, script);
		}
	}
}

async function verifyTests(): Promise<void> {
	logSection("TESTS", "gear");
	const packages = [
		{ label: "racine", path: "package.json", command: "npm test" },
		{ label: "server", path: "server/package.json", command: "npm test -w server" },
		{ label: "web", path: "web/package.json", command: "npm test -w web" },
	];

	for (const item of packages) {
		const pkg = JSON.parse(readFileSync(item.path, "utf-8"));
		if (!pkg.scripts?.test) {
			process.stdout.write(`  npm test (${item.label}) ... `);
			log(`${emoji.warning} aucun script test défini`, "yellow");
			currentSectionTests.push({ name: `npm test (${item.label}) non configuré`, status: "⚠" });
			totalIgnored++;
			continue;
		}

		await test(`npm test (${item.label})`, item.command);
	}
}

async function verifyGit(): Promise<void> {
	logSection("GIT / CI", "folder");
	testFile(".git", "Git initialisé (.git/)");
}

async function verifyPerformance(): Promise<void> {
	logSection("PERFORMANCE", "chart");

	process.stdout.write("  Temps de réponse /api/health ... ");
	try {
		for (let attempt = 0; attempt < 5; attempt++) {
			try {
				await fetch(getHealthUrl(), { signal: AbortSignal.timeout(3000) });
				break;
			} catch {
				await new Promise((resolveWait) => setTimeout(resolveWait, 1000));
			}
		}
		const startedAt = performance.now();
		const response = await fetch(getHealthUrl(), { signal: AbortSignal.timeout(3000) });
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const ms = Math.round(performance.now() - startedAt);
		log(`${emoji.check} OK (${ms}ms)`, "green");
		currentSectionTests.push({ name: `Temps réponse API : ${ms}ms`, status: "✓" });
		totalPass++;
		projectStack.apiResponseMs = ms;
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		currentSectionTests.push({ name: "Temps de réponse API", status: "✗" });
		totalFail++;
	}

	process.stdout.write("  Taille dist/ (web) ... ");
	try {
		const getSize = (target: string): number =>
			fs.readdirSync(target, { withFileTypes: true }).reduce((total, entry) => {
				const entryPath = resolve(target, entry.name);
				return total + (entry.isDirectory() ? getSize(entryPath) : fs.statSync(entryPath).size);
			}, 0);
		const bytes = getSize("web/dist");
		const size = `${(bytes / 1024).toFixed(1)} KB`;
		log(`${emoji.check} OK (${size})`, "green");
		currentSectionTests.push({ name: `Build size : ${size}`, status: "✓" });
		totalPass++;
		projectStack.buildSize = size;
	} catch (error) {
		log(`${emoji.cross} FAIL (${error instanceof Error ? error.message : error})`, "red");
		currentSectionTests.push({ name: "Build size web/dist/", status: "✗" });
		totalFail++;
	}
}

function addStackToMarkdown(): void {
	reportMarkdown += `## ${emoji.stack}  STACK TECHNIQUE\n\n`;
	reportMarkdown += `<!-- ==================================== -->
# 📦 Infos\n\n| Prop | Valeur |\n|------|--------|\n`;
	reportMarkdown += `| **Nom** | ${projectStack.PROJECT_NAME} |\n`;
	reportMarkdown += `| **Version** | ${projectStack.projectVersion} |\n\n`;
	reportMarkdown += `<!-- ==================================== -->
# 🛠 Outils\n\n| Outil | Version |\n|-------|---------|\n`;
	reportMarkdown += `| **Node.js** | ${projectStack.nodeVersion} |\n`;
	reportMarkdown += `| **npm** | ${projectStack.npmVersion} |\n`;
	reportMarkdown += `| **Biome** | ${projectStack.biomeVersion} |\n\n`;
}

function printSummary(): void {
	addSectionToMarkdown();
	console.log("");
	log("═".repeat(60), "blue");
	log(`\n${emoji.chart}  RÉSUMÉ`, "bright");
	log(`\n  ${emoji.check} Réussis   : ${colors.green}${totalPass}${colors.reset}`, "reset");
	log(`  ${emoji.cross} Échoués   : ${colors.red}${totalFail}${colors.reset}`, "reset");
	log(`  ${emoji.warning} Ignorés   : ${colors.yellow}${totalIgnored}${colors.reset}`, "reset");
	log(`  ⬡ Générés   : ${colors.blue}${totalGenerated}${colors.reset}`, "reset");
	const total = totalPass + totalFail;
	const percentage = total > 0 ? Math.round((totalPass / total) * 100) : 0;
	log(`  >>Taux      : ${percentage}%\n`, "reset");

	if (totalFail === 0) {
		log("═".repeat(60), "green");
		log(`\n${emoji.party}  DIAGNOSTIC TERMINÉ — vérifiez les tests ignorés avant livraison`, "green");
	} else {
		log("═".repeat(60), "red");
		log(`\n${emoji.sad}  ERREURS DÉTECTÉES\n`, "red");
		let lastSection = "";
		for (const failure of allFailedTests) {
			if (failure.section !== lastSection) {
				log(`\n  ${failure.section}`, "cyan");
				lastSection = failure.section;
			}
			log(`    ${emoji.cross} ${failure.name}`, "red");
		}
		console.log("");
	}

	log("═".repeat(60), "blue");
	console.log("");
}

function exportReport(): void {
	const fileName = `setup/verify_monorepo/verify-report-${new Date().toISOString().split("T")[0]}.md`;
	const readmeFileName = "README.md";
	try {
		const cssContent = getReportCSS();
		writeFileSync("setup/verify_monorepo/report.css", cssContent, "utf-8");
		const percentage = totalPass + totalFail > 0 ? Math.round((totalPass / (totalPass + totalFail)) * 100) : 0;
		const summaryMarkdown = `<div class="summary"><div class="summary-left"><div class="summary-item pass"style="color:white!important"> Réussis : ${totalPass}</div><div class="summary-item fail"style="color:white!important"> Échoués : ${totalFail}</div><div class="summary-item ignored"style="color:white!important"> Ignorés : ${totalIgnored}</div><div class="summary-item generated"style="color:white!important"> Générés : ${totalGenerated}</div></div><div class="summary-divider"></div><div class="summary-rate" style="color:white!important">📊 Taux : ${percentage}%</div></div>`;
		const styledReport = reportMarkdown;
		const finalMarkdown = styledReport.replace(/(\*\*Heure du test :\*\*.+?\n\n)/, `$1${summaryMarkdown}\n\n`);
		addStackToMarkdown();
		const tree = buildProjectTree(".");
		const completeMarkdown =
			finalMarkdown +
			`## 📁  ARBORESCENCE DU PROJET

\`\`\`
.
${tree}\`\`\`

`;

		writeFileSync(fileName, completeMarkdown, "utf-8");
		writeFileSync(readmeFileName, completeMarkdown, "utf-8");
		log(`${emoji.check} Rapport généré : ${fileName}`, "green");
		log(`${emoji.check} README.md généré`, "green");
	} catch (error) {
		log(`${emoji.cross} Échec de génération du rapport : ${error instanceof Error ? error.message : error}`, "red");
		throw error;
	}
}

function generateCIWorkflow(): void {
	const workflowDir = ".github/workflows";
	fs.mkdirSync(workflowDir, { recursive: true });

	const ciYaml = `name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  quality-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: TypeScript check
        run: npm run tsc

      - name: Build shared package
        run: npm run build:shared

      - name: Build web
        run: npm run build -w web

      - name: Build server
        run: npm run build -w server
`;

	fs.writeFileSync(`${workflowDir}/ci.yml`, ciYaml);
}

function getReportCSS(): string {
	return `body { font-family: "Segoe UI", sans-serif; font-size: 13px; color: black; max-width: 900px; margin: 0 auto; padding: 2rem; } .ok { color: #16a34a; font-weight: 700; } .fail { color: #dc2626; font-weight: 700; } .generated { color: #006666; font-weight: 700; } h1 { font-size: 24px; font-weight: 700; color: black; border-bottom: 3px solid #006666; padding-bottom: 0.5rem; margin-bottom: 0.25rem; } h1 + p { color: #006666; font-size: 12px; margin-top: 0; margin-bottom: 2rem; } h2 { font-size: 14px; font-weight: 600; color: white; background: #006666; padding: 6px 14px; border-radius: 6px; margin-top: 1.8rem; margin-bottom: 0.5rem; } h3 { font-size: 13px; font-weight: 600; color: #006666; border-left: 3px solid #006666; padding-left: 10px; margin-top: 1.2rem; } table { width: 100%; border-collapse: collapse; margin-bottom: 0.5rem; font-size: 12.5px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); } thead tr { color: #006666; font-weight: 600; } th, td { padding: 7px 14px; text-align: left; border-bottom: 1px solid #e5e7eb; } tr:last-child td { border-bottom: none; } tr:nth-child(even) td { background: #fafafa; } td:last-child { font-weight: 500; white-space: nowrap; width: 120px; } code { color: black !important; padding: 1px 6px; border-radius: 4px; font-size: 12px; font-family: "Cascadia Code", "Fira Code", monospace; } pre { padding: 1rem 1.2rem; border-radius: 8px; font-size: 11.5px; overflow-x: auto; line-height: 1.6; font-family: "Cascadia Code", "Fira Code", monospace; } pre code { background: none; color: black; padding: 0; font-size: inherit; } strong { color: black; } p { margin: 0.3rem 0; } .summary { background: linear-gradient(135deg, #006666 0%, #004d4d 100%); color: white; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; font-size: 14px; line-height: 1.8; display: flex; flex-direction: row; align-items: center; gap: 1.5rem; } .summary-left { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 2rem; flex: 2; } .summary-item { display: flex; align-items: center; font-weight: 500; } .summary-item::before { content: ''; display: inline-block; width: 12px; height: 12px; margin-right: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); } .summary-item.pass::before { background: #16a34a; box-shadow: 0 0 6px rgba(22, 163, 74, 0.5); } .summary-item.fail::before { background: #dc2626; box-shadow: 0 0 6px rgba(220, 38, 38, 0.5); } .summary-item.ignored::before { background: #f59e0b; box-shadow: 0 0 6px rgba(245, 158, 11, 0.5); } .summary-item.generated::before { background: #4dd9ff; box-shadow: 0 0 6px rgba(77, 217, 255, 0.5); } .summary-divider { width: 2px; background: rgba(255,255,255,0.2); align-self: stretch; } .summary-rate { font-size: 20px; font-weight: 700; flex: 1; text-align: center; } .dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: middle; position: relative; top: -1px; } .dot-ok { background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.5); } .dot-fail { background: #dc2626; box-shadow: 0 0 5px rgba(220,38,38,0.5); } .dot-ignored { background: #f59e0b; box-shadow: 0 0 5px rgba(245,158,11,0.5); } .dot-generated { background: #4dd9ff; box-shadow: 0 0 5px rgba(77,217,255,0.5);}`.trim();
}

async function main(): Promise<void> {
	logTitle("CODE QUALITY REPORT");
	log(`Heure : ${timestamp}\n`, "dim");
	try {
		await verifyProject();
		await verifyVersions();
		await verifyDocker();
		await verifyDatabase();
		await verifyBackend();
		await verifyFrontends();
		await verifyConfig();
		await verifyMonorepo();
		await verifyAPI();
		await verifyWorkspaceLinks();
		await verifySecurity();
		await verifyCodeQuality();
		await verifyTests();
		await verifyGit();
		await verifyPerformance();
		generateCIWorkflow();
		markGenerated("Pipeline CI (.github/workflows/ci.yml)");
		addSectionToMarkdown();
		exportReport();
		markGenerated("README.md");
		markGenerated(`Rapport setup/verify_monorepo/verify-report-${new Date().toISOString().split("T")[0]}.md`);
		printSummary();
		process.exit(totalFail === 0 ? 0 : 1);
	} catch (error) {
		log(`\n${emoji.boom} ERREUR : ${(error as Error).message}`, "red");
		process.exit(1);
	}
}

main();
