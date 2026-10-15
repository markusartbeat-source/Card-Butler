import { computed } from 'vue'
import type { IconName } from '../atoms/icons'
import type { ToolbarElement } from './toolbarElement'

// Die Werkzeuge der Karten-Toolbar, in Toolbar-Reihenfolge.
export const cardTools = ['square', 'circle', 'line', 'text', 'image', 'comment'] as const

export type CardTool = (typeof cardTools)[number]

const cardToolIcons: Record<CardTool, IconName> = {
  square: 'square',
  circle: 'circle',
  line: 'horizontal_rule',
  text: 'title',
  image: 'image',
  comment: 'add_comment',
}

// The elements the card toolbar offers, in toolbar order.
export const cardToolbarElements = computed<ToolbarElement[]>(() =>
  cardTools.map((tool) => ({ name: dictionary.cardEditor[tool], icon: cardToolIcons[tool] })),
)
