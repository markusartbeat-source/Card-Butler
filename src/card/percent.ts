import { currentLanguage } from '../dictionary/dictionary'

// Prozent fürs Panel (z.B. Deckkraft, Zeilenhöhe): eine Nachkommastelle, mit
// Dezimal- und Prozentzeichen der gewählten Sprache. Ohne Wert ein leerer Text.
export function formatPercent(percent: number | null | undefined) {
  if (percent == null) return ''
  const number = percent.toLocaleString(currentLanguage.value, { maximumFractionDigits: 1 })
  return dictionary.cardEditor.percentValue(number)
}

// Eingetippte Prozent: „50“, „50 %“, „50,5%“ und „-5 %“ gehen. Leer oder
// ungültig → undefined.
export function parsePercent(text: string) {
  const number = text.replace('%', '').replace(',', '.').trim()
  const value = Number(number)
  return number && Number.isFinite(value) ? value : undefined
}
