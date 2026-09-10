import { computed } from 'vue'
import type { ToolbarElement } from './toolbarElement'

// The elements the card toolbar offers, in toolbar order.
export const cardToolbarElements = computed<ToolbarElement[]>(() => [
  { name: dictionary.cardEditor.square, icon: 'square' },
  { name: dictionary.cardEditor.circle, icon: 'circle' },
  { name: dictionary.cardEditor.line, icon: 'horizontal_rule' },
  { name: dictionary.cardEditor.text, icon: 'title' },
  { name: dictionary.cardEditor.image, icon: 'image' },
  { name: dictionary.cardEditor.comment, icon: 'add_comment' },
])
