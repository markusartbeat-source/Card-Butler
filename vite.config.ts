import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'
import autoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
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
