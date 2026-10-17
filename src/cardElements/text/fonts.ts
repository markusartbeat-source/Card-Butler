import { computed } from 'vue'

// Schriften zur Auswahl für Textfelder. Der Beispieltext unter „Icons im Text“
// bietet dieselben an.
export const fontFamilyItems = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'].map(
  (name) => ({ value: name, label: name }),
)

export const fontWeightItems = computed(() => [
  { value: 'regular', label: dictionary.cardEditor.fontWeightRegular },
  { value: 'bold', label: dictionary.cardEditor.fontWeightBold },
])

export const fontSizeItems = ['12', '14', '16', '18', '20', '24', '28', '32', '40', '48'].map(
  (size) => ({ value: size, label: size }),
)
