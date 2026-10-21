<template>
  <CbExportDialog v-model:open="isExportDialogOpen" :cards="exportCards" />

  <CbCardEditor
    v-if="selectedCard && selectedCardSet && selectedCardRect"
    :key="selectedCard.id"
    :card="selectedCard"
    :card-set="selectedCardSet"
    :start-rect="selectedCardRect"
    @close="selectedCardId = null"
  />

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
            v-bind="dragOptions"
            draggable=".cb-card"
            :disabled="isSearching"
            class="cb-card-set-section flex flex-wrap content-start justify-center gap-6 py-32 select-none tablet:px-16"
            @start="startDrag('card', $event)"
            @end="finishCardDrag(cardSet, $event)"
          >
            <!-- The button stands in front of the row. It is not a ".cb-card", so the
                 drag library skips it: a card is only ever put before or after another
                 card, which keeps the button the first thing in the row. While
                 searching it steps aside — the row then shows hits only. -->
            <CbAddTile
              v-if="!isSearching"
              icon="add_2"
              :label="dictionary.project.newCard"
              class="cb-card-face"
              :class="[
                risenCardIds.has(addCardId(cardSet)) ? '' : 'animate-cb-rise',
                dimWhileDraggingClasses,
              ]"
              :style="{ ...cardFormatStyle(cardFormat), zoom: gridZoom }"
              @animationend="markRisen(addCardId(cardSet), $event)"
              @click="createCard(cardSet)"
            />

            <!-- The box the drag library picks up. It must be plain page pixels: the
                 library writes the position of the dragged copy into "transform", and
                 the "zoom" that draws the card would shrink that movement, so the card
                 would fall behind the cursor. The zoom sits on the card inside.
                 Front and back share the one grid cell of the box, so they lie on top
                 of each other; the flip turns the two faces (see style.css). -->
            <div
              v-for="(card, cardIndex) in visibleCardsOf(cardSet)"
              :key="card.id"
              class="cb-card group grid"
              :style="riseDelay(card.id, cardIndex)"
              :class="[
                risenCardIds.has(card.id) ? '' : 'animate-cb-rise',
                { invisible: card.id === selectedCardId, 'cb-card-flipped': showingCardBacks },
              ]"
              @animationend="markRisen(card.id, $event)"
              @transitionend="cardTurnEnded"
              @click="selectCard(card.id, $event)"
              @wheel="changePrintCountByWheel(card, $event)"
            >
              <!-- Behind the faces, so it comes first. Vanishes and fades back in
                   with the turn just like the badge below. "visible" lifts the
                   box's "invisible" while its card is in the editor: the
                   backdrops fade out and in instead of vanishing at once.
                   The tooltip opens from the strip that peeks out under the
                   card — the faces cover the rest. -->
              <CbTooltip
                v-if="card.printCount >= 2"
                :text="dictionary.project.printCountTooltip(card.printCount)"
              >
                <CbCardBackdrops
                  :count="card.printCount"
                  class="visible col-start-1 row-start-1 transition-opacity"
                  :class="[
                    isTurningCards ? 'duration-0' : 'duration-300',
                    isTurningCards || card.id === selectedCardId ? 'opacity-0' : 'opacity-100',
                  ]"
                />
              </CbTooltip>
              <CbCard
                :id="card.id"
                :elements="cardSet.elements"
                :element-values="card.elementValues"
                :element-image-ids="card.elementImageIds"
                highlight-search
                class="cb-card-front col-start-1 row-start-1"
              />
              <CbCard
                :id="card.id"
                :elements="cardSet.elements"
                :element-values="card.elementValues"
                :element-image-ids="card.elementImageIds"
                highlight-search
                side="back"
                class="cb-card-back col-start-1 row-start-1"
              />
              <!-- How often the card is printed — only worth showing from 2 up.
                   It does not turn with the card: front and back show it in the
                   same place; it vanishes at once while the turn runs and fades
                   back in after. It lies in page pixels, not card zoom. "relative"
                   keeps it above the faces: their transform would otherwise
                   paint them over it. While the mouse is on the card (the
                   "group" box) it fades out, so it never hides the corner. -->
              <CbPrintCountBadge
                v-if="card.printCount >= 2"
                :count="card.printCount"
                class="relative col-start-1 row-start-1 m-2 self-end justify-self-end transition-opacity group-hover:opacity-0"
                :class="isTurningCards ? 'opacity-0 duration-0' : 'opacity-100 duration-300'"
              />
              <!-- Shows while Alt + wheel changes the count. Last in the cell,
                   so it lies over faces and badge. The corner follows the card:
                   3 mm at the grid zoom is about 9 px, "rounded-lg" is 8.
                   It appears at once and fades out when it goes. -->
              <Transition
                leave-active-class="transition-opacity duration-300"
                leave-to-class="opacity-0"
              >
                <CbPrintCountOverlay
                  v-if="card.id === printCountOverlayCardId"
                  :count="card.printCount"
                  class="relative col-start-1 row-start-1 rounded-lg"
                />
              </Transition>
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
      v-if="loadedCardSets.length > 1"
      class="col-start-1 row-start-1"
      :class="dimWhileDraggingClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import CbCard from '../components/atoms/CbCard.vue'
