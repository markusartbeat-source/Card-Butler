<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       Several menus stand next to each other in one row and know about each
       other: once one is open, hovering the next one switches straight over. -->
  <NavigationMenu.Root>
    <NavigationMenu.List class="flex items-center gap-3">
      <!-- The panel hangs under its own trigger, so every menu is the box its
           panel is placed against. It opens towards the middle of the screen,
           because these menus sit at the right edge of the header. -->
      <NavigationMenu.Item
        v-for="menu in menus"
        :key="menu.value"
        :value="menu.value"
        class="relative"
      >
        <NavigationMenu.Trigger as-child>
          <CbButton variant="ghost">
            {{ menu.label }}
            <CbIcon name="keyboard_arrow_down" class="cb-navigation-menu-arrow" />
          </CbButton>
        </NavigationMenu.Trigger>

        <NavigationMenu.Content
          class="cb-fade absolute top-full right-0 z-50 mt-2 flex gap-8 rounded-lg bg-surface p-4 shadow-lg"
        >
          <!-- One column per group, each with its own heading above it. -->
          <div v-for="group in menu.groups" :key="group.label" class="flex w-56 flex-col gap-1">
            <span class="px-2 pb-1 text-xs uppercase text-white">{{ group.label }}</span>

            <NavigationMenu.Link
              v-for="link in group.links"
              :key="link.value"
              v-ripple
              class="cb-hover relative flex items-start gap-3 overflow-hidden rounded-md p-2"
              @click="$emit('select', link.value)"
            >
              <CbIcon :name="link.icon" class="text-gold" />
              <span class="flex flex-col">
                <span class="text-sm text-gold">{{ link.title }}</span>
                <span class="text-xs text-label">{{ link.description }}</span>
              </span>
            </NavigationMenu.Link>
          </div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</template>

<script setup lang="ts">
// Ark UI forgot the navigation menu in its main entry, so it comes straight
// from its own path. Every other Ark component is imported from '@ark-ui/vue'.
import { NavigationMenu } from '@ark-ui/vue/navigation-menu'
import CbButton from './CbButton.vue'
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{
  menus: {
    value: string
    label: string
    groups: {
      label: string
      links: { value: string; title: string; description: string; icon: IconName }[]
    }[]
  }[]
}>()

// The value of the clicked entry.
defineEmits<{ select: [value: string] }>()
</script>

<style scoped>
/* A closed panel stays in the page and only carries the "hidden" attribute.
   Its own "flex" class would draw it anyway, so hiding is said again here. */
:deep([data-part='content'][hidden]) {
  display: none;
}

/* Ark UI marks the open menu on its trigger. The button stays lit as long as
   its panel is open, and its arrow points at the panel below. */
:deep([data-part='trigger'][data-state='open']) {
  background-color: var(--color-surface);
}

:deep([data-part='trigger'][data-state='open']) .cb-navigation-menu-arrow {
  rotate: 180deg;
}

.cb-navigation-menu-arrow {
  transition: rotate 250ms ease;
}
</style>
