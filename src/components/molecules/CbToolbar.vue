<template>
  <!-- Thin frame around the bar: gold at both round ends, dark in between. -->
  <div class="cb-gold-edge-frame rounded-full p-0.5 shadow-lg">
    <div class="bg-surface flex items-center rounded-full">
      <!-- Square click zones, only the outer ones follow the bar's round ends.
           With the names written out, the tooltip would only repeat them. -->
      <CbInteractive
        v-for="element in elements"
        :key="element.name"
        class="flex items-center gap-2.5 px-3 py-4 text-sm text-white first:rounded-l-full first:pl-4 last:rounded-r-full last:pr-4"
        :title="showNames ? undefined : element.name"
      >
        <CbIcon :name="element.icon" />
        <span v-if="showNames">{{ element.name }}</span>
      </CbInteractive>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import type { ToolbarElement } from './toolbarElement'

defineProps<{ elements: ToolbarElement[]; showNames?: boolean }>()
</script>
