module.exports = {
    env: {
        es6: true,
        node: true,
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'prettier'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
  }
;
