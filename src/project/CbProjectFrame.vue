<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { currentProject, openProject } from './currentProject'

const props = defineProps<{ projectId: string }>()

// Alle Seiten unter /project/<id> laufen im geöffneten Projekt. Laden nur, wenn
// es noch nicht offen ist – nicht bei jedem Seitenwechsel darin.
// Unbekanntes Projekt: Den Toast zeigt schon die Poststelle, also zurück zur
// Startseite. "replace", damit „Zurück“ nicht wieder hierher führt.
const router = useRouter()
watch(
  () => props.projectId,
  async (projectId) => {
    if (currentProject.value?.id === projectId) return
    if (!(await openProject(projectId))) router.replace('/home')
  },
  { immediate: true },
)
</script>
