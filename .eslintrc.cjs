// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';
import typeScriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
// import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginHooks from 'eslint-plugin-react-hooks';
import pluginRefresh from 'eslint-plugin-react-refresh';
// import pluginImport from 'eslint-plugin-import';
import pluginBoundaries from 'eslint-plugin-boundaries';
import pluginStorybook from 'eslint-plugin-storybook';
import typeScriptAcademi from "htmlacademy/react-typescript";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist', 'coverage'] }, // Этот должно быть здесь в отдельном объекте, чтобы применяться глобально
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      },
      parser: typeScriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json'
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      // https://github.com/import-js/eslint-import-resolver-typescript#configuration
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'app',
        },
        {
          type: 'pages',
          pattern: 'src/pages/*',
          capture: ['page'],
        },
        {
          type: 'widgets',
          pattern: 'widgets/*',
          capture: ['widget'],
        },
        {
          type: 'features',
          pattern: 'features/*',
          capture: ['feature'],
        },
        {
          type: 'entities',
          pattern: 'entities/*',
          capture: ['entity'],
        },
        {
          type: 'shared',
          pattern: 'shared/*',
          capture: ['segment'],
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  pluginRefresh.configs.recommended,
  pluginReact.configs.flat.recommended,
  // pluginStorybook.configs.recommended,
  // pluginImport.flatConfigs.recommended,
  // pluginImport.flatConfigs.typescript,
  // ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': pluginHooks,
      'boundaries': pluginBoundaries,
      'storybook': pluginStorybook,
      '@typescript-eslint': typescriptPlugin,
      "react-typescript": typeScriptAcademi,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 0,
      'boundaries/entry-point': [
        2,
        {
          default: 'disallow',
          rules: [
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'lib',
                  },
                ],
              ],
              allow: '*/index.ts',
            },
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'lib',
                  },
                ],
              ],
              allow: '*.(ts|tsx)',
            },
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'constants',
                  },
                ],
              ],
              allow: 'index.ts',
            },
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'ui',
                  },
                ],
              ],
              allow: '**',
            },
            {
              target: ['app', 'pages', 'widgets', 'features', 'entities'],
              allow: 'index.(ts|tsx)',
            },
          ],
        },
      ],
      'boundaries/element-types': [
        2,
        {
          default: 'allow',
          message: '${file.type} is not allowed to import (${dependency.type})',
          rules: [
            {
              from: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features', 'entities'],
              message:
                'Shared module must not import upper layers (${dependency.type})',
            },
            {
              from: ['entities'],
              message: 'Entity must not import upper layers (${dependency.type})',
              disallow: ['app', 'pages', 'widgets', 'features'],
            },
            {
              from: ['entities'],
              message: 'Entity must not import other entity',
              disallow: [
                [
                  'entities',
                  {
                    entity: '!${entity}',
                  },
                ],
              ],
            },
            {
              from: ['features'],
              message:
                'Feature must not import upper layers (${dependency.type})',
              disallow: ['app', 'pages', 'widgets'],
            },
            {
              from: ['features'],
              message: 'Feature must not import other feature',
              disallow: [
                [
                  'features',
                  {
                    feature: '!${feature}',
                  },
                ],
              ],
            },
            {
              from: ['widgets'],
              message:
                'Feature must not import upper layers (${dependency.type})',
              disallow: ['app', 'pages'],
            },
            {
              from: ['widgets'],
              message: 'Widget must not import other widget',
              disallow: [
                [
                  'widgets',
                  {
                    widget: '!${widget}',
                  },
                ],
              ],
            },
            {
              from: ['pages'],
              message: 'Page must not import upper layers (${dependency.type})',
              disallow: ['app'],
            },
            {
              from: ['pages'],
              message: 'Page must not import other page',
              disallow: [
                [
                  'pages',
                  {
                    page: '!${page}',
                  },
                ],
              ],
            },
          ],
        },
      ],
      ...pluginHooks.configs.recommended.rules,
    },
  },
];
