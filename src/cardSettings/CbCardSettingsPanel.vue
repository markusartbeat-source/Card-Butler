<template>
  <div class="bg-surface rounded-2xl p-6">
    <!-- Title framed by a short golden stroke on each side. -->
    <div class="flex items-center justify-center gap-3">
      <span class="bg-gold h-px w-4.5"></span>
      <h2 class="text-xl text-white">{{ dictionary.cardEditor.cardSettings }}</h2>
      <span class="bg-gold h-px w-4.5"></span>
    </div>

    <CbTabs v-model="activeTab" class="mt-6" :items="tabs">
      <template #settings>
        <div class="mt-6 flex flex-col gap-3">
          <h3 class="text-base font-bold text-white">{{ dictionary.cardEditor.sizesGroup }}</h3>
          <div class="flex gap-3">
            <CbInput v-model="width" class="flex-1" :label="dictionary.cardEditor.width" />
            <CbInput v-model="height" class="flex-1" :label="dictionary.cardEditor.height" />
          </div>
        </div>
      </template>
    </CbTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbTabs from '../components/atoms/CbTabs.vue'

const activeTab = ref('settings')

// The values only live in the panel for now, they do not change the card yet.
const width = ref('20')
const height = ref('90')

const tabs = computed(() => [
  { value: 'settings', label: dictionary.cardEditor.settingsTab },
  { value: 'layers', label: dictionary.cardEditor.layersTab },
])
</script>
