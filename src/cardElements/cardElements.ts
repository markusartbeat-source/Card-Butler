import { ref } from 'vue'
import type { ElementPlacement } from '../elementTransform/elementPlacement'
import type { TextElement } from './text/textElement'

// Every card of a deck is built the same way: the elements below belong to the
// deck, not to a single card. Only one value per element differs from card to
// card — the content of a text, the link of an image.
// Each element type has its own folder next to this file.

// What every element type has, no matter what it shows.
export type CardElementBase = {
  id: string
  name: string
  placement: ElementPlacement
}

export type CardElement = TextElement

// Fixed for now, editing the build-up comes later.
export const cardElements = ref<CardElement[]>([
  { id: 'effect-text', name: 'Effekt', type: 'text', placement: { x: 8, y: 55 } },
])

// What one card fills into the deck's elements, keyed by element id.
export type CardElementValues = Record<string, string>
