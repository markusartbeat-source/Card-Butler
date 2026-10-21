/** Die eigentliche Karte ohne Anschnitt in einer gezeichneten Karte (CbCard) –
 *  Nullpunkt der Elemente. Wer auf der Karte misst, misst hier, nicht am Rahmen. */
export function findCardSurface(container: HTMLElement | null | undefined) {
  return container?.querySelector<HTMLElement>('[data-card-surface]') ?? null
}
