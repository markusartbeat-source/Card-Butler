import { postOffice } from '../api/postOffice/postOffice'
import { cardFormat } from '../card/cardFormat'
import { cardSetFromResource, cardSets } from './cardSets'
import { createCard } from './createCard'
// TEMPORÄR: für den JSON-Kasten.
import { loadedCardSetResources } from './loadCardSets'

// Anschnitt neuer Sets in mm, auf jeder Seite.
const defaultBleed = 3

/** Hintergrundfarbe neuer Sets aus colors.css, als `#rrggbb` – nur so nimmt
 *  sie das Backend. Der Browser rechnet sie um, denn der fertige Build kann
 *  z.B. `#ffffff` zu `#fff` kürzen. */
function defaultCardSetColor() {
  const context = document.createElement('canvas').getContext('2d')!
  context.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-card-default')
    .trim()
  return String(context.fillStyle)
}

/** Legt im Projekt ein Kartenset mit einer Karte an – nur im Backend, in keiner
 *  Liste. Liefert das neue Set oder null – Fehler meldet schon die Poststelle
 *  per Toast. */
export async function createCardSetInBackend(projectId: string, cardSetNumber: number) {
  try {
    const cardSetResource = await postOffice.cardSets.createCardSet(projectId, {
      name: dictionary.cardSets.cardSetName(cardSetNumber),
      width: cardFormat.value.width,
      height: cardFormat.value.height,
      color: defaultCardSetColor(),
      bleedWidth: defaultBleed,
      bleedHeight: defaultBleed,
    })
    // TEMPORÄR: Backend-Antwort im JSON-Kasten zeigen.
    loadedCardSetResources.value?.push(cardSetResource)

    // Klappt die Karte nicht, gibt es das Set trotzdem.
    const cardSet = cardSetFromResource(cardSetResource)
    await createCard(cardSet)
    return cardSet
  } catch {
    return null
  }
}

/** Legt im geöffneten Projekt ein Kartenset mit einer Karte an und nimmt es in
 *  die Liste auf. Sein Name zählt von den vorhandenen Sets weiter. Liefert das
 *  neue Set oder null – Fehler meldet schon die Poststelle per Toast. */
export async function createCardSet(projectId: string) {
  // Die Karte kommt dazu, bevor das Set erscheint – so steht es gleich
  // vollständig da.
  const cardSet = await createCardSetInBackend(projectId, (cardSets.value?.length ?? 0) + 1)
  if (cardSet) cardSets.value?.push(cardSet)
  return cardSet
}
