// Nur im Dev-Modus: zeigt auf der Oberfläche, was der Server (noch) nicht
// speichert – nicht angebunden, nur im Browser oder eine Notlösung. Zum Entfernen
// nach den beiden Namen suchen.

export const showsNotStoredMarks = import.meta.env.DEV

/** Färbt die Felder in diesem Bereich rot (style.css), außerhalb des Dev-Modus nichts. */
export const notStoredClass = showsNotStoredMarks ? 'cb-not-stored' : ''
