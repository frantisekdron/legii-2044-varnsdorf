import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const basePath = "/legii-2044-varnsdorf";
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "1" },
});
if (result.status !== 0) process.exit(result.status || 1);

const output = "out";
const localAssets = /\/(media|visualizations|decor|plany|downloads|brand)\//g;
const textFiles = /\.(html|js|css|txt|json)$/;
let changed = 0;

function rewrite(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      rewrite(path);
    } else if (textFiles.test(entry.name)) {
      const original = readFileSync(path, "utf8");
      const updated = original
        .replace(localAssets, `${basePath}/$1/`)
        .replaceAll('"/favicon.svg"', `"${basePath}/favicon.svg"`);
      if (updated !== original) {
        writeFileSync(path, updated);
        changed++;
      }
    }
  }
}

if (!existsSync(join(output, "index.html"))) throw new Error("Static export is missing index.html");
rewrite(output);
writeFileSync(join(output, ".nojekyll"), "");
console.log(`GitHub Pages export ready: ${changed} text files updated for ${basePath}`);
