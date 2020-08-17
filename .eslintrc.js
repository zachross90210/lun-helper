module.exports = {
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
    ],
    plugins: [
        'json',
    ],
    parserOptions: {
        ecmaVersion: 11,
    },
    rules: {
        indent: [
            'warn',
            4,
        ],
    },
};
