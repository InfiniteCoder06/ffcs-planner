import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Base JavaScript and TypeScript recommendations
  js.configs.recommended,
  tseslint.configs.recommended,

  // React recommendations
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],

  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
]);
