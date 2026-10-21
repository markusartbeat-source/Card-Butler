import type { CardSetData } from '../api/cardSets/cardSetsApi'
import { ApiError } from '../api/postOffice/apiError'
import { postOffice } from '../api/postOffice/postOffice'
import { sizeWithChangedSide } from '../card/sizeWithChangedSide'
import type { CardSet } from './cardSets'
import { reloadCardSet } from './loadCardSets'

/** Ändert Einstellungen eines Sets: sofort auf allen seinen Karten, dann im
 *  Backend. Jede Änderung an Karten, Elementen und Werten zählt die Version des
 *  Sets hoch – darum holt es Version und Stand vorher frisch und setzt nur die
 *  Änderung darauf. Liefert, ob das geklappt hat – Fehler meldet schon die
 *  Poststelle per Toast. */
export async function changeCardSet(cardSet: CardSet, changes: Partial<CardSetData>) {
  Object.assign(cardSet.data, changes)
  try {
    const { version, data } = await postOffice.cardSets.loadCardSet(cardSet.id)
    const saved = await postOffice.cardSets.updateCardSet(cardSet.id, { ...data, ...changes }, version)
    cardSet.version = saved.version
    return true
  } catch (error) {
    // Jemand anderes hat das Set inzwischen geändert oder gelöscht.
    if (error instanceof ApiError && [404, 412].includes(error.status)) await reloadCardSet(cardSet)
    return false
  }
}

/** Neue Breite oder Höhe der Karten in mm. Die Elemente bleiben stehen – sie
 *  messen ab der linken oberen Ecke. Mit keepsAspectRatio ändert sich die
 *  andere Seite im gleichen Verhältnis mit. */
export function changeCardSetSize(
  cardSet: CardSet,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const size = sizeWithChangedSide(cardSet.data, side, millimeters, keepsAspectRatio)
  return changeCardSet(cardSet, { width: size.width, height: size.height })
}

/** Neuer Anschnitt einer Seite in mm: Breite gilt links und rechts je, Höhe
 *  oben und unten je. Mit keepsAspectRatio ändert sich die andere Seite im
 *  gleichen Verhältnis mit. */
export function changeCardSetBleed(
  cardSet: CardSet,
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const { bleedWidth, bleedHeight } = cardSet.data
  const bleed = sizeWithChangedSide(
    { width: bleedWidth, height: bleedHeight },
    side,
    millimeters,
    keepsAspectRatio,
  )
  return changeCardSet(cardSet, { bleedWidth: bleed.width, bleedHeight: bleed.height })
}
