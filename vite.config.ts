// Import Third-party Dependencies
import { defineConfig } from "vite";

// Import Internal Dependencies
import zupTransformer from "./src/zupTransformer.ts";

export default defineConfig({
  plugins: [
    zupTransformer({})
  ]
});
