<template>
  <!-- Ein Feld für eine Zahl in mm: eintippen oder aus der Liste wählen, Optik
       wie CbSelect variant="field". Ark UI bringt nur das Verhalten. Eigene
       Werte sind erlaubt. Die Liste filtert nicht und geht erst per Pfeil oder
       Pfeiltaste auf, nicht schon beim Tippen. preserve: Ark fasst den Text nie
       selbst an, auch bei einer Auswahl setzt ihn selectItem. -->
  <Combobox.Root
    v-model:input-value="text"
    :collection="collection"
    :model-value="selectedValues"
    :allow-custom-value="true"
    :open-on-change="false"
    selection-behavior="preserve"
    :translations="{ triggerLabel: dictionary.general.showSuggestions }"
    @select="selectItem"
  >
    <Combobox.Control
      v-ripple
      class="cb-hover relative flex min-h-8 w-full items-center gap-1.5 overflow-hidden rounded-md bg-surface-light px-1.5 py-1 text-sm text-white"
    >
      <Combobox.Label class="text-label" :class="hideLabel && 'sr-only'">{{ label }}</Combobox.Label>
      <Combobox.Input
        class="min-w-0 grow cursor-text bg-transparent outline-none"
        @keydown.enter="applyText"
        @blur="applyText"
      />
      <Combobox.Trigger class="flex">
        <CbIcon name="keyboard_arrow_down" />
      </Combobox.Trigger>
    </Combobox.Control>

    <!-- In den body verschoben, damit nichts die Liste abschneidet. -->
    <Teleport to="body">
      <Combobox.Positioner>
        <Combobox.Content as-child>
          <CbPopupList>
            <Combobox.Item
              v-for="item in collection.items"
              :key="item.value"
              :item="item"
              as-child
            >
              <CbListItem>
                <Combobox.ItemText>{{ item.label }}</Combobox.ItemText>
              </CbListItem>
            </Combobox.Item>
          </CbPopupList>
        </Combobox.Content>
      </Combobox.Positioner>
    </Teleport>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Combobox, createListCollection } from '@ark-ui/vue'
import { formatMillimeters, parseMillimeters } from '../../card/millimeters'
import CbIcon from './CbIcon.vue'
import CbListItem from './CbListItem.vue'
import CbPopupList from './CbPopupList.vue'

// items und modelValue in mm. Angezeigt mit dem Dezimalzeichen der Sprache.
const props = defineProps<{
  items: number[]
  modelValue: number
  label: string
  /** Das Wort ist nur für Screenreader da, sichtbar steht allein der Wert. */
  hideLabel?: boolean
}>()

// Gemeldet wird nur ein gültiger, geänderter Wert.
const emit = defineEmits<{ 'update:modelValue': [millimeters: number] }>()

const collection = computed(() =>
  createListCollection({
    items: props.items.map((millimeters) => ({
      value: String(millimeters),
      label: formatMillimeters(millimeters),
    })),
  }),
)

// Steht der Wert in der Liste, ist er dort als gewählt markiert.
const selectedValues = computed(() =>
  props.items.includes(props.modelValue) ? [String(props.modelValue)] : [],
)

const storedText = computed(() => formatMillimeters(props.modelValue))
const text = ref(storedText.value)
watch(storedText, (stored) => (text.value = stored))

// Ark meldet die Auswahl, bevor es den Text ersetzen würde – deshalb setzt ihn
// diese Funktion selbst.
function selectItem({ itemValue }: { itemValue: string }) {
  text.value = formatMillimeters(Number(itemValue))
  applyText()
}

// Gilt bei Enter, beim Verlassen des Felds und bei einer Auswahl. Wie bei der
// Größe der Textbox: Unveränderter Text zählt nicht, Ungültiges oder ≤ 0 zeigt
// wieder den gespeicherten Wert. Zweimal hintereinander (Enter + Auswahl)
// schadet nicht, der Aufrufer bekommt höchstens denselben Wert noch einmal.
function applyText() {
  const typedText = text.value.trim()
  const value = parseMillimeters(typedText)
  if (typedText !== storedText.value && value !== undefined && value > 0) {
    emit('update:modelValue', value)
  }
  text.value = storedText.value
}
</script>
