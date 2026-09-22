import { build } from "esbuild";
import { readFileSync } from "fs";

await build({
  entryPoints: ["api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "api/index.js",
  format: "cjs",
  banner: {
    js: `
const __filename_compat = process.argv[1] || '/var/task/api/index.js';
const __dirname_compat = require('path').dirname(__filename_compat);
if (typeof globalThis.__dirname === 'undefined') globalThis.__dirname = __dirname_compat;
if (typeof globalThis.__filename === 'undefined') globalThis.__filename = __filename_compat;
    `.trim(),
  },
  define: {
    "import.meta.url": "require('url').pathToFileURL(require('path').resolve(__dirname_compat, 'api/index.js')).href",
  },
});
