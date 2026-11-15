import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { queueCardChange } from '../cardSets/cardChangeQueue'
import { cardSets, type Card } from '../cardSets/cardSets'
import { reloadCardSet } from '../cardSets/loadCardSets'

// A card is printed at least once, and never more than 99 times.
export const minPrintCount = 1
export const maxPrintCount = 99

// So lange nach der letzten Änderung wird gewartet, bevor gespeichert wird – ein
// Dreh am Mausrad sind viele einzelne Schritte.
const pauseInMilliseconds = 1000

// Speicherungen, die noch auf die Pause warten – je Karte eine.
const waitingSaves = new Map<string, ReturnType<typeof setTimeout>>()

/** Setzt, wie oft die Karte gedruckt wird – gerundet und begrenzt auf die
 *  erlaubten Werte. Gespeichert wird nach einer Pause, jeder weitere Aufruf
 *  schiebt das hinaus. */
export function changePrintCount(card: Card, printCount: number) {
  card.printCount = Math.min(maxPrintCount, Math.max(minPrintCount, Math.round(printCount)))

  clearTimeout(waitingSaves.get(card.id))
  const save = () => {
    waitingSaves.delete(card.id)
    savePrintCount(card.id)
  }
  waitingSaves.set(card.id, setTimeout(save, pauseInMilliseconds))
}

/** Schickt die neueste Druckanzahl ins Backend. Die anderen Karten rücken dabei
 *  nicht, nur diese bekommt eine neue Version. Die Karte wird erst gesucht, wenn
 *  sie an der Reihe ist: Wurde ihr Set inzwischen neu geladen, ist sie ein neues
 *  Objekt. Fehler meldet schon die Poststelle per Toast. */
function savePrintCount(cardId: string) {
  return queueCardChange([cardId], async () => {
    const cardSet = cardSets.value?.find((cardSet) => cardSet.cards.some((card) => card.id === cardId))
    const card = cardSet?.cards.find((card) => card.id === cardId)
    if (!cardSet || !card) return

    try {
      const { printCount, version } = card
      card.version = (await postOffice.cards.updateCard(cardId, { printCount }, version)).version
    } catch (error) {
      // Jemand anderes hat die Karte inzwischen geändert oder gelöscht.
      if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    }
  })
}
