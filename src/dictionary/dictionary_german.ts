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
    undo: 'Rückgängig',
    notAvailableTitle: 'Nicht verfügbar',
    notAvailableText: 'Diese Funktion gibt es noch nicht.',
    support: 'Support',
  },
  // The bar at the top of every page.
  header: {
    searchInCards: 'In den Karten finden',
    askButler: 'Frag den Butler',
    // The entries of the images menu.
    allImages: 'Alle Bilder',
    iconsInText: 'Icons im Text',
    // The entries of the collaboration menu.
    collaboration: 'Zusammenarbeit',
    shareProject: 'Dieses Projekt teilen',
    userManagement: 'Benutzerverwaltung',
    // The entries of the cards menu.
    cards: 'Karten',
    newCardSet: 'Neues Kartenset',
    // The search entry of the profile menu on narrow screens.
    search: 'Suche',
  },
  // The search over all cards, started in the header pill.
  search: {
    noResults: 'Keine Karte gefunden',
  },
  // The bar that drops down while a card is being dragged.
  cardDrag: {
    deleteCard: 'Karte löschen',
    flipAllCards: 'Alle Karten umdrehen',
    cardDeleted: 'Karte gelöscht',
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
    printExport: 'Druck / Export',
    newCard: 'Neue Karte',
    linkCopiedTitle: 'Link kopiert',
    linkCopiedText: 'Der Link liegt in der Zwischenablage.',
    printCountTooltip: (count: number) =>
      `Diese Karte wird ${count}-mal gedruckt. Du kannst die Anzahl in den Karteneinstellungen dieser Karte ändern, oder mit Alt + Mausrad.`,
  },
  // The list of card sets at the right edge of the project page.
  cardSets: {
    title: 'Kartensets',
    // The name a set gets when it is created, numbered in order.
    cardSetName: (number: number) => `Kartenset ${number}`,
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
    pngExportToastTitle: 'Dein PNG Export wird vorbereitet',
    pngExportDoneTitle: 'Fertig!',
    pngExportDoneInfo: 'Dein Export wird heruntergeladen 😊',
    // The names the downloaded files carry. The number already has its leading
    // zero, so the cards stay in order in every folder window.
    pngZipFileName: 'karten.zip',
    pngCardFileName: (number: string) => `karte-${number}.png`,
    // One PNG per card, so the number of cards is the number of files.
    pngExportButton: (cardCount: number, megabytes: number) =>
      `${cardCount} PNGs · ${megabytes}MB · exportieren`,
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
    // What each resolution is good for. The dpi number stands in the entry
    // itself, so a print shop's "300 dpi please" can be picked without knowing
    // what the words mean.
    imageQualityOption: (purpose: string, dpi: number) => `${purpose} · ${dpi} dpi`,
    imageQualityScreen: 'Bildschirm',
    imageQualityTabletop: 'Tabletop',
    imageQualityPrint: 'Druckoptimiert',
    imageQualityFinePrint: 'Feiner Druck',
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
    printGroup: 'Druck',
    printCount: 'Anzahl',
    printInfo: 'Wie oft diese Karte beim Drucken und Exportieren enthalten ist.',
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
  // The overlay for looking at a single picture.
  imageViewer: {
    imageSettings: 'Bildeinstellungen',
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
  // The page for sharing a project by link or mail.
  shareProject: {
    title: 'Wen würdest du gern einladen?',
    linkHeading: 'Link',
    copy: 'Kopieren',
    permission: 'Berechtigung',
    permissionView: 'Nur sehend',
    permissionEdit: 'Darf schreiben',
    permissionAdmin: 'Admin',
    password: 'Passwort',
    mailHeading: 'Mail',
    invite: 'Einladen',
    mailPlaceholder: 'Trage hier die Mail ein',
    inviteSent: (mail: string) => `Einladung verschickt an ${mail}`,
  },
  // The support page with the feedback form.
  support: {
    title: 'Was möchtest du uns mitteilen?',
    feedbackHeading: 'Beschreibe gerne dein Feedback',
    feedbackPlaceholder: 'Hier dein Text',
    screenshotHeading: 'Lade gerne Screenshots des Problems hoch:',
    screenshotTile: 'Bild',
    notifyUpdatesCheckbox: 'Informiere mich über Updates per Mail',
    allowContactCheckbox:
      'Um das Feedback besser verstehen zu können, dürfen Entwickler mich per Mail kontaktieren.',
    submit: 'Absenden',
    sentToast: 'Danke für dein Feedback',
  },
  // The page with the list of everyone who is in the project.
  userManagement: {
    title: 'Was wollen wir an der Zusammenarbeit ändern?',
    removeUser: 'Benutzer entfernen',
    removeUserQuestion: (name: string) => `Soll ${name} wirklich aus dem Projekt entfernt werden?`,
    remove: 'Entfernen',
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
