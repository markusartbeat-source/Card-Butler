import { ref } from 'vue'
import type { CardElementValues } from '../cardElements/cardElements'

// The id stays with a card forever — the number is only what the card is called.
export type Card = {
  id: string
  number: number
  // What this card fills into the deck's elements.
  elementValues: CardElementValues
}

// A project has many card sets, each with its own cards. Header, project page
// and the sets panel all read from this one list.
export type CardSet = { id: string; name: string; cards: Card[] }

// The starter set uses fixed ids so every window means the same cards. Real
// shared card data comes later with live sync.
export const cardSets = ref<CardSet[]>([
  {
    id: 'starter-card-set',
    name: dictionary.cardSets.cardSetName(1),
    cards: [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
      id: `starter-card-${number}`,
      number,
      // Placeholder content for now.
      elementValues: (number === 3 ? { 'effect-text': 'Test' } : {}) as CardElementValues,
    })),
  },
])

/** A new set starts with one empty card, so it is not an empty section. Its
    name counts on from the sets there are. */
export function addCardSet() {
  const cardSet: CardSet = {
    id: crypto.randomUUID(),
    name: dictionary.cardSets.cardSetName(cardSets.value.length + 1),
    cards: [{ id: crypto.randomUUID(), number: 1, elementValues: {} }],
  }
  cardSets.value.push(cardSet)
  return cardSet
}

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
