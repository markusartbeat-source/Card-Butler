// Where an element sits on the card. Measured from the card's top left corner,
// in the same millimetres as the card format — the card is drawn small in the
// grid and large in the editor, but it is scaled as a whole, so one set of
// millimetres is right everywhere. The rotation is in degrees, clockwise,
// around the element's centre.
export type ElementPlacement = { x: number; y: number; rotation: number }

// The style that puts an element onto the card. It carries the position itself,
// so no element type has to remember to be absolute. The turn goes through
// "transform", not the "rotate" property: Moveable reads the transform to draw
// its frame at the same angle.
export function placementStyle({ x, y, rotation }: ElementPlacement) {
  return {
    position: 'absolute' as const,
    left: `${x}mm`,
    top: `${y}mm`,
    transform: `rotate(${rotation}deg)`,
  }
}
