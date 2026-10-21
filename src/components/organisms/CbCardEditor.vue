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

        <!-- Beim Zuschneiden zoomt das Mausrad das Bild statt der Anzahl. -->
        <div
          ref="cardWrapper"
          class="relative"
          @wheel="!croppedPictureId && changePrintCountByWheel(card, $event)"
        >
          <CbCard
            :id="card.id"
            :elements="cardSet.elements"
            :element-values="card.elementValues"
            :element-image-ids="card.elementImageIds"
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
             while the card flies, which would squeeze the handles with it.
             Beim Zuschneiden bleibt der Rahmen fest, nur das Bild hat Anfasser. -->
        <CbPictureCropTransform
          v-if="croppedPictureId"
          :card="card"
          :card-node="cardWrapper"
          :element-id="croppedPictureId"
        />
        <CbElementTransform v-else :card="cardWrapper" />
      </div>

      <CbButton
        class="min-w-64 transition-opacity"
        :class="fadeInClasses"
        @click="startClosing"
      >
        {{ dictionary.general.save }}
      </CbButton>
    </div>

    <!-- Ist ein Element ausgewählt, zeigt das Panel statt der Karte dessen
         Einstellungen – jeder Elementtyp hat sein eigenes. -->
    <div class="absolute top-8 right-8 bottom-8 w-80 transition-opacity" :class="fadeInClasses">
      <CbPictureSettingsPanel
        v-if="selectedElement?.data.type === 'PICTURE'"
        :key="selectedElement.id"
        :element-id="selectedElement.id"
        :card="card"
        class="h-full"
      />
      <CbTextSettingsPanel
        v-else-if="selectedElement"
        :key="selectedElement.id"
        :element-id="selectedElement.id"
        class="h-full"
      />
      <CbCardSettingsPanel v-else class="h-full" :is-visible="areControlsVisible" />
    </div>

    <!-- Nur Größe und Name zählen, die Lage gibt der Zeiger vor. -->
    <CbNewElementPreview
      v-if="dragPosition && draggedElementData"
      :x="dragPosition.x"
      :y="dragPosition.y"
      :element="draggedElementData"
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
import { cardToolbarElements, cardTools, type CardTool } from '../molecules/cardToolbarElements'
import type { ElementData } from '../../api/elements/elementsApi'
import CbCardSettingsPanel from '../../cardSettings/CbCardSettingsPanel.vue'
import CbElementTransform from '../../elementTransform/CbElementTransform.vue'
import { cardFormat, editorZoom } from '../../card/cardFormat'
import { setElementValue } from '../../cardElements/cardElements'
import { createElement } from '../../cardElements/createElement'
import { deleteElement } from '../../cardElements/deleteElement'
import { deleteWithUndo } from '../../deletion/deleteWithUndo'
import { undoDeletionOnKey } from '../../deletion/undoDeletionOnKey'
import { isInInputField } from '../../keyboard/isInInputField'
import { newTextElementData } from '../../cardElements/text/newTextElementData'
import { setTextSizing } from '../../cardElements/text/textSizing'
import CbTextSettingsPanel from '../../cardElements/text/CbTextSettingsPanel.vue'
import { saveCardTextAfterPause, saveWaitingCardTexts } from '../../cardElements/text/saveCardText'
import { newPictureElementData } from '../../cardElements/picture/newPictureElementData'
import CbPictureSettingsPanel from '../../cardElements/picture/CbPictureSettingsPanel.vue'
import CbPictureCropTransform from '../../cardElements/picture/CbPictureCropTransform.vue'
import CbNewElementPreview from '../../cardElements/newElementDrag/CbNewElementPreview.vue'
import { useNewElementDrag } from '../../cardElements/newElementDrag/useNewElementDrag'
import {
  clearElementSelection,
  clearSelectionOnMiss,
  isEditingSelectedElement,
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

// Das ausgewählte Element dieses Sets.
const selectedElement = computed(() =>
  props.cardSet.elements.find((element) => element.id === selectedElementId.value),
)

// Das Bild-Element, das gerade zugeschnitten wird (2. Stufe beim Bild), sonst null.
const croppedPictureId = computed(() =>
  isEditingSelectedElement.value && selectedElement.value?.data.type === 'PICTURE'
    ? selectedElement.value.id
    : null,
)

// Der Text gilt nur für diese Karte und geht nach einer Tipp-Pause ins Backend.
function changeElementValue(elementId: string, value: string) {
  setElementValue(props.card, elementId, value)
  saveCardTextAfterPause(props.card.id, elementId)
}

// Wer das Feld verlässt, wartet nicht auf die Pause. Nicht beim Verlust des
// Fokus: Ziehen an der Kante nimmt ihn, das Tippen geht aber weiter.
watch(isEditingSelectedElement, (isEditing) => {
  if (!isEditing) saveWaitingCardTexts()
})

// Was die Toolbar schon anlegen kann: je Werkzeug die Daten eines neuen
// Elements mit der Mitte auf einem Punkt der Karte (mm). Die anderen Einträge
// haben noch keine Funktion.
const newElementDataByTool: Partial<
  Record<CardTool, (centerX: number, centerY: number) => ElementData>
> = {
  text: newTextElementData,
  image: newPictureElementData,
}

// Legt das Element des Werkzeugs mit der Mitte auf diesem Punkt der Karte (mm)
// an und wählt es gleich aus. Ein Textfeld wächst mit seinem Text nach unten.
async function addElementAt(tool: CardTool, centerX: number, centerY: number) {
  const newElementData = newElementDataByTool[tool]
  if (!newElementData) return
  const createdElement = await createElement(props.cardSet, newElementData(centerX, centerY))
  if (!createdElement) return
  if (tool === 'text') setTextSizing(createdElement.id, 'autoHeight')
  selectElement(createdElement.id)
}

// Ein Klick auf ein Werkzeug legt sein Element in der Kartenmitte an.
function addElementFromToolbar(index: number) {
  addElementAt(cardTools[index], cardFormat.value.width / 2, cardFormat.value.height / 2)
}

// Das Werkzeug, das gerade aus der Toolbar gezogen wird.
const draggedTool = ref<CardTool | null>(null)
const draggedElementData = computed(
  () => draggedTool.value && newElementDataByTool[draggedTool.value]?.(0, 0),
)

// Ablegen legt das Element dort an – seine Mitte liegt unter dem Zeiger.
const { dragPosition, startDrag } = useNewElementDrag(cardWrapper, (centerX, centerY) => {
  if (draggedTool.value) addElementAt(draggedTool.value, centerX, centerY)
})

function startDragFromToolbar(index: number, event: PointerEvent) {
  const tool = cardTools[index]
  if (!newElementDataByTool[tool]) return
  draggedTool.value = tool
  startDrag(event)
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
// Editor. Hat schon ein Dialog oder eine Liste von Ark das Escape genommen
// (defaultPrevented), war das die Stufe – sonst ginge es zwei zurück.
function stepBackOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented) return
  if (!stepBackElementSelection()) startClosing()
}

