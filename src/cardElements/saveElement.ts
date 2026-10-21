import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { cardSets } from '../cardSets/cardSets'
import { reloadCardSet } from '../cardSets/loadCardSets'

/** Speichert den lokalen Stand eines Elements im Backend und übernimmt die neue
 *  Version. Unverändertes geht nicht noch einmal raus – das spart Versionen und
 *  412. Liefert, ob das geklappt hat – Fehler meldet schon die Poststelle per Toast. */
export async function saveElement(elementId: string) {
  const cardSet = cardSets.value?.find((cardSet) =>
    cardSet.elements.some((element) => element.id === elementId),
  )
  const element = cardSet?.elements.find((element) => element.id === elementId)
  if (!cardSet || !element) return false

  // Ändert sich data während der Anfrage, ist nur dieser Stand gespeichert.
  const data = JSON.stringify(element.data)
  if (data === element.savedData) return true

  try {
    const { version } = await postOffice.elements.updateElement(elementId, element.data, element.version)
    element.version = version
    element.savedData = data
    return true
  } catch (error) {
    // Jemand anderes hat das Element inzwischen geändert oder gelöscht.
    if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    return false
  }
}
