import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The same source builds three ways:
//   npm run build                                   → base '/'  (Capacitor APK, local preview)
//   VITE_BASE=/murshidi-app/ npm run build          → GitHub Pages under a repository sub-path
// The router is a HashRouter, so only asset URLs need the base — there is no
// server-side rewrite to configure.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
