<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       A round icon button that stays pressed until it is clicked again. -->
  <Toggle.Root
    v-ripple
    :pressed="modelValue"
    class="cb-hover relative overflow-hidden rounded-full p-1"
    :class="modelValue ? 'bg-radial from-gold-light to-gold text-surface' : 'text-white'"
    @update:pressed="(pressed) => $emit('update:modelValue', pressed)"
  >
    <CbIcon :name="icon" />
  </Toggle.Root>
</template>

<script setup lang="ts">
import { Toggle } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ icon: IconName; modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
