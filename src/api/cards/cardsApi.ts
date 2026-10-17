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

/** Lädt eine Karte, z.B. um ihre aktuelle Version zu erfahren. */
function loadCard(cardId: string) {
  return postOffice.request<CardResource>(`/api/cards/${encodeURIComponent(cardId)}`)
}

/** Löscht eine Karte. `version` ist der Stand, den der Aufrufer kennt – ist er
 *  veraltet, antwortet das Backend mit 412. */
function deleteCard(cardId: string, version: number) {
  return postOffice.request<void>(`/api/cards/${encodeURIComponent(cardId)}`, {
    method: 'DELETE',
    version,
  })
}

/** Fach `cards` der Poststelle, Aufruf als `postOffice.cards.…()`. */
export const cardsApi = { createCard, loadCard, deleteCard }
