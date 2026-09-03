// All German texts of the app, grouped by the area they appear in.
// Every new text goes in here first, then into dictionary_english.ts.
export const dictionaryGerman = {
  // Texts that show up in more than one area.
  general: {
    guest: 'Gast',
    signIn: 'Anmelden',
    signInWithGoogle: 'Mit Google anmelden',
    signOut: 'Abmelden',
    upgrade: 'Upgrade',
    more: 'Mehr',
    save: 'Speichern',
    close: 'Schließen',
    cancel: 'Abbrechen',
    back: 'Zurück',
    notAvailableTitle: 'Nicht verfügbar',
    notAvailableText: 'Diese Funktion gibt es noch nicht.',
  },
  // The menu bar on the left edge of every page.
  sidebar: {
    logoAlt: 'Logo',
    home: 'Home',
    images: 'Bilder',
    newProject: 'Neues Projekt',
  },
  // The bar at the top of every page.
  header: {
    searchInCards: 'In den Karten finden',
    askButler: 'Frag den Butler',
  },
  // The page with the picture library.
  images: {
    title: 'Bilder',
    addImages: 'Bilder hinzufügen',
  },
  // The page with the card grid.
  project: {
    name: 'Mein erstes Projekt',
    share: 'Teilen',
    export: 'Exportieren',
    // Placeholders in the more menu until it is decided what goes in there.
    // Lorem ipsum stays the same in every language.
    placeholderOne: 'Lorem ipsum',
    placeholderTwo: 'Dolor sit amet',
    placeholderThree: 'Consetetur sadipscing',
    newCard: 'Neue Karte',
    linkCopiedTitle: 'Link kopiert',
    linkCopiedText: 'Der Link liegt in der Zwischenablage.',
  },
  // The dialog for picking an export format.
  exportDialog: {
    digitalGroup: 'Digital & Vorschau',
    png: 'PNG',
    pngInfo: 'Jede Karte als einzelnes Bild.',
    tableTopSimulator: 'Table Top Simulator',
    tableTopSimulatorInfo: 'Alle Karten als Blatt für den Table Top Simulator.',
    boardGameArena: 'Board Game Arena',
    boardGameArenaInfo: 'Karten im Format von Board Game Arena.',
    printGroup: 'Druck',
    pdf: 'PDF',
    pdfInfo: 'Alle Karten als Druckvorlage mit Schnittmarken.',
    pngTitle: 'Exportieren als PNG',
    // The number of cards is invented until the export really counts them, the
    // size comes from the quality slider.
    pngExportButton: (megabytes: number) => `48 PNGs · ${megabytes}MB · exportieren`,
    settingsTitle: 'Exporteinstellungen',
    whichCardsGroup: 'Welche Karten möchtest du exportieren?',
    // Invented card sets until the project really has some.
    cardSetOne: 'Kartenset 1',
    cardSetTwo: 'Kartenset 2',
    cardSetThree: 'Kartenset 3',
    cardSidesGroup: 'Kartenseiten',
    cardFronts: 'Vorderseiten',
    cardBacks: 'Rückseiten',
    imageQualityGroup: 'Bildqualität:',
    // The size is invented until the export really renders the cards.
    imageQualityInfo: (megabytes: number) =>
      `Die Bildqualität beeinflusst, wie groß der Export wird. Aktuell ist der Export ${megabytes}MB groß.`,
    imageQualityLow: 'Niedrig',
    imageQualityHigh: 'Hoch',
  },
  // The overlay for editing a single card, including its tool bar.
  cardEditor: {
    square: 'Viereck',
    circle: 'Kreis',
    line: 'Linie',
    text: 'Text',
    image: 'Bild',
    comment: 'Kommentar',
    cardSettings: 'Karteneinstellungen',
    settingsTab: 'Einstellungen',
    layersTab: 'Ebenen',
    sizesGroup: 'Größen',
    width: 'Breite',
    height: 'Höhe',
    linkSizes: 'Breite und Höhe zusammen ändern',
    unit: 'Typ',
    unitCentimeters: 'cm',
    unitMillimeters: 'mm',
    unitInches: 'in',
    cornersGroup: 'Abrundungen',
    cornerRadius: 'Abrundung',
    separateCorners: 'Jede Ecke einzeln einstellen',
    cornerTopLeft: 'Ecke oben links',
    cornerTopRight: 'Ecke oben rechts',
    cornerBottomLeft: 'Ecke unten links',
    cornerBottomRight: 'Ecke unten rechts',
    colorGroup: 'Farbe',
    pickColor: 'Farbe auswählen',
    bleedGroup: 'Anschnitt',
    bleedInfo: 'Zusätzlicher Rand rund um die Karte, der beim Drucken abgeschnitten wird.',
  },
  // The settings page.
  settings: {
    title: 'Einstellungen',
    accountGroup: 'Account',
    language: 'Sprache',
    // Every language is named in its own words, so it stays recognisable.
    languageGerman: 'Deutsch',
    languageEnglish: 'English',
    languageSpanish: 'Español',
    languageFrench: 'Français',
    languagePortuguese: 'Português',
    theme: 'Design',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    accessibility: 'Barrierefreiheit',
    subscriptionGroup: 'Subscription',
    perMonth: 'monatlich',
    storage: 'Speicherplatz',
    storageOf: 'von',
    storageUsed: 'belegt',
    freeProjects: 'Freie Projekte',
    dataLocation: 'Ort deiner Daten',
    dataCityName: 'Bielefeld',
    dataLocationSoonTitle: 'Kommt bald',
    dataLocationSoonText: 'Hier kannst du später den Ort deiner Daten wählen.',
  },
  // The upgrade page with the three plan cards.
  upgrade: {
    title: 'Pläne, die mit dir wachsen',
    priceNote: 'EUR / Monat + MwSt.',
    billingNote: 'monatlich abgerechnet',
    noCommitment: 'Keine Verpflichtungen | Jederzeit kündbar',
    currentPlan: 'Dein aktueller Plan',
    paymentSoonTitle: 'Bezahlung kommt bald',
    paymentSoonText: 'Das Upgrade lässt sich noch nicht kaufen.',
    plans: {
      free: {
        name: 'Free',
        subtitle: 'Einfach mal ausprobieren',
        benefitsTitle: 'Deine Vorteile:',
        benefits: ['10 MB Speicher', 'Exportieren als PNGs', '1 Projekt'],
      },
      pro: {
        name: 'Pro',
        subtitle: 'Mehr Speicher, Mehr Funktionen...',
        benefitsTitle: 'Alle Vorteile aus "Free" und:',
        benefits: [
          '500 MB Speicher',
          'Export in PDF',
          'TableTop',
          'Teilen',
          'Integration von eigener AI',
          '6 Projekte',
        ],
      },
      professional: {
        name: 'Professionell',
        subtitle: 'Kommerzielle Nutzung der Inhalte',
        benefitsTitle: 'Alle Vorteile aus "Pro" und:',
        benefits: [
          '2GB Speicher',
          'Berechtigung, die Karten kommerziell zu nutzen',
          'Volle Nutzerverwaltung',
          'AI MVP Zugriff',
          'Unbegrenzt viele Projekte',
        ],
      },
    },
  },
}
