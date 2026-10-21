<template>
  <template v-for="(part, index) in parts" :key="index">
    <img
      v-if="part.icon"
      :src="part.icon.image"
      :alt="part.icon.name"
      :class="iconImageClasses"
      :style="iconImageStyle"
    />
    <CbHighlightedText v-else :text="part.text" :search-word="searchWord" />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbHighlightedText from '../components/atoms/CbHighlightedText.vue'
import { iconImageClasses, iconImageStyle, splitByIconWords } from './textIconWords'

// Ein Text, in dem Icon-Namen als Icon gezeichnet werden – nur Darstellung,
// der Text selbst bleibt unverändert. Größe & Co. kommen aus den
// CSS-Variablen des Aufrufers (iconStyleVariables). Ohne Hülle, der Text läuft
// beim Aufrufer in derselben Zeile weiter.
const props = defineProps<{ text: string; searchWord: string }>()

const parts = computed(() => splitByIconWords(props.text))
</script>
