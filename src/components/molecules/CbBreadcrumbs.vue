<template>
  <!-- Jeder Eintrag außer dem letzten führt dorthin, der letzte ist die Stelle,
       an der man gerade ist. Lange Namen enden in „…“. Gekürzt wird am Text
       selbst, nicht am Listenpunkt, sonst schnitte der Fokusrahmen ab. -->
  <!-- Ein Eintrag mit dropTarget nimmt beim Ziehen etwas an und leuchtet dann,
       der letzte nie – dort ist es schon. Fürs Leuchten hat jeder Eintrag
       seitlich Luft, die Liste rückt um so viel heraus. -->
  <nav :aria-label="label">
    <ol class="-mx-1 flex min-w-0">
      <li v-for="(entry, index) in entries" :key="index" class="flex min-w-0">
        <span v-if="index > 0" aria-hidden="true" class="shrink-0">
          {{ dictionary.general.pathSeparator }}
        </span>
        <span v-if="index === entries.length - 1" aria-current="page" class="truncate px-1">
          {{ entry.label }}
        </span>
        <router-link
          v-else
          :to="entry.to"
          v-bind="entry.dropTarget === undefined ? {} : pageDropTargetAttributes(entry.dropTarget)"
          class="relative truncate rounded px-1 hover:text-white data-drop-hovered:bg-white/10 data-drop-hovered:text-white"
        >
          {{ entry.label }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { pageDropTargetAttributes } from '../../dragAndDrop/pageDropTarget'

export type BreadcrumbEntry = { label: string; to: RouteLocationRaw; dropTarget?: string }

// label ist der Vorlesename des Pfads.
defineProps<{ entries: BreadcrumbEntry[]; label: string }>()
</script>
