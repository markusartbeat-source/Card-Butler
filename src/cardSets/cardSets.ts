import { ref } from 'vue'
import type { CardSetData, FullCardSet } from '../api/cardSets/cardSetsApi'
import type { ElementData } from '../api/elements/elementsApi'
import type { CardElementValues } from '../cardElements/cardValues'
import type { TextSizing } from '../cardElements/text/textSizing'
import { rememberImages } from '../images/knownImages'
import { inRememberedLayerOrder } from '../layers/layerOrder'
import { cardSetFromSnapshot } from './cardSetModel'
export { cardSetFromResource, cardSetElementFromResource, cardFromResource } from './cardSetModel'

export type Card = {
  id: string
  /** Stand der Karte im Backend, wird beim Ändern als If-Match mitgeschickt. */
  version: number
  // What this card fills into the deck's elements.
  values: CardElementValues
  // How many copies of this card get printed. 1 is the normal card.
  printCount: number
}

// Ein Element des Sets mit seinen vollständigen Backend-Daten – der einzigen
// Quelle der Wahrheit, gezeichnet wird direkt daraus. Die Version geht beim
// Ändern als If-Match mit. savedData ist der zuletzt gespeicherte Stand als
// JSON, so speichert saveElement nur Änderungen. Die Drehung (Grad) und wie ein
// Textfeld zu seiner Größe kommt, kennt das Backend nicht – beides lebt nur hier
// und geht beim Neuladen verloren.
export type CardSetElement = {
  id: string
  version: number
  data: ElementData
  savedData: string
  rotation: number
  textSizing?: TextSizing
}

// A project has many card sets, each with its own cards. Header, project page
// and the sets panel all read from this one list.
// data sind die Einstellungen des Sets aus dem Backend (Name, Maße, Farbe,
// Anschnitt), die Version geht beim Ändern als If-Match mit.
export type CardSet = {
  id: string
  version: number
  data: CardSetData
  cards: Card[]
  elements: CardSetElement[]
}

// Die Kartensets des geöffneten Projekts. null, solange sie nicht geladen sind.
export const cardSets = ref<CardSet[] | null>(null)

/** Das Set, dem das Element gehört. */
export function findCardSetOfElement(elementId: string) {
  return cardSets.value?.find((cardSet) =>
    cardSet.elements.some((element) => element.id === elementId),
  )
}

/** Macht aus einem vollständigen Kartenset des Backends eins der App, samt
    Karten, Elementen, Texten und Bildern der Karten. Die neueste Karte steht
    vorn – dort, wo auch neu angelegte hinkommen. Die Elemente stehen so, wie
    ihre Ebenen zuletzt sortiert waren, sonst das neueste hinten, also obenauf.
    Name und Adresse der Bilder merkt sich die App projektweit. */
export function cardSetFromFullCardSet(fullCardSet: FullCardSet): CardSet {
  const cardSet = cardSetFromSnapshot(fullCardSet)
  rememberImages(fullCardSet.images)
  cardSet.elements = inRememberedLayerOrder(fullCardSet.set.id, cardSet.elements)
  return cardSet
}

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
