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
      horizontalAlignmentClasses[horizontalAlignment],
      verticalAlignmentClasses[verticalAlignment],
      wrapsLines ? 'whitespace-pre-wrap' : 'whitespace-pre',
      isTyping ? 'cursor-text' : 'cursor-pointer px-1',
      { 'border-background/70 border border-dashed': isPlaceholderShown },
    ]"
    :style="{ fontFamily, fontSize: `${fontSize}mm`, color }"
    :data-element-id="id"
    :tabindex="editable ? 0 : undefined"
    :role="isButton ? 'button' : undefined"
    :aria-label="isButton ? name : undefined"
    @click="selectOrStartTyping"
    @focus="selectOnKeyboardFocus"
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
      :aria-label="name"
      class="block size-full min-h-lh px-1 outline-none"
      :class="verticalAlignmentClasses[verticalAlignment]"
      @input="emitTypedText"
      @keydown.escape.stop="stopTyping"
    />
    <template v-else>
      <span v-if="isPlaceholderShown" class="text-background/70">{{ placeholder }}</span>
      <span
        v-for="(part, index) in textParts"
        :key="index"
        :class="part.isMatch ? 'bg-gold-light rounded' : ''"
        >{{ part.text }}</span
      >
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue'
import type { HorizontalAlignment, VerticalAlignment } from '../../api/elements/elementsApi'
import {
  isTypingInSelectedElement,
  selectElement,
  selectedElementId,
  startTypingInElement,
} from '../../elementTransform/elementSelection'
import { splitBySearchWord } from '../../search/splitBySearchWord'
import { placeCaretAtPoint } from './placeCaretAtPoint'

// The content is the one thing each card fills in itself. Only the card
// overview asks for the found spots to be marked. Mit placeholder zeigt sich
// ein leeres Feld als gestrichelter Rahmen mit diesem Text. Mit editable kann
// man ins Feld tippen – nur im Editor. name ist der Name des Felds für
// Screenreader. Mit wrapsLines brechen lange Zeilen am Rand um, ohne wird das
// Feld breiter und nur Enter beginnt eine neue Zeile. horizontalAlignment und
// verticalAlignment richten den Text in der Box aus, auch beim Tippen.
const props = withDefaults(
  defineProps<{
    id: string
    name: string
    horizontalAlignment: HorizontalAlignment
    verticalAlignment: VerticalAlignment
    fontFamily: string
    /** In mm. */
    fontSize: number
    color: string
    content?: string
    highlightSearch?: boolean
    placeholder?: string
    editable?: boolean
    wrapsLines?: boolean
  }>(),
  { content: '', highlightSearch: false, placeholder: '', editable: false, wrapsLines: true },
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

const field = useTemplateRef<HTMLElement>('field')
const editor = useTemplateRef<HTMLElement>('editor')

const isTyping = computed(
  () => props.editable && isTypingInSelectedElement.value && selectedElementId.value === props.id,
)

// Beim Tippen ist das Textfeld darin dran, kein Knopf drumherum.
const isButton = computed(() => props.editable && !isTyping.value)

const isPlaceholderShown = computed(() => !props.content && !!props.placeholder)

const textParts = computed(() =>
  props.highlightSearch
    ? splitBySearchWord(props.content)
    : [{ text: props.content, isMatch: false }],
)

// placeCaret setzt den Cursor, sobald das Textfeld da ist.
async function startTyping(placeCaret: (textField: HTMLElement) => void) {
  startTypingInElement(props.id)
  await nextTick()
  if (!editor.value) return
  editor.value.textContent = props.content
  editor.value.focus()
  placeCaret(editor.value)
}

// Der 1. Klick wählt das Feld aus. Ein weiterer startet im Editor das Tippen,
// der Cursor landet an der Klickstelle. Im Tippmodus setzt der Browser den
// Cursor selbst.
function selectOrStartTyping(event: MouseEvent) {
  if (isTyping.value) return
  if (!props.editable || selectedElementId.value !== props.id) return selectElement(props.id)

  startTyping((textField) => placeCaretAtPoint(textField, event.clientX, event.clientY))
}

function startTypingAtEnd() {
  startTyping((textField) => window.getSelection()?.collapse(textField, textField.childNodes.length))
}

// Das Feld bleibt ausgewählt und fokussiert.
function stopTyping() {
  selectElement(props.id)
  field.value?.focus()
}

// Per Tastatur angesprungen wählt sich das Feld aus. Ein Mausklick fokussiert es
// auch, wählt aber erst mit dem Klick aus – sonst wäre schon der 1. Klick der 2.
function selectOnKeyboardFocus() {
  if (field.value?.matches(':focus-visible')) selectElement(props.id)
}

// Browser hängen ans Ende oft einen Zeilenumbruch nur als Platzhalter an – der
// zählt nicht, sonst wäre ein geleertes Feld nie mehr leer.
function emitTypedText() {
  emit('update:content', editor.value?.innerText.replace(/\n$/, '') ?? '')
}
</script>
