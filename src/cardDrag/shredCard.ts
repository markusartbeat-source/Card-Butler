// A card let go over a field of the drop bar: it is pulled into the field until
// nothing is left of it, and the field spits its snippets back out.
import confetti from 'canvas-confetti'

const flightDurationInMilliseconds = 200

// Small paper snippets, thrown straight down and barely at all, so they read as
// the leftovers of a shredded card and not as a firework.
const snippetCount = 40
const snippetSize = 0.5
const snippetSpread = 90
const snippetSpeed = 12
const snippetAngleDownwards = 270
const snippetGravity = 2
const snippetLifetime = 90
const snippetColorNames = ['gold-light', 'gold', 'gold-lighter']

// What the drop bar last measured while a card hung over one of its fields. The
// drag library takes the dragged copy off the page before it reports the drop,
// so this is everything the animation ever gets to see.
let draggedCardRect: DOMRect | null = null
let hoveredFieldRect: DOMRect | null = null

export function rememberDropGeometry(cardRect: DOMRect | null, fieldRect: DOMRect | null) {
  draggedCardRect = cardRect
  hoveredFieldRect = fieldRect
}

// Draws a copy of the card where it last hung and pulls it into the middle of
// the field. The copy wears a class of its own, not the one of the dragged
// card, which the drop bar is still looking for on every mouse move.
function flyIntoField(cardElement: HTMLElement, from: DOMRect, into: DOMRect) {
  const flyingCard = cardElement.cloneNode(true) as HTMLElement
  flyingCard.classList.remove('cb-card-ghost', 'animate-cb-rise')
  flyingCard.classList.add('cb-flying-card')
  flyingCard.style.left = `${from.left}px`
  flyingCard.style.top = `${from.top}px`
  document.body.append(flyingCard)

  const moveX = into.left + into.width / 2 - (from.left + from.width / 2)
  const moveY = into.top + into.height / 2 - (from.top + from.height / 2)

  // "translate" and "scale" instead of "transform" — like everything else that
  // moves a card in this project.
  const flight = flyingCard.animate(
    [
      { translate: '0 0', scale: 1 },
      { translate: `${moveX}px ${moveY}px`, scale: 0 },
    ],
    { duration: flightDurationInMilliseconds, easing: 'ease-in' },
  )

  return flight.finished.then(() => flyingCard.remove())
}

// The snippets rain out of the middle of the field. They draw on a surface of
// their own over the whole window, which is cleared away again as soon as the
// last snippet has landed.
function rainSnippets(fieldRect: DOMRect) {
  const confettiStage = document.createElement('canvas')
  confettiStage.className = 'cb-shred-stage'
  document.body.append(confettiStage)

  const themeColors = getComputedStyle(document.documentElement)
  const pop = confetti.create(confettiStage, { resize: true })

  pop({
    particleCount: snippetCount,
    scalar: snippetSize,
    spread: snippetSpread,
    startVelocity: snippetSpeed,
    angle: snippetAngleDownwards,
    gravity: snippetGravity,
    ticks: snippetLifetime,
    // A paper snippet is a straight cut, so it is drawn as a little square.
    shapes: ['square' as const],
    origin: {
      x: (fieldRect.left + fieldRect.width / 2) / window.innerWidth,
      y: (fieldRect.top + fieldRect.height / 2) / window.innerHeight,
    },
    colors: snippetColorNames.map((name) => themeColors.getPropertyValue(`--color-${name}`).trim()),
  })?.then(() => {
    pop.reset()
    confettiStage.remove()
  })
}

/** Card in, snippets out. Resolves as soon as the snippets start falling — they
    keep raining while the page goes on. */
export async function playCardShredding(cardElement: HTMLElement | null) {
  const from = draggedCardRect
  const into = hoveredFieldRect
  if (!into) return

  if (cardElement && from) await flyIntoField(cardElement, from, into)
  rainSnippets(into)
}
