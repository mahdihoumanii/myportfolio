import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path defaults to '/' (Vercel). The GitHub Pages workflow overrides it
// with `vite build --base=/<repo>/`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
