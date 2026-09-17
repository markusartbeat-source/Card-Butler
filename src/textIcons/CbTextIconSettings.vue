<template>
  <!-- The dark panel under "My icons": the icon settings on top, later the
       icon tiles below it. Same look as the settings groups. -->
  <div class="rounded-3xl bg-surface shadow-lg">
    <div class="flex flex-col gap-3 p-6">
      <h3 class="text-base font-bold text-white">{{ dictionary.textIcons.iconSettings }}</h3>
      <CbInput v-model="iconHeight" :label="dictionary.textIcons.height" />
      <CbInput v-model="iconWidth" :label="dictionary.textIcons.width" />
      <div class="flex gap-6">
        <CbInput
          v-model="iconVerticalOffset"
          class="flex-1"
          icon="vertical_align_center"
          :label="dictionary.textIcons.verticalOffset"
        />
        <CbInput
          v-model="iconSideSpacing"
          class="flex-1"
          icon="format_letter_spacing_wider"
          :label="dictionary.textIcons.sideSpacing"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbInput from '../components/atoms/CbInput.vue'
import { iconHeight, iconWidth, iconVerticalOffset, iconSideSpacing } from './textIconSettings'
</script>
