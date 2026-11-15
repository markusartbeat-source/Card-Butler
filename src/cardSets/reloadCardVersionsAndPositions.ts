import { postOffice } from '../api/postOffice/postOffice'
import type { CardSet } from './cardSets'

/** Übernimmt Version und Platz aller Karten des Sets aus dem Backend – nötig,
 *  wenn Karten nachgerückt sind. Die Reihenfolge im Set bleibt, wie sie ist,
 *  sonst spränge eine Karte zurück, deren Verschieben noch wartet. Wirft bei
 *  Fehlern, die Poststelle meldet sie schon per Toast. */
export async function reloadCardVersionsAndPositions(cardSet: CardSet) {
  const cardResources = await postOffice.cards.loadCards(cardSet.id)
  for (const card of cardSet.cards) {
    const cardResource = cardResources.find((resource) => resource.id === card.id)
    if (!cardResource) continue
    card.version = cardResource.version
    card.position = cardResource.position
  }
}
