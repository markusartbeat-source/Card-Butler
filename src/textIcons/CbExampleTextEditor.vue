<template>
  <!-- The example text is always the same big textarea. Clicking into it
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
      <label
        class="block rounded-md transition-all duration-350"
        :class="editing && 'bg-surface-light px-1.5 py-1'"
      >
        <span class="cb-unfold text-sm text-label" :class="editing && 'cb-unfold-open'">
          <span>{{ dictionary.textIcons.exampleTextLabel }}</span>
        </span>
        <textarea
          v-model="exampleText"
          class="block w-full field-sizing-content resize-none bg-transparent text-3xl leading-normal text-white outline-none"
          @focus="editing = true"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
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

const editing = ref(false)

const fontFamilyItems = fontFamilies.map((name) => ({ value: name, label: name }))
const fontWeightItems = [
  { value: 'regular', label: dictionary.textIcons.fontWeightRegular },
  { value: 'bold', label: dictionary.textIcons.fontWeightBold },
]
const fontSizeItems = fontSizes.map((size) => ({ value: size, label: size }))

// A click outside the panel closes it. The open select list lives in the
// body, so a click on one of its entries must not count as outside.
const panel = useTemplateRef<HTMLElement>('panel')
function closeOnClickOutside(event: PointerEvent) {
  const target = event.target as HTMLElement
  if (panel.value?.contains(target) || target.closest('[data-scope="select"]')) return
  editing.value = false
}
onMounted(() => document.addEventListener('pointerdown', closeOnClickOutside))
onUnmounted(() => document.removeEventListener('pointerdown', closeOnClickOutside))
</script>
