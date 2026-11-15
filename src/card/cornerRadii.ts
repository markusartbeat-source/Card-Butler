// Die vier Ecken in Lesereihenfolge: oben links, oben rechts, unten links, unten rechts.
export const corners = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const

export type Corner = (typeof corners)[number]

// Wie rund jede Ecke ist, in mm.
export type CornerRadii = Record<Corner, number>

export function uniformCornerRadii(radius: number): CornerRadii {
  return { topLeft: radius, topRight: radius, bottomLeft: radius, bottomRight: radius }
}

export function areCornerRadiiUniform(radii: CornerRadii) {
  return corners.every((corner) => radii[corner] === radii.topLeft)
}

// Für CSS border-radius – das zählt im Uhrzeigersinn ab oben links. zoom ist für
// Flächen, die ohne eigenen Zoom über einer gezoomten Karte liegen.
export function cornerRadiiStyle(
  { topLeft, topRight, bottomRight, bottomLeft }: CornerRadii,
  zoom = 1,
) {
  return [topLeft, topRight, bottomRight, bottomLeft]
    .map((radius) => `${radius * zoom}mm`)
    .join(' ')
}
