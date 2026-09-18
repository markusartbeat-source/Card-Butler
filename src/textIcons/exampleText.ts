import { ref } from 'vue'

// The example text and its font. Dummy data in memory for now; later this
// belongs to the text element of the card set.
export const exampleText = ref(dictionary.textIcons.exampleText)
export const fontFamily = ref('Arial')
export const fontWeight = ref('regular')
export const fontSize = ref('28')

export const fontFamilies = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New']
export const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '40', '48']
