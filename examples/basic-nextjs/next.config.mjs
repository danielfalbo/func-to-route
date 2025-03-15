// @ts-check
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { register } from "ts-node";

// Register ts-node to handle TypeScript files
register({
  project: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
  compilerOptions: {
    module: "esnext",
  },
});

// Import the TypeScript config
const require = createRequire(import.meta.url);
/** @type {import('next').NextConfig} */
const config = require("./next.config.ts").default;

export default config;
