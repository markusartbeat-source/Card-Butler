import { computed, ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { backendUrl } from '../backend/backendUrl'

const currentUser = ref<User | null>(null)

// Fires once with the stored session and again on every sign in / sign out.
supabase.auth.onAuthStateChange((_event, session) => {
  currentUser.value = session?.user ?? null
})

/** Loads the session saved in the browser. Await this before mounting the app. */
export async function restoreSession() {
  const { data } = await supabase.auth.getSession()
  currentUser.value = data.session?.user ?? null
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
  const displayName = computed(
    () => (currentUser.value?.user_metadata.full_name as string | undefined) ?? null,
  )
  const avatarUrl = computed(
    () => (currentUser.value?.user_metadata.avatar_url as string | undefined) ?? null,
  )

  return { currentUser, displayName, avatarUrl }
}
