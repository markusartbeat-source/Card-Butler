<template>
  <!-- Thin frame around the bar: gold at both round ends, dark in between. -->
  <div class="cb-gold-edge-frame rounded-full p-0.5 shadow-lg">
    <div class="bg-surface flex items-center rounded-full">
      <!-- Square click zones, only the outer ones follow the bar's round ends. -->
      <CbInteractive
        v-for="element in cbCardToolbarElements"
        :key="element.name"
        class="px-3 py-4 text-white first:rounded-l-full first:pl-4 last:rounded-r-full last:pr-4"
        :title="element.name"
      >
        <CbIcon :name="element.icon" />
      </CbInteractive>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import { cbCardToolbarElements } from './CbCardToolbarElements'
</script>
