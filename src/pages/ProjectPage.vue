<template>
  <h1 class="text-3xl text-white">Mein erstes Projekt</h1>

  <CbCardEditor
    v-if="selectedCardNumber && selectedCardRect"
    :number="selectedCardNumber"
    :start-rect="selectedCardRect"
    @close="selectedCardNumber = null"
  />

  <VueDraggable
    v-model="cards"
    :animation="200"
    draggable=".cb-card"
    :force-fallback="true"
    :fallback-tolerance="8"
    ghost-class="cb-card-ghost"
    drag-class="cb-card-dragged"
    class="mx-auto mt-8 flex w-4/5 flex-wrap justify-center gap-6 select-none"
    @start="isDragging = true"
    @end="endDragging"
  >
    <CbCard
      v-for="card in cards"
      :key="card.number"
      :number="card.number"
      @click="selectCard(card.number, $event)"
    />

    <CbInteractive
      class="order-last flex h-72 w-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold text-gold"
      @click="addCard"
    >
      <CbIcon name="add_2" />
      <span>Neue Karte</span>
    </CbInteractive>
  </VueDraggable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'

const cards = ref([1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({ number })))
const selectedCardNumber = ref<number | null>(null)

// Where the clicked card sits in the grid — the editor starts its flight there.
const selectedCardRect = ref<DOMRect | null>(null)

// A finished drag still fires a click on the card, so we keep the flag alive
// until that click is over.
const isDragging = ref(false)

function endDragging() {
  setTimeout(() => {
    isDragging.value = false
  }, 0)
}

function selectCard(number: number, event: MouseEvent) {
  if (isDragging.value) return
  selectedCardRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  selectedCardNumber.value = number
}

function addCard() {
  const highestNumber = Math.max(...cards.value.map((card) => card.number))
  cards.value.push({ number: highestNumber + 1 })
}
</script>
