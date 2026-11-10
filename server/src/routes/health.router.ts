import type { Request, Response } from "express";
import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
	res.json({
		status: "ok",
		message: "Server is running",
		timestamp: new Date().toISOString(),
	});
});

export default healthRouter;
