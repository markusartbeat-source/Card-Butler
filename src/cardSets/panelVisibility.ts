import { ref } from 'vue'

// Whether the card sets panel is slid in over the cards.
export const isCardSetsPanelShown = ref(false)

const hideDelay = 1500
let hideTimer: ReturnType<typeof setTimeout> | undefined

// Shows the panel right away and cancels a pending hide.
export function showCardSetsPanel() {
  clearTimeout(hideTimer)
  isCardSetsPanelShown.value = true
}

// Hides the panel once the delay has passed. Calling it again restarts the delay.
export function hideCardSetsPanelAfterDelay() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    isCardSetsPanelShown.value = false
  }, hideDelay)
}
