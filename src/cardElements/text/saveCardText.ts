import { ref } from 'vue'
import { ApiError } from '../../api/postOffice/apiError'
import { postOffice } from '../../api/postOffice/postOffice'
import type { ValueResource } from '../../api/values/valuesApi'
import { cardSets } from '../../cardSets/cardSets'
import { reloadCardSet } from '../../cardSets/loadCardSets'

// So lange nach dem letzten Tastendruck wird gewartet, bevor gespeichert wird.
const typingPauseInMilliseconds = 1000

// Speicherungen, die noch auf die Tipp-Pause warten – je Karte und Feld eine.
const waitingSaves = new Map<string, { timer: ReturnType<typeof setTimeout>; save: () => void }>()

// Je Karte die zuletzt angestoßene Speicherung. Jede neue wartet sie ab, denn
// jeder Text erhöht die Version der Karte – zwei gleichzeitig gäben 412.
const latestSaveByCardId = new Map<string, Promise<unknown>>()

// TEMPORÄR (Plan „Textfeld bearbeiten“, Aufräumschritt): letzte Speicherung für
// den Kasten im Editor.
export const lastCardTextSave = ref<{
  cardVersionBefore: number
  cardVersionAfter: number
  response: ValueResource
} | null>(null)

/** Speichert den Text eines Textfelds auf einer Karte, sobald eine Tipp-Pause
 *  eintritt. Jeder weitere Aufruf für dasselbe Feld schiebt das hinaus. */
export function saveCardTextAfterPause(cardId: string, elementId: string) {
  const key = `${cardId}/${elementId}`
  clearTimeout(waitingSaves.get(key)?.timer)

  const save = () => {
    waitingSaves.delete(key)
    const previousSave = latestSaveByCardId.get(cardId) ?? Promise.resolve()
    latestSaveByCardId.set(cardId, previousSave.then(() => saveCardText(cardId, elementId)))
  }
  waitingSaves.set(key, { timer: setTimeout(save, typingPauseInMilliseconds), save })
}

/** Speichert alle Texte, die noch auf die Tipp-Pause warten, sofort. */
export function saveWaitingCardTexts() {
  for (const { timer, save } of waitingSaves.values()) {
    clearTimeout(timer)
    save()
  }
}

// Schickt den neuesten Text des Felds und übernimmt danach die neue Version der
// Karte. Die Karte wird erst jetzt gesucht: Wurde ihr Set inzwischen neu
// geladen, ist sie ein neues Objekt. Liefert, ob das geklappt hat – Fehler
// meldet schon die Poststelle per Toast.
async function saveCardText(cardId: string, elementId: string) {
  const cardSet = cardSets.value?.find((cardSet) => cardSet.cards.some((card) => card.id === cardId))
  const card = cardSet?.cards.find((card) => card.id === cardId)
  const text = card?.elementValues[elementId]
  if (!cardSet || !card || text === undefined) return false

  try {
    const cardVersionBefore = card.version
    const response = await postOffice.values.setText(cardId, elementId, text, card.version)
    // Um wie viel die Version gestiegen ist, sagt die Antwort nicht – darum nachladen.
    card.version = (await postOffice.cards.loadCard(cardId)).version
    lastCardTextSave.value = { cardVersionBefore, cardVersionAfter: card.version, response } // TEMPORÄR
    return true
  } catch (error) {
    // Jemand anderes hat die Karte oder das Feld inzwischen geändert oder gelöscht.
    if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    return false
  }
}
