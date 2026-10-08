<template>
  <!-- Textblock links, Abstände wie im Figma (105px links, 88px unter der Linie). -->
  <div class="mt-22 ml-26 flex w-fit flex-col gap-2.5">
    <h1 class="text-display flex flex-col leading-12.5 font-bold text-white">
      <span>{{ dictionary.home.titleCards }}</span>
      <span class="text-gold">{{ dictionary.home.titleStories }}</span>
    </h1>
    <p class="w-100 font-bold text-white">{{ dictionary.home.description }}</p>
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
      <h2 id="home-projects-title" class="font-bold text-white">
        {{ dictionary.home.projectsTitle }}
      </h2>
      <ul v-if="projects.length" class="flex flex-col gap-2">
        <CbProjectListItem v-for="project in projects" :key="project.id" :name="project.name" />
      </ul>
      <p v-else class="text-label text-sm">{{ dictionary.home.noProjects }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProjectListItem from '../components/molecules/CbProjectListItem.vue'
import { useHeader } from '../components/organisms/headerState'
import { useCurrentUser } from '../composables/useCurrentUser'
import { loadProjects, projects } from '../project/projects'

useHeader(() => ({ logo: true, menus: false, searchbar: false, goldLine: true }))

const { currentUser } = useCurrentUser()
const isMember = computed(() => currentUser.value?.guest === false)

onMounted(() => {
  if (isMember.value) loadProjects()
})
</script>
