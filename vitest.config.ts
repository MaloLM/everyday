import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'main',
          globals: true,
          environment: 'node',
          include: ['src/main/**/*.test.{js,ts}'],
        },
      },
      {
        test: {
          name: 'renderer',
          globals: true,
          environment: 'jsdom',
          include: ['src/renderer/**/*.test.{ts,tsx}'],
          setupFiles: ['./src/test/setup.renderer.ts'],
          css: false,
        },
      },
    ],
  },
})
