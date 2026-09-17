import { ref } from 'vue'

// The card whose print count overlay is showing right now — null for none.
export const printCountOverlayCardId = ref<string | null>(null)

// The overlay leaves 1 s after the last change. Every change starts the
// time over, so it stays while the wheel keeps turning.
const hideAfterMilliseconds = 1000
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function showPrintCountOverlay(cardId: string) {
  printCountOverlayCardId.value = cardId
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => (printCountOverlayCardId.value = null), hideAfterMilliseconds)
}
