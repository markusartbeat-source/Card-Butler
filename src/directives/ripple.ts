import type { Directive } from 'vue'

// v-ripple: a soft circle grows out of the click position. It lives in a
// directive so any element can use it, not only CbInteractive.
// The element it sits on has to bring "relative overflow-hidden", otherwise
// the circle would be placed against the page and run over the edges.
export const ripple: Directive<HTMLElement> = {
  mounted(element) {
    element.addEventListener('mousedown', (event) => spawnRipple(element, event as MouseEvent))
  },
}

function spawnRipple(element: HTMLElement, event: MouseEvent) {
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2

  const circle = document.createElement('span')
  circle.className = 'bg-white/40 animate-cb-ripple pointer-events-none absolute rounded-full'
  circle.style.left = `${event.clientX - rect.left - size / 2}px`
  circle.style.top = `${event.clientY - rect.top - size / 2}px`
  circle.style.width = `${size}px`
  circle.style.height = `${size}px`

  element.appendChild(circle)
  circle.addEventListener('animationend', () => circle.remove())
}
