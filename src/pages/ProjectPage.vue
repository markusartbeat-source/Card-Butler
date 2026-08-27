<template>
  <CbHeader :title="projectName" :buttons="headerButtons" @action="runHeaderAction" />

  <CbCardEditor
    v-if="selectedCard && selectedCardRect"
    :key="selectedCard.id"
    :id="selectedCard.id"
    :number="selectedCard.number"
    :start-rect="selectedCardRect"
    @close="selectedCardId = null"
  >
    <CbCursor
      v-for="cursor in cursorsOnCard(selectedCard.id)"
      :key="cursor.senderId"
      :x="cursor.x"
      :y="cursor.y"
      :name="cursor.name"
      :color="cursor.color"
    />
  </CbCardEditor>

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
      v-for="(card, cardIndex) in cards"
      :key="card.id"
      :id="card.id"
      :number="card.number"
      :highlight-color="highlightColorForCard(card.id)"
      :style="riseDelay(cardIndex)"
      :class="[
        risenCardIds.has(card.id) ? '' : 'animate-cb-rise',
        { invisible: card.id === selectedCardId },
      ]"
      @animationend="markRisen(card.id, $event)"
      @click="selectCard(card.id, $event)"
    >
      <CbCursor
        v-for="cursor in cursorsOnCard(card.id)"
        :key="cursor.senderId"
        :x="cursor.x"
        :y="cursor.y"
        :name="cursor.name"
        :color="cursor.color"
      />
    </CbCard>

    <CbInteractive
      class="order-last flex h-72 w-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold text-gold"
      :class="risenCardIds.has(addCardId) ? '' : 'animate-cb-rise'"
      :style="addCardDelay"
      @animationend="markRisen(addCardId, $event)"
      @click="addCard"
    >
      <CbIcon name="add_2" />
      <span>{{ dictionary.project.newCard }}</span>
    </CbInteractive>
  </VueDraggable>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'
import CbCursor from '../livecursors/CbCursor.vue'
import { readAnchorFromMouse, type CursorAnchor } from '../livecursors/cursorAnchor'
import { useLiveCursors } from '../livecursors/useLiveCursors'
import { showDangerToast, showSuccessToast } from '../components/atoms/toaster'
import CbHeader from '../components/organisms/CbHeader.vue'
import type { HeaderButton } from '../components/organisms/headerButton'
import { projectName } from '../project/project'

const headerButtons = computed<HeaderButton[]>(() => [
  { key: 'share', label: dictionary.project.share, icon: 'share', variant: 'secondary' },
  { key: 'more', label: dictionary.general.more, icon: 'more_horiz', variant: 'secondary' },
])

function runHeaderAction(key: string) {
  if (key === 'share')
    showSuccessToast(dictionary.project.linkCopiedTitle, dictionary.project.linkCopiedText)
  else showDangerToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText)
}

// The id stays with a card forever — the number is only its place in the row.
// The starter cards use fixed ids so every window means the same card. Real
// shared card data comes later with live sync.
const cards = ref(
  [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({ id: `starter-card-${number}`, number })),
)
const selectedCardId = ref<string | null>(null)

// The cards of the first render fan in one after the other. A card added later
// should show up right away, so it gets no delay.
const initialCardCount = cards.value.length

function riseDelay(index: number) {
  return index < initialCardCount ? { animationDelay: `${index * 60}ms` } : undefined
}

// The button for a new card comes in behind the last card.
const addCardDelay = { animationDelay: `${initialCardCount * 60}ms` }
const addCardId = 'add-card-button'

// Dropping a card on the spot it came from makes the drag library put every
// element of the row back into the page one by one, which would start the
// entrance animation all over again. So each element wears the animation only
// until it has played once.
const risenCardIds = ref(new Set<string>())

function markRisen(id: string, event: AnimationEvent) {
  if (event.animationName === 'cb-rise') risenCardIds.value.add(id)
}
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
const { foreignCursors } = useLiveCursors(myAnchor)

// The cursors of other people that are sitting on this card right now.
function cursorsOnCard(cardId: string) {
  return foreignCursors.value.flatMap((cursor) =>
    cursor.anchor?.cardId === cardId
      ? [{ ...cursor, x: cursor.anchor.x, y: cursor.anchor.y }]
      : [],
  )
}

// The card somebody stands on gets a frame in their colour. If several people
// are on the same card, the first one wins — the frame can only show one.
function highlightColorForCard(cardId: string) {
  return foreignCursors.value.find((cursor) => cursor.anchor?.cardId === cardId)?.color
}

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
