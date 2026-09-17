# Card-Butler – Coding-Regeln

Diese Regeln werden mit der Zeit ergänzt. Der Skill `/check` prüft
Änderungen dagegen — hier ergänzen, nicht im Skill selbst.

## Styling

- Farben nur als Variablen aus einer zentralen Farbdatei verwenden. Keine
  Hex-Farben (`#fff`, `#123abc`, ...) direkt in Komponenten oder anderen
  Dateien.
- Tailwind-Klassen möglichst ohne eckige Klammern (`[...]`) verwenden — also
  Tailwind-Basisklassen statt Arbitrary Values.
- Responsive nur über die eigenen Breakpoints aus `src/breakpoints.css`
  (`tablet:`, `laptop:`, `desktop:`, ohne Präfix = Handy). Keine
  Tailwind-Namen (`sm:`, `md:`, `lg:`, `xl:`) und keine eigenen
  `@media`-Regeln mit Pixelwerten.

## Struktur

- Inhalte logisch/sprechend benennen.
- Thematisch zusammengehörige Inhalte in eigene Dateien auslagern, wenn das
  für den jeweiligen Bereich üblich ist (z.B. Komponenten, Utilities). Keine
  Datei, die viele fachfremde Dinge gemeinsam enthält.
