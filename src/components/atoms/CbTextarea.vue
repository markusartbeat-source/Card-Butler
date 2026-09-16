<template>
  <!-- Same box as CbInput, only taller and without the visible label word.
       The label stays for screen readers. -->
  <Field.Root
    v-ripple
    class="cb-hover relative flex overflow-hidden rounded-md bg-surface-light px-1.5 py-1 text-sm"
  >
    <Field.Label class="sr-only">{{ label }}</Field.Label>
    <Field.Textarea
      class="min-h-32 w-full min-w-0 resize-none cursor-text bg-transparent text-white outline-none placeholder:text-label focus:placeholder:text-transparent"
      :value="modelValue"
      :placeholder="placeholder"
      @input="(event) => $emit('update:modelValue', (event.target as HTMLTextAreaElement).value)"
    />
  </Field.Root>
</template>

<script setup lang="ts">
import { Field } from '@ark-ui/vue'

defineProps<{ label: string; modelValue: string; placeholder?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
