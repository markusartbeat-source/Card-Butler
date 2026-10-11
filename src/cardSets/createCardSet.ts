import { postOffice } from '../api/postOffice/postOffice'
import { cardFormat } from '../card/cardFormat'
import { cardSetFromResource, cardSets } from './cardSets'
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

/** Legt im Projekt ein Kartenset an und nimmt es in die Liste auf. Sein Name
 *  zählt von den vorhandenen Sets weiter. Liefert das neue Set oder null –
 *  Fehler meldet schon die Poststelle per Toast. */
export async function createCardSet(projectId: string) {
  try {
    const cardSetResource = await postOffice.cardSets.createCardSet(projectId, {
      name: dictionary.cardSets.cardSetName((cardSets.value?.length ?? 0) + 1),
      width: cardFormat.value.width,
      height: cardFormat.value.height,
      color: defaultCardSetColor(),
      bleedWidth: defaultBleed,
      bleedHeight: defaultBleed,
    })
    // TEMPORÄR: Backend-Antwort im JSON-Kasten zeigen.
    loadedCardSetResources.value?.push(cardSetResource)

    const cardSet = cardSetFromResource(cardSetResource)
    cardSets.value?.push(cardSet)
    return cardSet
  } catch {
    return null
  }
}
