<template>
  <!-- One row inside a CbSettingsGroup: a name, an optional explanation below
       it and whatever the slot puts at the right edge. The spacer pushes the
       slot to the right without anyone needing a width.
       A plain row is a quiet div. With `interactive` the row is a
       CbInteractive instead, which already brings the whole click feel
       (cursor, hover, ripple), so nothing has to be repeated here.
       The panel around the rows is rounded but does not clip them, so the
       first and last row round their own outer corners — otherwise the hover
       layer would show square corners over the panel. -->
  <component
    :is="interactive ? CbInteractive : 'div'"
    class="flex items-center p-6 text-left"
    :class="interactive && 'first:rounded-t-3xl last:rounded-b-3xl'"
  >
    <div>
      <p class="text-sm text-white">{{ title }}</p>
      <p v-if="info" class="text-xs text-white/50">{{ info }}</p>
    </div>
    <div class="grow"></div>
    <slot />
  </component>
</template>

<script setup lang="ts">
import CbInteractive from './CbInteractive.vue'

defineProps<{ title: string; info?: string; interactive?: boolean }>()
</script>
