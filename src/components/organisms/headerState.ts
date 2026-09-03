import { onUnmounted, ref, watchEffect } from 'vue'
import type { HeaderButton } from './headerButton'

export type HeaderSettings = {
  title?: string
  searchbar?: boolean
  buttons?: HeaderButton[]
  onAction?: (key: string) => void
}

// What the header shows right now. The header itself hangs in App.vue above the
// page transition, so it stays still while the page below it animates.
export const headerSettings = ref<HeaderSettings>({})

// A page calls this to describe its own header.
export function useHeader(settings: () => HeaderSettings) {
  let mySettings: HeaderSettings

  watchEffect(() => {
    mySettings = settings()
    headerSettings.value = mySettings
  })

  // During a page change the new page is already mounted when the old one goes
  // away, so the old page only clears the header if it is still its own.
  onUnmounted(() => {
    if (headerSettings.value === mySettings) headerSettings.value = {}
  })
}
