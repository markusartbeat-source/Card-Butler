<template>
  <!-- Thin frame around the bar: gold at both round ends, dark in between. -->
  <div class="cb-gold-edge-frame rounded-full p-0.5 shadow-lg">
    <div ref="bar" class="bg-surface flex items-center rounded-full">
      <!-- Square click zones, only the outer ones follow the bar's round ends.
           With the names written out, the tooltip would only repeat them. The
           active entry wears the golden fill of the primary button. -->
      <CbInteractive
        v-for="(element, index) in elements"
        :key="element.name"
        class="flex items-center gap-2.5 px-3 py-4 text-sm first:rounded-l-full first:pl-4 last:rounded-r-full last:pr-4"
        :class="
          index === activeIndex ? 'bg-radial from-gold-light to-gold text-surface' : 'text-white'
        "
        :title="showNames ? undefined : element.name"
      >
        <CbIcon :name="element.icon" />
        <span v-if="showNames">{{ element.name }}</span>
      </CbInteractive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import type { ToolbarElement } from './toolbarElement'

defineProps<{ elements: ToolbarElement[]; showNames?: boolean; activeIndex?: number | null }>()

const barElement = useTemplateRef<HTMLElement>('bar')

function overlapArea(one: DOMRect, other: DOMRect) {
  const width = Math.min(one.right, other.right) - Math.max(one.left, other.left)
  const height = Math.min(one.bottom, other.bottom) - Math.max(one.top, other.top)
  return width > 0 && height > 0 ? width * height : 0
}

/** Which entry the biggest part of this rectangle covers — for callers whose
    pointer cannot reach the bar, like a card being dragged over it. */
function indexOverlapping(rect: DOMRect) {
  const entries = barElement.value ? [...barElement.value.children] : []
  let coveredIndex: number | null = null
  let largestArea = 0

  entries.forEach((entry, index) => {
    const area = overlapArea(rect, entry.getBoundingClientRect())
    if (area > largestArea) {
      largestArea = area
      coveredIndex = index
    }
  })

  return coveredIndex
}

defineExpose({ indexOverlapping })
</script>
