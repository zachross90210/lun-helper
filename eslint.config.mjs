import globals from "globals";
import json from 'eslint-plugin-json';
import html from "eslint-plugin-html"

export default [
  {
    settings: {
      'html/html-extensions': ['.html'],
      'html/indent': '0', // code should start at the beginning of the line (no initial indentation).
      'html/report-bad-indent': 'error',
      'no-dupe-args': 'error'
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 11,
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.es2020,
        ...globals.chrome,
      },
    },
    rules: {
      indent: [
        'warn',
        4,
      ]
    },
    ignores: [
      ".config/*",
      "build/*",
      "release/*",
      "node_modules/*"
        ],
    files: [
      "**/*.json",
      "**/*.html",
    ],
    plugins: { html, json }
  }
];
