<template>
  <div class="flex w-full items-center gap-2.5 p-6">
    <!-- Empty side, same width as the right side, so the search stays centered. -->
    <div class="flex-1"></div>

    <div class="bg-surface flex w-96 items-center rounded-full text-white shadow-lg">
      <!-- The text area opens the search later, the icons only switch the mode. -->
      <CbInteractive
        class="flex flex-1 items-center self-stretch rounded-l-full pl-6 text-left text-sm"
        @click="showToast(searchModes[activeSearchMode], 'Diese Funktion gibt es noch nicht.')"
      >
        {{ searchModes[activeSearchMode] }}
      </CbInteractive>
      <div class="flex gap-0.5 p-1.5">
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

    <div class="flex flex-1 justify-end gap-2.5">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import { showToast } from '../atoms/toaster'

// Each search mode has its own icon button and its own text in the pill.
const searchModes = {
  search: 'In den Karten finden',
  forum: 'Frag den Butler',
} as const

const searchModeNames = ['search', 'forum'] as const

const activeSearchMode = ref<keyof typeof searchModes>('search')
</script>
