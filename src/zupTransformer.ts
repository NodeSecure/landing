// Import Node.js Dependencies
import path from "node:path";

// Import Third-party Dependencies
import compile from "zup";
import type { TransformResult } from "vite";

export default function zupTransformer(
  data: Record<string, any> = {}
) {
  return {
    name: "zup-transformer",

    transform(src: string, id: string): TransformResult | undefined {
      if (
        path.extname(id) === ".html" &&
        path.basename(id) === "index.html"
      ) {
        return {
          code: compile(src)(data),
          map: null
        };
      }

      return void 0;
    }
  };
}
