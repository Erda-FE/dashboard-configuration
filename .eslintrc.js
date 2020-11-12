module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint-config-ali/react',
    'eslint-config-ali/typescript'
  ],
  parser: 'babel-eslint',
  plugins: [
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'import',
    'compat',
    'jsx-a11y'
  ],
  overrides: [{
    files: ['**/*.tsx', '**/*.ts'],
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint'
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [1, {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^ignored?$'
      }],
      '@typescript-eslint/interface-name-prefix': 'off',
      indent: 0,
    }
  }],
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true
    }
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'example', 'src'],
      },
    }
  },
  rules: {
    'import/prefer-default-export': 'off',
    // 'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/prop-types': 'off',
    'arrow-body-style': 'off',
    'max-len': 'off',
    'no-nested-ternary': 'off',
    'react/no-multi-comp': 'off',
    'jsx-first-prop-new-line': 'off',
    'no-unused-vars': 1,
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'no-console': 2,
    '@typescript-eslint/ban-ts-ignore': 'off'
  },
};