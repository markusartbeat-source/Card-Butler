import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ProjectPage from './pages/ProjectPage.vue'
import CbProjectFrame from './project/CbProjectFrame.vue'
import UpgradePage from './pages/UpgradePage.vue'

// Bilder, Zusammenarbeit, Einstellungen und Support sind Dialoge über der Seite,
// sie stehen im Abfrageteil der Adresse (components/organisms/headerDialogs.ts).
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
    // Der Rahmen öffnet das Projekt, die Seite darunter läuft darin.
    {
      path: '/project/:projectId',
      component: CbProjectFrame,
      props: true,
      children: [{ path: '', component: ProjectPage }],
    },
    { path: '/upgrade', component: UpgradePage },
  ],
})

export default router