// Entf/Rücktaste löscht das ausgewählte Element – nicht beim Bearbeiten und nicht,
// wenn ein Eingabefeld die Taste braucht. Es verschwindet aus dem Set und damit
// von allen Karten, „Rückgängig“ setzt es an seine alte Stelle in der
// Stapelreihenfolge. Der Toast nennt, was gelöscht wurde.
function deleteSelectedElementOnKey(event: KeyboardEvent) {
  if (!['Delete', 'Backspace'].includes(event.key)) return
  const elementToDelete = selectedElement.value
  if (!elementToDelete || isEditingSelectedElement.value || isInInputField(event)) return

  event.preventDefault()
  clearElementSelection()
  const { cardSet } = props
  const deletedMessage =
    elementToDelete.data.type === 'PICTURE'
      ? dictionary.cardEditor.pictureElementDeleted
      : dictionary.cardEditor.textElementDeleted
  deleteWithUndo(cardSet.elements, elementToDelete, deletedMessage, (element) =>
    deleteElement(cardSet, element),
  )
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
  window.addEventListener('keydown', undoDeletionOnKey)
})

onUnmounted(() => {
  // A card picked mid-close replaces us — that close must not fire any more.
  if (closingFlight) closingFlight.onfinish = null
  window.removeEventListener('keydown', stepBackOnEscape)
  window.removeEventListener('keydown', deleteSelectedElementOnKey)
  window.removeEventListener('keydown', undoDeletionOnKey)
})
</script>
