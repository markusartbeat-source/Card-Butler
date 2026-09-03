<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       No ripple here: the handle is dragged, not clicked. -->
  <!-- While dragging, the hand stays closed wherever the pointer goes, so the
       cursor sits on the whole slider and not only on the handle. -->
  <Slider.Root
    class="flex items-center gap-3 data-dragging:cursor-grabbing"
    :model-value="[modelValue]"
    @value-change="(details) => $emit('update:modelValue', details.value[0])"
  >
    <!-- The real name of the slider is only read out, on screen the two ends
         say what low and high mean. -->
    <Slider.Label class="sr-only">{{ label }}</Slider.Label>
    <span class="text-2xs">{{ lowLabel }}</span>

    <Slider.Control class="relative flex grow items-center">
      <Slider.Track class="h-2 w-full rounded-full bg-background">
        <Slider.Range
          class="h-full rounded-full border-2 border-surface bg-gradient-to-r from-gold-light to-gold"
        />
      </Slider.Track>
      <Slider.Thumb
        :index="0"
        class="size-4 cursor-grab rounded-full border-2 border-gold-light bg-gradient-to-br from-gold-light to-gold"
      >
        <Slider.HiddenInput />
      </Slider.Thumb>
    </Slider.Control>

    <span class="text-2xs">{{ highLabel }}</span>
  </Slider.Root>
</template>

<script setup lang="ts">
import { Slider } from '@ark-ui/vue'

defineProps<{ modelValue: number; label: string; lowLabel: string; highLabel: string }>()
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>
