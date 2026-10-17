<template>
  <!-- Wie die Textbox zu ihrer Größe kommt, wie in Figma: automatische Breite,
       automatische Höhe oder feste Größe. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.textboxGroup }}</CbSettingsHeading>
    <!-- Gleich breit wie eine Ausrichten-Gruppe unter „Position“. -->
    <div class="grid grid-cols-2 gap-3">
      <CbToggleGroup
        v-model="sizingIndex"
        :label="dictionary.cardEditor.textboxSizing"
        :items="sizings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'

const sizings = computed(() => [
  { name: dictionary.cardEditor.autoWidth, icon: 'start' as const },
  { name: dictionary.cardEditor.autoHeight, icon: 'wrap_text' as const },
  { name: dictionary.cardEditor.fixedSize, icon: 'article' as const },
])

// Vorerst nur hier im Panel, noch ohne Wirkung aufs Textfeld. Feste Größe, weil
// sich Textfelder heute so verhalten.
const sizingIndex = ref(2)
</script>
