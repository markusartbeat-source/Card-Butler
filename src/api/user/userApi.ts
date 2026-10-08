// Alles, was das Backend über die angemeldete Person weiß und mit ihr macht.
import { postOffice } from '../postOffice/transport'

// Was das Backend unter /api/me über die angemeldete Person liefert.
export type CurrentUser = {
  id: string
  guest: boolean
  name: string
  /** Fehlt bei Gästen. */
  firstName: string | null
  lastName: string | null
  color: string
  /** Kann fehlen, z.B. wenn Google kein Bild liefert. */
  picture: string | null
  /** Fehlt bei Gästen. */
  version: number | null
}

/** Lädt die angemeldete Person. Wirft bei 401, also wenn niemand angemeldet ist. */
function loadCurrentUser() {
  return postOffice.request<CurrentUser>('/api/me')
}

/** Schickt den Browser zur Google-Anmeldung des Backends. Danach bringt das
 *  Backend die Person auf die Seite zurück, von der sie kam. */
function signInWithGoogle() {
  const loginUrl = new URL('/login/google', location.origin)
  loginUrl.searchParams.set('returnTo', location.pathname + location.search)
  window.location.assign(loginUrl)
}

/** Beendet die Sitzung im Backend. */
async function signOut() {
  await postOffice.request('/logout', { method: 'POST' })
  postOffice.forgetCsrfToken()
}

/** Fach `user` der Poststelle, Aufruf als `postOffice.user.…()`. */
export const userApi = { loadCurrentUser, signInWithGoogle, signOut }
