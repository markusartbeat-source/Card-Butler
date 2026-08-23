import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), icons({ compiler: 'vue3' })],
})
