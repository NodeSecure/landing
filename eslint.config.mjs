// Import Third-party Dependencies
import { typescriptConfig, globals } from "@openally/config.eslint";

export default typescriptConfig({
  languageOptions: {
    sourceType: "module",
    globals: {
      ...globals.browser
    }
  }
});
