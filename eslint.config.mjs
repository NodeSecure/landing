// Import Third-party Dependencies
import { ESLintConfig, globals } from "@openally/config.eslint";

export default [
  ...ESLintConfig,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    }
  }
];
