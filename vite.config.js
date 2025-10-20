import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Use base path when building for production so assets resolve under /blog
  const base = command === 'build'
    ? (env.VITE_ROUTER_BASENAME || '/')
    : '/';

  return {
    base: base.endsWith('/') ? base : base + '/',
    plugins: [tailwindcss(), react()],
  }
})
