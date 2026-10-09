<template>
  <!-- Ein Link, kein Button: Er führt zu einer eigenen Seite (auch per Tab,
       Enter und „In neuem Tab öffnen“). -->
  <li>
    <router-link
      v-ripple
      :to="`/project/${projectId}`"
      class="bg-surface cb-hover relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm text-white shadow-lg"
    >
      <CbIcon name="playing_cards" />
      <span class="truncate">{{ name }}</span>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'

defineProps<{ projectId: string; name: string }>()
</script>
