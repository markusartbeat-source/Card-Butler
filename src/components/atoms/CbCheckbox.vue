<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here. -->
  <!-- The 6 px of air around the box are the padding of the whole row, so the
       text is part of the click target and two rows below each other end up
       12 px apart on their own. -->
  <Checkbox.Root
    v-ripple
    class="cb-hover relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-lg p-1.5"
    :checked="modelValue"
    @update:checked="(checked) => $emit('update:modelValue', checked === true)"
  >
    <!-- The fill is bound instead of a data attribute variant, so a template
         utility can never win over it. -->
    <Checkbox.Control
      class="flex size-5.5 items-center justify-center rounded-sm border-2 border-gold-light text-background"
      :class="modelValue ? 'bg-gradient-to-br from-gold-light to-gold' : ''"
    >
      <Checkbox.Indicator>
        <CbIcon name="check" size="small" />
      </Checkbox.Indicator>
    </Checkbox.Control>

    <Checkbox.Label class="text-sm">{{ label }}</Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>

<script setup lang="ts">
import { Checkbox } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'

defineProps<{ modelValue: boolean; label: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
