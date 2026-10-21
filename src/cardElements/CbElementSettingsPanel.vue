<template>
  <!-- Die Einstellungen eines Elements: Zurück zur Karte und der Name, der sich
       hier umbenennen lässt. Darunter die Abschnitte seines Typs in der
       Reihenfolge aus Figma, mit Trennlinien dazwischen. -->
  <CbPanel>
    <template #title>
      <h2 class="sr-only">{{ title }}</h2>
      <CbButton
        variant="icon"
        size="small"
        :aria-label="dictionary.cardEditor.backToCardSettings"
        @click="clearElementSelection"
      >
        <CbIcon name="west" />
      </CbButton>
      <CbInput
        v-model="name"
        variant="title"
        hide-label
        :label="dictionary.cardEditor.elementName"
        :max-length="maxElementNameLength"
        @change="saveName"
      />
    </template>
    <div class="mt-6 flex flex-col gap-6">
      <template v-if="type === 'PICTURE'">
        <CbPictureAppearanceSettings :element-id="elementId" :card="card" />
        <CbDivider />
        <CbElementCornerSettings :element-id="elementId" />
        <CbDivider />
      </template>
      <template v-else-if="type === 'TEXT'">
        <CbTextAppearanceSettings :element-id="elementId" />
        <CbDivider />
        <CbTextboxSettings :element-id="elementId" />
        <CbDivider />
      </template>
      <template v-else>
        <CbShapeAppearanceSettings :element-id="elementId" />
        <CbDivider />
        <template v-if="type === 'SQUARE'">
          <CbElementCornerSettings :element-id="elementId" />
          <CbDivider />
        </template>
      </template>
      <CbElementPositionSettings :element-id="elementId" />
    </div>
  </CbPanel>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { ElementType } from '../api/elements/elementsApi'
import CbButton from '../components/atoms/CbButton.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbPanel from '../components/atoms/CbPanel.vue'
import type { Card } from '../cardSets/cardSets'
import { clearElementSelection } from '../elementTransform/elementSelection'
import CbElementCornerSettings from './CbElementCornerSettings.vue'
import CbElementPositionSettings from './CbElementPositionSettings.vue'
import { findCardSetElement, maxElementNameLength, renameElement } from './cardElements'
import CbPictureAppearanceSettings from './picture/CbPictureAppearanceSettings.vue'
import CbShapeAppearanceSettings from './shape/CbShapeAppearanceSettings.vue'
import CbTextAppearanceSettings from './text/CbTextAppearanceSettings.vue'
import CbTextboxSettings from './text/CbTextboxSettings.vue'

// Je Element ein eigenes Panel (key im Editor) – so landet ein geänderter Name
// nie beim nächsten ausgewählten Element. card ist die Karte, die gerade im
// Editor offen ist.
const props = defineProps<{ elementId: string; card: Card }>()

const element = computed(() => findCardSetElement(props.elementId))

const type = computed(() => element.value?.data.type)

// Nur für Screenreader, sichtbar ist der Name.
const title = computed(() => {
  const titles: Partial<Record<ElementType, string>> = {
    TEXT: dictionary.cardEditor.textSettings,
    PICTURE: dictionary.cardEditor.pictureSettings,
    SQUARE: dictionary.cardEditor.squareSettings,
    CIRCLE: dictionary.cardEditor.circleSettings,
  }
  return type.value && titles[type.value]
})

const name = ref(element.value?.data.name ?? '')

// Gespeichert wird bei Enter bzw. beim Verlassen des Felds, nicht bei jedem
// Tastendruck.
function saveName() {
  name.value = renameElement(props.elementId, name.value)
}

// Escape oder eine andere Auswahl schließen das Panel, ohne dass das Feld seine
// Änderung meldet.
onBeforeUnmount(saveName)
</script>
