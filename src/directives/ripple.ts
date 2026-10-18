import type { Directive } from 'vue'

// v-ripple: a soft circle grows out of the click position. It lives in a
// directive so any element can use it, not only CbInteractive.
// The element it sits on has to bring "relative overflow-hidden", otherwise
// the circle would be placed against the page and run over the edges.
export const ripple: Directive<HTMLElement> = {
  mounted(element) {
    element.addEventListener('mousedown', (event) => playRipple(element, event.clientX, event.clientY))
  },
}

/** Lässt den Kreis an einer Stelle des Bildschirms aus dem Element wachsen –
 *  auch ohne Klick, z.B. wenn etwas in einem Ordner landet. */
export function playRipple(element: HTMLElement, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2

  const circle = document.createElement('span')
  circle.className = 'bg-white/40 pointer-events-none absolute rounded-full'
  circle.style.left = `${clientX - rect.left - size / 2}px`
  circle.style.top = `${clientY - rect.top - size / 2}px`
  circle.style.width = `${size}px`
  circle.style.height = `${size}px`

  element.appendChild(circle)

  // The animation runs from here instead of a CSS class: a CSS animation is
  // cancelled and started over when the element is hidden and shown again
  // (a dropdown closing on click), which played the ripple a second time.
  const animation = circle.animate(
    [
      { transform: 'scale(0)', opacity: 0.6 },
      { transform: 'scale(1)', opacity: 0 },
    ],
    { duration: 600, easing: 'ease-out' },
  )
  animation.onfinish = () => circle.remove()
}
