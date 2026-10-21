<template>
  <div
    v-ripple
    class="cb-hover relative overflow-hidden rounded-md"
    :class="isTile ? 'flex flex-col gap-1 p-1 text-center text-2xs' : 'flex items-center gap-2 px-2 py-1.5'"
  >
    <!-- Ein Eintrag einer aufgeklappten Liste, mit Icon davor, wenn er eins hat.
         Mit Bild oder als Ordner wird er zur Kachel im Raster: oben das Bild im
         Seitenverhältnis des großen Auswahlfelds (73×52 px), darunter der Text.
         Ark legt sein Verhalten per as-child darauf, z.B. <Select.Item as-child>.
         Kommentar im Eintrag statt davor – Grund siehe CbPopupList. -->
    <template v-if="isTile">
      <div v-if="folder" class="aspect-73/52 w-full">
        <CbFolder graphic-only :picture="picture" />
      </div>
      <CbThumbnail v-else :picture="picture" class="aspect-73/52 w-full" />
      <span class="truncate"><slot /></span>
    </template>
    <template v-else>
      <CbIcon v-if="icon" :name="icon" />
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbFolder from './CbFolder.vue'
import CbIcon from './CbIcon.vue'
import CbThumbnail from './CbThumbnail.vue'
import type { IconName } from './icons'

// picture ist die Adresse des Bildes, bei einem Ordner das Bild darin.
const props = defineProps<{ icon?: IconName; picture?: string; folder?: boolean }>()

const isTile = computed(() => props.picture !== undefined || props.folder)
</script>
