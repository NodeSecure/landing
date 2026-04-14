/* eslint-disable consistent-return */
// Import Node.js Dependencies
import path from "node:path";

// Import Third-party Dependencies
import compile from "zup";

interface ZupTransformerOptions {
  [key: string]: any;
}

interface TransformResult {
  code: string;
  map: null;
}

export default function zupTransformer(
  data: ZupTransformerOptions = {}
): {
  name: string;
  transform: (src: string, id: string) => TransformResult | undefined;
} {
  return {
    name: "zup-transformer",

    /**
     * @param {!string} src
     * @param {!string} id
     */
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
    }
  };
}
