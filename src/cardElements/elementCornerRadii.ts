import { refStoredInBrowser } from '../browserStorage/refStoredInBrowser'
import { areCornerRadiiUniform, uniformCornerRadii, type CornerRadii } from '../card/cornerRadii'
import { changeElement, findCardSetElement } from './cardElements'

// Das Backend kennt nur beim Viereck einen Radius, beim Bild gar keinen.
// Verschiedene Ecken – beim Bild alle – merkt sich deshalb der Browser, je
// Element-id.
const separateCornerRadii = refStoredInBrowser<Record<string, CornerRadii>>(
  'separateCornerRadii',
  {},
)

/** Die Rundung jeder Ecke eines Elements in mm. radius ist der eine Wert aus dem Backend. */
export function cornerRadiiOfElement(id: string, radius: number | null | undefined) {
  return separateCornerRadii.value[id] ?? uniformCornerRadii(radius ?? 0)
}

/** Stellt die Rundung der Ecken ein. Gleiche Ecken eines Vierecks gehen als ein
    Radius ins Backend, alles andere nur in den Browser – das Backend behält dann
    seinen Radius. */
export function changeElementCornerRadii(id: string, radii: CornerRadii) {
  const savesRadiusInBackend =
    findCardSetElement(id)?.data.type === 'SQUARE' && areCornerRadiiUniform(radii)
  const stored = { ...separateCornerRadii.value }
  if (savesRadiusInBackend) delete stored[id]
  else stored[id] = radii
  separateCornerRadii.value = stored

  if (savesRadiusInBackend) changeElement(id, (data) => (data.radius = radii.topLeft))
}
