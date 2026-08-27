<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here. -->
  <Switch.Root
    :checked="modelValue"
    @update:checked="(checked) => $emit('update:modelValue', checked)"
  >
    <!-- The moving and colour classes are bound instead of a data attribute
         variant, so a template utility can never win over them. -->
    <Switch.Control
      v-ripple
      class="cb-hover relative flex h-6 w-10 items-center overflow-hidden rounded-full px-0.5 transition-colors duration-200"
      :class="modelValue ? 'bg-gold-light' : 'bg-surface-light'"
    >
      <Switch.Thumb
        class="size-5 rounded-full bg-background transition-transform duration-200"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      />
    </Switch.Control>
    <Switch.HiddenInput />
  </Switch.Root>
</template>

<script setup lang="ts">
import { Switch } from '@ark-ui/vue'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
