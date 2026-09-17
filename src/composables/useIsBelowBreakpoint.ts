import { ref, type Ref } from 'vue'

// Whether the window is narrower than one of the breakpoints — the same width
// the `tablet:` / `laptop:` / `desktop:` classes switch at, read from
// breakpoints.css so CSS and script never disagree. One shared flag per
// breakpoint for the whole app, kept up to date while the window is resized.
type Breakpoint = 'tablet' | 'laptop' | 'desktop'

const flagByBreakpoint: Partial<Record<Breakpoint, Ref<boolean>>> = {}

export function useIsBelowBreakpoint(breakpoint: Breakpoint) {
  let isBelow = flagByBreakpoint[breakpoint]
  if (!isBelow) {
    const width = getComputedStyle(document.documentElement)
      .getPropertyValue(`--breakpoint-${breakpoint}`)
      .trim()
    const belowQuery = matchMedia(`(width < ${width})`)

    const flag = ref(belowQuery.matches)
    belowQuery.addEventListener('change', (event) => (flag.value = event.matches))
    flagByBreakpoint[breakpoint] = flag
    isBelow = flag
  }

  return isBelow
}
