// Als Ziel in der Seite (Ordner, Eintrag im Pfad) steht eine Ebene für ihre
// Ordner-ID. Die oberste hat keine, sie steht für einen leeren Wert.

export function levelDropTarget(folderId: string | null) {
  return folderId ?? ''
}

/** Die Ebene zum Ziel, null = oberste. */
export function levelOfDropTarget(dropTarget: string) {
  return dropTarget || null
}
