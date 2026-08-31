<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       An entry can carry its own icon, e.g. a flag or a moon. -->
  <Select.Root
    :collection="collection"
    :model-value="[modelValue]"
    :positioning="{ sameWidth: true }"
    @update:model-value="(values) => $emit('update:modelValue', values[0])"
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
        <span v-if="label" class="text-label">{{ label }}</span>
        <Select.ValueText class="grow text-left" />
        <CbIcon name="keyboard_arrow_down" />
      </Select.Trigger>
    </Select.Control>

    <Select.Positioner>
      <!-- The open menu has to stay above the rows that come after it. Ark
           copies the z-index of this content onto the positioner, so the
           class belongs here and not one level up. -->
      <!-- cb-collapse rolls the list open and shut. The padding sits on the
           inner list, otherwise it would stay behind as a thin strip. -->
      <!-- sameWidth on the root makes the list as wide as the closed field. -->
      <Select.Content
        class="cb-collapse z-50 overflow-hidden rounded-lg bg-surface-light text-sm text-white shadow-lg"
      >
        <!-- The outer box is the one that gets cut off; the list inside keeps
             its full height, so the entries never squash together. -->
        <div>
          <div class="flex flex-col p-1">
            <Select.Item
              v-for="item in items"
              :key="item.value"
              v-ripple
              :item="item"
              class="cb-hover relative flex items-center gap-2 overflow-hidden rounded-md px-2 py-1.5"
            >
              <CbIcon v-if="item.icon" :name="item.icon" />
              <Select.ItemText>{{ item.label }}</Select.ItemText>
            </Select.Item>
          </div>
        </div>
      </Select.Content>
    </Select.Positioner>
  </Select.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Select, createListCollection } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

const props = defineProps<{
  items: { value: string; label: string; icon?: IconName }[]
  modelValue: string
  // 'field' looks like the dark input boxes in the card settings panel.
  variant?: 'default' | 'field'
  label?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const collection = computed(() => createListCollection({ items: props.items }))

// The closed field shows the icon of the entry that is currently picked.
const selectedItem = computed(() => props.items.find((item) => item.value === props.modelValue))
</script>
