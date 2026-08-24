<template>
  <div class="flex w-full items-center gap-3">
    <!-- Empty side, same width as the right side, so the search stays centered. -->
    <div class="flex-1"></div>

    <div class="bg-surface flex items-center gap-3 rounded-full py-2 pr-2 pl-5 text-white shadow-lg">
      <span class="text-sm">{{ searchModes[activeSearchMode] }}</span>
      <div class="flex gap-1">
        <CbInteractive
          v-for="mode in searchModeNames"
          :key="mode"
          class="rounded-full p-2 text-white"
          :class="{ 'bg-surface-light': mode === activeSearchMode }"
          @click="activeSearchMode = mode"
        >
          <CbIcon :name="mode" />
        </CbInteractive>
      </div>
    </div>

    <div class="flex flex-1 justify-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'

// Each search mode has its own icon button and its own text in the pill.
const searchModes = {
  search: 'In den Karten finden',
  forum: 'Frag den Butler',
} as const

const searchModeNames = ['search', 'forum'] as const

const activeSearchMode = ref<keyof typeof searchModes>('search')
</script>
