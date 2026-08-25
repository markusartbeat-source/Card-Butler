<template>
  <CbTopbar>
    <template #actions>
      <CbButton
        variant="secondary"
        @click="showSuccessToast('Link kopiert', 'Der Link liegt in der Zwischenablage.')"
      >
        <CbIcon name="share" />
        Teilen
      </CbButton>
      <CbButton variant="secondary" @click="showDangerToast('Nicht verfügbar', 'Diese Funktion gibt es noch nicht.')">
        <CbIcon name="more_horiz" />
        Mehr
      </CbButton>
    </template>
  </CbTopbar>

  <CbCardEditor
    v-if="selectedCard && selectedCardRect"
    :key="selectedCard.id"
    :id="selectedCard.id"
    :number="selectedCard.number"
    :start-rect="selectedCardRect"
    @close="selectedCardId = null"
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
      :key="card.id"
      :id="card.id"
      :number="card.number"
      :class="{ invisible: card.id === selectedCardId }"
      @click="selectCard(card.id, $event)"
    >
      <!-- Temporary: one example cursor to check the look and the anchoring. -->
      <CbCursor v-if="card.id === cards[0].id" :x="40" :y="60" name="Beispiel" />
    </CbCard>

    <CbInteractive
      class="order-last flex h-72 w-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold text-gold"
      @click="addCard"
    >
      <CbIcon name="add_2" />
      <span>Neue Karte</span>
    </CbInteractive>
  </VueDraggable>

  <!-- Temporary: shows where my own mouse is anchored. -->
  <div class="fixed bottom-2 left-2 rounded-md bg-surface px-2 py-1 text-xs text-gold-light">
    {{ myAnchorText }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'
import CbCursor from '../livecursors/CbCursor.vue'
import { readAnchorFromMouse, type CursorAnchor } from '../livecursors/cursorAnchor'
import { showDangerToast, showSuccessToast } from '../components/atoms/toaster'
import CbTopbar from '../components/organisms/CbTopbar.vue'

// The id stays with a card forever — the number is only its place in the row.
const cards = ref(
  [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({ id: crypto.randomUUID(), number })),
)
const selectedCardId = ref<string | null>(null)
const selectedCard = computed(() => cards.value.find((card) => card.id === selectedCardId.value))

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

function selectCard(id: string, event: MouseEvent) {
  if (isDragging.value) return
  selectedCardRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  selectedCardId.value = id
}

// Where my own mouse currently is, as { card, x%, y% } — null outside the cards.
const myAnchor = ref<CursorAnchor | null>(null)
const myAnchorText = computed(() =>
  myAnchor.value
    ? `Karte ${myAnchor.value.cardId.slice(0, 4)} · ${myAnchor.value.x}% / ${myAnchor.value.y}%`
    : 'keine Karte',
)

function updateMyAnchor(event: MouseEvent) {
  myAnchor.value = readAnchorFromMouse(event)
}

onMounted(() => window.addEventListener('mousemove', updateMyAnchor))
onUnmounted(() => window.removeEventListener('mousemove', updateMyAnchor))

function addCard() {
  const highestNumber = Math.max(...cards.value.map((card) => card.number))
  cards.value.push({ id: crypto.randomUUID(), number: highestNumber + 1 })
}
</script>
