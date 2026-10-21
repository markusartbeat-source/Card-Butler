import { postOffice } from '../../api/postOffice/postOffice'
import { queueCardChange } from '../../cardSets/cardChangeQueue'
import type { Card } from '../../cardSets/cardSets'
import { saveCardValue } from '../saveCardValue'

/** Zeigt im Bild-Element nur auf dieser Karte dieses Bild und speichert das.
    Ist es schon gewählt, passiert nichts. */
export function chooseCardPicture(card: Card, elementId: string, imageId: string) {
  if (card.elementImageIds[elementId] === imageId) return

  card.elementImageIds[elementId] = imageId
  queueCardChange([card.id], () =>
    saveCardValue(card.id, (savedCard) => {
      const savedImageId = savedCard.elementImageIds[elementId]
      return savedImageId === undefined
        ? undefined
        : postOffice.values.setImage(card.id, elementId, savedImageId, savedCard.version)
    }),
  )
}
