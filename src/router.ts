import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ImagesPage from './pages/ImagesPage.vue'
import ProjectPage from './pages/ProjectPage.vue'
import UpgradePage from './pages/UpgradePage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/images', component: ImagesPage },
    { path: '/project', component: ProjectPage },
    { path: '/upgrade', component: UpgradePage },
    { path: '/settings', component: SettingsPage },
  ],
})

export default router
