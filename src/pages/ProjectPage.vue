<template>
  <CbExportDialog v-model:open="isExportDialogOpen" :cards="allCards" />

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

  <!-- The card area and the card sets panel share the one grid cell, so the
       panel floats over the cards at the right edge instead of taking space.
       Sideways overflow is clipped, so the panel sliding out past the right
       edge never brings a horizontal scrollbar. -->
  <div ref="pageContent" class="grid min-h-full grid-cols-1 grid-rows-1 overflow-x-clip">
    <!-- The cards take at most 80% of the page and stand centred. The print
         bar stands under the cards, so it ends up at the bottom edge of a
         short page and stays there while a long page scrolls. -->
    <div class="col-start-1 row-start-1 mx-auto flex w-full max-w-4/5 min-w-0 flex-col">
      <div class="flex flex-1">
        <!-- Every set is a section of its own, a thin line divides them. A card
             can only be sorted within its set: the sections share no drag group.
             The rows pack at the top, so the minimum height does not stretch
             the cards. While searching, a set without a hit is left out, and
             with it its line. -->
        <div
          v-if="!hasNoSearchResults"
          class="flex min-w-0 flex-1 flex-col divide-y divide-surface-light"
        >
          <VueDraggable
            v-for="cardSet in shownCardSets"
            :id="cardSetElementId(cardSet.id)"
            :key="cardSet.id"
            v-model="cardSet.cards"
            v-bind="cardDragOptions"
            :disabled="isSearching"
            class="cb-card-set-section flex flex-wrap content-start justify-center gap-6 px-16 py-32 select-none"
            @start="startCardDrag"
            @end="finishCardDrag(cardSet)"
          >
            <!-- The button stands in front of the row. It is not a ".cb-card", so the
                 drag library skips it: a card is only ever put before or after another
                 card, which keeps the button the first thing in the row. While
                 searching it steps aside — the row then shows hits only. -->
            <CbInteractive
              v-if="!isSearching"
              class="cb-card-face flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold text-gold"
              :class="[
                risenCardIds.has(addCardId(cardSet)) ? '' : 'animate-cb-rise',
                dimWhileDraggingClasses,
              ]"
              :style="{ ...cardFormatStyle(cardFormat), zoom: gridZoom }"
              @animationend="markRisen(addCardId(cardSet), $event)"
              @click="addCard(cardSet)"
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
              v-for="(card, cardIndex) in visibleCardsOf(cardSet)"
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
              <!-- How often the card is printed — only worth showing from 2 up.
                   "relative" keeps it above the faces: their transform would
                   otherwise paint them over plain text. -->
              <span
                v-if="card.printCount >= 2"
                class="relative col-start-1 row-start-1 m-2 self-end justify-self-end text-xs text-background"
              >
                x{{ card.printCount }}
              </span>
            </div>
          </VueDraggable>
        </div>

        <CbSearchNoResults v-else />
      </div>

      <CbPrintExportBar :class="dimWhileDraggingClasses" @open="isExportDialogOpen = true" />
    </div>

    <!-- With a single set there is nothing to jump between, so neither the
         panel nor its edge strip exists. -->
    <CbCardSetsPanel
      v-if="cardSets.length > 1"
      class="col-start-1 row-start-1"
      :class="dimWhileDraggingClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'
import CbCursor from '../livecursors/CbCursor.vue'
import CbExportDialog from '../export/CbExportDialog.vue'
import CbCardSetsPanel from '../cardSets/CbCardSetsPanel.vue'
import { cardSetIdToShow, cardSets, type CardSet } from '../cardSets/cardSets'
import { flashCardSetsPanel } from '../cardSets/panelVisibility'
import { cardSetElementId, scrollToCardSetSection } from '../cardSets/scrollToCardSetSection'
import { updateVisibleCardSet } from '../cardSets/visibleCardSet'
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

const isExportDialogOpen = ref(false)

useHeader(() => ({
  title: projectName.value,
  // Every entry of the header menus is still a placeholder.
  onAction: () =>
    showDangerToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText),
}))

// The cards of every set in one row — for the editor and the export.
const allCards = computed(() => cardSets.value.flatMap((cardSet) => cardSet.cards))
const selectedCardId = ref<string | null>(null)

