// Je Karte die zuletzt angestoßene Änderung im Backend. Jede Änderung an einer
// Karte oder ihren Werten erhöht ihre Version – zwei gleichzeitig gäben 412.
const latestChangeByCardId = new Map<string, Promise<unknown>>()

/** Führt eine Änderung an diesen Karten erst aus, wenn deren vorige Änderungen
    fertig sind, und liefert ihr Ergebnis. Die Änderung darf nicht scheitern
    (Fehler selbst abfangen), sonst bliebe die Schlange stehen. */
export function queueCardChange<Result>(cardIds: string[], change: () => Promise<Result>) {
  const previousChanges = cardIds.map((cardId) => latestChangeByCardId.get(cardId))
  const queuedChange = Promise.all(previousChanges).then(change)
  for (const cardId of cardIds) latestChangeByCardId.set(cardId, queuedChange)
  return queuedChange
}
