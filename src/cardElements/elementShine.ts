import { ref } from 'vue'

/** Das Element, das gerade auf der offenen Karte einmal aufglänzt (cb-shine in
    style.css), z.B. nach einem Klick auf seine Ebene – sonst null. Nur die Karte
    im Editor zeigt den Glanz. Glänzt es noch, beginnt ein weiterer Klick nicht
    von vorn. */
export const shiningElementId = ref<string | null>(null)

/** Auch, wenn der Editor mitten im Glanz schließt – sonst glänzte das Element
    beim nächsten Öffnen gleich wieder. */
export function stopShine() {
  shiningElementId.value = null
}

/** Am Ende des Glanzes, damit ein weiterer Klick ihn wieder startet. Auch
    Animationen im Element (z.B. der Ripple) melden ihr Ende hier. */
export function endShine(event: AnimationEvent) {
  if (event.animationName === 'cb-shine') stopShine()
}
