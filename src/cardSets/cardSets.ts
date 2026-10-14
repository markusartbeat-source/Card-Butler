import { ref } from 'vue'
import type { CardSetResource, FullCardSet } from '../api/cardSets/cardSetsApi'
import type { CardResource } from '../api/cards/cardsApi'
import { newerFirst } from '../api/postOffice/resource'
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

// A project has many card sets, each with its own cards. Header, project page
// and the sets panel all read from this one list.
export type CardSet = { id: string; name: string; cards: Card[] }

// Die Kartensets des geöffneten Projekts. null, solange sie nicht geladen sind.
export const cardSets = ref<CardSet[] | null>(null)

/** Macht aus einem Kartenset des Backends eins der App. Die Karten kommen
    eigens dazu. */
export function cardSetFromResource(cardSetResource: CardSetResource): CardSet {
  return { id: cardSetResource.id, name: cardSetResource.data.name, cards: [] }
}

/** Macht aus einer Karte des Backends eine der App. Ihren Namen braucht die App
    nicht, Inhalte und Druckanzahl kennt das Backend noch nicht. */
export function cardFromResource(cardResource: CardResource): Card {
  return { id: cardResource.id, version: cardResource.version, elementValues: {}, printCount: 1 }
}

/** Macht aus einem vollständigen Kartenset des Backends eins der App, samt
    Karten. Die neueste Karte steht vorn – dort, wo auch neu angelegte hinkommen. */
export function cardSetFromFullCardSet(fullCardSet: FullCardSet): CardSet {
  return {
    ...cardSetFromResource(fullCardSet.set),
    cards: fullCardSet.cards.sort(newerFirst).map(cardFromResource),
  }
}

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
