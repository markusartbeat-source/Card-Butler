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
  // Dummy set to check the sections — leaves again once sets can be created.
  {
    id: 'dummy-card-set',
    name: dictionary.cardSets.cardSetName(2),
    cards: [1, 2, 3].map((number) => ({
      id: `dummy-card-${number}`,
      number,
      elementValues: {},
    })),
  },
])
