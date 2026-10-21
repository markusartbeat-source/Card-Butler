import { computed, ref } from 'vue'

// How every icon inside the text is drawn. Dummy data in memory for now.
// Gilt pro Projekt, später lädt und speichert das Backend sie hier.
export const iconHeight = ref('20px')
export const iconWidth = ref('20px')
export const iconVerticalOffset = ref('0')
export const iconSideSpacing = ref('0%')

// A bare number means pixels, anything with a unit is passed on as typed.
function asCssLength(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value.trim()) ? `${value.trim()}px` : value
}

// The settings as CSS variables on the text; every icon picture reads them,
// so a changed value shows up on all icons at once.
export const iconStyleVariables = computed(() => ({
  '--icon-height': asCssLength(iconHeight.value),
  '--icon-width': asCssLength(iconWidth.value),
  '--icon-vertical-offset': asCssLength(iconVerticalOffset.value),
  '--icon-side-spacing': asCssLength(iconSideSpacing.value),
}))
