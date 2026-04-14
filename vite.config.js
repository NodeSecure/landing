// Import Third-party Dependencies
import { defineConfig } from "vite";

// Import Internal Dependencies
import zupTransformer from "./plugins/zupTransformer.ts";

export default defineConfig({
  plugins: [
    zupTransformer({})
  ],
  esbuild: {
    target: "es2020",
    supported: {
      "top-level-await": true
    }
  }
});
