<template>
  <div class="flex w-full items-center gap-2.5 py-6">
    <!-- Left side is as wide as the right side, so the search stays centered. -->
    <div class="flex flex-1 items-center gap-2.5">
      <!-- The back button belongs to the heading, so it only shows with one. -->
      <template v-if="title">
        <CbButton variant="ghost" @click="router.back()">
          <CbIcon name="west" />
        </CbButton>
        <h1 class="text-3xl text-white">{{ title }}</h1>
      </template>
    </div>

    <div v-if="searchbar" class="bg-surface flex w-96 items-center rounded-full text-white shadow-lg">
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
      <CbButton
        v-for="button in buttons"
        :key="button.key"
        :variant="button.variant"
        @click="$emit('action', button.key)"
      >
        <CbIcon v-if="button.icon" :name="button.icon" />
        {{ button.label }}
      </CbButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CbButton from '../atoms/CbButton.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import { showToast } from '../atoms/toaster'
import type { HeaderButton } from './headerButton'

withDefaults(defineProps<{ title?: string; searchbar?: boolean; buttons?: HeaderButton[] }>(), {
  searchbar: true,
  buttons: () => [],
})
defineEmits<{ action: [key: string] }>()

// Each search mode has its own icon button and its own text in the pill.
const searchModes = {
  search: 'In den Karten finden',
  forum: 'Frag den Butler',
} as const

const searchModeNames = ['search', 'forum'] as const

const activeSearchMode = ref<keyof typeof searchModes>('search')

const router = useRouter()
</script>
