<template>
  <!-- While closing, clicks go through to the grid so the next card can be
       picked right away. -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    :class="{ 'pointer-events-none': isClosing }"
  >
    <!-- Own layer, so fading it does not fade the card as well. -->
    <CbDimLayer ref="backdrop" class="absolute inset-0" @click="startClosing" />

    <!-- Padding matches the settings panel, so the card sits in the middle of
         the space left of it instead of the middle of the screen.
         A press that misses an element drops the selection again. -->
    <div
      class="relative flex flex-col items-center gap-6 pr-88"
      @pointerdown="clearSelectionOnMiss"
    >
      <CbToolbar
        :elements="cardToolbarElements"
        class="transition-opacity"
        :class="fadeInClasses"
        @select="addElementFromToolbar"
        @press="startDragFromToolbar"
      />

      <!-- The ring is placed next to the flying wrapper, so it stays put while
           the card moves. -->
      <div class="relative">
        <CbCardOrnament class="transition-opacity" :class="fadeInClasses" />

        <div
          ref="cardWrapper"
          class="relative"
          @wheel="changePrintCountByWheel(card, $event)"
        >
          <CbCard
            :id="card.id"
            :elements="cardSet.elements"
            :element-values="card.elementValues"
            :zoom="editorZoom"
            mark-empty-elements
            editable-elements
            @change-element-value="changeElementValue"
          >
            <!-- The cursors of people standing on exactly this card. -->
            <slot />
          </CbCard>
          <!-- Shows while Alt + wheel changes the count. The corner follows the
               big card: 3 mm at the editor zoom is about 18 px, "rounded-2xl"
               is 16. It appears at once and fades out when it goes. -->
          <Transition
            leave-active-class="transition-opacity duration-300"
            leave-to-class="opacity-0"
          >
            <CbPrintCountOverlay
              v-if="card.id === printCountOverlayCardId"
              :count="card.printCount"
              class="absolute inset-0 rounded-2xl"
            />
          </Transition>
        </div>

        <!-- Next to the flying wrapper, not inside it: the wrapper is scaled
             while the card flies, which would squeeze the handles with it. -->
        <CbElementTransform :card="cardWrapper" />
      </div>

      <CbButton
        class="min-w-64 transition-opacity"
        :class="fadeInClasses"
        @click="startClosing"
      >
        {{ dictionary.general.save }}
      </CbButton>
    </div>

    <!-- Ist ein Feld ausgewählt, zeigt das Panel dessen Einstellungen statt der
         Karte. -->
    <div class="absolute top-8 right-8 bottom-8 w-80 transition-opacity" :class="fadeInClasses">
      <CbTextSettingsPanel v-if="selectedElementId" class="h-full" />
      <CbCardSettingsPanel v-else class="h-full" :is-visible="areControlsVisible" />
    </div>

    <!-- Nur Größe und Name zählen, die Lage gibt der Zeiger vor. -->
    <CbNewElementPreview
      v-if="dragPosition"
      :x="dragPosition.x"
      :y="dragPosition.y"
      :element="newTextElementData(0, 0)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import CbButton from '../atoms/CbButton.vue'
import CbCard from '../atoms/CbCard.vue'
import CbCardOrnament from '../atoms/CbCardOrnament.vue'
import CbDimLayer from '../atoms/CbDimLayer.vue'
import CbToolbar from '../molecules/CbToolbar.vue'
import { cardToolbarElements, cardTools } from '../molecules/cardToolbarElements'
import CbCardSettingsPanel from '../../cardSettings/CbCardSettingsPanel.vue'
import CbElementTransform from '../../elementTransform/CbElementTransform.vue'
import { cardFormat, editorZoom } from '../../card/cardFormat'
import { setElementValue } from '../../cardElements/cardElements'
import { createElement } from '../../cardElements/createElement'
import { deleteElementWithUndo } from '../../cardElements/deleteElementWithUndo'
import { newTextElementData } from '../../cardElements/text/newTextElementData'
import CbTextSettingsPanel from '../../cardElements/text/CbTextSettingsPanel.vue'
import { saveCardTextAfterPause, saveWaitingCardTexts } from '../../cardElements/text/saveCardText'
import CbNewElementPreview from '../../cardElements/newElementDrag/CbNewElementPreview.vue'
import { useNewElementDrag } from '../../cardElements/newElementDrag/useNewElementDrag'
import {
  clearElementSelection,
  clearSelectionOnMiss,
  isTypingInSelectedElement,
  selectedElementId,
  selectElement,
  stepBackElementSelection,
} from '../../elementTransform/elementSelection'
import CbPrintCountOverlay from '../../printCount/CbPrintCountOverlay.vue'
import { changePrintCountByWheel } from '../../printCount/changePrintCountByWheel'
import { printCountOverlayCardId } from '../../printCount/printCountOverlayState'
import type { Card, CardSet } from '../../cardSets/cardSets'

const props = defineProps<{
  card: Card
  // Das Set der Karte – ihm gehören die Elemente.
  cardSet: CardSet
  startRect: DOMRect
}>()

const emit = defineEmits<{ close: [] }>()

const flightDurationInMilliseconds = 350

const cardWrapper = useTemplateRef<HTMLElement>('cardWrapper')
const backdrop = useTemplateRef<InstanceType<typeof CbDimLayer>>('backdrop')

