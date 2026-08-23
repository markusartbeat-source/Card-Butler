<template>
  <h1 class="text-3xl text-white">Mein erstes Projekt</h1>

  <div class="mx-auto mt-8 flex w-4/5 flex-wrap justify-center gap-6">
    <CbCard
      v-for="card in cards"
      :key="card.number"
      :number="card.number"
      :shape-classes="card.shapeClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbCard from '../components/atoms/CbCard.vue'

const cards = ref([
  { number: 1 },
  { number: 2 },
  { number: 3 },
  // Temporary proof that the area does not force a card size.
  { number: 4, shapeClasses: 'h-24 w-24 rounded-full' },
  { number: 5 },
  { number: 6 },
  { number: 7 },
  { number: 8 },
])
</script>
