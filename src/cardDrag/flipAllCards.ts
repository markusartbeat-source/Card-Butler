import { nextTick, ref } from 'vue'

/** True while every card in the grid shows its back. Shared, because the grid
    draws the flip and the drop bar triggers it. */
export const showingCardBacks = ref(false)

/** True while the cards are mid-turn. Things that sit flat on the card in page
    pixels — like the print count badge — hide themselves for that moment. */
export const isTurningCards = ref(false)

/** Dropping on "flip all cards" turns the whole grid over — and back again. */
export async function flipAllCards() {
  // Letting go makes the drag library put every card of the row back into the
  // page as a fresh node. A node that turns over in the same moment it arrives
  // has nothing to animate from — so the row is laid out once as it is first.
  await nextTick()
  void document.body.offsetWidth

  isTurningCards.value = true
  showingCardBacks.value = !showingCardBacks.value
}

/** The grid calls this when a face's transition ends; only the turn counts,
    not the scale or tilt of a dragged card. */
export function cardTurnEnded(event: TransitionEvent) {
  if (event.propertyName === 'transform') isTurningCards.value = false
}