// Button, tool bar and settings panel only show up once the card has landed.
const areControlsVisible = ref(false)
// They fade in gently, but disappear at once so they do not disturb the
// card flying back to the grid.
const fadeInClasses = computed(() =>
  areControlsVisible.value
    ? 'opacity-100 duration-300'
    : 'pointer-events-none opacity-0 duration-0',
)

const isClosing = ref(false)

// Der Text gilt nur für diese Karte und geht nach einer Tipp-Pause ins Backend.
function changeElementValue(elementId: string, value: string) {
  setElementValue(props.card, elementId, value)
  saveCardTextAfterPause(props.card.id, elementId)
}

// Wer das Feld verlässt, wartet nicht auf die Pause. Nicht beim Verlust des
// Fokus: Ziehen an der Kante nimmt ihn, das Tippen geht aber weiter.
watch(isTypingInSelectedElement, (isTyping) => {
  if (!isTyping) saveWaitingCardTexts()
})

// Legt ein Textfeld mit der Mitte auf diesem Punkt der Karte (mm) an und wählt
// es gleich aus.
async function addTextElementAt(centerX: number, centerY: number) {
  const createdElement = await createElement(props.cardSet, newTextElementData(centerX, centerY))
  if (createdElement) selectElement(createdElement.id)
}

// Ein Klick auf „Text“ legt das Feld in der Kartenmitte an. Die anderen
// Einträge haben noch keine Funktion.
function addElementFromToolbar(index: number) {
  if (cardTools[index] === 'text') {
    addTextElementAt(cardFormat.value.width / 2, cardFormat.value.height / 2)
  }
}

// Ablegen legt das Feld dort an – die Feldmitte liegt unter dem Zeiger.
const { dragPosition, startDrag } = useNewElementDrag(cardWrapper, addTextElementAt)

// Ziehen geht bisher nur mit „Text“.
function startDragFromToolbar(index: number, event: PointerEvent) {
  if (cardTools[index] === 'text') startDrag(event)
}

// Keeps the closing flight, so an early unmount can drop its finish handler.
let closingFlight: Animation | null = null

// Fade the darkened, blurred layer in and out along with the card's flight.
function playBackdropFade(direction: 'in' | 'out') {
  const steps = [{ opacity: 0 }, { opacity: 1 }]

  backdrop.value?.$el.animate(direction === 'in' ? steps : [...steps].reverse(), {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Fly the card between its place in the grid and the center of the screen.
function playFlight(direction: 'in' | 'out') {
  const wrapper = cardWrapper.value
  if (!wrapper) return null

  const target = wrapper.getBoundingClientRect()
  const start = props.startRect
  const moveX = start.left + start.width / 2 - (target.left + target.width / 2)
  const moveY = start.top + start.height / 2 - (target.top + target.height / 2)
  const scaleX = start.width / target.width
  const scaleY = start.height / target.height

  const inGrid = { transform: `translate(${moveX}px, ${moveY}px) scale(${scaleX}, ${scaleY})` }
  const inCenter = { transform: 'translate(0px, 0px) scale(1, 1)' }

  return wrapper.animate(direction === 'in' ? [inGrid, inCenter] : [inCenter, inGrid], {
    duration: flightDurationInMilliseconds,
    easing: 'ease-out',
    fill: 'forwards',
  })
}

// Only tell the page to remove us once the card is back on its grid spot.
function startClosing() {
  if (isClosing.value) return
  isClosing.value = true
  areControlsVisible.value = false
  // The handles vanish at once, like the other controls, instead of flying
  // back to the grid along with the card.
  clearElementSelection()

  playBackdropFade('out')

  closingFlight = playFlight('out')
  if (!closingFlight) return emit('close')
  closingFlight.onfinish = () => emit('close')
}

// Escape nimmt erst die Auswahl schrittweise zurück, zuletzt schließt es den
// Editor.
function stepBackOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && !stepBackElementSelection()) startClosing()
}

// Entf/Rücktaste löscht das ausgewählte Feld – nicht beim Tippen und nicht, wenn
// ein Eingabefeld die Taste braucht.
function deleteSelectedElementOnKey(event: KeyboardEvent) {
  if (!['Delete', 'Backspace'].includes(event.key)) return
  const elementId = selectedElementId.value
  const isInInputField = (event.target as HTMLElement).closest('input, textarea, [contenteditable]')
  if (!elementId || isTypingInSelectedElement.value || isInInputField) return

  event.preventDefault()
  clearElementSelection()
  deleteElementWithUndo(props.cardSet, elementId)
}

onMounted(() => {
  // A click in the grid also runs through an element, so we start clean.
  clearElementSelection()

  playBackdropFade('in')

  const animation = playFlight('in')
  if (animation) animation.onfinish = () => (areControlsVisible.value = true)
  else areControlsVisible.value = true

  window.addEventListener('keydown', stepBackOnEscape)
  window.addEventListener('keydown', deleteSelectedElementOnKey)
})

onUnmounted(() => {
  // A card picked mid-close replaces us — that close must not fire any more.
  if (closingFlight) closingFlight.onfinish = null
  window.removeEventListener('keydown', stepBackOnEscape)
  window.removeEventListener('keydown', deleteSelectedElementOnKey)
})
</script>
