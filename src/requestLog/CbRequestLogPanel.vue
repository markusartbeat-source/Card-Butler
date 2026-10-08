<template>
  <!-- TEMPORÄR (Poststellen-Protokoll): wird im Aufräumschritt entfernt. -->
  <ol
    v-if="requestLog.length"
    class="bg-surface fixed right-4 bottom-4 left-4 z-50 max-h-40 max-w-lg overflow-y-auto rounded-lg p-2 font-mono text-xs text-white shadow-lg"
  >
    <li v-for="entry in requestLog" :key="entry.requestId">
      {{ entry.method }} {{ entry.path }} {{ entry.status }} · {{ entry.durationInMilliseconds }} ms ·
      {{ entry.requestId }}
    </li>
  </ol>
</template>

<script setup lang="ts">
import { requestLog } from './requestLog'
</script>
