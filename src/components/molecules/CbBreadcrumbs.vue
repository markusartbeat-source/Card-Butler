<template>
  <!-- Jeder Eintrag außer dem letzten führt dorthin, der letzte ist die Stelle,
       an der man gerade ist. Lange Namen enden in „…“. Gekürzt wird am Text
       selbst, nicht am Listenpunkt, sonst schnitte der Fokusrahmen ab. -->
  <nav :aria-label="label">
    <ol class="flex min-w-0">
      <li v-for="(entry, index) in entries" :key="index" class="flex min-w-0">
        <span v-if="index > 0" aria-hidden="true" class="shrink-0 px-1">
          {{ dictionary.general.pathSeparator }}
        </span>
        <span v-if="index === entries.length - 1" aria-current="page" class="truncate">
          {{ entry.label }}
        </span>
        <router-link v-else :to="entry.to" class="truncate hover:text-white">{{ entry.label }}</router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export type BreadcrumbEntry = { label: string; to: RouteLocationRaw }

// label ist der Vorlesename des Pfads.
defineProps<{ entries: BreadcrumbEntry[]; label: string }>()
</script>
