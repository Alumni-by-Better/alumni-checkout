import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/alumni-checkout/',
  build: {
    minify: true,
    sourcemap: false,
    target: 'modules',
  },
})
