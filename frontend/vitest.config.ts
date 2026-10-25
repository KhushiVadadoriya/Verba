import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testRunner: 'node',
    include: ['src/**/*.test.ts'],
  },
})