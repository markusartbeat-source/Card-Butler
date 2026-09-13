import { ref } from 'vue'
import { cardSets } from './cardSets'
import { cardSetElementId } from './scrollToCardSetSection'

/** The set whose section the user is looking at right now. The sets panel and
    the header menu mark it. */
export const visibleCardSetId = ref(cardSets.value[0].id)

/** The visible set is the last one whose section starts above the middle of the
    page area — so a set counts as soon as it fills the bigger part of the screen. */
export function updateVisibleCardSet(pageArea: HTMLElement) {
  const middle = pageArea.getBoundingClientRect().top + pageArea.clientHeight / 2
  const visibleCardSet = cardSets.value.findLast((cardSet) => {
    const section = document.getElementById(cardSetElementId(cardSet.id))
    return section !== null && section.getBoundingClientRect().top <= middle
  })
  visibleCardSetId.value = visibleCardSet?.id ?? cardSets.value[0].id
}
