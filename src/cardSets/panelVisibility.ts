import { ref } from 'vue'
import { visibleCardSetId } from './visibleCardSet'

// Whether the card sets panel is slid in over the cards.
export const isCardSetsPanelShown = ref(false)

// The set the panel marks. It lags behind the visible set: the panel first
// slides in with the old mark, then the mark jumps, so the change can be seen.
export const markedCardSetId = ref(visibleCardSetId.value)

// The mark jumps and the panel slides out after the same pause.
const markDelay = 800
const hideDelay = markDelay
let markTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

// While the cursor is inside the panel, nothing may slide it out.
let isCursorInPanel = false

// The cursor came in: the panel shows right away and a pending hide is cancelled.
export function cursorEnteredCardSetsPanel() {
  isCursorInPanel = true
  clearTimeout(hideTimer)
  isCardSetsPanelShown.value = true
}

// The cursor went out: the panel slides out once the delay has passed.
export function cursorLeftCardSetsPanel() {
  isCursorInPanel = false
  hideCardSetsPanelAfterDelay()
}

// The visible set changed: the panel shows, a moment later the mark jumps to
// the new set, and after the delay the panel slides out again. While the
// panel is already there, the mark follows right away and the panel stays a
// while longer. With the cursor inside, it stays until the cursor has left.
export function flashCardSetsPanel() {
  clearTimeout(markTimer)
  if (isCardSetsPanelShown.value) return markVisibleCardSet()

  isCardSetsPanelShown.value = true
  markTimer = setTimeout(markVisibleCardSet, markDelay)
}

function markVisibleCardSet() {
  markedCardSetId.value = visibleCardSetId.value
  if (!isCursorInPanel) hideCardSetsPanelAfterDelay()
}

// Calling it again restarts the delay.
function hideCardSetsPanelAfterDelay() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    isCardSetsPanelShown.value = false
  }, hideDelay)
}
