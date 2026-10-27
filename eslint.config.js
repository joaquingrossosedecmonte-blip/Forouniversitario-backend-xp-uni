import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        localStorage: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly'
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
);