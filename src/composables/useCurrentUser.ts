import { computed, ref } from 'vue'
import { postOffice } from '../api/postOffice/postOffice'

// What the backend's /api/me answers for the signed in person.
export type CurrentUser = {
  id: string
  email: string
  name: string
  picture: string
}

const currentUser = ref<CurrentUser | null>(null)

/** Fragt das Backend, wer angemeldet ist. 401 heißt niemand – ebenso ein
 *  nicht erreichbares Backend, denn die App funktioniert auch ohne Anmeldung.
 *  Vor dem Mounten der App abwarten. */
export async function restoreSession() {
  try {
    currentUser.value = await postOffice.request<CurrentUser>('/api/me')
  } catch {
    currentUser.value = null
  }
}

/** Sends the browser to the backend's Google sign in. After it, the backend
 *  brings the user back to the page they started from. */
export function signInWithGoogle() {
  const loginUrl = new URL('/login/google', location.origin)
  loginUrl.searchParams.set('returnTo', location.pathname + location.search)
  window.location.assign(loginUrl)
}

/** Ends the session on the backend. A POST needs the CSRF token first, sent
 *  under the header name the backend hands out with it. */
export async function signOut() {
  const csrfResponse = await fetch('/api/csrf', { credentials: 'include' })
  const csrf: { headerName: string; token: string } = await csrfResponse.json()

  // Das Backend antwortet mit einer Weiterleitung auf eine Frontend-Seite.
  // Die braucht hier niemand, deshalb wird ihr nicht gefolgt.
  await fetch('/logout', {
    method: 'POST',
    credentials: 'include',
    redirect: 'manual',
    headers: { [csrf.headerName]: csrf.token },
  })
  currentUser.value = null
}

/** The person currently signed in with Google, or null when nobody is. */
export function useCurrentUser() {
  const displayName = computed(() => currentUser.value?.name ?? null)
  const avatarUrl = computed(() => currentUser.value?.picture ?? null)

  return { currentUser, displayName, avatarUrl }
}
