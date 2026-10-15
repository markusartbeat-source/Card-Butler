import { ref } from 'vue'
import type { CardSetResource, FullCardSet } from '../api/cardSets/cardSetsApi'
import type { CardResource } from '../api/cards/cardsApi'
import type { ElementData, ElementResource } from '../api/elements/elementsApi'
import { newerFirst, olderFirst } from '../api/postOffice/resource'
import type { CardElementValues } from '../cardElements/cardElements'

export type Card = {
  id: string
  /** Stand der Karte im Backend, wird beim Ändern als If-Match mitgeschickt. */
  version: number
  // What this card fills into the deck's elements.
  elementValues: CardElementValues
  // How many copies of this card get printed. 1 is the normal card.
  printCount: number
}

// Ein Element des Sets mit seinen vollständigen Backend-Daten. Die Version geht
// beim Ändern als If-Match mit.
export type CardSetElement = { id: string; version: number; data: ElementData }

// A project has many card sets, each with its own cards. Header, project page
// and the sets panel all read from this one list.
export type CardSet = { id: string; name: string; cards: Card[]; elements: CardSetElement[] }

// Die Kartensets des geöffneten Projekts. null, solange sie nicht geladen sind.
export const cardSets = ref<CardSet[] | null>(null)

/** Macht aus einem Kartenset des Backends eins der App. Karten und Elemente
    kommen eigens dazu. */
export function cardSetFromResource(cardSetResource: CardSetResource): CardSet {
  return { id: cardSetResource.id, name: cardSetResource.data.name, cards: [], elements: [] }
}

/** Macht aus einem Element des Backends eins des Sets. */
export function cardSetElementFromResource({ id, version, data }: ElementResource): CardSetElement {
  return { id, version, data }
}

/** Macht aus einer Karte des Backends eine der App. Ihren Namen braucht die App
    nicht, Inhalte und Druckanzahl kennt das Backend noch nicht. */
export function cardFromResource(cardResource: CardResource): Card {
  return { id: cardResource.id, version: cardResource.version, elementValues: {}, printCount: 1 }
}

/** Macht aus einem vollständigen Kartenset des Backends eins der App, samt
    Karten und Elementen. Die neueste Karte steht vorn – dort, wo auch neu
    angelegte hinkommen. Das neueste Element steht hinten, also obenauf. */
export function cardSetFromFullCardSet(fullCardSet: FullCardSet): CardSet {
  return {
    ...cardSetFromResource(fullCardSet.set),
    cards: fullCardSet.cards.sort(newerFirst).map(cardFromResource),
    elements: fullCardSet.elements.sort(olderFirst).map(cardSetElementFromResource),
  }
}

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
