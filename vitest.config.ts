import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    singleThread: true,
    deps: {
      inline: ['@asamuzakjp/css-color', '@csstools/css-calc'],
    },
  },
})
