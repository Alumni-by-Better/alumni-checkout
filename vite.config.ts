import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alumni-checkout/',
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
})
