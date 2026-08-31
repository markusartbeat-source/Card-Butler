import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { restoreSession } from './composables/useCurrentUser'
import { ripple } from './directives/ripple'
import './arkEmitsFix'

// Wait for the stored session so the sidebar never flashes the signed-out state.
restoreSession().then(() => {
  createApp(App).use(router).directive('ripple', ripple).mount('#app')
})
