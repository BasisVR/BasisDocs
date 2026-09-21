import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'; //new rules for Next 16.0+ see: https://nextjs.org/docs/app/api-reference/config/eslint
import nextTypescript from 'eslint-config-next/typescript';         //new rules for Next 16.0+ see: https://nextjs.org/docs/app/api-reference/config/eslint
import { dirname } from 'path';                                     //left old approach in just in case.
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '.source/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
