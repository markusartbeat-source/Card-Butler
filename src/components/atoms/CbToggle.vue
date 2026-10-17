<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       A round icon button that stays pressed until it is clicked again. -->
  <!-- Gesperrt: :hover greift trotzdem, deshalb kommt der Hover von Hand weg. -->
  <Toggle.Root
    v-ripple
    :pressed="modelValue"
    :disabled="disabled"
    class="relative shrink-0 overflow-hidden rounded-full p-1"
    :class="[
      modelValue ? 'bg-radial from-gold-light to-gold text-surface' : 'text-white',
      disabled ? 'opacity-40' : 'cb-hover',
    ]"
    @update:pressed="(pressed) => $emit('update:modelValue', pressed)"
  >
    <CbIcon :name="icon" />
  </Toggle.Root>
</template>

<script setup lang="ts">
import { Toggle } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ icon: IconName; modelValue: boolean; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
