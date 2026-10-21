import { ref } from 'vue'
import type { CardSetData, CardSetResource, FullCardSet } from '../api/cardSets/cardSetsApi'
import type { CardResource } from '../api/cards/cardsApi'
import type { ElementData, ElementResource } from '../api/elements/elementsApi'
import { newerFirst, olderFirst } from '../api/postOffice/resource'
import type { CardElementValues } from '../cardElements/cardValues'
import type { TextSizing } from '../cardElements/text/textSizing'
import { rememberImages } from '../images/knownImages'
import { inRememberedLayerOrder } from '../layers/layerOrder'

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

/** Macht aus einem Kartenset des Backends eins der App. Karten und Elemente
    kommen eigens dazu. */
export function cardSetFromResource({ id, version, data }: CardSetResource): CardSet {
  return { id, version, data, cards: [], elements: [] }
}

/** Macht aus einem Element des Backends eins des Sets. */
export function cardSetElementFromResource({ id, version, data }: ElementResource): CardSetElement {
  return { id, version, data, savedData: JSON.stringify(data), rotation: 0 }
}

/** Macht aus einer Karte des Backends eine der App. Ihren Namen braucht die App
    nicht, Inhalte kommen eigens dazu, die Druckanzahl kennt das Backend noch
    nicht. */
export function cardFromResource(cardResource: CardResource): Card {
  return {
    id: cardResource.id,
    version: cardResource.version,
    values: {},
    printCount: 1,
  }
}

/** Macht aus einem vollständigen Kartenset des Backends eins der App, samt
    Karten, Elementen, Texten und Bildern der Karten. Die neueste Karte steht
    vorn – dort, wo auch neu angelegte hinkommen. Die Elemente stehen so, wie
    ihre Ebenen zuletzt sortiert waren, sonst das neueste hinten, also obenauf.
    Name und Adresse der Bilder merkt sich die App projektweit. */
export function cardSetFromFullCardSet(fullCardSet: FullCardSet): CardSet {
  const cards = fullCardSet.cards.sort(newerFirst).map(cardFromResource)
  for (const { parentId, data } of fullCardSet.values) {
    const card = cards.find((card) => card.id === parentId)
    if (card) card.values[data.elementId] = data.value
  }
  rememberImages(fullCardSet.images)
  const elements = fullCardSet.elements.sort(olderFirst).map(cardSetElementFromResource)
  return {
    ...cardSetFromResource(fullCardSet.set),
    cards,
    elements: inRememberedLayerOrder(fullCardSet.set.id, elements),
  }
}

/** The set the project page should scroll to as soon as it shows it. The header
    sets it, the page clears it once it has scrolled there. */
export const cardSetIdToShow = ref<string | null>(null)
