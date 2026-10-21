<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       An entry can carry its own icon, e.g. a flag or a moon. Mit variant
       „pictures“ tragen die Einträge Bilder: Das geschlossene Feld zeigt groß das
       Bild des gewählten, offen stehen die Einträge als Kacheln im Raster. -->
  <!-- Ark nimmt null als „nichts hervorgehoben“, sein Typ nennt nur string.
       Mit Suchfeld ist der Inhalt ein Dialog und die Liste darin die Listbox
       (composite aus) – ein Eingabefeld darf nicht in einer Listbox stehen. -->
  <Select.Root
    :open="open"
    :highlighted-value="highlightedValue as string"
    :collection="collection"
    :model-value="selectedValues"
    :positioning="{ sameWidth: true }"
    :scroll-to-index-fn="scrollToItem"
    :composite="!searchLabel"
    :ids="ids"
    @update:open="changeOpen"
    @update:highlighted-value="(value) => (highlightedValue = value)"
    @update:model-value="select"
    @interact-outside="$emit('interactOutside', $event)"
  >
    <Select.Control>
      <Select.Trigger
        v-ripple
        class="cb-hover relative flex items-center overflow-hidden bg-surface-light text-sm text-white"
        :class="triggerClasses[variant]"
      >
        <CbThumbnail
          v-if="variant === 'pictures'"
          :picture="shownItem?.picture"
          class="h-13 w-18.25 shrink-0"
        />
        <CbIcon v-else-if="shownItem?.icon" :name="shownItem.icon" />
        <!-- The field variant names the value with a grey word in front of it. -->
        <Select.Label v-if="label" as-child>
          <span class="text-label" :class="hideLabel && 'sr-only'">{{ label }}</span>
        </Select.Label>
        <!-- Im großen Feld höchstens zwei Zeilen, ein längerer Name endet mit „…“. -->
        <span
          class="min-w-0 grow text-left wrap-break-word"
          :class="[!shownItem && 'text-label', variant === 'pictures' && 'line-clamp-2']"
        >
          {{ shownItem?.label ?? placeholder }}
        </span>
        <CbIcon name="keyboard_arrow_down" />
      </Select.Trigger>
    </Select.Control>

    <!-- The list is moved to the body, so a parent that clips its content
         (a row with a ripple) cannot cut the open list off. -->
    <Teleport to="body">
      <Select.Positioner>
        <!-- sameWidth on the root makes the list as wide as the closed field. -->
        <Select.Content as-child>
          <CbPopupList>
            <!-- Das Suchfeld bekommt beim Öffnen den Fokus, die Pfeiltasten wandern
                 trotzdem durch die Liste. Leertaste, Pos1 und Ende gehören dem
                 Text – Ark würde damit wählen bzw. springen. -->
            <label
              v-if="searchLabel"
              class="mb-1 flex items-center gap-1.5 rounded-md bg-surface px-1.5 py-1 text-label"
            >
              <CbIcon name="search" />
              <input
                v-model="search"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                :aria-controls="listId"
                :aria-activedescendant="highlightedValue === null ? undefined : itemId(highlightedValue)"
                :aria-label="searchLabel"
                :placeholder="searchLabel"
                class="min-w-0 grow cursor-text bg-transparent text-white outline-none placeholder:text-label"
                @keydown.space.stop
                @keydown.home.stop
                @keydown.end.stop
              />
            </label>
            <!-- Kopf über der Liste, z.B. ein Umschalter. Enter und Leertaste
                 gehören seinen Knöpfen – Ark würde damit einen Eintrag wählen. -->
            <div v-if="$slots.header" class="mb-1 flex" @keydown.enter.stop @keydown.space.stop>
              <slot name="header" />
            </div>
            <!-- Lange Listen rollen in diesem Kasten (relative: Die Einträge messen
                 ihre Lage darin). Im Raster nimmt ein Eintrag ohne Bild (z.B.
                 „zurück“) eine ganze Zeile ein, eine Bildkachel zeigt nur ihr
                 Bild (den Namen hört der Screenreader). Beim Suchen stehen die
                 Treffer als Zeilen mit kleinem Bild und Namen untereinander. -->
            <component
              :is="searchLabel ? Select.List : 'div'"
              :id="listId"
              class="relative max-h-80 overflow-y-auto"
              :class="variant === 'pictures' && !isSearching ? 'grid grid-cols-3 gap-1' : 'flex flex-col'"
            >
              <Select.Item
                v-for="item in items"
                :key="item.value"
                :item="item"
                :aria-label="item.ariaLabel ?? item.label"
                as-child
              >
                <CbListItem
                  :icon="item.icon"
                  :picture="item.picture"
                  :folder="item.isFolder"
                  :picture-only="!item.isFolder"
                  :row="isSearching"
                  :class="!item.picture && !item.isFolder && 'col-span-full'"
                >
                  <Select.ItemText>
                    <CbHighlightedText :text="item.label" :search-word="search" />
                  </Select.ItemText>
                </CbListItem>
              </Select.Item>
            </component>
            <p v-if="isSearching && !items.length" class="px-2 py-1.5 text-label">{{ noResultsText }}</p>
          </CbPopupList>
        </Select.Content>
      </Select.Positioner>
    </Teleport>
  </Select.Root>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Select, createListCollection, type SelectInteractOutsideEvent } from '@ark-ui/vue'
