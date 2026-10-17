import { computed } from 'vue'
import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'
import { currentProject } from '../../project/currentProject'
import type { IconName } from '../atoms/icons'

// The header entries that lead to a page of their own, grouped the way the
// header menus show them. The header menus and the profile menu both read
// from here, so every text and link stands only once. The texts come from
// the dictionary, so the lists follow the chosen language.
// "value" ist zugleich der Name der Route (router.ts).
export type HeaderPage = { value: string; label: string; icon: IconName }

export const imagePages = computed<HeaderPage[]>(() => [
  { value: 'all-images', label: dictionary.header.allImages, icon: 'photo_library' },
  { value: 'icons-in-text', label: dictionary.header.iconsInText, icon: 'art_track' },
])

export const collaborationPages = computed<HeaderPage[]>(() => [
  { value: 'share-project', label: dictionary.header.shareProject, icon: 'share' },
  { value: 'user-management', label: dictionary.header.userManagement, icon: 'manage_accounts' },
])

const allHeaderPages = computed(() => [...imagePages.value, ...collaborationPages.value])

// Wohin ein Menüeintrag führt, falls er eine dieser Seiten ist. Sie liegen im
// geöffneten Projekt, ohne Projekt geht es zur Startseite mit der Projektliste.
export function headerPageRoute(value: string): RouteLocationRaw | undefined {
  if (!allHeaderPages.value.some((page) => page.value === value)) return undefined
  return currentProject.value
    ? { name: value, params: { projectId: currentProject.value.id } }
    : '/home'
}

// Der Menüwert der offenen Seite, falls sie eine dieser Seiten ist.
export function headerPageAt(routeName: RouteLocationNormalizedLoaded['name']) {
  return allHeaderPages.value.find((page) => page.value === routeName)?.value
}
