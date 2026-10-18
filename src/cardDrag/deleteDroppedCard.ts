import type { CardSet } from '../cardSets/cardSets'
import { deleteCard } from '../cardSets/deleteCard'
import { showDeletionToast } from '../deletion/showDeletionToast'
import { releaseDrag } from '../dragAndDrop/dragState'
import { playCardShredding } from './shredCard'

/** The card leaves the row at once and is shredded in the drop field. Only when
    its snippets start falling does the surface come back and the toast offer to
    put the card exactly where it stood. Gelöscht wird im Backend erst, wenn der
    Toast ohne „Rückgängig“ verschwunden ist. */
export async function deleteDroppedCard(
  cardSet: CardSet,
  cardIndex: number,
  cardElement: HTMLElement | null,
) {
  const [deletedCard] = cardSet.cards.splice(cardIndex, 1)
  if (!deletedCard) return releaseDrag()

  await playCardShredding(cardElement)
  releaseDrag()

  showDeletionToast(
    dictionary.dropBar.cardDeleted,
    () => cardSet.cards.splice(cardIndex, 0, deletedCard),
    () => deleteCard(cardSet, deletedCard),
  )
}
