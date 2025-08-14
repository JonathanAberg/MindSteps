module.exports = {
  root: true,
  extends: ['@react-native/eslint-config', 'eslint:recommended'],
  parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
  rules: { 'no-console': ['warn', { allow: ['warn', 'error'] }] },
};
