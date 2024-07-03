import typescript from 'typescript-eslint';
import reactConfigurations from 'eslint-plugin-react/configs/recommended.js';
import stylistic from '@stylistic/eslint-plugin';

const configuration = typescript.config(
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            ...typescript.configs.recommended,
            reactConfigurations,
            stylistic.configs['recommended-flat']
        ],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            ...reactConfigurations.languageOptions,
            sourceType: 'module'
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            // Ban console.(log|warn|error)() and (alert|confirm|prompt)(), since we
            // have toasts, and these should only be used while debugging.
            "no-console": "error",
            "no-alert": "error",

            // TypeScript already does type checking for destructuring, so we don't need this:
            'react/prop-types': 'off',

            "react/jsx-filename-extension": [ 'error', {"extensions": [".tsx"]} ],
            '@stylistic/jsx-pascal-case': 'error',
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'never']
        }
    }
)

export default configuration;