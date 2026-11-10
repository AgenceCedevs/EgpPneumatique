const fs = require("node:fs");

for (const [format, type] of [
	["esm", "module"],
	["cjs", "commonjs"],
]) {
	fs.writeFileSync(`dist/${format}/package.json`, JSON.stringify({ type }, null, 2));
}
