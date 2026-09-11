<template>
  <CbExportDialog v-model:open="isExportDialogOpen" :cards="cards" />

  <CbCardEditor
    v-if="selectedCard && selectedCardRect"
    :key="selectedCard.id"
    :id="selectedCard.id"
    :number="selectedCard.number"
    :element-values="selectedCard.elementValues"
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

  <!-- The card sets stand at the right edge and their divider line runs the
       whole height. Everything else belongs to the cards, so the print bar
       ends up centred under them and not under the whole page. -->
  <div class="flex min-h-full">
    <!-- The print bar stands under the cards, so it ends up at the bottom edge
         of a short page and stays there while a long page scrolls. -->
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex flex-1">
        <VueDraggable
          v-if="!hasNoSearchResults"
          v-model="cards"
          v-bind="cardDragOptions"
          :disabled="isSearching"
          class="mt-8 flex h-max min-w-0 flex-1 flex-wrap justify-center gap-6 px-16 select-none"
          @start="startCardDrag"
          @end="finishCardDrag"
        >
          <!-- The button stands in front of the row. It is not a ".cb-card", so the
               drag library skips it: a card is only ever put before or after another
               card, which keeps the button the first thing in the row. While
               searching it steps aside — the row then shows hits only. -->
          <CbInteractive
            v-if="!isSearching"
            class="cb-card-face flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold text-gold"
            :class="[
              risenCardIds.has(addCardId) ? '' : 'animate-cb-rise',
              dimWhileDraggingClasses,
            ]"
            :style="{ ...cardFormatStyle(cardFormat), zoom: gridZoom }"
            @animationend="markRisen(addCardId, $event)"
            @click="addCard"
          >
            <CbIcon name="add_2" />
            <span>{{ dictionary.project.newCard }}</span>
          </CbInteractive>


          <!-- The box the drag library picks up. It must be plain page pixels: the
               library writes the position of the dragged copy into "transform", and
               the "zoom" that draws the card would shrink that movement, so the card
               would fall behind the cursor. The zoom sits on the card inside.
               Front and back share the one grid cell of the box, so they lie on top
               of each other; the flip turns the two faces (see style.css). -->
          <div
            v-for="(card, cardIndex) in visibleCards"
            :key="card.id"
            class="cb-card grid"
            :style="riseDelay(card.id, cardIndex)"
            :class="[
              risenCardIds.has(card.id) ? '' : 'animate-cb-rise',
              { invisible: card.id === selectedCardId, 'cb-card-flipped': showingCardBacks },
            ]"
            @animationend="markRisen(card.id, $event)"
            @click="selectCard(card.id, $event)"
          >
            <CbCard
              :id="card.id"
              :number="card.number"
              :element-values="card.elementValues"
              :highlight-color="highlightColorForCard(card.id)"
              highlight-search
              class="cb-card-front col-start-1 row-start-1"
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
            <CbCard
              :id="card.id"
              :number="card.number"
              :element-values="card.elementValues"
              :highlight-color="highlightColorForCard(card.id)"
              highlight-search
              side="back"
              class="cb-card-back col-start-1 row-start-1"
            />
          </div>
        </VueDraggable>

        <CbSearchNoResults v-else />
      </div>

      <CbPrintExportBar :class="dimWhileDraggingClasses" @open="isExportDialogOpen = true" />
    </div>

    <CbCardSetsPanel :class="dimWhileDraggingClasses" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'
import CbCursor from '../livecursors/CbCursor.vue'
import CbExportDialog from '../export/CbExportDialog.vue'
import CbCardSetsPanel from '../cardSets/CbCardSetsPanel.vue'
import CbSearchNoResults from '../search/CbSearchNoResults.vue'
import CbPrintExportBar from '../printExport/CbPrintExportBar.vue'
import { cardDragOptions } from '../cardDrag/cardDragOptions'
import {
  endCardDrag,
  isDraggingCard,
  releaseCardDrag,
  startCardDrag,
} from '../cardDrag/cardDragState'
import { dimWhileDraggingClasses } from '../cardDrag/dimWhileDragging'
import { deleteDroppedCard } from '../cardDrag/deleteDroppedCard'
import { flipAllCards, showingCardBacks } from '../cardDrag/flipAllCards'
import { readAnchorFromMouse, type CursorAnchor } from '../livecursors/cursorAnchor'
import { useLiveCursors } from '../livecursors/useLiveCursors'
import { showDangerToast } from '../components/atoms/toaster'
import { useHeader } from '../components/organisms/headerState'
import { projectName } from '../project/project'
import { cardFormat, cardFormatStyle, gridZoom } from '../card/cardFormat'
import { cardMatchesSearch } from '../search/cardMatchesSearch'
import { searchWord } from '../search/searchWord'
import type { CardElementValues } from '../cardElements/cardElements'

const isExportDialogOpen = ref(false)

useHeader(() => ({
  title: projectName.value,
  // Every entry of the header menus is still a placeholder.
  onAction: () =>
    showDangerToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText),
}))

// The id stays with a card forever — the number is only what the card is called.
// The starter cards use fixed ids so every window means the same card. Real
// shared card data comes later with live sync.
const cards = ref(
  [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
    id: `starter-card-${number}`,
    number,
    // What this card fills into the deck's elements. Placeholder for now.
    elementValues: (number === 3 ? { 'effect-text': 'Test' } : {}) as CardElementValues,
  })),
)
const selectedCardId = ref<string | null>(null)

// While searching, only the cards with a hit stand in the row. Reordering is off
// then: the drag library writes the new order of the shown cards back into
// "cards", which would shuffle the hidden ones.
const visibleCards = computed(() =>
  cards.value.filter((card) => cardMatchesSearch(card.elementValues)),
)
const isSearching = computed(() => searchWord.value.trim() !== '')

// Then the placeholder box takes the whole card area instead of the row.
const hasNoSearchResults = computed(() => isSearching.value && visibleCards.value.length === 0)

// The cards of the first render fan in one after the other, behind the button
// that stands in front of them. A card added later should show up right away,
// so it gets no delay — and since it is put in front, only its id tells the two
// apart, no longer its place in the row.
const initialCardIds = new Set(cards.value.map((card) => card.id))

function riseDelay(id: string, index: number) {
  return initialCardIds.has(id) ? { animationDelay: `${(index + 1) * 60}ms` } : undefined
}

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

function selectCard(id: string, event: MouseEvent) {
  if (isDraggingCard.value) return
  selectedCardRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  selectedCardId.value = id
}

// Letting go over a field of the drop bar is not a sort — the row stays as it
// was, and the field decides what happens to the card. Deleting brings its own
// animation along, which is why it gives the drag state back itself.
function finishCardDrag() {
  const { droppedOn, cardIndex, cardElement } = endCardDrag()
  if (droppedOn === 'deleteCard') return deleteDroppedCard(cards, cardIndex, cardElement)

  if (droppedOn === 'flipAllCards') flipAllCards()
  releaseCardDrag()
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

// A new card appears right where the button is, so it goes to the front of the
// row. Its number keeps counting up — it is a name, not the place in the row.
function addCard() {
  const highestNumber = Math.max(...cards.value.map((card) => card.number))
  cards.value.unshift({ id: crypto.randomUUID(), number: highestNumber + 1, elementValues: {} })
}
</script>
