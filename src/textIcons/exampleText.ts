import { ref } from 'vue'

// The example text and its font. Dummy data in memory for now.
// Gilt pro Projekt, später lädt und speichert das Backend sie hier.
export const exampleText = ref(dictionary.textIcons.exampleText)
export const fontFamily = ref('Arial')
export const fontWeight = ref('regular')
// In mm, wie die Textfelder auf der Karte.
export const fontSize = ref(7)
