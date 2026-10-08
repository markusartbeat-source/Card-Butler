// Die Poststelle: einziger Weg des Frontends zum Backend. Nur Transport –
// Fachliches gehört in die Themen-Ordner unter src/api/.
import { requestLog } from '../../requestLog/requestLog'

export type PostOfficeRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Wird als JSON gesendet. */
  body?: unknown
}

/** Schickt einen Aufruf ans Backend (relativer Pfad, Sitzungs-Cookie dabei)
 *  und liefert die Antwort als JSON. Wirft bei einem Fehlerstatus. */
async function request<ResponseBody>(
  path: string,
  { method = 'GET', body }: PostOfficeRequestOptions = {},
): Promise<ResponseBody> {
  // Kennzeichnet den Aufruf, damit er sich in Protokollen wiederfinden lässt.
  const requestId = crypto.randomUUID()
  const startTime = performance.now()
  let status = 0

  try {
    const response = await fetch(path, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Request-Id': requestId,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
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

/** Aufruf immer als `postOffice.request(...)`, damit sofort erkennbar ist:
 *  hier geht etwas ans Backend. */
export const postOffice = { request }
