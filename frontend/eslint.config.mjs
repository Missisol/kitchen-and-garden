import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,ts,mjs,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
  },
  {
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/object-curly-newline': ['error', {
        consistent: true,
        // ObjectExpression: 'always',
        // ObjectPattern: 'never',
        // ImportDeclaration: 'never',
        // ExportDeclaration: {
        //   multiline: true,
        //   minProperties: 3,
        // },
      }],
      '@stylistic/brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      '@stylistic/arrow-parens': [2, 'as-needed', {
        requireForBlockBody: true,
      }],

      'vue/multi-word-component-names': ['error', {
      'ignores': []
      }],  
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',

        selfClosingTag: {
          singleline: 'never',
          multiline: 'always',
        },
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'ignore',
        multiline: 'below',
  }],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      }],

      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/attribute-hyphenation': ['error', 'never', {
        ignore: [],
      }],
      'vue/v-on-event-hyphenation': ['error', 'never'],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'any',
          component: 'always',
        },
        svg: 'any',
        math: 'always',
      }],
    },
  },
])
