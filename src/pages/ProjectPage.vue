<template>
  <h1 class="text-3xl text-white">Mein erstes Projekt</h1>

  <div class="mx-auto mt-8 flex w-4/5 flex-wrap justify-center gap-6">
    <CbCard v-for="card in cards" :key="card.number" :number="card.number" />

    <CbInteractive
      class="flex h-72 w-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold text-gold"
      @click="addCard"
    >
      <CbIcon name="add_2" />
      <span>Neue Karte</span>
    </CbInteractive>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbCard from '../components/atoms/CbCard.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({ number })))

function addCard() {
  const highestNumber = Math.max(...cards.value.map((card) => card.number))
  cards.value.push({ number: highestNumber + 1 })
}
</script>
