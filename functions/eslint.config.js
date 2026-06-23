const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  // Global ignores
  {
    ignores: ['lib/**/*', 'eslint.config.js', '.eslintrc.js'],
  },
  // Base ESLint recommended
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.dev.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2018,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      // ESLint recommended rules
      'no-unused-vars': 'off', // use @typescript-eslint version instead
      // TypeScript ESLint recommended rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off', // Allow any - per original config
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Per original config
      // Custom rules from original config
      // quotes: ['error', 'single'],
      // Import plugin rules (errors and warnings)
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'warn',
      'import/no-deprecated': 'warn',
      'import/no-mutable-exports': 'warn',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.d.ts', '.test.ts'],
        },
      },
    },
  },
];
