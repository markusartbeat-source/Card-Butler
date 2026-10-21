// Alles, was das Backend über Kartensets weiß und mit ihnen macht.
import type { CardResource } from '../cards/cardsApi'
import type { ElementResource } from '../elements/elementsApi'
import type { ImageResource } from '../images/imagesApi'
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'
import type { ValueResource } from '../values/valuesApi'

// Die gemeinsamen Einstellungen eines Kartensets. Maße in mm.
export type CardSetData = {
  name: string
  width: number
  height: number
  /** Hintergrundfarbe der Karten als `#RRGGBB` oder `#RRGGBBAA`. */
  color: string
  bleedWidth: number
  bleedHeight: number
}

export type CardSetResource = Resource<CardSetData>

// Ein Kartenset mit allem, was dazugehört, auf einem Stand (im Backend
// „Snapshot“). Das Backend liefert noch mehr (revision, comments) – hier steht
// nur, was die App schon nutzt.
export type FullCardSet = {
  set: CardSetResource
  cards: CardResource[]
  elements: ElementResource[]
  /** Die Werte aller Karten des Sets. */
  values: ValueResource[]
  /** Die Bilder, die Elemente oder Karten des Sets zeigen. */
  images: ImageResource[]
}

/** Lädt alle Kartensets eines Projekts – in keiner festen Reihenfolge. */
function loadCardSets(projectId: string) {
  return postOffice.request<CardSetResource[]>(
    `/api/projects/${encodeURIComponent(projectId)}/sets`,
  )
}

/** Legt im Projekt ein Kartenset an. */
function createCardSet(projectId: string, cardSetData: CardSetData) {
  return postOffice.request<CardSetResource>(
    `/api/projects/${encodeURIComponent(projectId)}/sets`,
    { method: 'POST', body: cardSetData },
  )
}

/** Lädt ein Kartenset samt Karten und Elementen – beide in keiner festen
 *  Reihenfolge. */
function loadFullCardSet(cardSetId: string) {
  return postOffice.request<FullCardSet>(`/api/sets/${encodeURIComponent(cardSetId)}/snapshot`)
}

/** Lädt ein Kartenset ohne Karten und Elemente, z.B. um seine aktuelle Version
 *  zu erfahren. */
function loadCardSet(cardSetId: string) {
  return postOffice.request<CardSetResource>(`/api/sets/${encodeURIComponent(cardSetId)}`)
}

/** Ersetzt die Einstellungen eines Kartensets komplett. `version` ist der Stand,
 *  den der Aufrufer kennt – ist er veraltet, antwortet das Backend mit 412. Jede
 *  Änderung an Karten, Elementen und Werten des Sets erhöht ihn. */
function updateCardSet(cardSetId: string, cardSetData: CardSetData, version: number) {
  return postOffice.request<CardSetResource>(`/api/sets/${encodeURIComponent(cardSetId)}`, {
    method: 'PUT',
    body: cardSetData,
    version,
  })
}

/** Fach `cardSets` der Poststelle, Aufruf als `postOffice.cardSets.…()`. */
export const cardSetsApi = {
  loadCardSets,
  createCardSet,
  loadFullCardSet,
  loadCardSet,
  updateCardSet,
}
