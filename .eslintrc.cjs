const ALIASED_PACKAGES = ['@'];

const commonRules = {
  curly: ['error', 'all'],

  'import/extensions': ['error', { js: 'never', ts: 'never' }],
};

module.exports = {
  env: {
    es2022: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],

  plugins: ['import', 'simple-import-sort'],

  ignorePatterns: ['!.*', 'dist', 'coverage', 'node_modules'],

  rules: {
    ...commonRules,

    'no-console': 'error',
    'no-sequences': ['error', { allowInParentheses: false }],
    'no-restricted-exports': ['error', { restrictedNamedExports: ['then'] }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
      { blankLine: 'never', prev: 'export', next: 'export' },
      { blankLine: 'never', prev: 'case', next: 'case' },
      { blankLine: 'never', prev: 'case', next: 'default' },
    ],

    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports:
          ['^\\u0000'],
          // Node builtin modules:
          ['^node:\\w'],
          // Third party packages:
          ['^@?\\w'],
          // Aliased project packages:
          [`^(${ALIASED_PACKAGES.join('|')})(/.*|$)`],
          // Parent imports, with `..` first.
          ['^\\.\\./?$', '^\\.\\.(?!/?$)'],
          // Other relative imports with nested folders imports first and same folder imports last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    'import/group-exports': 'error',
    'import/no-anonymous-default-export': 'error',
    'import/prefer-default-export': 'off',
  },

  overrides: [
    {
      // Just to describe examined files:
      files: ['**/*.{js,cjs}'],
    },
    {
      // TypeScript
      files: ['**/*.ts'],

      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/strict',
        'plugin:import/typescript',
        // Needed again here to overwrite above configs:
        'plugin:prettier/recommended',
      ],

      plugins: ['@typescript-eslint'],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
        sourceType: 'module',
      },

      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          // TODO: check why it breaks 'import/extensions'
          /* typescript: {
            project: __dirname,
          }, */
          node: true,
        },
      },

      rules: {
        ...commonRules,

        '@typescript-eslint/consistent-type-imports': [
          'error',
          { fixStyle: 'inline-type-imports' },
        ],
        '@typescript-eslint/consistent-type-exports': [
          'error',
          { fixMixedExportsWithInlineTypeSpecifier: false },
        ],

        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
      },
    },
  ],
};
