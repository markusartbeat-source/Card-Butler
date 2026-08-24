<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isSupabaseReachable, supabase } from '../supabase'
import { useCurrentUser } from '../composables/useCurrentUser'
import CbButton from '../components/atoms/CbButton.vue'

const reachable = ref<boolean | null>(null)

const { currentUser } = useCurrentUser()
const userEmail = computed(() => currentUser.value?.email ?? null)

onMounted(async () => {
  reachable.value = await isSupabaseReachable()
})

function signInWithGoogle() {
  supabase.auth.signInWithOAuth({ provider: 'google' })
}

function signOut() {
  supabase.auth.signOut()
}
</script>

<template>
  <h1 class="text-3xl text-white">Einstellungen</h1>
  <p class="mt-4 text-white">
    Supabase erreichbar:
    {{ reachable === null ? '...' : reachable ? 'ja' : 'nein' }}
  </p>

  <p class="mt-2 text-white">
    Angemeldet als: {{ userEmail ?? 'niemand' }}
  </p>

  <CbButton v-if="!userEmail" class="mt-4 w-64" @click="signInWithGoogle">
    Mit Google anmelden
  </CbButton>
  <CbButton v-else variant="secondary" class="mt-4 w-64 justify-center" @click="signOut">
    Abmelden
  </CbButton>
</template>
