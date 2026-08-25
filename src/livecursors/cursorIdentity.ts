import { computed } from 'vue'
import { useCurrentUser } from '../composables/useCurrentUser'

// The values behind these names live in src/colors.css.
const cursorColors = [
  'var(--color-cursor-red)',
  'var(--color-cursor-orange)',
  'var(--color-cursor-green)',
  'var(--color-cursor-blue)',
  'var(--color-cursor-purple)',
  'var(--color-cursor-pink)',
]

const guestIdStorageKey = 'cb-cursor-guest-id'

// A guest keeps this id for the whole browser tab, so the color survives a reload.
function readGuestId() {
  const stored = sessionStorage.getItem(guestIdStorageKey)
  if (stored) return stored

  const created = crypto.randomUUID()
  sessionStorage.setItem(guestIdStorageKey, created)
  return created
}

const guestId = readGuestId()

/** Always picks the same color for the same id — never random. */
export function colorForId(id: string) {
  let sum = 0
  for (const character of id) sum += character.charCodeAt(0)
  return cursorColors[sum % cursorColors.length]
}

/** Who I am for the others: the Google name when signed in, otherwise a guest. */
export function useMyIdentity() {
  const { currentUser, displayName } = useCurrentUser()

  const name = computed(() => displayName.value ?? 'Gast')
  const color = computed(() => colorForId(currentUser.value?.id ?? guestId))

  return { name, color }
}