// While searching, only the cards with a hit stand in the row. Reordering is off
// then: the drag library writes the new order of the shown cards back into the
// set, which would shuffle the hidden ones.
function visibleCardsOf(cardSet: CardSet) {
  return cardSet.cards.filter((card) => cardMatchesSearch(card.elementValues))
}
const isSearching = computed(() => searchWord.value.trim() !== '')

// While searching, only the sets with at least one hit get a section.
const shownCardSets = computed(() =>
  isSearching.value
    ? cardSets.value.filter((cardSet) => visibleCardsOf(cardSet).length > 0)
    : cardSets.value,
)

// Then the placeholder box takes the whole card area instead of the sections.
const hasNoSearchResults = computed(() => isSearching.value && shownCardSets.value.length === 0)

// The cards of the first render fan in one after the other, behind the button
// that stands in front of them. A card added later should show up right away,
// so it gets no delay — and since it is put in front, only its id tells the two
// apart, no longer its place in the row.
const initialCardIds = new Set(allCards.value.map((card) => card.id))

function riseDelay(id: string, index: number) {
  return initialCardIds.has(id) ? { animationDelay: `${(index + 1) * 60}ms` } : undefined
}

// Every set has its own button, so each one remembers its rise on its own.
function addCardId(cardSet: CardSet) {
  return `add-card-button-${cardSet.id}`
}

// The header asks for a set to be shown — right away when the page is already
// open, or as soon as it has been mounted. The page waits one tick so the
// section of a brand-new set is in the DOM before it scrolls there. The sets
// panel comes along, so the mark can be seen moving to the set.
watch(
  cardSetIdToShow,
  async (cardSetId) => {
    if (!cardSetId) return
    await nextTick()
    flashCardSetsPanel()
    scrollToCardSetSection(cardSetId)
    cardSetIdToShow.value = null
  },
  { immediate: true },
)

// Dropping a card on the spot it came from makes the drag library put every
// element of the row back into the page one by one, which would start the
// entrance animation all over again. So each element wears the animation only
// until it has played once.
const risenCardIds = ref(new Set<string>())

function markRisen(id: string, event: AnimationEvent) {
  if (event.animationName === 'cb-rise') risenCardIds.value.add(id)
}
const selectedCard = computed(() =>
  allCards.value.find((card) => card.id === selectedCardId.value),
)

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
function finishCardDrag(cardSet: CardSet) {
  const { droppedOn, cardIndex, cardElement } = endCardDrag()
  if (droppedOn === 'deleteCard') {
    return deleteDroppedCard(toRef(cardSet, 'cards'), cardIndex, cardElement)
  }

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

// The page area (the page wrapper in App.vue) scrolls, not the page itself.
// Which set is in view is read off it on every scroll, so the sets panel can
// mark it.
const pageContent = ref<HTMLElement | null>(null)
const pageArea = computed(() => pageContent.value?.closest<HTMLElement>('.cb-page-area') ?? null)

function updateVisibleCardSetFromScroll() {
  if (pageArea.value) updateVisibleCardSet(pageArea.value)
}

onMounted(() => {
  window.addEventListener('mousemove', updateMyAnchor)
  pageArea.value?.addEventListener('scroll', updateVisibleCardSetFromScroll)
  updateVisibleCardSetFromScroll()
})
onUnmounted(() => {
  window.removeEventListener('mousemove', updateMyAnchor)
  pageArea.value?.removeEventListener('scroll', updateVisibleCardSetFromScroll)
})

// A new card appears right where the button is, so it goes to the front of its
// set. Its number keeps counting up within the set — it is a name, not the
// place in the row.
function addCard(cardSet: CardSet) {
  const highestNumber = Math.max(0, ...cardSet.cards.map((card) => card.number))
  cardSet.cards.unshift({
    id: crypto.randomUUID(),
    number: highestNumber + 1,
    elementValues: {},
    printCount: 1,
  })
}
</script>

<style scoped>
/* A section is at least as tall as the page area — the screen minus the 100px
   header (see CbHeader) — so a set scrolled to the top stands alone on the
   screen. A percentage cannot do this: nothing above the section has a fixed
   height, the page only has a minimum. */
.cb-card-set-section {
  min-height: calc(100vh - 100px);
}
</style>
