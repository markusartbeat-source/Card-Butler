import { ref, type Ref } from 'vue'
import { cardFormat } from '../../card/cardFormat'

// Ab so vielen Pixeln Bewegung wird aus dem Drücken ein Ziehen.
const dragThresholdInPixels = 8

/** Ziehen eines neuen Elements auf die Karte, mit eigenen Pointer-Events.
 *  dragPosition ist die Zeigerposition (px), solange gezogen wird – sonst null.
 *  onDrop bekommt die Ablagestelle auf der Karte (mm); außerhalb passiert nichts. */
export function useNewElementDrag(
  card: Readonly<Ref<HTMLElement | null>>,
  onDrop: (xInMillimeters: number, yInMillimeters: number) => void,
) {
  const dragPosition = ref<{ x: number; y: number } | null>(null)

  function startDrag(pressEvent: PointerEvent) {
    if (pressEvent.button !== 0) return

    function follow(event: PointerEvent) {
      const distance = Math.hypot(
        event.clientX - pressEvent.clientX,
        event.clientY - pressEvent.clientY,
      )
      if (dragPosition.value || distance >= dragThresholdInPixels) {
        dragPosition.value = { x: event.clientX, y: event.clientY }
      }
    }

    function finish(event: PointerEvent) {
      window.removeEventListener('pointermove', follow)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      // Ohne Bewegung war es ein Klick – den meldet die Toolbar selbst.
      if (!dragPosition.value) return
      dragPosition.value = null
      swallowFollowingClick()

      const point = event.type === 'pointerup' ? positionOnCard(event) : null
      if (point) onDrop(point.x, point.y)
    }

    window.addEventListener('pointermove', follow)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
  }

  // Zeigerposition auf der Karte in mm, außerhalb null. Über das Verhältnis zur
  // gezeichneten Größe gerechnet – so spielt der Zoom keine Rolle.
  function positionOnCard({ clientX, clientY }: PointerEvent) {
    const rect = card.value?.getBoundingClientRect()
    if (!rect) return null
    const isOnCard =
      clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    if (!isOnCard) return null

    return {
      x: ((clientX - rect.left) / rect.width) * cardFormat.value.width,
      y: ((clientY - rect.top) / rect.height) * cardFormat.value.height,
    }
  }

  return { dragPosition, startDrag }
}

// Nach dem Ziehen schickt der Browser noch einen Klick (an den Eintrag oder einen
// gemeinsamen Vorfahren). Der darf weder ein Feld in der Mitte anlegen noch die
// Auswahl aufheben. Er kommt gleich nach dem Loslassen – danach nicht mehr warten.
function swallowFollowingClick() {
  const swallow = (event: MouseEvent) => event.stopPropagation()
  window.addEventListener('click', swallow, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }))
}
