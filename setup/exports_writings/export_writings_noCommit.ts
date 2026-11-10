// npx tsx setup/exports_writings/export_writings_noCommit.ts
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const selfName = path.basename(__filename);
const outputFileName = "export_writings_noCommit.md";
const outputPath = path.join(__dirname, outputFileName);

function detectLanguage(file: string): string {
	const ext = path.extname(file).slice(1);
	const map: Record<string, string> = { js: "javascript", ts: "typescript", sh: "bash", css: "css", html: "html", json: "json", md: "markdown", tsx: "tsx" };
	return map[ext] || "";
}

try {
	console.log(`\n=========================\n🔵 EXPORT NO-COMMIT\n=========================\n`);
	const modified = execSync("git diff --name-only", { encoding: "utf8" })
		.split("\n")
		.filter((f) => f && fs.existsSync(f) && f !== outputFileName && f !== selfName);
	const untracked = execSync("git ls-files --others --exclude-standard", { encoding: "utf8" })
		.split("\n")
		.filter((f) => f && fs.existsSync(f) && f !== outputFileName && f !== selfName);

	let output = "## FICHIERS À MODIFIER\n";
	if (modified.length > 0) {
		for (const f of modified) {
			output += `\n<!-- ==================================== -->
# \`${f}\`\n\`\`\`${detectLanguage(f)}\n${fs.readFileSync(f, "utf8")}\n\`\`\`\n`;
		}
	} else {
		output += "\n_Aucun fichier modifié._\n";
	}

	output += "\n## NOUVEAUX FICHIERS\n";
	if (untracked.length > 0) {
		for (const f of untracked) {
			output += `\n<!-- ==================================== -->
# \`${f}\`\n\`\`\`${detectLanguage(f)}\n${fs.readFileSync(f, "utf8")}\n\`\`\`\n`;
		}
	} else {
		output += "\n_Aucun fichier non suivi._\n";
	}

	fs.writeFileSync(outputPath, output, "utf8");
	console.log(`🟢 EXPORT RÉUSSI : ${outputFileName}`);
} catch (error) {
	console.error(`\n🔴 ERREUR :`, (error as Error).message);
}
