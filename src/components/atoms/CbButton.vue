<template>
  <!-- Thin gradient frame around the golden button. -->
  <div
    v-if="variant === 'primary'"
    class="bg-gradient-to-br from-gold-dark to-gold-light rounded-lg p-0.5 shadow-lg"
    :class="{ 'opacity-40': disabled }"
  >
    <CbInteractive
      class="bg-radial from-gold-light to-gold text-surface flex w-full items-center justify-center rounded-md text-sm"
      :class="framedSizeClasses[size]"
      :disabled="disabled"
      @click="$emit('click', $event)"
    >
      <slot />
    </CbInteractive>
  </div>

  <!-- "light" is the same button one shade brighter, for use on a surface
       coloured panel where the secondary button would disappear. "ghost" is
       round and carries no background of its own, only the hover. "small"
       tightens the padding for a button that sits next to text instead of on
       its own. -->
  <CbInteractive
    v-else
    class="flex items-center text-sm text-white"
    :class="[
      variantClasses[variant],
      variant === 'ghost' ? ghostSizeClasses[size] : sizeClasses[size],
      { 'opacity-40': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </CbInteractive>
</template>

<script setup lang="ts">
import CbInteractive from './CbInteractive.vue'

// Every variant but the round ghost wears the corner of CbSelect.
const variantClasses = {
  primary: '',
  secondary: 'bg-surface rounded-lg shadow-lg',
  light: 'bg-surface-light rounded-lg shadow-lg',
  ghost: 'rounded-full',
}

// The default is the click area of one entry in CbDropdown, so a button that
// opens a dropdown is exactly as big as the entries inside it.
const sizeClasses = {
  default: 'gap-2 px-2 py-1.5',
  small: 'gap-2.5 p-1',
}

// The round ghost button needs the same padding on every side, otherwise its
// hover circle comes out as an oval instead.
const ghostSizeClasses = {
  default: 'gap-2 p-2',
  small: 'gap-2.5 p-1',
}

// The primary button wears a 2px gradient frame around it. Its own padding is
// that much smaller, so it ends up exactly as big as every other button.
const framedSizeClasses = {
  default: 'gap-2 px-1.5 py-1',
  small: 'gap-2.5 p-0.5',
}

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'light' | 'ghost'
    size?: 'default' | 'small'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'default' },
)
defineEmits<{ click: [event: MouseEvent] }>()
</script>
