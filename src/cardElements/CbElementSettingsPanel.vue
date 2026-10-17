<template>
  <!-- Rahmen für die Einstellungen jedes Elements: Zurück zur Karte und der
       Name des Elements, der sich hier umbenennen lässt. Die Abschnitte darunter
       (z.B. Position) bringt jeder Elementtyp selbst mit – in seiner
       Reihenfolge, mit Trennlinien dazwischen. -->
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
      <slot />
    </div>
  </CbPanel>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbPanel from '../components/atoms/CbPanel.vue'
import { clearElementSelection } from '../elementTransform/elementSelection'
import { findCardSetElement } from './cardElements'
import { maxElementNameLength, renameElement } from './renameElement'

// Je Element ein eigenes Panel (key im Editor) – so landet ein geänderter Name
// nie beim nächsten ausgewählten Element.
const props = defineProps<{
  elementId: string
  // Nur für Screenreader, sichtbar ist der Name.
  title: string
}>()

const name = ref(findCardSetElement(props.elementId)?.data.name ?? '')

// Gespeichert wird bei Enter bzw. beim Verlassen des Felds, nicht bei jedem
// Tastendruck.
function saveName() {
  name.value = renameElement(props.elementId, name.value)
}

// Escape oder eine andere Auswahl schließen das Panel, ohne dass das Feld seine
// Änderung meldet.
onBeforeUnmount(saveName)
</script>
