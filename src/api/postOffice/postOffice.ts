// Die Poststelle: einziger Weg des Frontends zum Backend. Nur Transport –
// Fachliches gehört in die Themen-Ordner unter src/api/.
import { requestLog } from '../../requestLog/requestLog'

export type PostOfficeRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Wird als JSON gesendet. */
  body?: unknown
}

type CsrfToken = { headerName: string; token: string }

// Schutz gegen gefälschte Aufrufe fremder Seiten. Wird beim ersten
// schreibenden Aufruf geholt und im Speicher gehalten.
let csrfToken: CsrfToken | null = null

/** Schickt einen Aufruf ans Backend (relativer Pfad, Sitzungs-Cookie dabei)
 *  und liefert die Antwort als JSON. Wirft bei einem Fehlerstatus. */
async function request<ResponseBody>(
  path: string,
  { method = 'GET', body }: PostOfficeRequestOptions = {},
): Promise<ResponseBody> {
  // Kennzeichnet den Aufruf, damit er sich in Protokollen wiederfinden lässt.
  const requestId = crypto.randomUUID()
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Request-Id': requestId }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') {
    csrfToken ??= await request<CsrfToken>('/api/csrf')
    headers[csrfToken.headerName] = csrfToken.token
  }

  const startTime = performance.now()
  let status = 0

  try {
    const response = await fetch(path, {
      method,
      credentials: 'include',
      redirect: 'manual',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    // Weiterleitungen des Backends (z.B. nach dem Abmelden) gelten der
    // Adresszeile, nicht diesem Aufruf: Ihnen wird nicht gefolgt, sie zählen
    // als Erfolg ohne Inhalt. Den Status verbirgt der Browser dabei; Spring
    // schickt 302.
    if (response.type === 'opaqueredirect') {
      status = 302
      return undefined as ResponseBody
    }

    status = response.status
    if (!response.ok) throw new Error(`${method} ${path} ${status}`)

    // Manche Antworten (z.B. 204) haben keinen Inhalt.
    const responseText = await response.text()
    return responseText ? JSON.parse(responseText) : undefined
  } finally {
    // TEMPORÄR (Poststellen-Protokoll): wird im Aufräumschritt entfernt.
    requestLog.unshift({
      method,
      path,
      status,
      durationInMilliseconds: Math.round(performance.now() - startTime),
      requestId,
    })
  }
}

/** Nach dem Abmelden aufrufen: Das Backend macht den Token dann ungültig. */
function forgetCsrfToken() {
  csrfToken = null
}

/** Aufruf immer als `postOffice.request(...)`, damit sofort erkennbar ist:
 *  hier geht etwas ans Backend. */
export const postOffice = { request, forgetCsrfToken }
