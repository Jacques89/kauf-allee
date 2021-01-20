module.exports = {
  env: {
    es2021: true,
    mocha: true,
  },
  extends: [
    "./node_modules/coding-standard/eslintDefaults.js",
    "./node_modules/coding-standard/.eslintrc-es6",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: ["error", "never"],
    indent: ["error", 2],
    linebreakStyle: ["error", "unix"],
    quotes: ["error", "double"],
  },
};
