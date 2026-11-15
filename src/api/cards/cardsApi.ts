// Alles, was das Backend über Karten weiß und mit ihnen macht.
import type { Resource } from '../postOffice/resource'
import { postOffice } from '../postOffice/transport'

// Was die Karte selbst speichert. Ihre Inhalte liegen als eigene Werte daneben.
export type CardData = { printCount: number; position: number }

export type CardResource = Resource<CardData> & { setId: string }

/** Legt in einem Kartenset eine Karte an. Ohne Druckanzahl wird sie einmal
 *  gedruckt, ohne Platz kommt sie ans Ende; die Karten dahinter rücken nach –
 *  ihre Versionen steigen. */
function createCard(cardSetId: string, card: Partial<CardData>) {
  return postOffice.request<CardResource>(`/api/sets/${encodeURIComponent(cardSetId)}/cards`, {
    method: 'POST',
    body: card,
  })
}

/** Lädt eine Karte, z.B. um ihre aktuelle Version zu erfahren. */
function loadCard(cardId: string) {
  return postOffice.request<CardResource>(`/api/cards/${encodeURIComponent(cardId)}`)
}

/** Lädt alle Karten eines Kartensets, sortiert nach position. */
function loadCards(cardSetId: string) {
  return postOffice.request<CardResource[]>(`/api/sets/${encodeURIComponent(cardSetId)}/cards`)
}

/** Ändert Druckanzahl und/oder Platz einer Karte, fehlende Felder bleiben. Die
 *  anderen Karten des Sets rücken dabei nach – ihre Versionen steigen. `version`
 *  ist der Stand, den der Aufrufer kennt – ist er veraltet, antwortet das
 *  Backend mit 412. */
function updateCard(cardId: string, change: Partial<CardData>, version: number) {
  return postOffice.request<CardResource>(`/api/cards/${encodeURIComponent(cardId)}`, {
    method: 'PUT',
    body: change,
    version,
  })
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
export const cardsApi = { createCard, loadCard, loadCards, updateCard, deleteCard }
