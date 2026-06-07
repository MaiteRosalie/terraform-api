import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/handlers/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: "dist/index.js",
});