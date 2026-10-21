import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import type { ValueData } from '../api/values/valuesApi'
import { queueCardChange } from '../cardSets/cardChangeQueue'
import { cardSets, type Card } from '../cardSets/cardSets'
import { reloadCardSet } from '../cardSets/loadCardSets'

// Was eine Karte in die Elemente ihres Sets einträgt, je Element-id – wie im
// Backend: bei Textfeldern den Text, bei Bild-Elementen das Bild. Gespeichert
// wird immer nur der eine geänderte Wert.
export type CardElementValues = Record<string, ValueData['value']>

// So lange nach dem letzten Tastendruck wird gewartet, bevor gespeichert wird.
const typingPauseInMilliseconds = 1000

// Speicherungen, die noch auf die Tipp-Pause warten – je Karte und Feld eine.
const waitingSaves = new Map<string, { timer: ReturnType<typeof setTimeout>; save: () => void }>()

/** Setzt den Text eines Textfelds nur auf dieser Karte. Gespeichert wird nach
 *  einer Tipp-Pause, jeder weitere Aufruf für dasselbe Feld schiebt das hinaus. */
export function changeCardText(card: Card, elementId: string, text: string) {
  card.values[elementId] = { text, imageId: null }

  const key = `${card.id}/${elementId}`
  clearTimeout(waitingSaves.get(key)?.timer)
  const save = () => {
    waitingSaves.delete(key)
    saveCardValue(card.id, elementId)
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

/** Zeigt im Bild-Element nur auf dieser Karte dieses Bild und speichert das.
 *  Ist es schon gewählt, passiert nichts. */
export function chooseCardPicture(card: Card, elementId: string, imageId: string) {
  if (card.values[elementId]?.imageId === imageId) return

  card.values[elementId] = { text: null, imageId }
  saveCardValue(card.id, elementId)
}

/** Schickt den neuesten Wert eines Elements auf einer Karte ins Backend und
 *  übernimmt danach ihre neue Version. Änderungen je Karte laufen nacheinander,
 *  denn jede erhöht ihre Version. Die Karte wird erst dann gesucht: Wurde ihr
 *  Set inzwischen neu geladen, ist sie ein neues Objekt. Fehler meldet schon die
 *  Poststelle per Toast. */
function saveCardValue(cardId: string, elementId: string) {
  return queueCardChange([cardId], async () => {
    const cardSet = cardSets.value?.find((cardSet) => cardSet.cards.some((card) => card.id === cardId))
    const card = cardSet?.cards.find((card) => card.id === cardId)
    const value = card?.values[elementId]
    if (!cardSet || !card || !value) return

    try {
      await postOffice.values.setValue(cardId, elementId, value, card.version)
      // Um wie viel die Version gestiegen ist, sagt die Antwort nicht – darum nachladen.
      card.version = (await postOffice.cards.loadCard(cardId)).version
    } catch (error) {
      // Jemand anderes hat die Karte oder das Element inzwischen geändert oder gelöscht.
      if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    }
  })
}
