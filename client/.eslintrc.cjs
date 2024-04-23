/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx,cjs}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [path.resolve(__dirname, 'tsconfig.json'), path.resolve(__dirname, 'tsconfig.eslint.json')],
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@next/next/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:react/jsx-runtime',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'eslint-config-prettier',
        'next/core-web-vitals',
        'prettier'
      ],
      plugins: [
        '@typescript-eslint',
        'immer',
        'simple-import-sort',
        'import',
        'jsx-a11y',
        'react',
        'react-hooks',
        'editorconfig',
        'prettier'
      ],
      settings: {
        react: {
          version: 'detect'
        },
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
          node: {
            paths: [path.resolve(__dirname, '')],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
          },
          typescript: {
            project: path.resolve(__dirname, 'tsconfig.json')
          }
        },
        env: {
          node: true
        }
      },
      rules: {
        'no-plusplus': 'off',
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Packages. `react` related packages come first.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              ['^react', '^vue', '^@?\\w'],
              // Absolute imports and Relative imports.
              ['^~/'],
              // Relative imports.
              // Anything that starts with a dot.
              ['^\\.']
            ]
          }
        ],
        'simple-import-sort/exports': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports'
          }
        ],
        semi: 0,
        curly: ['error', 'multi-line'],
        'no-param-reassign': [
          'error',
          {
            props: true,
            ignorePropertyModificationsForRegex: ['^draft', 'state']
          }
        ],
        'react/jsx-wrap-multilines': [
          'error',
          {
            prop: 'ignore'
          }
        ],
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/interactive-supports-focus': 0,
        'react/jsx-props-no-spreading': 0,
        'react/state-in-constructor': ['error', 'never'],
        'react/function-component-definition': [
          'error',
          {
            namedComponents: ['arrow-function', 'function-declaration', 'function-expression'],
            unnamedComponents: 'arrow-function'
          }
        ],
        'react/prop-types': 0,
        'react/require-default-props': 0,
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            ignoreRestSiblings: true,
            destructuredArrayIgnorePattern: '[A-Z]',
            caughtErrors: 'none'
          }
        ],
        'immer/no-update-map': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never'
          }
        ],
        '@typescript-eslint/no-misused-promises': [
          2,
          {
            checksVoidReturn: {
              attributes: false
            }
          }
        ],
        'prettier/prettier': ['warn']
      }
    }
  ]
}
