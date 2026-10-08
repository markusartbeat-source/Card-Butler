import { computed, ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'
import type { CurrentUser } from '../api/user/userApi'

const currentUser = ref<CurrentUser | null>(null)

/** Fragt das Backend, wer angemeldet ist. 401 heißt niemand – ebenso ein
 *  nicht erreichbares Backend, denn die App funktioniert auch ohne Anmeldung.
 *  Vor dem Mounten der App abwarten. */
export async function restoreSession() {
  try {
    currentUser.value = await postOffice.user.loadCurrentUser()
  } catch {
    currentUser.value = null
  }
}

/** Beendet die Sitzung im Backend und vergisst die Person. */
export async function signOut() {
  await postOffice.user.signOut()
  currentUser.value = null
}

/** The person currently signed in with Google, or null when nobody is. */
export function useCurrentUser() {
  const displayName = computed(() => currentUser.value?.name ?? null)
  const avatarUrl = computed(() => currentUser.value?.picture ?? null)

  return { currentUser, displayName, avatarUrl }
}
