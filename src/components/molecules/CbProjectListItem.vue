<template>
  <!-- Ein Link, kein Button: Er führt zu einer eigenen Seite (auch per Tab,
       Enter und „In neuem Tab öffnen“). Der Stift steht daneben, weil ein
       Button nicht in einem Link liegen darf. -->
  <li class="flex items-center gap-1">
    <router-link
      v-ripple
      :to="`/project/${projectId}`"
      class="cb-regular-text bg-surface cb-hover relative flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-lg px-3 py-2 shadow-lg ring ring-surface-edge"
    >
      <CbIcon name="playing_cards" />
      <span class="truncate">{{ name }}</span>
    </router-link>
    <CbButton
      variant="icon"
      :aria-label="dictionary.home.renameProjectLabel(name)"
      @click="$emit('rename')"
    >
      <CbIcon name="edit" />
    </CbButton>
  </li>
</template>

<script setup lang="ts">
import CbButton from '../atoms/CbButton.vue'
import CbIcon from '../atoms/CbIcon.vue'

defineProps<{ projectId: string; name: string }>()
defineEmits<{ rename: [] }>()
</script>
