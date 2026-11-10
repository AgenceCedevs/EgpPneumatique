// npx tsx setup/update-package-name.ts
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const rootFolderName = path.basename(path.resolve());
const requiredFiles = ["server/.env", "web/.env", "mobile/.env", ".env"];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.resolve(file)));
if (missingFiles.length > 0) {
	throw new Error(`Fichiers requis introuvables : ${missingFiles.join(", ")}. Lancez ce script depuis la racine après avoir créé ces fichiers.`);
}

console.log(`
=========================
🔵 AUTO-CONFIG PROJECT
=========================
`);
console.log(`🔵 Dossier racine détecté : ${rootFolderName}`);
const appName = rootFolderName
	.replace(/([a-z])([A-Z0-9])|([0-9])([a-zA-Z])/g, "$1$3 $2$4")
	.trim()
	.replace(/\s+/g, " ");
const folderName = rootFolderName.toLowerCase().replace(/[^\w]/g, "_").replace(/_+/g, "_");

const TEMPLATE_SCOPE = "@appstarter/";
const TEMPLATE_PLACEHOLDER = "{{PROJECT_NAME_LOWER}}";
const sharedScope = `@${folderName}/`;
const scopeExtensions = [".json", ".ts", ".tsx", ".js", ".cjs", ".mjs"];
const scopeIgnoredFolders = ["node_modules", "dist", ".git"];

function renameSharedScope(dir: string): number {
	let count = 0;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!scopeIgnoredFolders.includes(entry.name)) count += renameSharedScope(fullPath);
			continue;
		}
		if (entry.name === "package-lock.json" || !scopeExtensions.includes(path.extname(entry.name))) continue;
		const content = fs.readFileSync(fullPath, "utf8");
		if (!content.includes(TEMPLATE_SCOPE) && !content.includes(TEMPLATE_PLACEHOLDER)) continue;
		fs.writeFileSync(fullPath, content.split(TEMPLATE_SCOPE).join(sharedScope).split(TEMPLATE_PLACEHOLDER).join(folderName));
		console.log(`   ${path.relative(process.cwd(), fullPath).replace(/\\/g, "/")} : ${TEMPLATE_SCOPE} → ${sharedScope}`);
		count++;
	}
	return count;
}

function generateJWTSecret(): string {
	return crypto.randomBytes(32).toString("hex");
}

function updateHtmlTitle(htmlPath: string): void {
	if (!fs.existsSync(htmlPath)) {
		throw new Error(`Fichier requis introuvable : ${path.relative(process.cwd(), htmlPath)}`);
	}
	const relativePath = path.relative(process.cwd(), htmlPath).replace(/\\/g, "/");
	const original = fs.readFileSync(htmlPath, "utf8");
	const escapedAppName = appName.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[character] ?? character;
	});
	const updated = original.replace(/(<title>)[\s\S]*?(<\/title>)/i, (_match, openingTag: string, closingTag: string) => `${openingTag}${escapedAppName}${closingTag}`);
	if (updated === original) {
		if (!/<title>[\s\S]*?<\/title>/i.test(original)) {
			throw new Error(`Balise <title> introuvable dans ${relativePath}`);
		}
		console.log(`🔵 ${relativePath} - titre déjà à jour`);
		return;
	}
	fs.writeFileSync(htmlPath, updated);
	console.log(`🟢 Titre de ${relativePath} défini sur "${appName}"`);
}

function updateEnv(envPath: string): void {
	if (!fs.existsSync(envPath)) {
		throw new Error(`Fichier requis introuvable : ${path.relative(process.cwd(), envPath)}`);
	}
	const relativePath = path.relative(process.cwd(), envPath).replace(/\\/g, "/");
	const original = fs.readFileSync(envPath, "utf8");
	const lines = original.split("\n");
	let hasChanges = false;
	const updatedLines = lines.map((line) => {
		if (line.startsWith("JWT_SECRET=PENDING_JWT_SECRET")) {
			const jwtSecret = generateJWTSecret();
			console.log("   JWT_SECRET généré (valeur masquée)");
			hasChanges = true;
			return `JWT_SECRET=${jwtSecret}`;
		}
		if (line.startsWith("VITE_APP_NAME=PENDING_APP_NAME")) {
			console.log(`   VITE_APP_NAME : "PENDING_APP_NAME" → "${appName}"`);
			hasChanges = true;
			return `VITE_APP_NAME=${appName}`;
		}
		if (line.startsWith("EXPO_PUBLIC_APP_NAME=PENDING_APP_NAME")) {
			console.log(`   EXPO_PUBLIC_APP_NAME : "PENDING_APP_NAME" → "${appName}"`);
			hasChanges = true;
			return `EXPO_PUBLIC_APP_NAME=${appName}`;
		}
		if (line.startsWith("APP_NAME=PENDING_APP_NAME")) {
			console.log(`   APP_NAME : "PENDING_APP_NAME" → "${appName}"`);
			hasChanges = true;
			return `APP_NAME=${appName}`;
		}
		if (!line.includes("PENDING_FOLDER_NAME")) return line;
		const [key] = line.split("=");
		const newLine = line.replace(/PENDING_FOLDER_NAME/g, folderName);
		console.log(`   ${key} : PENDING_FOLDER_NAME → ${folderName}`);
		hasChanges = true;
		return newLine;
	});
	if (hasChanges) {
		const updated = updatedLines.join("\n");
		fs.writeFileSync(envPath, updated);
		console.log(`🟢 ${relativePath} mis à jour`);
	} else {
		console.log(`🔵 ${relativePath} - aucun remplacement nécessaire`);
	}
}

updateEnv(path.resolve("server/.env"));
updateEnv(path.resolve("web/.env"));
updateEnv(path.resolve("mobile/.env"));
updateEnv(path.resolve(".env"));
updateHtmlTitle(path.resolve("web/index.html"));

if (sharedScope === TEMPLATE_SCOPE) {
	console.log(`🔵 Scope npm ${sharedScope} - aucun renommage nécessaire`);
} else {
	const renamed = ["shared", "web", "server", "mobile"].reduce((total, workspace) => total + renameSharedScope(path.resolve(workspace)), 0);
	console.log(`🟢 Scope npm : ${TEMPLATE_SCOPE}shared → ${sharedScope}shared (${renamed} fichier(s))`);
}
console.log(`
=========================
🟢 CONFIGURATION TERMINÉE
=========================
`);
