import { ref } from 'vue'
import { cardSets } from './cardSets'
import { cardSetElementId } from './scrollToCardSetSection'

/** The set whose section the user is looking at right now. The sets panel and
    the header menu mark it. null, solange es kein Set gibt. */
export const visibleCardSetId = ref<string | null>(null)

/** The visible set is the last one whose section starts above the middle of the
    page area — so a set counts as soon as it fills the bigger part of the screen. */
export function updateVisibleCardSet(pageArea: HTMLElement) {
  const loadedCardSets = cardSets.value ?? []
  const middle = pageArea.getBoundingClientRect().top + pageArea.clientHeight / 2
  const visibleCardSet = loadedCardSets.findLast((cardSet) => {
    const section = document.getElementById(cardSetElementId(cardSet.id))
    return section !== null && section.getBoundingClientRect().top <= middle
  })
  visibleCardSetId.value = visibleCardSet?.id ?? loadedCardSets[0]?.id ?? null
}
