import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (!existsSync("biome.json") || !existsSync("node_modules/@biomejs/biome/package.json")) process.exit(0);

const { version } = JSON.parse(readFileSync("node_modules/@biomejs/biome/package.json", "utf8"));
const config = JSON.parse(readFileSync("biome.json", "utf8"));
config.$schema = `https://biomejs.dev/schemas/${version}/schema.json`;
writeFileSync("biome.json", `${JSON.stringify(config, null, "\t")}\n`);
