import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { createLogger, defineConfig, loadEnv } from "vite";

const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";
const configDir = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(configDir, "..");

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, monorepoRoot, "");
	const serverEnv = loadEnv(mode, resolve(monorepoRoot, "server"), "");
	const apiPort = env.SERVER_PORT || serverEnv.PORT || "3310";
	const webPort = Number(env.WEB_PORT) || 5173;

	const logger = createLogger();
	const loggerInfo = logger.info;
	logger.info = (msg, options) => {
		if (msg.includes("Local") || msg.includes("Network") || msg.includes("ready in") || msg.includes("VITE v") || msg.includes("is in use")) return;
		loggerInfo(msg, options);
	};

	return {
		customLogger: logger,
		plugins: [
			react(),
			{
				name: "custom-logger",
				configureServer(server) {
					server.httpServer?.once("listening", () => {
						const address = server.httpServer?.address();
						const actualPort = typeof address === "object" && address ? address.port : webPort;

						console.log("\n=========================================");
						console.log("🔵 CLIENT WEB");
						console.log("=========================================");
						console.log(`🔵 NODE_ENV : ${mode}`);
						console.log(`🟢 Client démarré sur : ${BLUE}http://localhost:${actualPort}${RESET}`);
						console.log(`🟢 Proxy API vers : ${BLUE}http://localhost:${apiPort}${RESET}`);
						console.log("=========================================\n");
					});
				},
			},
		],
		server: {
			port: webPort,
			proxy: {
				"/api": {
					target: `http://localhost:${apiPort}`,
					changeOrigin: true,
				},
			},
		},
		resolve: {
			alias: {
				"@": resolve(configDir, "src"),
				"@shared": resolve(monorepoRoot, "shared/src"),
			},
		},
	};
});
