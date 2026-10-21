// Alles, was das Backend über Kartenwerte weiß und mit ihnen macht. Ein Wert ist
// der Inhalt eines Elements auf genau einer Karte – `parentId` ist die Karte.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

// Was ein Wert speichert: bei Textfeldern den Text, bei Bildern das Bild.
export type ValueData = {
  elementId: string
  value: { text: string | null; imageId: string | null }
}

export type ValueResource = Resource<ValueData>

/** Setzt den Wert eines Elements auf einer Karte. `cardVersion` ist der Stand
 *  der Karte, den der Aufrufer kennt – ist er veraltet, antwortet das Backend
 *  mit 412. Danach hat die Karte eine neue Version. */
function setValue(cardId: string, elementId: string, value: ValueData['value'], cardVersion: number) {
  return postOffice.request<ValueResource>(
    `/api/cards/${encodeURIComponent(cardId)}/values/${encodeURIComponent(elementId)}`,
    { method: 'PUT', body: value, version: cardVersion },
  )
}

/** Fach `values` der Poststelle, Aufruf als `postOffice.values.…()`. */
export const valuesApi = { setValue }
