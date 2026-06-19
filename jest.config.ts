import type { Config } from 'jest'

const config: Config = {
  projects: [
    // CJS project for tests that don't need ESM deps
    {
      displayName: 'cjs',
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: [
        '**/tests/lib/reading-time.test.ts',
        '**/tests/lib/content.test.ts',
      ],
    },
    // ESM project for tests that use ESM-only packages
    {
      displayName: 'esm',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      testMatch: [
        '**/tests/lib/markdown.test.ts',
      ],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
      },
      extensionsToTreatAsEsm: ['.ts'],
    },
  ],
}

export default config
