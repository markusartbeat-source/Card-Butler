<template>
  <span
    v-for="(part, index) in parts"
    :key="index"
    :class="part.isMatch && 'rounded bg-gold-light text-background'"
    >{{ part.text }}</span
  >
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { splitBySearchWord } from '../../search/splitBySearchWord'

// Ein Text, in dem die Fundstellen des Suchworts gold hinterlegt sind – dunkle
// Schrift darauf, damit sie auf jeder Textfarbe lesbar bleiben. Ohne Hülle, der
// Text läuft beim Aufrufer in derselben Zeile weiter. Ohne Suchwort keine
// Markierung.
const props = defineProps<{ text: string; searchWord: string }>()

const parts = computed(() => splitBySearchWord(props.text, props.searchWord))
</script>
