import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import AllImagesPage from './pages/AllImagesPage.vue'
import IconsInTextPage from './pages/IconsInTextPage.vue'
import ShareProjectPage from './pages/ShareProjectPage.vue'
import UserManagementPage from './pages/UserManagementPage.vue'
import ProjectPage from './pages/ProjectPage.vue'
import CbProjectFrame from './project/CbProjectFrame.vue'
import UpgradePage from './pages/UpgradePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import SupportPage from './pages/SupportPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    // The backend lands here after a Google sign in without "returnTo". The
    // user is already loaded by then (main.ts waits for it), so straight on.
    { path: '/login/success', redirect: '/home' },
    { path: '/home', component: HomePage },
    // Ohne Projekt-ID gibt es nichts zu zeigen.
    { path: '/project', redirect: '/home' },
    // Der Rahmen öffnet das Projekt, die Seiten darunter laufen darin. Die Namen
    // sind zugleich die Werte der Menüeinträge (headerPages.ts).
    {
      path: '/project/:projectId',
      component: CbProjectFrame,
      props: true,
      children: [
        { path: '', component: ProjectPage },
        { path: 'images/all', name: 'all-images', component: AllImagesPage },
        { path: 'images/icons-in-text', name: 'icons-in-text', component: IconsInTextPage },
        { path: 'collaboration/share', name: 'share-project', component: ShareProjectPage },
        { path: 'collaboration/users', name: 'user-management', component: UserManagementPage },
      ],
    },
    { path: '/upgrade', component: UpgradePage },
    { path: '/settings', component: SettingsPage },
    { path: '/support', component: SupportPage },
  ],
})

export default router
