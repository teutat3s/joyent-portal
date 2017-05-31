// eslint-disable-next-line no-warning-comments
// TODO wait for eslint/eslint#3458

module.exports = {
  extends: ['eslint:recommended', 'xo-space/esnext', 'react-app', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'capitalized-comments': 0,
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        semi: true
      }
    ]
  }
};
