// The small confetti cloud that greets a finished export.
import confetti from 'canvas-confetti'

// Where the cloud starts, measured on the confetti surface: it is 384 × 288 px
// (h-72 w-96) in the bottom right corner, and the toast standing in it is
// 336 × 76 px with 16 px air around it. That puts the middle of the toast at
// 200 of 384 across and 234 of 288 down.
const toastCenterAcross = 200 / 384
const toastCenterDown = 234 / 288

// Few and small: this is a wink, not a New Year's party.
const particleCount = 24
const particleSize = 0.6
const particleSpread = 80
const particleSpeed = 22

// The paper snippets wear the colours of the app.
const particleColorNames = ['gold-light', 'gold', 'gold-lighter']

function particleColors() {
  const themeColors = getComputedStyle(document.documentElement)
  return particleColorNames.map((name) => themeColors.getPropertyValue(`--color-${name}`).trim())
}

// Draws on its own surface over the toast corner, so the confetti can never
// spread across the whole screen. The surface is cleared away again as soon as
// the last snippet has fallen.
export function popConfettiOverToast() {
  const confettiStage = document.createElement('canvas')
  confettiStage.className = 'cb-confetti-stage'
  document.body.append(confettiStage)

  const pop = confetti.create(confettiStage, { resize: true })

  pop({
    particleCount,
    scalar: particleSize,
    spread: particleSpread,
    startVelocity: particleSpeed,
    origin: { x: toastCenterAcross, y: toastCenterDown },
    colors: particleColors(),
  })?.then(() => {
    pop.reset()
    confettiStage.remove()
  })
}
