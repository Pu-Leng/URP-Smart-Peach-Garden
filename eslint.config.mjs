import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";
import prettierPlugin from "eslint-plugin-prettier"; // 改用 import 语法

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  // 基础推荐配置
  js.configs.recommended,

  // Vue 配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      "vue/multi-word-component-names": "off"
    }
  },

  // 统一配置 Prettier
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  }
]);