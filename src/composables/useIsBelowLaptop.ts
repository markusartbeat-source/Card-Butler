import { ref } from 'vue'

// Whether the window is narrower than the laptop breakpoint — the same width
// the `laptop:` classes switch at, read from breakpoints.css so CSS and script
// never disagree. One shared flag for the whole app, kept up to date while
// the window is resized.
const isBelowLaptop = ref(false)

let isWatchingWindow = false

export function useIsBelowLaptop() {
  if (!isWatchingWindow) {
    isWatchingWindow = true

    const laptopWidth = getComputedStyle(document.documentElement)
      .getPropertyValue('--breakpoint-laptop')
      .trim()
    const belowLaptop = matchMedia(`(width < ${laptopWidth})`)

    isBelowLaptop.value = belowLaptop.matches
    belowLaptop.addEventListener('change', (event) => (isBelowLaptop.value = event.matches))
  }

  return { isBelowLaptop }
}
