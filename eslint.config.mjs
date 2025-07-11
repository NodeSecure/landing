// Import Third-party Dependencies
import { ESLintConfig, globals } from "@openally/config.eslint";

export default [
  ...ESLintConfig,
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    }
  }
];
