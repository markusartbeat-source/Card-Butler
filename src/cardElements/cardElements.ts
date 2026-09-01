import { ref } from 'vue'

// Every card of a deck is built the same way: the elements below belong to the
// deck, not to a single card. Only one value per element differs from card to
// card — the content of a text, the link of an image.
export type CardElement = {
  id: string
  name: string
  type: 'text'
}

// Fixed for now, editing the build-up comes later.
export const cardElements = ref<CardElement[]>([
  { id: 'effect-text', name: 'Effekt', type: 'text' },
])

// What one card fills into the deck's elements, keyed by element id.
export type CardElementValues = Record<string, string>
