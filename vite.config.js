// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";

// Import Third-party Dependencies
import { defineConfig } from "vite";

// Import Internal Dependencies
import zupTransformer from "./plugins/zupTransformer.js";

function getBlogEntries() {
  const entries = {
    main: "index.html"
  };

  if (fs.existsSync("./blog")) {
    const files = fs.readdirSync("./blog").filter((file) => file.endsWith(".html"));

    files.forEach((file) => {
      const name = path.basename(file, ".html");

      if (!name.includes("base-template")) {
        entries[`blog-${name}`] = `blog/${file}`;
      }
    });
  }

  return entries;
}

export default defineConfig({
  plugins: [
    zupTransformer({})
  ],
  build: {
    rollupOptions: {
      input: getBlogEntries()
    }
  }
});
