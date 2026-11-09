import type { CardSetResource, FullCardSet } from '../api/cardSets/cardSetsApi'
import type { CardResource } from '../api/cards/cardsApi'
import type { ElementResource } from '../api/elements/elementsApi'
import type { Card, CardSet, CardSetElement } from './cardSets'

// Nur der Bearbeitungszustand der UI wird aufgebaut. Die API-Objekte behalten
// ihre aktuelle Fachstruktur; es gibt keine Rueckabbildung ins alte API-Format.
export function cardSetFromResource(source: CardSetResource): CardSet {
  const { id, version, name, width, height, color, bleedWidth, bleedHeight } = source
  return {
    id, version, data: { name, width, height, color, bleedWidth, bleedHeight },
    cards: [], elements: [],
  }
}

export function cardSetElementFromResource(source: ElementResource): CardSetElement {
  const { id, projectId, setId, version, audit, ...data } = source
  return { id, version, data, savedData: JSON.stringify(data), rotation: 0 }
}

export function cardFromResource(source: CardResource): Card {
  return { id: source.id, version: source.version, printCount: source.printCount, values: {} }
}

export function cardSetFromSnapshot(snapshot: FullCardSet): CardSet {
  const cards = [...snapshot.cards]
    .sort((a, b) => Date.parse(b.audit.createdAt) - Date.parse(a.audit.createdAt))
    .map(cardFromResource)
  for (const { cardId, elementId, text, imageId } of snapshot.cardElementValues) {
    const card = cards.find((card) => card.id === cardId)
    if (card) card.values[elementId] = { text, imageId }
  }
  const elements = [...snapshot.elements]
    .sort((a, b) => Date.parse(a.audit.createdAt) - Date.parse(b.audit.createdAt))
    .map(cardSetElementFromResource)
  return { ...cardSetFromResource(snapshot.set), cards, elements }
}
