<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       An entry can carry its own icon, e.g. a flag or a moon. -->
  <Select.Root
    :collection="collection"
    :model-value="[modelValue]"
    @update:model-value="(values) => $emit('update:modelValue', values[0])"
  >
    <Select.Control>
      <Select.Trigger
        v-ripple
        class="cb-hover relative flex w-52 items-center gap-2 overflow-hidden rounded-lg bg-surface-light px-2 py-1.5 text-sm text-white"
      >
        <CbIcon v-if="selectedItem?.icon" :name="selectedItem.icon" />
        <Select.ValueText class="grow text-left" />
        <CbIcon name="keyboard_arrow_down" />
      </Select.Trigger>
    </Select.Control>

    <Select.Positioner>
      <Select.Content
        class="flex w-52 flex-col rounded-lg bg-surface-light p-1 text-sm text-white shadow-lg"
      >
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
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const collection = computed(() => createListCollection({ items: props.items }))

// The closed field shows the icon of the entry that is currently picked.
const selectedItem = computed(() => props.items.find((item) => item.value === props.modelValue))
</script>
