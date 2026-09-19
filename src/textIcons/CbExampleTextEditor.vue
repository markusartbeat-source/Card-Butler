<template>
  <!-- The example text is always the same big editable area. Clicking into it
       lets the panel around it appear: the dark shell, the font choices on
       top and the field box with its label. Nothing is swapped, so the text
       keeps its size and only the shell fades and unfolds around it. -->
  <div
    ref="panel"
    class="rounded-3xl transition-all duration-350"
    :class="editing && 'bg-surface shadow-lg'"
  >
    <div class="cb-unfold" :class="editing && 'cb-unfold-open'">
      <div>
        <div class="flex gap-3 p-6">
          <CbSelect v-model="fontFamily" class="flex-1" variant="field" :items="fontFamilyItems" />
          <CbSelect v-model="fontWeight" class="flex-1" variant="field" :items="fontWeightItems" />
          <CbSelect v-model="fontSize" class="flex-1" variant="field" :items="fontSizeItems" />
        </div>
        <CbDivider />
      </div>
    </div>

    <div class="transition-all duration-350" :class="editing ? 'p-6' : 'p-0'">
      <div
        class="rounded-md transition-all duration-350"
        :class="editing && 'bg-surface-light px-1.5 py-1'"
      >
        <div class="cb-unfold text-sm text-label" :class="editing && 'cb-unfold-open'">
          <div>{{ dictionary.textIcons.exampleTextLabel }}</div>
        </div>
        <!-- An editable area instead of a textarea, because a textarea cannot
             show pictures. Enter gives a line break, paste stays plain text. -->
        <div
          ref="editor"
          contenteditable="true"
          role="textbox"
          aria-multiline="true"
          :aria-label="dictionary.textIcons.exampleTextLabel"
          class="leading-normal whitespace-pre-wrap text-white outline-none"
          :style="exampleTextStyle"
          @focus="editing = true"
          @input="onInput"
          @keydown.enter.prevent="insertLineBreak"
          @paste.prevent="pastePlainText"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import {
  exampleText,
  fontFamily,
  fontWeight,
  fontSize,
  fontFamilies,
  fontSizes,
} from './exampleText'
import { nodesToText, replaceTypedIconWords, textToNodes } from './textIconWords'

const editing = ref(false)

const fontFamilyItems = fontFamilies.map((name) => ({ value: name, label: name }))
const fontWeightItems = [
  { value: 'regular', label: dictionary.textIcons.fontWeightRegular },
  { value: 'bold', label: dictionary.textIcons.fontWeightBold },
]
const fontSizeItems = fontSizes.map((size) => ({ value: size, label: size }))

const exampleTextStyle = computed(() => ({
  fontFamily: fontFamily.value,
  fontWeight: fontWeight.value === 'bold' ? 'bold' : 'normal',
  fontSize: `${fontSize.value}px`,
}))

// The editable area is filled once from the stored text; from then on the
// browser owns its content and every change is written back as text.
const editor = useTemplateRef<HTMLElement>('editor')
onMounted(() => editor.value?.replaceChildren(...textToNodes(exampleText.value)))

function onInput() {
  if (!editor.value) return
  replaceTypedIconWords(editor.value)
  exampleText.value = nodesToText(editor.value)
}

// Leaving the text also finishes a word that ends exactly at the caret.
// An emptied text comes back as the original example, so the page is never
// left without a sample to look at.
function finishEditing() {
  editing.value = false
  editor.value?.blur()
  window.getSelection()?.removeAllRanges()
  onInput()
  if (exampleText.value.trim() === '') {
    exampleText.value = dictionary.textIcons.exampleText
    editor.value?.replaceChildren(...textToNodes(exampleText.value))
  }
}

function insertLineBreak() {
  document.execCommand('insertLineBreak')
}

function pastePlainText(event: ClipboardEvent) {
  document.execCommand('insertText', false, event.clipboardData?.getData('text/plain'))
}

// A click outside the panel closes it. The open select list lives in the
// body, so a click on one of its entries must not count as outside.
const panel = useTemplateRef<HTMLElement>('panel')
function closeOnClickOutside(event: PointerEvent) {
  const target = event.target as HTMLElement
  if (panel.value?.contains(target) || target.closest('[data-scope="select"]')) return
  if (editing.value) finishEditing()
}
onMounted(() => document.addEventListener('pointerdown', closeOnClickOutside))
onUnmounted(() => document.removeEventListener('pointerdown', closeOnClickOutside))
</script>
