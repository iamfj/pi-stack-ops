import { defineConfig, type Options } from "tsup";
import packageJson from "./package.json" with { type: "json" };

const shared = {
  format: ["esm"],
  target: "node20",
  platform: "node",
  bundle: true,
  clean: false,
  splitting: false,
  sourcemap: false,
  dts: false,
} satisfies Options;

export default defineConfig([
  {
    ...shared,
    entry: {
      "stack-ops": "src/cli/index.ts",
    },
    outDir: "bin",
    define: {
      STACK_OPS_VERSION: JSON.stringify(packageJson.version),
    },
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
  {
    ...shared,
    entry: {
      "stack-ops": "src/extensions/stack-ops.ts",
    },
    outDir: "extensions",
    external: ["@earendil-works/pi-coding-agent"],
  },
]);
