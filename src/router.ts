import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import AllImagesPage from './pages/AllImagesPage.vue'
import IconsInTextPage from './pages/IconsInTextPage.vue'
import ShareProjectPage from './pages/ShareProjectPage.vue'
import UserManagementPage from './pages/UserManagementPage.vue'
import ProjectPage from './pages/ProjectPage.vue'
import UpgradePage from './pages/UpgradePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import SupportPage from './pages/SupportPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/images/all', component: AllImagesPage },
    { path: '/images/icons-in-text', component: IconsInTextPage },
    { path: '/collaboration/share', component: ShareProjectPage },
    { path: '/collaboration/users', component: UserManagementPage },
    { path: '/project', component: ProjectPage },
    { path: '/upgrade', component: UpgradePage },
    { path: '/settings', component: SettingsPage },
    { path: '/support', component: SupportPage },
  ],
})

export default router
