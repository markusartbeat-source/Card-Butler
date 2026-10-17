import { computed } from 'vue'

// Schriften, Schnitte und Größen zur Auswahl für Textfelder. Der Beispieltext
// unter „Icons im Text“ bietet dieselben an.
export const fontFamilyItems = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'].map(
  (name) => ({ value: name, label: name }),
)

/** Die Schriften zur Auswahl, dazu die gegebene, falls sie fehlt – z.B. eine,
    die eine KI eingetragen hat. */
export function fontFamilyItemsIncluding(fontFamily: string) {
  return fontFamilyItems.some((item) => item.value === fontFamily)
    ? fontFamilyItems
    : [...fontFamilyItems, { value: fontFamily, label: fontFamily }]
}

export const fontWeightItems = computed(() => [
  { value: 'regular', label: dictionary.cardEditor.fontWeightRegular },
  { value: 'bold', label: dictionary.cardEditor.fontWeightBold },
])

// Schriftgrößen in mm.
export const fontSizeItems = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12]
