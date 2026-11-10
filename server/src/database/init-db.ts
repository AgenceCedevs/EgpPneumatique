import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import pg, { type PoolClient } from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");
const schemaPath = path.resolve(projectRoot, "server/database/script/schema.sql");
const sql = await readFile(schemaPath, "utf8");

const host = process.env.PGHOST || "localhost";
const port = Number(process.env.PGPORT) || 5432;
const user = process.env.PGUSER || process.env.POSTGRES_USER;
const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
const database = process.env.PGDATABASE || process.env.POSTGRES_DB;

if (!user || !password || !database) {
	throw new Error("Variables PostgreSQL manquantes : PGUSER/POSTGRES_USER, PGPASSWORD/POSTGRES_PASSWORD et PGDATABASE/POSTGRES_DB.");
}

const initPool = new Pool({
	host,
	port,
	user,
	password,
	database,
});

function startDatabaseContainer(): Promise<void> {
	return new Promise((resolve, reject) => {
		const docker = spawn("docker", ["compose", "up", "-d", "--wait"], {
			cwd: projectRoot,
			stdio: "inherit",
		});

		docker.once("error", reject);
		docker.once("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`docker compose s'est terminé avec le code ${code}`));
			}
		});
	});
}

async function main(): Promise<void> {
	let client: PoolClient | undefined;

	try {
		console.log("\n=========================================");
		console.log("🔵 DÉMARRAGE DE LA BASE");
		console.log("=========================================");
		await startDatabaseContainer();
		console.log(`Connexion PostgreSQL : ${user}@${host}:${port}/${database}`);

		client = await initPool.connect();
		await client.query(sql);
		console.log("🟢 Schéma appliqué avec succès.");
	} catch (error) {
		console.error("🔴 Échec de l'initialisation de la base :", error);
		process.exitCode = 1;
	} finally {
		client?.release();
		await initPool.end();
		console.log("=========================================\n");
	}
}

await main();