import CbCardBackdrops from '../components/atoms/CbCardBackdrops.vue'
import CbAddTile from '../components/atoms/CbAddTile.vue'
import CbPrintCountBadge from '../components/atoms/CbPrintCountBadge.vue'
import CbTooltip from '../components/atoms/CbTooltip.vue'
import CbCardEditor from '../components/organisms/CbCardEditor.vue'
import CbExportDialog from '../export/CbExportDialog.vue'
import CbCardSetsPanel from '../cardSets/CbCardSetsPanel.vue'
import { cardSetIdToShow, cardSets, type CardSet } from '../cardSets/cardSets'
import { createCard } from '../cardSets/createCard'
import { flashCardSetsPanel } from '../cardSets/panelVisibility'
import { cardSetElementId, scrollToCardSetSection } from '../cardSets/scrollToCardSetSection'
import { updateVisibleCardSet } from '../cardSets/visibleCardSet'
import CbSearchNoResults from '../search/CbSearchNoResults.vue'
import CbPrintExportBar from '../printExport/CbPrintExportBar.vue'
import CbPrintCountOverlay from '../printCount/CbPrintCountOverlay.vue'
import { changePrintCountByWheel } from '../printCount/changePrintCountByWheel'
import { printCountOverlayCardId } from '../printCount/printCountOverlayState'
import { dragOptions } from '../dragAndDrop/dragOptions'
import { endDrag, isDragging, releaseDrag, startDrag } from '../dragAndDrop/dragState'
import { dimWhileDraggingClasses } from '../dragAndDrop/dimWhileDragging'
import { deleteDroppedItem } from '../dragAndDrop/deleteDroppedItem'
import { deleteCard } from '../cardSets/deleteCard'
import {
  cardTurnEnded,
  flipAllCards,
  isTurningCards,
  showingCardBacks,
} from '../cardDrag/flipAllCards'
import { showDangerToast } from '../components/atoms/toaster'
import { useHeader } from '../components/organisms/headerState'
import { currentProject } from '../project/currentProject'
import { cardFormat, cardFormatStyle, gridZoom } from '../card/cardFormat'
import { cardMatchesSearch } from '../search/cardMatchesSearch'
import { searchWord } from '../search/searchWord'

const isExportDialogOpen = ref(false)

useHeader(() => ({
  title: currentProject.value?.name,
  subtitle: dictionary.header.cards,
  // Every entry of the header menus is still a placeholder.
  onAction: () =>
    showDangerToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText),
}))

// Solange die Sets laden, zeigt die Seite einfach keine.
const loadedCardSets = computed(() => cardSets.value ?? [])

// The cards of every set in one row — for the editor.
const allCards = computed(() => loadedCardSets.value.flatMap((cardSet) => cardSet.cards))
// Für den Export: jede Karte mit den Elementen ihres Sets.
const exportCards = computed(() =>
  loadedCardSets.value.flatMap((cardSet) =>
    cardSet.cards.map((card) => ({ ...card, elements: cardSet.elements })),
  ),
)
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
    ? loadedCardSets.value.filter((cardSet) => visibleCardsOf(cardSet).length > 0)
    : loadedCardSets.value,
)

// Then the placeholder box takes the whole card area instead of the sections.
const hasNoSearchResults = computed(() => isSearching.value && shownCardSets.value.length === 0)

// The cards of the first render fan in one after the other, behind the button
// that stands in front of them. A card added later should show up right away,
// so it gets no delay — and since it is put in front, only its id tells the two
// apart, no longer its place in the row.
// Meist kommen die Karten erst nach dem Einhängen der Seite – dann zählen die,
// mit denen die Sets geladen werden.
const initialCardIds = new Set<string>()
watch(
  () => cardSets.value !== null,
  (isLoaded) => {
    if (isLoaded) allCards.value.forEach((card) => initialCardIds.add(card.id))
  },
  { immediate: true },
)

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
// Das Set der gewählten Karte – ihm gehören die Elemente, die der Editor anlegt.
const selectedCardSet = computed(() =>
  loadedCardSets.value.find((cardSet) =>
    cardSet.cards.some((card) => card.id === selectedCardId.value),
  ),
)

// Where the clicked card sits in the grid — the editor starts its flight there.
const selectedCardRect = ref<DOMRect | null>(null)

function selectCard(id: string, event: MouseEvent) {
  if (isDragging.value) return
  selectedCardRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  selectedCardId.value = id
}

// Letting go over a field of the drop bar is not a sort — the row stays as it
// was, and the field decides what happens to the card. Deleting brings its own
// animation along, which is why it gives the drag state back itself.
function finishCardDrag(cardSet: CardSet, event: { newDraggableIndex?: number }) {
  const { droppedOn, index, element } = endDrag(event)
  if (droppedOn === 'deleteCard') {
    return deleteDroppedItem(cardSet.cards, index, element, dictionary.dropBar.cardDeleted, (card) =>
      deleteCard(cardSet, card),
    )
  }

  if (droppedOn === 'flipAllCards') flipAllCards()
  releaseDrag()
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
  pageArea.value?.addEventListener('scroll', updateVisibleCardSetFromScroll)
  updateVisibleCardSetFromScroll()
})
// Die Sets kommen oft erst nach dem Einhängen der Seite – dann, sobald ihre
// Abschnitte auf der Seite stehen.
watch(cardSets, updateVisibleCardSetFromScroll, { flush: 'post' })
onUnmounted(() => {
  pageArea.value?.removeEventListener('scroll', updateVisibleCardSetFromScroll)
})
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
