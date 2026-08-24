<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isSupabaseReachable } from '../supabase'

const reachable = ref<boolean | null>(null)

onMounted(async () => {
  reachable.value = await isSupabaseReachable()
})
</script>

<template>
  <h1 class="text-3xl text-white">Einstellungen</h1>
  <p class="mt-4 text-white">
    Supabase erreichbar:
    {{ reachable === null ? '...' : reachable ? 'ja' : 'nein' }}
  </p>
</template>
