<template>
  <!-- data-element-id lets the transform handles find this element on the card.
       The card hands in the position, so no "relative" or "inline-block" here.
       pre-wrap und pre zeigen die Zeilenumbrüche im Text. Im Editor ist das Feld
       per Tab erreichbar und wie ein Knopf mit Enter oder Leertaste zu bearbeiten.
       content-* rückt den Inhalt in der Box nach oben, in die Mitte oder nach
       unten – ohne Hülle, die Such-Markierungen bleiben in einer Zeile. -->
  <span
    ref="field"
    v-ripple
    class="overflow-hidden rounded"
    :class="[
      horizontalAlignmentClasses[element.data.alignment.horizontal],
      verticalAlignmentClasses[element.data.alignment.vertical],
      wrapsLines ? 'whitespace-pre-wrap' : 'whitespace-pre',
      isTyping ? 'cursor-text' : 'cursor-pointer px-1',
      { 'border-background/70 border border-dashed': isPlaceholderShown },
    ]"
    :style="[textStyle, iconStyleVariables]"
    :data-element-id="element.id"
    :tabindex="editable ? 0 : undefined"
    :role="isButton ? 'button' : undefined"
    :aria-label="isButton ? element.data.name : undefined"
    @click="selectOrStartTyping"
    @focus="selectOnKeyboardFocus(element.id, $event)"
    @keydown.enter.self.prevent="startTypingAtEnd"
    @keydown.space.self.prevent="startTypingAtEnd"
  >
    <!-- Im Tippmodus gehört der Inhalt dem Browser: einmal befüllt, danach
         zeichnet Vue nichts mehr hinein, sonst springt der Cursor.
         plaintext-only macht Enter zum Zeilenumbruch und fügt nur reinen Text
         ein. Escape beendet das Tippen hier, damit der Fokus aufs Feld
         zurückgeht – der Editor darf nicht noch eine Stufe weiter zurück.
         Leer fiele es sonst auf null Höhe zusammen, wenn es mit dem Text wächst.
         Es füllt die Box und richtet seinen Text deshalb selbst senkrecht aus. -->
    <span
      v-if="isTyping"
      ref="editor"
      contenteditable="plaintext-only"
      role="textbox"
      aria-multiline="true"
      :aria-label="element.data.name"
      class="block size-full min-h-lh px-1 outline-none"
      :class="verticalAlignmentClasses[element.data.alignment.vertical]"
      @input="emitTypedText"
      @keydown.escape.stop="stopTyping"
    />
    <template v-else>
      <span v-if="isPlaceholderShown" class="text-background/70">{{ placeholder }}</span>
      <CbTextWithIcons :text="content" :search-word="highlightSearch ? searchWord : ''" />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue'
import type { CardSetElement } from '../../cardSets/cardSets'
import {
  isEditingElement,
  selectElement,
  selectOnKeyboardFocus,
  selectOrStartEditing,
  startEditingElement,
} from '../../elementTransform/elementSelection'
import { searchWord } from '../../search/searchWord'
import CbTextWithIcons from '../../textIcons/CbTextWithIcons.vue'
import { iconStyleVariables } from '../../textIcons/textIconSettings'
import { nodesToText, textToNodes } from '../../textIcons/textIconWords'
import { placeCaretAtPoint } from './placeCaretAtPoint'
import { textAppearanceOf } from './textAppearance'
import { textSizingOf } from './textSizing'

// The content is the one thing each card fills in itself. Only the card
// overview asks for the found spots to be marked. Mit placeholder zeigt sich
// ein leeres Feld als gestrichelter Rahmen mit diesem Text. Mit editable kann
// man ins Feld tippen – nur im Editor.
const props = withDefaults(
  defineProps<{
    element: CardSetElement
    content?: string
    highlightSearch?: boolean
    placeholder?: string
    editable?: boolean
  }>(),
  { content: '', highlightSearch: false, placeholder: '', editable: false },
)

const emit = defineEmits<{ 'update:content': [content: string] }>()

const horizontalAlignmentClasses = {
  LEFT: 'text-left',
  CENTER: 'text-center',
  RIGHT: 'text-right',
}
const verticalAlignmentClasses = {
  TOP: 'content-start',
  CENTER: 'content-center',
  BOTTOM: 'content-end',
}

// Schriftgröße in mm.
const textStyle = computed(() => {
  const { fontFamily, fontSize, color } = textAppearanceOf(props.element.data)
  return { fontFamily, fontSize: `${fontSize}mm`, color }
})

// Mit automatischer Breite wird das Feld breiter, nur Enter beginnt eine neue
// Zeile. Sonst brechen lange Zeilen am Rand um.
const wrapsLines = computed(() => textSizingOf(props.element) !== 'autoWidth')

const field = useTemplateRef<HTMLElement>('field')
const editor = useTemplateRef<HTMLElement>('editor')

const isTyping = computed(() => props.editable && isEditingElement(props.element.id))

// Beim Tippen ist das Textfeld darin dran, kein Knopf drumherum.
const isButton = computed(() => props.editable && !isTyping.value)

const isPlaceholderShown = computed(() => !props.content && !!props.placeholder)

// placeCaret setzt den Cursor, sobald das Textfeld da ist. Icon-Namen stehen
// darin als Bilder.
async function startTyping(placeCaret: (textField: HTMLElement) => void) {
  startEditingElement(props.element.id)
  await nextTick()
  if (!editor.value) return
  editor.value.replaceChildren(...textToNodes(props.content))
  editor.value.focus()
  placeCaret(editor.value)
}

// Der Cursor landet an der Klickstelle. Im Tippmodus setzt ihn der Browser selbst.
function selectOrStartTyping(event: MouseEvent) {
  selectOrStartEditing(props.element.id, props.editable, () =>
    startTyping((textField) => placeCaretAtPoint(textField, event.clientX, event.clientY)),
  )
}

function startTypingAtEnd() {
  startTyping((textField) => window.getSelection()?.collapse(textField, textField.childNodes.length))
}

// Das Feld bleibt ausgewählt und fokussiert.
function stopTyping() {
  selectElement(props.element.id)
  field.value?.focus()
}

// Browser hängen ans Ende oft einen Zeilenumbruch nur als Platzhalter an – der
// zählt nicht, sonst wäre ein geleertes Feld nie mehr leer. Icon-Bilder werden
// wieder zu ihren Namen.
function emitTypedText() {
  emit('update:content', editor.value ? nodesToText(editor.value).replace(/\n$/, '') : '')
}
</script>
