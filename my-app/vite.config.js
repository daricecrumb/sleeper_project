import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // fixing the error 'Error: [vite]: Rollup failed to resolve import "@supabase/supabase-js" from "/vercel/path0/my-app/src/App.jsx".' during build with vercel
  build: {
    rollupOptions: {
      external: ['@supabase/supabase-js'],
    },
  },
})


