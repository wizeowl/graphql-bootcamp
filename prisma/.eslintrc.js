module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-undef': ['error']
  }
};
