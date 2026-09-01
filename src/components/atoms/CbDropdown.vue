<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The slot element becomes the trigger itself, so a dropdown can be put
       around an existing button without changing how that button looks.
       The list looks like the one of CbSelect. -->
  <Menu.Root
    :positioning="{ placement: 'bottom-end' }"
    @select="({ value }) => $emit('select', value)"
  >
    <Menu.Trigger as-child>
      <slot />
    </Menu.Trigger>

    <Menu.Positioner>
      <!-- cb-collapse rolls the list open and shut. The outer box is the one
           that gets cut off; the list inside keeps its full height, so the
           entries never squash together. -->
      <Menu.Content
        class="cb-collapse z-50 overflow-hidden rounded-lg bg-surface-light text-sm text-white shadow-lg"
      >
        <div>
          <!-- min-w keeps a short list from looking pinched, longer entries
               push the list wider instead of wrapping. -->
          <div class="flex min-w-44 flex-col p-1">
            <Menu.Item
              v-for="item in items"
              :key="item.value"
              v-ripple
              :value="item.value"
              class="cb-hover relative flex items-center gap-2 overflow-hidden rounded-md px-2 py-1.5"
            >
              <CbIcon v-if="item.icon" :name="item.icon" />
              {{ item.label }}
            </Menu.Item>
          </div>
        </div>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>

<script setup lang="ts">
import { Menu } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ items: { value: string; label: string; icon?: IconName }[] }>()

// The value of the clicked entry.
defineEmits<{ select: [value: string] }>()
</script>
