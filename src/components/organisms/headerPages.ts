import { computed } from 'vue'
import type { IconName } from '../atoms/icons'

// The header entries that lead to a page of their own, grouped the way the
// header menus show them. The header menus and the profile menu both read
// from here, so every text and link stands only once. The texts come from
// the dictionary, so the lists follow the chosen language.
export type HeaderPage = { value: string; label: string; icon: IconName; path: string }

export const imagePages = computed<HeaderPage[]>(() => [
  {
    value: 'all-images',
    label: dictionary.header.allImages,
    icon: 'photo_library',
    path: '/images/all',
  },
  {
    value: 'icons-in-text',
    label: dictionary.header.iconsInText,
    icon: 'art_track',
    path: '/images/icons-in-text',
  },
])

export const collaborationPages = computed<HeaderPage[]>(() => [
  {
    value: 'share-project',
    label: dictionary.header.shareProject,
    icon: 'share',
    path: '/collaboration/share',
  },
  {
    value: 'user-management',
    label: dictionary.header.userManagement,
    icon: 'manage_accounts',
    path: '/collaboration/users',
  },
])

const allHeaderPages = computed(() => [...imagePages.value, ...collaborationPages.value])

// The URL a menu value leads to, if it is one of these pages.
export function headerPagePath(value: string) {
  return allHeaderPages.value.find((page) => page.value === value)?.path
}

// The menu value of the page that is open at the given URL, if it is one of
// these pages.
export function headerPageAt(path: string) {
  return allHeaderPages.value.find((page) => page.path === path)?.value
}
