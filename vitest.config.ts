import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['client/src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});