<template>
  <!-- Ein Vorschaubild: füllt seinen Platz und schneidet zu, statt zu verzerren.
       Ohne Bild ein leerer Rahmen mit Icon. Die Größe gibt der Aufrufer vor. -->
  <span class="flex items-center justify-center overflow-hidden rounded-md bg-surface text-label">
    <img v-if="picture" :src="picture" alt="" class="size-full object-cover" />
    <CbIcon v-else name="add_photo_alternate" />
  </span>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'

// picture ist die Adresse des Bildes.
defineProps<{ picture?: string }>()
</script>
