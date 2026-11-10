import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const host = process.env.PGHOST || "localhost";
const port = Number(process.env.PGPORT) || 5432;
const user = process.env.PGUSER || process.env.POSTGRES_USER;
const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
const database = process.env.PGDATABASE || process.env.POSTGRES_DB;

if (!user || !password || !database) {
	throw new Error("Variables PostgreSQL manquantes : PGUSER/POSTGRES_USER, PGPASSWORD/POSTGRES_PASSWORD et PGDATABASE/POSTGRES_DB.");
}

const pool = new Pool({
	host,
	port,
	user,
	password,
	database,
});

pool.on("error", (err) => {
	console.error("🔴 Erreur inattendue sur le pool PostgreSQL :", err.message);
});

export default pool;
