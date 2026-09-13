// The id every section of the project page carries, so it can be scrolled to.
export function cardSetElementId(cardSetId: string) {
  return `card-set-${cardSetId}`
}

// The browser's own smooth scroll is over in a blink and cannot be slowed down,
// so the page area is moved by hand: an ease-in-out over 800ms, the pace of a
// whole-page change plus some way to travel.
const scrollDurationMs = 800

/** Glides the page area until the section of the given set stands at its top. */
export function scrollToCardSetSection(cardSetId: string) {
  const section = document.getElementById(cardSetElementId(cardSetId))
  const pageArea = section?.closest('main')
  if (!section || !pageArea) return

  const startTop = pageArea.scrollTop
  const sectionTop = startTop + section.getBoundingClientRect().top - pageArea.getBoundingClientRect().top
  const furthestTop = pageArea.scrollHeight - pageArea.clientHeight
  const distance = Math.min(sectionTop, furthestTop) - startTop
  const startTime = performance.now()

  function step(now: number) {
    const progress = Math.min((now - startTime) / scrollDurationMs, 1)
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2
    pageArea!.scrollTop = startTop + distance * eased
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
