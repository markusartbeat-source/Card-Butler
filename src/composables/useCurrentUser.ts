import { computed, ref } from 'vue'
import { supabase } from '../supabase'
import { backendUrl } from '../backend/backendUrl'

// What the backend's /api/me answers for the signed in person.
export type CurrentUser = {
  id: string
  email: string
  name: string
  picture: string
}

const currentUser = ref<CurrentUser | null>(null)

/** Asks the backend who is signed in. The session lives in a cookie, so the
 *  request has to send it along. 401 means nobody — and so does a backend
 *  that cannot be reached, because the app works without signing in. Await
 *  this before mounting the app. */
export async function restoreSession() {
  try {
    const response = await fetch(`${backendUrl}/api/me`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    currentUser.value = response.ok ? await response.json() : null
  } catch {
    currentUser.value = null
  }
}

/** Sends the browser to the backend's Google sign in. After it, the backend
 *  brings the user back to the page they started from. */
export function signInWithGoogle() {
  const loginUrl = new URL('/login/google', backendUrl)
  loginUrl.searchParams.set('returnTo', location.pathname + location.search)
  window.location.assign(loginUrl)
}

/** Ends the current session. */
export function signOut() {
  supabase.auth.signOut()
}

/** The person currently signed in with Google, or null when nobody is. */
export function useCurrentUser() {
  const displayName = computed(() => currentUser.value?.name ?? null)
  const avatarUrl = computed(() => currentUser.value?.picture ?? null)

  return { currentUser, displayName, avatarUrl }
}
