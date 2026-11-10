import cors from "cors";
import "dotenv/config";
import express from "express";
import pool from "./database/client.js";
import healthRouter from "./routes/health.router.js";

const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

const app = express();
const PORT = process.env.PORT || 3310;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ── Middlewares ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true,
	}),
);

// ── Routes ────────────────────────────────────────────
app.use("/api/health", healthRouter);

// ── Démarrage ─────────────────────────────────────────
app.listen(PORT, async () => {
	console.log("\n=========================================");
	console.log("🔵 SERVER BACKEND");
	console.log("=========================================");
	console.log(`🔵 NODE_ENV : ${NODE_ENV}`);
	console.log(`🟢 Serveur démarré sur : ${BLUE}http://localhost:${PORT}${RESET}`);

	try {
		await pool.query("SELECT 1");
		console.log("🟢 Base de données connectée");
	} catch (err) {
		console.error("🔴 Base de données non connectée :", err);
	}

	console.log("=========================================\n");
});

export default app;
