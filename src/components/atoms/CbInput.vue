<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The label is the grey word inside the dark box, left of the value. -->
  <Field.Root
    v-ripple
    class="cb-hover group relative flex min-h-8 items-center gap-1.5 overflow-hidden rounded-md bg-surface-light"
    :class="variantClasses[variant].root"
  >
    <!-- With an icon or hideLabel the word itself stays hidden, but screen
         readers keep it. -->
    <Field.Label class="text-label" :class="hideLabel && 'sr-only'">
      <CbIcon v-if="icon" :name="icon" />
      <span :class="icon && 'sr-only'">{{ label }}</span>
      <!-- Platzhalter nur fürs Auge, der Screenreader hört stattdessen den
           gesprochenen. Im Label, damit ein Klick darauf ins Feld führt. -->
      <template v-if="spokenPlaceholder && !modelValue">
        <span aria-hidden="true" class="ml-1.5 group-focus-within:hidden">{{ placeholder }}</span>
        <span class="sr-only">{{ spokenPlaceholder }}</span>
      </template>
    </Field.Label>
    <Field.Input
      class="min-w-0 cursor-text bg-transparent text-white outline-none placeholder:text-label focus:placeholder:text-transparent"
      :class="variantClasses[variant].input"
      :value="modelValue"
      :placeholder="spokenPlaceholder ? undefined : placeholder"
      :autofocus="autofocus"
      :maxlength="maxLength"
      @input="(event) => $emit('update:modelValue', (event.target as HTMLInputElement).value)"
      @change="$emit('change')"
    />
  </Field.Root>
</template>

<script setup lang="ts">
import { Field } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

// „title“ steht im Kopf eines Panels statt des Titels: große, mittige Schrift,
// und das Feld wächst mit dem Text.
const variantClasses = {
  default: { root: 'px-1.5 py-1 text-sm', input: 'w-full' },
  title: { root: 'min-w-24 px-3 py-0.5 text-xl', input: 'field-sizing-content grow text-center' },
}

withDefaults(
  defineProps<{
    label: string
    modelValue: string
    variant?: 'default' | 'title'
    icon?: IconName
    placeholder?: string
    /** Hört der Screenreader statt des Platzhalters, z.B. „automatisch“ statt „-“. */
    spokenPlaceholder?: string
    hideLabel?: boolean
    maxLength?: number
    /** In einem Dialog bekommt dieses Feld beim Öffnen den Fokus. */
    autofocus?: boolean
  }>(),
  { variant: 'default' },
)
// change: Der Wert wurde bestätigt (Enter oder Feld verlassen).
defineEmits<{ 'update:modelValue': [value: string]; change: [] }>()
</script>
