<template>
  <!-- Textblock links, ab Tablet Abstände wie im Figma (105px links, 88px unter
       der Linie). Auf dem Handy schmaler Rand, damit der Text Platz hat. -->
  <div class="mx-4 mt-8 flex w-fit flex-col gap-2.5 tablet:mt-22 tablet:ml-26">
    <h1 class="cb-display-text flex flex-col">
      <span>{{ dictionary.home.titleCards }}</span>
      <span class="cb-display-text-gold">{{ dictionary.home.titleStories }}</span>
    </h1>
    <p class="cb-headline-02 tablet:w-100">{{ dictionary.home.description }}</p>
    <!-- Vorerst ohne Funktion. -->
    <CbButton class="self-start">
      <CbIcon name="live_tv" />
      {{ dictionary.home.watchVideoTutorial }}
    </CbButton>

    <!-- Gäste dürfen keine Projekte haben, daher nur für angemeldete Personen. -->
    <section
      v-if="isMember && projects"
      aria-labelledby="home-projects-title"
      class="mt-10 flex flex-col gap-2.5"
    >
      <h2 id="home-projects-title" class="cb-headline-02">
        {{ dictionary.home.projectsTitle }}
      </h2>
      <ul v-if="projects.length" class="flex flex-col gap-2">
        <CbProjectListItem
          v-for="project in projects"
          :key="project.id"
          :project-id="project.id"
          :name="project.name"
          @rename="projectToRename = project"
        />
      </ul>
      <p v-else class="cb-regular-text-muted">{{ dictionary.home.noProjects }}</p>
      <CbButton variant="secondary" class="self-start" @click="isNewProjectDialogOpen = true">
        <CbIcon name="add_2" />
        {{ dictionary.home.newProject }}
      </CbButton>
      <CbNameDialog
        v-model:open="isNewProjectDialogOpen"
        :title="dictionary.home.newProject"
        :save="createProject"
      />
      <!-- Der Dialog meldet nur das Schließen, daher immer zurück auf null. -->
      <CbNameDialog
        :open="projectToRename !== null"
        :title="dictionary.home.renameProject"
        :initial-name="projectToRename?.name"
        :save="(name) => renameProject(projectToRename!.id, name)"
        @update:open="projectToRename = null"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Project } from '../api/projects/projectsApi'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProjectListItem from '../components/molecules/CbProjectListItem.vue'
import CbNameDialog from '../components/organisms/CbNameDialog.vue'
import { useHeader } from '../components/organisms/headerState'
import { useCurrentUser } from '../composables/useCurrentUser'
import { createProject, loadProjects, projects } from '../project/projects'
import { renameProject } from '../project/renameProject'

useHeader(() => ({ logo: true, menus: false, searchbar: false, goldLine: true }))

const { currentUser } = useCurrentUser()
const isMember = computed(() => currentUser.value?.guest === false)
const isNewProjectDialogOpen = ref(false)
// Das Projekt im Umbenennen-Dialog – null, solange der Dialog zu ist.
const projectToRename = ref<Project | null>(null)

onMounted(() => {
  if (isMember.value) loadProjects()
})
</script>
