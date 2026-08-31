<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The closed field looks like the other panel fields: a small square in
       the picked colour on the left, its hex value next to it. -->
  <ColorPicker.Root
    :model-value="parseColor(modelValue)"
    :positioning="{ sameWidth: true }"
    @value-change="(details) => $emit('update:modelValue', toHex(details.value))"
  >
    <ColorPicker.Control>
      <ColorPicker.Trigger
        v-ripple
        class="cb-hover relative flex min-h-8 w-full items-center gap-1.5 overflow-hidden rounded-md bg-surface-light px-1.5 py-1 text-sm text-white"
        :aria-label="label"
      >
        <ColorPicker.ValueSwatch class="size-4.5 shrink-0 rounded" />
        <span>{{ modelValue }}</span>
      </ColorPicker.Trigger>
    </ColorPicker.Control>

    <ColorPicker.Positioner>
      <!-- cb-collapse rolls the picker open and shut, the same way the select
           list does. The padding sits on the inner box, otherwise it would
           stay behind as a thin strip. -->
      <ColorPicker.Content
        class="cb-collapse z-50 overflow-hidden rounded-lg bg-surface-light shadow-lg"
      >
        <div>
          <div class="flex flex-col gap-3 p-3">
            <!-- Ark places every thumb by percent, so each one has to be
                 pulled back by half its own size to sit on the picked spot. -->
            <ColorPicker.Area class="h-40 rounded-md">
              <ColorPicker.AreaBackground class="size-full rounded-md" />
              <ColorPicker.AreaThumb
                class="size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              />
            </ColorPicker.Area>

            <div class="flex items-center gap-3">
              <ColorPicker.EyeDropperTrigger
                v-ripple
                class="cb-hover relative shrink-0 overflow-hidden rounded-md bg-surface p-1.5 text-white"
              >
                <CbIcon name="colorize" />
              </ColorPicker.EyeDropperTrigger>

              <div class="flex grow flex-col gap-2">
                <ColorPicker.ChannelSlider channel="hue" class="relative">
                  <ColorPicker.ChannelSliderTrack class="h-3 rounded-full" />
                  <ColorPicker.ChannelSliderThumb
                    class="size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                  />
                </ColorPicker.ChannelSlider>
                <!-- The chequered grid lies under the alpha track, so a
                     see-through colour is recognisable as such. -->
                <ColorPicker.ChannelSlider channel="alpha" class="relative">
                  <ColorPicker.TransparencyGrid size="6px" class="rounded-full" />
                  <ColorPicker.ChannelSliderTrack class="h-3 rounded-full" />
                  <ColorPicker.ChannelSliderThumb
                    class="size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                  />
                </ColorPicker.ChannelSlider>
              </div>
            </div>

            <div class="flex gap-3">
              <ColorPicker.ChannelInput
                channel="hex"
                class="min-w-0 grow rounded-md bg-surface px-1.5 py-1 text-sm text-white outline-none"
              />
              <ColorPicker.ChannelInput
                channel="alpha"
                class="w-14 min-w-0 rounded-md bg-surface px-1.5 py-1 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>
      </ColorPicker.Content>
    </ColorPicker.Positioner>
  </ColorPicker.Root>
</template>

<script setup lang="ts">
import { ColorPicker, parseColor, type Color } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'

// The value travels as a plain hex string, Ark works with its own colour
// object. A see-through colour needs the two extra digits, a solid one does not.
function toHex(color: Color) {
  return color.getChannelValue('alpha') < 1 ? color.toString('hexa') : color.toString('hex')
}

defineProps<{ modelValue: string; label: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
