<template>
  <!-- data-element-id lets the transform handles find this element on the card.
       The card hands in the position, so no "relative" or "inline-block" here.
       pre-wrap zeigt die Zeilenumbrüche im Text. -->
  <span
    v-ripple
    class="text-background overflow-hidden rounded whitespace-pre-wrap"
    :class="[
      isTyping ? 'cursor-text' : 'cursor-pointer px-1',
      { 'border-background/70 border border-dashed': isPlaceholderShown },
    ]"
    :data-element-id="id"
    @click="selectOrStartTyping"
  >
    <!-- Im Tippmodus gehört der Inhalt dem Browser: einmal befüllt, danach
         zeichnet Vue nichts mehr hinein, sonst springt der Cursor.
         plaintext-only macht Enter zum Zeilenumbruch und fügt nur reinen Text
         ein. -->
    <span
      v-if="isTyping"
      ref="editor"
      contenteditable="plaintext-only"
      class="block size-full px-1 outline-none"
      @input="emitTypedText"
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
import {
  isTypingInSelectedElement,
  selectElement,
  selectedElementId,
  startTypingInSelectedElement,
} from '../../elementTransform/elementSelection'
import { splitBySearchWord } from '../../search/splitBySearchWord'
import { placeCaretAtPoint } from './placeCaretAtPoint'

// The content is the one thing each card fills in itself. Only the card
// overview asks for the found spots to be marked. Mit placeholder zeigt sich
// ein leeres Feld als gestrichelter Rahmen mit diesem Text. Mit editable kann
// man ins Feld tippen – nur im Editor.
const props = withDefaults(
  defineProps<{
    id: string
    content?: string
    highlightSearch?: boolean
    placeholder?: string
    editable?: boolean
  }>(),
  { content: '', highlightSearch: false, placeholder: '', editable: false },
)

const emit = defineEmits<{ 'update:content': [content: string] }>()

const editor = useTemplateRef<HTMLElement>('editor')

const isTyping = computed(
  () => props.editable && isTypingInSelectedElement.value && selectedElementId.value === props.id,
)

const isPlaceholderShown = computed(() => !props.content && !!props.placeholder)

const textParts = computed(() =>
  props.highlightSearch
    ? splitBySearchWord(props.content)
    : [{ text: props.content, isMatch: false }],
)

// Der 1. Klick wählt das Feld aus. Ein weiterer startet im Editor das Tippen,
// der Cursor landet an der Klickstelle. Im Tippmodus setzt der Browser den
// Cursor selbst.
async function selectOrStartTyping(event: MouseEvent) {
  if (isTyping.value) return
  if (!props.editable || selectedElementId.value !== props.id) return selectElement(props.id)

  startTypingInSelectedElement()
  await nextTick()
  if (!editor.value) return
  editor.value.textContent = props.content
  editor.value.focus()
  placeCaretAtPoint(editor.value, event.clientX, event.clientY)
}

// Browser hängen ans Ende oft einen Zeilenumbruch nur als Platzhalter an – der
// zählt nicht, sonst wäre ein geleertes Feld nie mehr leer.
function emitTypedText() {
  emit('update:content', editor.value?.innerText.replace(/\n$/, '') ?? '')
}
</script>
