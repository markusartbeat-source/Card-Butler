// The toast that shows how far the PNG export has come. It carries its numbers
// in meta, which is what CbToaster.vue reads to draw CbExportProgressToast.
import { toaster } from '../components/atoms/toaster'

// The bar always takes at least this long, so a quick export does not just
// blink from empty to full.
const minimumBarTime = 2000

// How often the bar is redrawn while the export runs.
const barTickTime = 50

// CbProgress slides its bar to a new value over 300 ms, so the last value is
// set that much earlier — then the bar is really full after minimumBarTime.
const barCatchUpTime = 300

const fullBar = 100

let barTicker = 0
let barStartTime = 0
let finishedCards = 0
let cardCount = 1

// No close button and no running time: the export itself decides when this
// toast is done.
export function startExportProgressToast(cards: number) {
  barStartTime = Date.now()
  finishedCards = 0
  cardCount = cards

  const id = toaster.create({
    duration: Infinity,
    closable: false,
    meta: { exportProgress: { value: 0, max: fullBar } },
  })

  window.clearInterval(barTicker)
  barTicker = window.setInterval(() => drawBar(id), barTickTime)
  return id
}

// The card that is being photographed right now is not finished yet, so the bar
// may walk through its part of the way but not past it. Inside that room it
// simply follows the clock. That way a single fast card still fills the bar
// calmly over two seconds, while a slow export stays at the truth.
function drawBar(id: string) {
  const byTime = ((Date.now() - barStartTime) / (minimumBarTime - barCatchUpTime)) * fullBar
  const roomSoFar = ((finishedCards + 1) / cardCount) * fullBar
  const value = Math.min(byTime, roomSoFar, fullBar)

  toaster.update(id, { meta: { exportProgress: { value, max: fullBar } } })
}

export function reportExportedCard(finishedCount: number) {
  finishedCards = finishedCount
}

// Waits until the bar has really arrived at the end, so a fast export does not
// close its toast while the bar is still walking.
export function waitForFullBar() {
  const timeLeft = minimumBarTime - (Date.now() - barStartTime)
  return new Promise((done) => window.setTimeout(done, Math.max(timeLeft, 0)))
}

export function closeExportProgressToast(id: string) {
  window.clearInterval(barTicker)
  toaster.dismiss(id)
}
