import { refStoredInBrowser } from '../browserStorage/refStoredInBrowser'
import { areCornerRadiiUniform, uniformCornerRadii, type CornerRadii } from '../card/cornerRadii'
import { changeElement } from './cardElements'

// Das Backend kennt je Element nur einen Radius. Verschiedene Ecken merkt sich
// deshalb der Browser, je Element-id.
const separateCornerRadii = refStoredInBrowser<Record<string, CornerRadii>>(
  'separateCornerRadii',
  {},
)

/** Die Rundung jeder Ecke eines Elements in mm. radius ist der eine Wert aus dem Backend. */
export function cornerRadiiOfElement(id: string, radius: number | null | undefined) {
  return separateCornerRadii.value[id] ?? uniformCornerRadii(radius ?? 0)
}

/** Stellt die Rundung der Ecken ein. Gleiche Ecken gehen als ein Radius ins
    Backend, verschiedene nur in den Browser – das Backend behält dann seinen
    Radius. */
export function changeElementCornerRadii(id: string, radii: CornerRadii) {
  const isUniform = areCornerRadiiUniform(radii)
  const stored = { ...separateCornerRadii.value }
  if (isUniform) delete stored[id]
  else stored[id] = radii
  separateCornerRadii.value = stored

  if (isUniform) changeElement(id, (data) => (data.radius = radii.topLeft))
}
