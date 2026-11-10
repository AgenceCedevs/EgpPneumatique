import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(scriptDir, "../dist");
const PORT = Number(process.env.PRERENDER_PORT) || 4174;
const MAX_ROUTES = 250;
const EXTRA_SEED_ROUTES = [];
const EXCLUDED_PREFIXES = [];
const ORIGIN = `http://127.0.0.1:${PORT}`;
let spaTemplate = Buffer.alloc(0);

const MIME_TYPES = {
	".css": "text/css",
	".html": "text/html",
	".ico": "image/x-icon",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".svg": "image/svg+xml",
	".txt": "text/plain",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

function isExcluded(route) {
	return EXCLUDED_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}

function normalizeRoute(href) {
	try {
		const url = new URL(href, ORIGIN);
		if (url.origin !== ORIGIN) return null;

		const pathname = decodeURIComponent(url.pathname);
		if (pathname.includes("\\") || path.posix.extname(pathname)) return null;

		const normalized = path.posix.normalize(pathname);
		const route = normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
		if (!route.startsWith("/") || route.startsWith("//") || isExcluded(route)) return null;

		return route;
	} catch {
		return null;
	}
}

function startServer() {
	const server = createServer(async (request, response) => {
		let pathname;

		try {
			pathname = decodeURIComponent(new URL(request.url ?? "/", ORIGIN).pathname);
		} catch {
			response.writeHead(400).end("Bad request");
			return;
		}

		if (pathname.includes("\\") || pathname.includes("\0")) {
			response.writeHead(400).end("Bad request");
			return;
		}

		const filePath = path.resolve(DIST_DIR, `.${pathname}`);
		const relativePath = path.relative(DIST_DIR, filePath);

		if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
			response.writeHead(403).end("Forbidden");
			return;
		}

		const hasExtension = path.extname(filePath) !== "";
		if (hasExtension && !existsSync(filePath)) {
			response.writeHead(404).end("Not found");
			return;
		}

		const targetPath = hasExtension ? filePath : path.join(DIST_DIR, "index.html");

		try {
			const content = hasExtension ? await readFile(targetPath) : spaTemplate;
			const contentType = MIME_TYPES[path.extname(targetPath)] ?? "application/octet-stream";
			response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` }).end(content);
		} catch (error) {
			console.error(`Impossible de servir ${targetPath} :`, error);
			response.writeHead(500).end("Internal server error");
		}
	});

	return new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(PORT, "127.0.0.1", () => {
			server.off("error", reject);
			resolve(server);
		});
	});
}

async function prerenderRoute(browser, route) {
	const page = await browser.newPage();

	try {
		await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle2", timeout: 30000 });
		await page.evaluate(() => {
			const selectors = ["title", 'meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]', 'meta[property="og:type"]', 'meta[property="og:url"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]'];

			for (const selector of selectors) {
				const elements = document.head.querySelectorAll(selector);
				for (let index = 0; index < elements.length - 1; index++) {
					elements[index]?.remove();
				}
			}
		});
		const links = await page.$$eval("a[href]", (anchors) => anchors.map((anchor) => anchor.getAttribute("href") ?? ""));
		const html = (await page.content()).replaceAll(ORIGIN, "");
		const outputDir = path.resolve(DIST_DIR, `.${route}`);

		await mkdir(outputDir, { recursive: true });
		await writeFile(path.join(outputDir, "index.html"), html, "utf-8");
		console.log(`Prérendu : ${route}`);

		return links.map(normalizeRoute).filter(Boolean);
	} finally {
		await page.close();
	}
}

async function main() {
	if (!existsSync(path.join(DIST_DIR, "index.html"))) {
		throw new Error("dist/index.html introuvable. Lancez d'abord `npm run build -w web`.");
	}

	spaTemplate = await readFile(path.join(DIST_DIR, "index.html"));
	const server = await startServer();
	let browser;

	try {
		browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
		const visited = new Set();
		const queue = ["/", ...EXTRA_SEED_ROUTES.map(normalizeRoute).filter(Boolean)];

		while (queue.length > 0) {
			const route = queue.shift();
			if (visited.has(route)) continue;
			if (visited.size >= MAX_ROUTES) {
				throw new Error(`Limite de ${MAX_ROUTES} routes atteinte. Vérifiez les liens ou augmentez MAX_ROUTES.`);
			}

			visited.add(route);
			const discoveredRoutes = await prerenderRoute(browser, route);
			for (const discoveredRoute of discoveredRoutes) {
				if (!visited.has(discoveredRoute) && !queue.includes(discoveredRoute)) {
					queue.push(discoveredRoute);
				}
			}
		}

		console.log(`Prérendu terminé : ${visited.size} route(s).`);
	} finally {
		try {
			if (browser) await browser.close();
		} finally {
			await new Promise((resolve, reject) => {
				server.close((error) => (error ? reject(error) : resolve()));
			});
		}
	}
}

main().catch((error) => {
	console.error("Échec du prérendu :", error);
	process.exitCode = 1;
});
