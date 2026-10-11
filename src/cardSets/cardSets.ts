import { ref } from 'vue'
import type { CardSetResource } from '../api/cardSets/cardSetsApi'
import type { CardElementValues } from '../cardElements/cardElements'

// The id stays with a card forever — the number is only what the card is called.
export type Card = {
  id: string
  number: number
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

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
