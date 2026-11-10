import type { Request, Response } from "express";
import { Router } from "express";
import pool from "../database/client.js";

const healthRouter = Router();

healthRouter.get("/", async (_req: Request, res: Response) => {
	try {
		await pool.query("SELECT 1");
		res.json({
			status: "ok",
			message: "Server is running",
			db: "connected",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("🔴 Échec du contrôle PostgreSQL :", error);
		res.status(500).json({
			status: "error",
			message: "Server is running",
			db: "disconnected",
			timestamp: new Date().toISOString(),
		});
	}
});

export default healthRouter;
