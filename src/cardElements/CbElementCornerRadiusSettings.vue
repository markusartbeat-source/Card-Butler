<template>
  <!-- Wie rund die Ecken des Elements sind, für jeden Elementtyp mit Ecken. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.cornersGroup }}</CbSettingsHeading>
    <CbCornerRadiusFields
      :radii="radii"
      @change="(changed) => changeElementCornerRadii(elementId, changed)"
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

const radii = computed(() =>
  cornerRadiiOfElement(props.elementId, findCardSetElement(props.elementId)?.data.radius),
)
</script>