import CbHighlightedText from './CbHighlightedText.vue'
import CbIcon from './CbIcon.vue'
import CbListItem from './CbListItem.vue'
import CbPopupList from './CbPopupList.vue'
import CbThumbnail from './CbThumbnail.vue'
import type { IconName } from './icons'

type Item = {
  value: string
  label: string
  icon?: IconName
  /** Adresse eines Bildes – der Eintrag wird damit zur Kachel. */
  picture?: string
  /** Als Ordner gezeigt (picture = Bild darin), ebenfalls als Kachel. */
  isFolder?: boolean
  /** Nach der Wahl bleibt die Liste offen, z.B. um einen Ordner zu öffnen. */
  keepsListOpen?: boolean
  /** Hört der Screenreader statt label. */
  ariaLabel?: string
}

const props = withDefaults(
  defineProps<{
    items: Item[]
    modelValue?: string
    // 'field' looks like the dark input boxes in the card settings panel.
    variant?: 'default' | 'field' | 'pictures'
    label?: string
    /** Das Wort ist nur für Screenreader da, sichtbar steht allein der Wert. */
    hideLabel?: boolean
    /** Steht da, solange nichts gewählt ist. */
    placeholder?: string
    /** Der gewählte Eintrag, wenn er nicht in items steht (z.B. ein Bild aus
        einem anderen Ordner). */
    selectedItem?: Item
    /** Damit steht oben in der Liste ein Suchfeld (Text per v-model:search),
        der Text benennt es und steht als Platzhalter darin. Filtern muss der
        Aufrufer, die Liste markiert nur die Fundstellen. */
    searchLabel?: string
    /** Steht da, wenn beim Suchen nichts übrig bleibt. */
    noResultsText?: string
  }>(),
  { variant: 'default' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  // Fired on a click outside the list. A parent can preventDefault() on it to
  // keep the list open, e.g. when the click was on a row that toggles it.
  interactOutside: [event: SelectInteractOutsideEvent]
}>()

const triggerClasses = {
  default: 'w-52 gap-2 rounded-lg px-2 py-1.5',
  field: 'min-h-8 w-full gap-1.5 rounded-md px-1.5 py-1',
  pictures: 'h-16 w-full gap-1.5 rounded-md p-1.5',
}

// Whether the list is open. A parent may bind it to open the list from
// outside (v-model:open); without a binding the select handles it alone.
const open = defineModel<boolean>('open')

const search = defineModel<string>('search', { default: '' })
const isSearching = computed(() => search.value.trim() !== '')

// Eigene IDs der Einträge: Das Suchfeld verweist damit auf den hervorgehobenen.
const id = useId()
const listId = `${id}-list`
const itemId = (value: string | number) => `${id}-item-${value}`
const ids = { item: itemId }

const collection = computed(() => createListCollection({ items: props.items }))

// Ark bekommt nur einen Wert aus der Liste: Einen fremden (z.B. ein Bild aus
// einem anderen Ordner) höbe es beim Öffnen hervor, und die Pfeiltasten fänden
// von dort keinen Nachbarn. Das geschlossene Feld zeigt ihn über selectedItem.
const selectedValues = computed(() =>
  props.items.filter((item) => item.value === props.modelValue).map((item) => item.value),
)

// The closed field shows the icon or picture of the entry that is currently picked.
const shownItem = computed(
  () => props.items.find((item) => item.value === props.modelValue) ?? props.selectedItem,
)

// Bei einem Klick oder Enter auf einen Eintrag meldet Ark erst die Wahl, dann
// das Schließen. Nach einem Eintrag mit keepsListOpen wird das Schließen
// übergangen. closeOnSelect je nach hervorgehobenem Eintrag ginge nicht: Ein
// Tipp auf dem Tablet hebt vorher nichts hervor (Ark tut das nur für die Maus).
let isKeepingListOpen = false

function select([value]: string[]) {
  isKeepingListOpen = !!props.items.find((item) => item.value === value)?.keepsListOpen
  emit('update:modelValue', value)
}

function changeOpen(isOpen: boolean) {
  if (!isOpen && isKeepingListOpen) {
    isKeepingListOpen = false
    return
  }
  // Jedes Öffnen beginnt ohne Suchtext.
  if (isOpen) search.value = ''
  open.value = isOpen
}

// Der Eintrag, auf dem Pfeiltasten oder Maus gerade stehen. Verschwindet er aus
// der Liste (z.B. beim Wechsel in einen Ordner), rückt der erste nach – sonst
// fänden die Pfeiltasten keinen Startpunkt mehr.
const highlightedValue = ref<string | null>(null)

watch(
  () => props.items,
  (items) => {
    if (highlightedValue.value === null) return
    if (items.some((item) => item.value === highlightedValue.value)) return
    highlightedValue.value = items[0]?.value ?? null
  },
)

// Die Liste rollt in einem Kasten darin, den Ark nicht kennt – darum rollt es
// den hervorgehobenen Eintrag hiermit ins Bild. Nur den Kasten, nie die Seite:
// Beim Öffnen steht die Liste noch nicht an ihrem Platz.
function scrollToItem({ getElement }: { getElement: () => HTMLElement | null }) {
  const item = getElement()
  const list = item?.parentElement
  if (!item || !list) return

  const top = item.offsetTop
  const bottom = top + item.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
}
</script>
