import { computed } from 'vue'
import type { ElementType } from '../../api/elements/elementsApi'
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

// Das Icon je Element-Typ – dasselbe wie beim Werkzeug, das ihn anlegt.
export const elementTypeIcons: Record<ElementType, IconName> = {
  SQUARE: cardToolIcons.square,
  CIRCLE: cardToolIcons.circle,
  LINE: cardToolIcons.line,
  TEXT: cardToolIcons.text,
  PICTURE: cardToolIcons.image,
}

// The elements the card toolbar offers, in toolbar order.
export const cardToolbarElements = computed<ToolbarElement[]>(() =>
  cardTools.map((tool) => ({ name: dictionary.cardEditor[tool], icon: cardToolIcons[tool] })),
)
