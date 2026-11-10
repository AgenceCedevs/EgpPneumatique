// npx tsx setup/exports_writings/export_writings_gitDiff.ts
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFileName = "export_writings_gitDiff.md";
const outputPath = path.join(__dirname, outputFileName);

console.log(`\n=========================\n🔵 GIT DIFF EXPORT\n=========================\n`);

exec("git diff", (err: Error | null, stdout: string) => {
	if (err) {
		console.error(`🔴 ERREUR :`, err.message);
		return;
	}
	if (!stdout) stdout = "Aucune différence détectée (git diff vide).";
	const markdown = `# Git Diff - ${new Date().toLocaleString()}\n\n\`\`\`diff\n${stdout}\n\`\`\`\n`;
	fs.writeFile(outputPath, markdown, "utf8", (e: NodeJS.ErrnoException | null) => {
		if (e) console.error(`🔴 ERREUR écriture :`, e.message);
		else console.log(`🟢 EXPORT RÉUSSI : ${outputFileName}`);
	});
});
