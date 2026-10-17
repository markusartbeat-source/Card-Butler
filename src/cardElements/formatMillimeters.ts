import { currentLanguage } from '../dictionary/dictionary'

// Millimeter fürs Panel: eine Nachkommastelle, mit dem Dezimalzeichen der
// gewählten Sprache.
export function formatMillimeters(value: number | undefined) {
  return value?.toLocaleString(currentLanguage.value, { maximumFractionDigits: 1 }) ?? ''
}
