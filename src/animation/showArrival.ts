import { playRipple } from '../directives/ripple'

/** Zeigt, dass etwas in einem Element angekommen ist, z.B. in einem Ordner: Es
 *  schwillt kurz an, federt zurück, und aus seiner Mitte läuft der Kreis wie
 *  beim Klicken – dafür braucht es wie dort "relative overflow-hidden". */
export function showArrival(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  playRipple(element, rect.left + rect.width / 2, rect.top + rect.height / 2)
  element.animate(
    [{ scale: 1 }, { scale: 1.15, offset: 0.35 }, { scale: 0.97, offset: 0.7 }, { scale: 1 }],
    { duration: 400, easing: 'ease-out' },
  )
}
