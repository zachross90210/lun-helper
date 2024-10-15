import globals from "globals";
import json from 'eslint-plugin-json';
import html from "eslint-plugin-html";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    settings: {
      'html/html-extensions': ['.html'],
      'html/indent': '0', // code should start at the beginning of the line (no initial indentation).
      'html/report-bad-indent': 'error',
      'no-dupe-args': 'error'
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.webextensions,
        ...globals.es2020,
        ...globals.chrome,
      },
    },
    rules: {
      "no-console": "off",
      indent: [
        'warn',
        4,
      ]
    },
    files: [
      "**/*.json",
      "**/*.html",
      "**/*.js"
    ],
    ignores: [
      ".config/*",
      "build/*",
      "release/*",
      "node_modules/*",
      "src/test.js"
    ],
    plugins: { html, json }
  }
];
