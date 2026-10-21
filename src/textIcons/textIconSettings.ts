import { computed, ref } from 'vue'

// How every icon inside the text is drawn. Dummy data in memory for now.
// Gilt pro Projekt, später lädt und speichert das Backend sie hier.
export const iconHeight = ref('100%')
export const iconWidth = ref('100%')
export const iconVerticalOffset = ref('0%')
export const iconSideSpacing = ref('0%')

// Eine Zahl, mit oder ohne %, ist ein Anteil der Schriftgröße: 100 % ist so
// groß wie der Text, so wachsen und schrumpfen die Icons mit ihm. Alles mit
// anderer Einheit wird übernommen, wie getippt.
function asCssLength(value: string) {
  const percent = value.trim().match(/^(-?\d+(\.\d+)?)\s*%?$/)
  return percent ? `${Number(percent[1]) / 100}em` : value
}

// The settings as CSS variables on the text; every icon picture reads them,
// so a changed value shows up on all icons at once.
export const iconStyleVariables = computed(() => ({
  '--icon-height': asCssLength(iconHeight.value),
  '--icon-width': asCssLength(iconWidth.value),
  '--icon-vertical-offset': asCssLength(iconVerticalOffset.value),
  '--icon-side-spacing': asCssLength(iconSideSpacing.value),
}))
