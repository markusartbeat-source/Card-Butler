<template>
  <div class="bg-surface rounded-2xl p-6">
    <!-- Title framed by a short golden stroke on each side. -->
    <div class="flex items-center justify-center gap-3">
      <span class="bg-gold h-px w-4.5"></span>
      <h2 class="text-xl text-white">{{ dictionary.cardEditor.cardSettings }}</h2>
      <span class="bg-gold h-px w-4.5"></span>
    </div>

    <CbTabs v-model="activeTab" class="mt-6" :items="tabs" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbTabs from '../components/atoms/CbTabs.vue'

const activeTab = ref('settings')

const tabs = computed(() => [
  { value: 'settings', label: dictionary.cardEditor.settingsTab },
  { value: 'layers', label: dictionary.cardEditor.layersTab },
])
</script>
