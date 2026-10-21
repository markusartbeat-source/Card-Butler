<template>
  <!-- Wie rund die Ecken eines Elements sind – alle gleich oder jede einzeln. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.cornersGroup }}</CbSettingsHeading>
    <CbCornerRadiusFields
      :radii="cornerRadii"
      @change="(radii) => changeElementCornerRadii(elementId, radii)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbCornerRadiusFields from '../components/molecules/CbCornerRadiusFields.vue'
import { findCardSetElement } from './cardElements'
import { changeElementCornerRadii, cornerRadiiOfElement } from './elementCornerRadii'

const props = defineProps<{ elementId: string }>()

const cornerRadii = computed(() =>
  cornerRadiiOfElement(props.elementId, findCardSetElement(props.elementId)?.data.radius),
)
</script>
