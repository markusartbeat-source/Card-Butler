<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       An entry can carry its own icon, e.g. a flag or a moon. -->
  <Select.Root
    v-model:open="open"
    :collection="collection"
    :model-value="[modelValue]"
    :positioning="{ sameWidth: true }"
    @update:model-value="(values) => $emit('update:modelValue', values[0])"
    @interact-outside="$emit('interactOutside', $event)"
  >
    <Select.Control>
      <Select.Trigger
        v-ripple
        class="cb-hover relative flex items-center overflow-hidden bg-surface-light text-sm text-white"
        :class="
          variant === 'field'
            ? 'min-h-8 w-full gap-1.5 rounded-md px-1.5 py-1'
            : 'w-52 gap-2 rounded-lg px-2 py-1.5'
        "
      >
        <CbIcon v-if="selectedItem?.icon" :name="selectedItem.icon" />
        <!-- The field variant names the value with a grey word in front of it. -->
        <span v-if="label" class="text-label" :class="hideLabel && 'sr-only'">{{ label }}</span>
        <Select.ValueText class="grow text-left" />
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
            <Select.Item v-for="item in items" :key="item.value" :item="item" as-child>
              <CbListItem :icon="item.icon">
                <Select.ItemText>{{ item.label }}</Select.ItemText>
              </CbListItem>
            </Select.Item>
          </CbPopupList>
        </Select.Content>
      </Select.Positioner>
    </Teleport>
  </Select.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Select, createListCollection, type SelectInteractOutsideEvent } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import CbListItem from './CbListItem.vue'
import CbPopupList from './CbPopupList.vue'
import type { IconName } from './icons'

const props = defineProps<{
  items: { value: string; label: string; icon?: IconName }[]
  modelValue: string
  // 'field' looks like the dark input boxes in the card settings panel.
  variant?: 'default' | 'field'
  label?: string
  /** Das Wort ist nur für Screenreader da, sichtbar steht allein der Wert. */
  hideLabel?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
  // Fired on a click outside the list. A parent can preventDefault() on it to
  // keep the list open, e.g. when the click was on a row that toggles it.
  interactOutside: [event: SelectInteractOutsideEvent]
}>()

// Whether the list is open. A parent may bind it to open the list from
// outside (v-model:open); without a binding the select handles it alone.
const open = defineModel<boolean>('open')

const collection = computed(() => createListCollection({ items: props.items }))

// The closed field shows the icon of the entry that is currently picked.
const selectedItem = computed(() => props.items.find((item) => item.value === props.modelValue))
</script>
