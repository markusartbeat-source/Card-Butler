<template>
  <!-- Four tiles per row, all the same width: the dashed "new icon" tile
       first, then every icon with its picture on top and its name field below. -->
  <div class="grid grid-cols-4 gap-3 p-6">
    <CbInteractive
      class="flex flex-col items-center justify-center gap-2.5 rounded-md border-2 border-dashed border-label text-sm text-label"
    >
      <CbIcon name="add_2" />
      <span>{{ dictionary.textIcons.newIcon }}</span>
    </CbInteractive>
    <div v-for="icon in textIcons" :key="icon.id" class="flex flex-col items-center gap-2.5">
      <img :src="icon.image" :alt="icon.name" class="h-12 object-contain" />
      <CbInput v-model="icon.name" class="w-full" :label="dictionary.textIcons.name" hide-label />
    </div>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import { textIcons } from './textIconList'
</script>
