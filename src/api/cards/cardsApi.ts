// Alles, was das Backend über Karten weiß und mit ihnen macht.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

// Was die Karte selbst speichert. Ihre Inhalte liegen als eigene Werte daneben.
export type CardData = { name: string }

export type CardResource = Resource<CardData>

/** Legt in einem Kartenset eine Karte an. */
function createCard(cardSetId: string, name: string) {
  return postOffice.request<CardResource>(`/api/sets/${encodeURIComponent(cardSetId)}/cards`, {
    method: 'POST',
    body: { name },
  })
}

/** Fach `cards` der Poststelle, Aufruf als `postOffice.cards.…()`. */
export const cardsApi = { createCard }
