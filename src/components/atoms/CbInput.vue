<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The label is the grey word inside the dark box, left of the value. -->
  <Field.Root
    v-ripple
    class="cb-hover relative flex min-h-8 items-center gap-1.5 overflow-hidden rounded-md bg-surface-light px-1.5 py-1 text-sm"
  >
    <!-- With an icon the word itself stays hidden, but screen readers keep it. -->
    <Field.Label class="text-label">
      <CbIcon v-if="icon" :name="icon" />
      <span :class="icon && 'sr-only'">{{ label }}</span>
    </Field.Label>
    <Field.Input
      class="w-full min-w-0 cursor-text bg-transparent text-white outline-none"
      :value="modelValue"
      @input="(event) => $emit('update:modelValue', (event.target as HTMLInputElement).value)"
    />
  </Field.Root>
</template>

<script setup lang="ts">
import { Field } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ label: string; modelValue: string; icon?: IconName }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
