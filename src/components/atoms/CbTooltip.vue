<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The slot element becomes the trigger itself, so a tooltip can be put
       around an existing button without changing how that button looks.
       Both close flags stay off, otherwise a click would hide the text again. -->
  <Tooltip.Root
    :open-delay="200"
    :close-delay="100"
    :close-on-click="false"
    :close-on-pointer-down="false"
  >
    <Tooltip.Trigger as-child>
      <slot />
    </Tooltip.Trigger>

    <Tooltip.Positioner>
      <Tooltip.Content
        class="z-50 max-w-56 rounded-md bg-surface-light px-2 py-1 text-sm text-white shadow-lg"
      >
        <!-- Ark UI only sets the arrow position, its size and colour are ours. -->
        <Tooltip.Arrow :style="arrowStyle">
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        {{ text }}
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
</template>

<script setup lang="ts">
import { Tooltip } from '@ark-ui/vue'

defineProps<{ text: string }>()

const arrowStyle = {
  '--arrow-size': '8px',
  '--arrow-background': 'var(--color-surface-light)',
}
</script>
