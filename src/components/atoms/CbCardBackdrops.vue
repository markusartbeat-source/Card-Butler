<template>
  <!-- The sheets stacked behind a card that is printed more than once: one
       sheet per extra copy, at most five. Each is a card-sized face pushed 4px
       further to the bottom right and one shade darker than the one in front.
       The root fills the card's cell and is positioned, so the faces (which are
       transformed) paint over it. The offset sits on a wrapper without zoom, so
       it stays in real page pixels. -->
  <div class="cb-card-backdrops relative">
    <!-- A soft shadow sets each sheet off from the one behind it; the deepest
         sheet has nothing behind it, so it goes without. -->
    <div
      v-for="(sheet, index) in shownSheets"
      :key="sheet.offset"
      class="absolute inset-0"
      :class="sheet.offset"
    >
      <div
        class="cb-card-face"
        :class="[sheet.color, index > 0 ? 'shadow-xl' : '']"
        :style="faceStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cardFormat, cardFormatStyle, gridZoom } from '../../card/cardFormat'

const props = defineProps<{ count: number }>()

// From the deepest sheet to the one right behind the card, so the deepest
// paints first. Written out so Tailwind finds the classes.
const sheets = [
  { offset: 'translate-5', color: 'bg-card-backdrop-5' },
  { offset: 'translate-4', color: 'bg-card-backdrop-4' },
  { offset: 'translate-3', color: 'bg-card-backdrop-3' },
  { offset: 'translate-2', color: 'bg-card-backdrop-2' },
  { offset: 'translate-1', color: 'bg-card-backdrop-1' },
]

// The card itself is one copy, every further copy gets a sheet.
const shownSheets = computed(() => {
  const sheetCount = Math.min(props.count - 1, sheets.length)
  return sheets.slice(sheets.length - sheetCount)
})

const faceStyle = computed(() => ({ ...cardFormatStyle(cardFormat.value), zoom: gridZoom }))
</script>
