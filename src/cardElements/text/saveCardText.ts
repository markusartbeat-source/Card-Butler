import { postOffice } from '../../api/postOffice/postOffice'
import { queueCardChange } from '../../cardSets/cardChangeQueue'
import { saveCardValue } from '../saveCardValue'

// So lange nach dem letzten Tastendruck wird gewartet, bevor gespeichert wird.
const typingPauseInMilliseconds = 1000

// Speicherungen, die noch auf die Tipp-Pause warten – je Karte und Feld eine.
const waitingSaves = new Map<string, { timer: ReturnType<typeof setTimeout>; save: () => void }>()

/** Speichert den Text eines Textfelds auf einer Karte, sobald eine Tipp-Pause
 *  eintritt. Jeder weitere Aufruf für dasselbe Feld schiebt das hinaus. */
export function saveCardTextAfterPause(cardId: string, elementId: string) {
  const key = `${cardId}/${elementId}`
  clearTimeout(waitingSaves.get(key)?.timer)

  const save = () => {
    waitingSaves.delete(key)
    queueCardChange([cardId], () => saveCardText(cardId, elementId))
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

// Schickt den neuesten Text des Felds.
function saveCardText(cardId: string, elementId: string) {
  return saveCardValue(cardId, (card) => {
    const text = card.elementValues[elementId]
    return text === undefined
      ? undefined
      : postOffice.values.setText(cardId, elementId, text, card.version)
  })
}
