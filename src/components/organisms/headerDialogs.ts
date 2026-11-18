import { computed } from 'vue'
import type { RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router'
import { currentProject } from '../../project/currentProject'
import type { IconName } from '../atoms/icons'

// Die Einträge von Header- und Profilmenü, die einen Dialog öffnen, gruppiert
// wie die Menüs sie zeigen. Beide Menüs lesen von hier, so steht jeder Text nur
// einmal. Der offene Dialog steht in der Adresse (?dialog=<value>): Neuladen
// und Links öffnen ihn wieder, „Zurück“ im Browser schließt ihn.
export type HeaderDialog = { value: string; label: string; icon: IconName }

// Diese gehören zum geöffneten Projekt und gehen über der Projektseite auf.
export const imageDialogs = computed<HeaderDialog[]>(() => [
  { value: 'all-images', label: dictionary.header.allImages, icon: 'photo_library' },
  { value: 'icons-in-text', label: dictionary.header.iconsInText, icon: 'art_track' },
])

export const collaborationDialogs = computed<HeaderDialog[]>(() => [
  { value: 'share-project', label: dictionary.header.shareProject, icon: 'share' },
  { value: 'user-management', label: dictionary.header.userManagement, icon: 'manage_accounts' },
])

// Diese gehen über jeder Seite auf.
export const profileDialogs = computed<HeaderDialog[]>(() => [
  { value: 'settings', label: dictionary.settings.title, icon: 'settings' },
  { value: 'support', label: dictionary.general.support, icon: 'support_agent' },
])

const projectDialogs = computed(() => [...imageDialogs.value, ...collaborationDialogs.value])

function findDialog(dialogs: HeaderDialog[], value: unknown) {
  return dialogs.find((dialog) => dialog.value === value)
}

/** Wohin ein Menüeintrag führt, falls er einen dieser Dialoge öffnet. Die des
    Projekts brauchen ein geöffnetes Projekt, ohne geht es zur Startseite mit
    der Projektliste. */
export function headerDialogRoute(value: string, route: RouteLocationNormalizedLoaded): RouteLocationRaw | undefined {
  if (findDialog(profileDialogs.value, value)) return { path: route.path, query: { dialog: value } }
  if (!findDialog(projectDialogs.value, value)) return undefined
  return currentProject.value ? { path: `/project/${currentProject.value.id}`, query: { dialog: value } } : '/home'
}

/** Der Dialog, den die Adresse öffnet. Die des Projekts nur im Projekt. */
export function headerDialogAt(route: RouteLocationNormalizedLoaded) {
  const value = route.query.dialog
  return (
    findDialog(profileDialogs.value, value) ??
    (route.params.projectId ? findDialog(projectDialogs.value, value) : undefined)
  )
}

/** Ob der Dialog ins Profilmenü gehört. */
export function isProfileDialog(dialog: HeaderDialog) {
  return !!findDialog(profileDialogs.value, dialog.value)
}

/** Zurück zur Seite ohne Dialog. War sie der Schritt davor im Browser, geht es
    dorthin zurück – so führt „Zurück“ danach nicht wieder in den Dialog. */
export function closeHeaderDialog(router: Router) {
  const pagePath = router.currentRoute.value.path
  if (window.history.state?.back === pagePath) router.back()
  else router.replace(pagePath)
}
