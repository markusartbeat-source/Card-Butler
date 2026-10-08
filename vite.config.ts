import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'
import autoImport from 'unplugin-auto-import/vite'

const backend = 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Fester Port, weil Backend und Google-Redirect-URI auf 5173 eingestellt sind.
    port: 5173,
    strictPort: true,
    // Nur diese Pfade gehören dem Backend. Nicht pauschal /login, denn
    // /login/success ist eine Frontend-Route.
    proxy: {
      '/api': backend,
      '/login/google': backend,
      '/login/oauth2': backend,
      '/oauth2': backend,
      '/logout': backend,
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    icons({ compiler: 'vue3' }),
    // Everything exported from src/dictionary can be used without an import,
    // in <script setup> as well as in the template.
    autoImport({
      dirs: ['./src/dictionary'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),
  ],
})
