<template>
  <!-- Wie rund die Ecken eines Elements sind – alle gleich oder jede einzeln.
       Einzelne Ecken merkt sich nur der Browser, beim Bild alle: Das Backend
       kennt dort keinen Radius. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.cornersGroup }}</CbSettingsHeading>
    <CbCornerRadiusFields
      :radii="cornerRadii"
      :class="data?.type === 'PICTURE' && notStoredClass"
      :separate-corners-class="notStoredClass"
      @change="(radii) => changeElementCornerRadii(elementId, radii)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbCornerRadiusFields from '../components/molecules/CbCornerRadiusFields.vue'
import { notStoredClass } from '../notStored/notStoredMark'
import { findCardSetElement } from './cardElements'
import { changeElementCornerRadii, cornerRadiiOfElement } from './elementCornerRadii'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)

const cornerRadii = computed(() => cornerRadiiOfElement(props.elementId, data.value?.radius))
</script>
