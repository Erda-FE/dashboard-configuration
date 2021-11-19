module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint-config-ali/react', 'plugin:jsx-control-statements/recommended', 'prettier'],
  parser: 'babel-eslint',
  plugins: [
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'import',
    'compat',
    'jsx-a11y',
    'jsx-control-statements',
  ],
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint-config-ali/typescript/react', 'prettier'],
      plugins: ['@typescript-eslint'],
      rules: {
        'max-len': 'off',
        'jsx-control-statements/jsx-jcs-no-undef': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^ignored?$',
          },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        indent: 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'example', 'src'],
      },
    },
  },
  rules: {
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft', 'state'],
      },
    ],
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
    '@typescript-eslint/ban-ts-ignore': 'off',
    'react/jsx-no-undef': [2, { allowGlobals: true }],
  },
};
