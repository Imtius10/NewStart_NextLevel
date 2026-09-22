import { build } from "esbuild";

await build({
  entryPoints: ["api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "api/index.js",
  external: ["@prisma/client", "prisma"],
  format: "esm",
});
