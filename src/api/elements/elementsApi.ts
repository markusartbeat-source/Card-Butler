// Alles, was das Backend über Elemente weiß und mit ihnen macht. Elemente
// gehören zum Kartenset und gelten für alle seine Karten.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

export type ElementType = 'SQUARE' | 'CIRCLE' | 'LINE' | 'TEXT' | 'PICTURE'
export type HorizontalAlignment = 'LEFT' | 'CENTER' | 'RIGHT'
export type VerticalAlignment = 'TOP' | 'CENTER' | 'BOTTOM'

// Was ein Element speichert. Maße in mm; die Position ist die linke obere Ecke,
// gemessen von der linken oberen Ecke der Karte. Die optionalen Felder liefert
// das Backend mit (sonst null); sie müssen beim Ändern mitgehen, sonst löscht
// das Backend sie.
export type ElementData = {
  name: string
  type: ElementType
  opacity: number
  width: number
  height: number
  alignment: { horizontal: HorizontalAlignment; vertical: VerticalAlignment }
  position: { x: number; y: number }
  radius?: number | null
  color?: string | null
  border?: { color: string; lineType: 'SOLID' | 'DASHED'; width: number } | null
  text?: string | null
  imageId?: string | null
  fontSize?: number | null
  fontFamily?: string | null
}

export type ElementResource = Resource<ElementData>

/** Legt in einem Kartenset ein Element an. */
function createElement(cardSetId: string, data: ElementData) {
  return postOffice.request<ElementResource>(
    `/api/sets/${encodeURIComponent(cardSetId)}/elements`,
    { method: 'POST', body: data },
  )
}

/** Ersetzt ein Element komplett – fehlende Felder werden null. `version` ist der
 *  Stand, den der Aufrufer kennt – ist er veraltet, antwortet das Backend mit 412. */
function updateElement(elementId: string, data: ElementData, version: number) {
  return postOffice.request<ElementResource>(`/api/elements/${encodeURIComponent(elementId)}`, {
    method: 'PUT',
    body: data,
    version,
  })
}

/** Löscht ein Element samt den Werten aller Karten dazu – deren Versionen
 *  steigen dadurch. `version` ist der Stand des Elements, den der Aufrufer kennt
 *  – ist er veraltet, antwortet das Backend mit 412. */
function deleteElement(elementId: string, version: number) {
  return postOffice.request<void>(`/api/elements/${encodeURIComponent(elementId)}`, {
    method: 'DELETE',
    version,
  })
}

/** Fach `elements` der Poststelle, Aufruf als `postOffice.elements.…()`. */
export const elementsApi = { createElement, updateElement, deleteElement }
