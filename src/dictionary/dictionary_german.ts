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
    save: 'Speichern',
    close: 'Schließen',
    cancel: 'Abbrechen',
    back: 'Zurück',
    undo: 'Rückgängig',
    notAvailableTitle: 'Nicht verfügbar',
    notAvailableText: 'Diese Funktion gibt es noch nicht.',
    support: 'Support',
    // Pfeil an einem Feld, das eine Liste mit Vorschlägen aufklappt.
    showSuggestions: 'Vorschläge anzeigen',
    // Trenner zwischen den Einträgen eines Pfads, z.B. „Alle Bilder / Ordner“.
    pathSeparator: '/',
    // aria-description einer sortierbaren Kachel.
    positionOf: (position: number, count: number) => `Position ${position} von ${count}`,
  },
  // The bar at the top of every page.
  header: {
    appName: 'Card Butler',
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
    // Vorlesetext des Zurück-Pfeils links neben dem Titel.
    backToHome: 'Zurück zur Startseite',
    // Vorlesename des Pfads unter dem Titel, z.B. „Alle Bilder / Ordner“.
    path: 'Pfad',
  },
  // The search over all cards, started in the header pill.
  home: {
    titleCards: 'Deine Karten.',
    titleStories: 'Deine Geschichten.',
    description:
      'Gestalte, bearbeite und exportiere deine Brettspielkarten - kreativ, einfach. Dein neues Lieblingstool!',
    watchVideoTutorial: 'Video-Tutorial ansehen',
    projectsTitle: 'Deine Projekte',
    noProjects: 'Noch keine Projekte',
    newProject: 'Neues Projekt',
    renameProject: 'Projekt umbenennen',
    // Für den Stift-Button: Mit Namen, damit Screenreader die Buttons unterscheiden.
    renameProjectLabel: (name: string) => `Projekt „${name}“ umbenennen`,
  },
  // Der Dialog zum Benennen, z.B. eines Projekts oder Ordners.
  nameDialog: {
    name: 'Name',
  },
  search: {
    noResults: 'Keine Karte gefunden',
  },
  // Die Leiste, die beim Ziehen (Karte, Bild, Ordner) von oben herunterfährt,
  // und was ihre Felder danach melden. Die Knöpfe in den Einstellungen von Bild
  // und Ordner tun dasselbe und heißen darum genauso.
  dropBar: {
    deleteCard: 'Karte löschen',
    flipAllCards: 'Alle Karten umdrehen',
    cardDeleted: 'Karte gelöscht',
    deleteImage: 'Bild löschen',
    imageDeleted: 'Bild gelöscht',
    moveIntoNewFolder: 'In neuen Ordner',
    deleteFolder: 'Ordner löschen',
    folderDeleted: 'Ordner gelöscht',
  },
  // The page with the picture library.
  images: {
    title: 'Bilder',
    uploadImages: 'Bilder hochladen',
    // Toast für eine abgelehnte Datei: Titel mit Dateiname, darunter der Grund.
    imageRejected: (fileName: string) => `„${fileName}“ nicht hochgeladen`,
    wrongImageType: 'Erlaubt sind nur PNG, JPEG und GIF.',
    imageTooLarge: (megabytes: number) => `Ein Bild darf höchstens ${megabytes} MB groß sein.`,
    // Text der Kachel, solange hochgeladen wird, und Toast danach.
    uploadingImages: 'Wird hochgeladen …',
    imagesUploaded: (count: number) => (count === 1 ? '1 Bild hochgeladen' : `${count} Bilder hochgeladen`),
    // Titel des Namens-Dialogs beim Anlegen eines Ordners.
    newFolder: 'Neuer Ordner',
    // Toasts nach Strg+C / Strg+X / Strg+V (Ausgeschnittenes) und aria-description
    // des ausgeschnittenen Bildes.
    imageCopied: 'Bild kopiert',
    imageCut: 'Bild ausgeschnitten',
    imagePasted: 'Bild eingefügt',
    markedAsCut: 'ausgeschnitten',
  },
  // The page with the card grid.
  project: {
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
    textElementName: 'Textfeld',
    textElementDeleted: 'Textfeld gelöscht',
    pictureElementName: 'Bild',
    pictureElementDeleted: 'Bild gelöscht',
    cardSettings: 'Karteneinstellungen',
    textSettings: 'Texteinstellungen',
    pictureSettings: 'Bildeinstellungen',
    elementName: 'Name',
    backToCardSettings: 'Zurück zu den Karteneinstellungen',
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
    positionGroup: 'Position',
    positionX: 'X',
    positionY: 'Y',
    alignHorizontally: 'Horizontal ausrichten',
    alignVertically: 'Vertikal ausrichten',
    alignLeft: 'Links ausrichten',
    alignHorizontalCenter: 'Horizontal zentrieren',
    alignRight: 'Rechts ausrichten',
    alignTop: 'Oben ausrichten',
    alignVerticalCenter: 'Vertikal zentrieren',
    alignBottom: 'Unten ausrichten',
    textboxGroup: 'Textbox',
    textboxSizing: 'Größe der Textbox',
    autoWidth: 'Automatische Breite',
    autoHeight: 'Automatische Höhe',
    fixedSize: 'Feste Größe',
    automaticSizeMark: '-',
    automaticSize: 'automatisch',
    appearanceGroup: 'Darstellung',
    chosenPicture: 'Bild',
    noPictureChosen: 'Kein Bild gewählt',
    leaveFolder: (name: string) => `Zurück aus Ordner „${name}“`,
    openFolder: (name: string) => `Ordner „${name}“ öffnen`,
    searchPictures: 'Bilder suchen',
    noPicturesFound: 'Keine Bilder gefunden',
    defaultFolder: 'Standard',
    defaultFolderLabel: (name: string) => `Standard: Bildwahl beginnt im Ordner „${name}“`,
    opacity: 'Sichtbarkeit',
    opacityValue: (percent: number) => `${percent}%`,
    fontFamily: 'Schriftart',
    fontWeight: 'Schriftschnitt',
    fontWeightRegular: 'Regular',
    fontWeightBold: 'Fett',
    fontSize: 'Schriftgröße',
    lineHeight: 'Zeilenhöhe',
    letterSpacing: 'Zeichenabstand',
    textAlignHorizontally: 'Text horizontal ausrichten',
    textAlignVertically: 'Text vertikal ausrichten',
    textAlignLeft: 'Linksbündig',
    textAlignCenter: 'Zentriert',
    textAlignRight: 'Rechtsbündig',
    textAlignTop: 'Oben',
    textAlignMiddle: 'Mittig',
    textAlignBottom: 'Unten',
    textColor: 'Textfarbe',
  },
  // The overlay for looking at a single picture.
  imageViewer: {
    imageSettings: 'Bildeinstellungen',
  },
  // Das Overlay für einen einzelnen Ordner.
  folderViewer: {
    folderSettings: 'Ordnereinstellungen',
    openFolder: 'Ordner öffnen',
  },
  // The page with the small pictures that can sit inside a text.
  textIcons: {
    exampleText:
      'Klicke hier rein und ändere gerne den Beispieltext. Hier ist ein Beispiel Icon im Text: +4Gold',
    myIcons: 'Meine Icons',
    shortcodeHint:
      'Ein Icon kommt in den Text, indem du seinen Namen als eigenes Wort tippst, z.B. Gold. Innerhalb anderer Wörter (Golden) bleibt es Text.',
    iconSettings: 'Einstellungen der Icons',
    height: 'Höhe',
    width: 'Breite',
    verticalOffset: 'Vertikaler Versatz',
    sideSpacing: 'Abstand links/rechts',
    newIcon: 'Neues Icon',
    name: 'Name',
    exampleTextLabel: 'Beispieltext',
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
  // Fehler beim Austausch mit dem Server.
  serverErrors: {
    unreachable: 'Server nicht erreichbar',
    forbidden: 'Dafür fehlen dir die Rechte',
    notFound: 'Nicht gefunden',
    changedMeanwhile: 'Wurde inzwischen von jemand anderem geändert',
    general: 'Etwas ist schiefgelaufen',
    errorId: (requestId: string) => `Fehler-ID: ${requestId}`,
  },
}
