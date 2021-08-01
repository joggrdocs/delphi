module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-semistandard'
  ],
  ignorePatterns: [
    'src/**/testUtils/',
    'src/**/__tests__/',
    'examples/**/*'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
  }
};
