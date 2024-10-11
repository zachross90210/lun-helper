module.exports = {
    ignores: [
      "build/*",
      "release/*",
      "node_modules/*"
    ],
    env: {
        browser: true,
        es2020: true,
        webextensions: true,
    },
    globals: {
        chrome: true,
    },
    extends: [
        'airbnb-base',
        'plugin:json/recommended',
    ],
    plugins: [
        'json',
        'html',
    ],
    settings: {
        'html/html-extensions': ['.html'],
        'html/indent': '0', // code should start at the beginning of the line (no initial indentation).
        'html/report-bad-indent': 'error',
        'no-dupe-args': 'error'
    },
    parserOptions: {
        ecmaVersion: 11,
    },
    rules: {
        indent: [
            'warn',
            4,
        ]
    },
};
