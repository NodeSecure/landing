/* eslint-disable consistent-return */
// Import Node.js Dependencies
import path from "node:path";

// Import Third-party Dependencies
import compile from "zup";

export default function zupTransformer(
  data = {}
) {
  return {
    name: "zup-transformer",

    /**
     * @param {!string} src
     * @param {!string} id
     */
    transform(src, id) {
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
