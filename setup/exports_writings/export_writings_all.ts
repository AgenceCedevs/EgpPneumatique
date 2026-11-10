// npx tsx setup/exports_writings/export_writings_all.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFileName = "export_writings_all.md";
const outputPath = path.join(__dirname, outputFileName);

const projectRoot = process.cwd();

// ── EXCLUSIONS INTELLIGENTES ──
const excludedPaths = [path.join(projectRoot, "setup")];
const excludedFiles = [".DS_Store", "npm-debug.log", outputFileName, "package-lock.json", ".env", ".env.sample"];
const excludedExtensions = [".tsbuildinfo", ".log", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip"];
const excludedFolders = ["node_modules", "dist", "build", ".git", ".github", ".vscode", "public", "assets", "__pycache__", ".next", ".nuxt", "out", "coverage"];

function detectLanguage(file: string): string {
	const ext = path.extname(file).slice(1).toLowerCase();
	const map: Record<string, string> = {
		js: "javascript",
		ts: "typescript",
		sh: "bash",
		css: "css",
		html: "html",
		py: "python",
		json: "json",
		yml: "yaml",
		yaml: "yaml",
		tsx: "tsx",
		jsx: "jsx",
		md: "markdown",
		sql: "sql",
	};
	return map[ext] || "";
}

function isExcluded(filePath: string): boolean {
	const normalized = filePath.replace(/\\/g, "/");
	const parts = normalized.split("/");

	// Vérifier les chemins exclus (dossier + contenu)
	if (
		excludedPaths.some((excluded) => {
			const relative = path.relative(excluded, filePath);
			return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
		})
	) {
		return true;
	}

	// Vérifier les dossiers exclus
	if (excludedFolders.some((folder) => parts.includes(folder))) {
		return true;
	}

	// Vérifier les fichiers cachés
	if (parts.some((part) => part.startsWith("."))) {
		return true;
	}

	// Vérifier les fichiers exclus
	if (excludedFiles.some((f) => path.basename(normalized) === f)) {
		return true;
	}

	// Vérifier les extensions exclues
	if (excludedExtensions.some((e) => normalized.endsWith(e))) {
		return true;
	}

	return false;
}

function isBinary(buffer: Buffer): boolean {
	for (let i = 0; i < Math.min(buffer.length, 1000); i++) {
		const byte = buffer[i];
		if (byte === 0) return true;
		if (byte < 9 || (byte > 13 && byte < 32 && byte !== 27)) {
			return true;
		}
	}
	return false;
}

function getAllFiles(dir: string): string[] {
	try {
		return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: fs.Dirent) => {
			const fullPath = path.join(dir, e.name);
			if (e.isDirectory()) {
				return isExcluded(fullPath) ? [] : getAllFiles(fullPath);
			}
			return fullPath;
		});
	} catch {
		return [];
	}
}

try {
	console.log(`\n=========================\n🔵 EXPORT GLOBAL\n=========================\n`);
	const root = projectRoot;
	const files = getAllFiles(root)
		.filter((f) => fs.existsSync(f) && !isExcluded(f) && path.basename(f) !== outputFileName && path.basename(f) !== path.basename(__filename))
		.sort();

	console.log(`🔵 ${files.length} fichiers trouvés.`);

	let output = "# CONTENU DU PROJET\n";
	let processedCount = 0;
	let skippedCount = 0;

	for (const file of files) {
		const rel = path.relative(root, file);
		const raw = fs.readFileSync(file);

		if (isBinary(raw)) {
			output += `\n<!-- ==================================== -->
# \`${rel}\`\n🟡 **Fichier ignoré (binaire)**\n`;
			skippedCount++;
			continue;
		}

		output += `\n<!-- ==================================== -->
# \`${rel}\`\n\`\`\`${detectLanguage(file)}\n${raw.toString("utf8")}\n\`\`\`\n`;
		processedCount++;
	}

	fs.writeFileSync(outputPath, output, "utf8");
	console.log(`🟢 EXPORT RÉUSSI : ${outputFileName}`);
	console.log(`📊 ${processedCount} fichiers exportés | ${skippedCount} fichiers binaires ignorés`);
} catch (error) {
	console.error(`\n🔴 ERREUR :`, (error as Error).message);
}
