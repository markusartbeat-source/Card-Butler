// Alles, was das Backend über Kartensets weiß und mit ihnen macht.
import type { CardResource } from '../cards/cardsApi'
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

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
// „Snapshot“). Das Backend liefert noch mehr (revision, elements, values,
// comments, images) – hier steht nur, was die App schon nutzt.
export type FullCardSet = { set: CardSetResource; cards: CardResource[] }

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

/** Lädt ein Kartenset samt Karten – die Karten in keiner festen Reihenfolge. */
function loadFullCardSet(cardSetId: string) {
  return postOffice.request<FullCardSet>(`/api/sets/${encodeURIComponent(cardSetId)}/snapshot`)
}

/** Fach `cardSets` der Poststelle, Aufruf als `postOffice.cardSets.…()`. */
export const cardSetsApi = { loadCardSets, createCardSet, loadFullCardSet }
