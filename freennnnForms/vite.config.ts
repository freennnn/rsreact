/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'forks',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
      },
    },
  },
})
