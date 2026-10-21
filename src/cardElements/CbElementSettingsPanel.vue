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
      <template v-if="isPicture">
        <CbPictureAppearanceSettings :element-id="elementId" :card="card" />
        <CbDivider />
        <div class="flex flex-col gap-3">
          <CbSettingsHeading>{{ dictionary.cardEditor.cornersGroup }}</CbSettingsHeading>
          <CbCornerRadiusFields
            :radii="cornerRadii"
            @change="(radii) => changeElementCornerRadii(elementId, radii)"
          />
        </div>
      </template>
      <template v-else>
        <CbTextAppearanceSettings :element-id="elementId" />
        <CbDivider />
        <CbTextboxSettings :element-id="elementId" />
      </template>
      <CbDivider />
      <CbElementPositionSettings :element-id="elementId" />
    </div>
  </CbPanel>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbPanel from '../components/atoms/CbPanel.vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbCornerRadiusFields from '../components/molecules/CbCornerRadiusFields.vue'
import type { Card } from '../cardSets/cardSets'
import { clearElementSelection } from '../elementTransform/elementSelection'
import CbElementPositionSettings from './CbElementPositionSettings.vue'
import { findCardSetElement, maxElementNameLength, renameElement } from './cardElements'
import { changeElementCornerRadii, cornerRadiiOfElement } from './elementCornerRadii'
import CbPictureAppearanceSettings from './picture/CbPictureAppearanceSettings.vue'
import CbTextAppearanceSettings from './text/CbTextAppearanceSettings.vue'
import CbTextboxSettings from './text/CbTextboxSettings.vue'

// Je Element ein eigenes Panel (key im Editor) – so landet ein geänderter Name
// nie beim nächsten ausgewählten Element. card ist die Karte, die gerade im
// Editor offen ist.
const props = defineProps<{ elementId: string; card: Card }>()

const element = computed(() => findCardSetElement(props.elementId))

const isPicture = computed(() => element.value?.data.type === 'PICTURE')

// Nur für Screenreader, sichtbar ist der Name.
const title = computed(() =>
  isPicture.value ? dictionary.cardEditor.pictureSettings : dictionary.cardEditor.textSettings,
)

const cornerRadii = computed(() => cornerRadiiOfElement(props.elementId, element.value?.data.radius))

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
