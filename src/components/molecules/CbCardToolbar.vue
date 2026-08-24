<template>
  <div class="bg-surface flex h-14 items-center justify-center gap-1 rounded-xl px-3 text-white">
    <button
      v-for="element in cbCardToolbarElements"
      :key="element.name"
      type="button"
      class="rounded-full p-2"
      :title="element.name"
    >
      <CbIcon :name="element.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'
import { cbCardToolbarElements } from './CbCardToolbarElements'
</script>
