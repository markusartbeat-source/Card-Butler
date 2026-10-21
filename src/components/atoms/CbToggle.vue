<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       A round icon button that stays pressed until it is clicked again. Mit
       chip eine Pille mit diesem Text statt des Icons. -->
  <!-- Gesperrt: :hover greift trotzdem, deshalb kommt der Hover von Hand weg. -->
  <Toggle.Root
    v-ripple
    :pressed="modelValue"
    :disabled="disabled"
    class="relative shrink-0 overflow-hidden rounded-full"
    :class="[
      chip ? 'px-3 py-1 text-xs' : 'p-1',
      modelValue ? 'bg-radial from-gold-light to-gold text-surface' : 'text-white',
      chip && !modelValue && 'bg-surface',
      disabled ? 'opacity-40' : 'cb-hover',
    ]"
    @update:pressed="(pressed) => $emit('update:modelValue', pressed)"
  >
    <template v-if="chip">{{ chip }}</template>
    <CbIcon v-else-if="icon" :name="icon" />
  </Toggle.Root>
</template>

<script setup lang="ts">
import { Toggle } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ icon?: IconName; chip?: string; modelValue: boolean; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
