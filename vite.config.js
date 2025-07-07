// Import Third-party Dependencies
import { defineConfig } from "vite";

// Import Internal Dependencies
import zupTransformer from "./plugins/zupTransformer.js";

export default defineConfig({
  plugins: [
    zupTransformer({})
  ]
});
