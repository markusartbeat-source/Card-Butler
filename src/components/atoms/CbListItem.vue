<template>
  <div
    v-ripple
    class="cb-hover relative flex items-center gap-2 overflow-hidden rounded-md px-2 py-1.5"
  >
    <!-- Ein Eintrag einer aufgeklappten Liste, mit Icon davor, wenn er eins hat.
         Ark legt sein Verhalten per as-child darauf, z.B. <Select.Item as-child>.
         Kommentar im Eintrag statt davor – Grund siehe CbPopupList. -->
    <CbIcon v-if="icon" :name="icon" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ icon?: IconName }>()
</script>
