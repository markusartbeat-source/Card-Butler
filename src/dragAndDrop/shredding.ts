// Etwas Gezogenes (Karte, Bild), über einem Feld der Drop-Leiste losgelassen:
// Das Feld zieht es ein, bis nichts mehr übrig ist, und spuckt Schnipsel aus.
import confetti from 'canvas-confetti'
import { flyInto } from '../animation/flyInto'

const flightDurationInMilliseconds = 200

// Small paper snippets, thrown straight down and barely at all, so they read as
// the leftovers of something shredded and not as a firework.
const snippetCount = 40
const snippetSize = 0.5
const snippetSpread = 90
const snippetSpeed = 12
const snippetAngleDownwards = 270
const snippetGravity = 2
const snippetLifetime = 90
const snippetColorNames = ['gold-light', 'gold', 'gold-lighter']

// Was die Leiste zuletzt gemessen hat, während das Gezogene über einem ihrer
// Felder hing. Die Zieh-Bibliothek nimmt die gezogene Kopie weg, bevor sie das
// Ablegen meldet – mehr bekommt die Animation also nie zu sehen.
let draggedRect: DOMRect | null = null
let hoveredFieldRect: DOMRect | null = null

export function rememberDropGeometry(dragged: DOMRect | null, field: DOMRect | null) {
  draggedRect = dragged
  hoveredFieldRect = field
}

// Zeichnet eine Kopie dort, wo das Gezogene zuletzt hing, und zieht sie in die
// Mitte des Felds. Die Kopie trägt eine eigene Klasse, nicht die der gezogenen
// Kopie – nach der sucht die Leiste noch bei jeder Mausbewegung. Die Größe
// kommt mit, weil eine Bildkachel ihre Breite sonst nur aus ihrer Reihe hat.
async function flyIntoField(element: HTMLElement, from: DOMRect, into: DOMRect) {
  const flyingCopy = element.cloneNode(true) as HTMLElement
  flyingCopy.classList.remove('cb-drag-ghost', 'animate-cb-rise')
  flyingCopy.classList.add('cb-flying-copy')
  flyingCopy.style.left = `${from.left}px`
  flyingCopy.style.top = `${from.top}px`
  flyingCopy.style.width = `${from.width}px`
  flyingCopy.style.height = `${from.height}px`
  document.body.append(flyingCopy)

  await flyInto(flyingCopy, into, flightDurationInMilliseconds)
  flyingCopy.remove()
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

/** Gezogenes rein, Schnipsel raus. Fertig, sobald die Schnipsel fallen – sie
    regnen weiter, während die Seite weitermacht. */
export async function playShredding(element: HTMLElement | null) {
  const from = draggedRect
  const into = hoveredFieldRect
  if (!into) return

  if (element && from) await flyIntoField(element, from, into)
  rainSnippets(into)
}
