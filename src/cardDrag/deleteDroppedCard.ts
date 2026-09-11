import type { Ref } from 'vue'
import { showUndoToast } from '../components/atoms/toaster'
import { releaseCardDrag } from './cardDragState'
import { playCardShredding } from './shredCard'

/** The card leaves the row at once and is shredded in the drop field. Only when
    its snippets start falling does the surface come back and the toast offer to
    put the card exactly where it stood. */
export async function deleteDroppedCard<Card>(
  cards: Ref<Card[]>,
  cardIndex: number,
  cardElement: HTMLElement | null,
) {
  const [deletedCard] = cards.value.splice(cardIndex, 1)
  if (!deletedCard) return releaseCardDrag()

  await playCardShredding(cardElement)
  releaseCardDrag()

  showUndoToast(dictionary.cardDrag.cardDeleted, () => {
    cards.value.splice(cardIndex, 0, deletedCard)
  })
}
