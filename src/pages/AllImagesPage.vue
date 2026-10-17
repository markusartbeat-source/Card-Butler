<template>
  <CbImageViewer
    v-if="openedImage && openedImageRect"
    :key="openedImage.id"
    :image="openedImage"
    :start-rect="openedImageRect"
    @close="openedImage = null"
  />

  <div class="mx-auto max-w-315 px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <div class="-mx-2 flex gap-2">
      <CbFolder v-for="folder in folders" :key="folder" :name="dictionary.images.placeholderFolderName" />
    </div>
    <CbImageGrid
      class="mt-6"
      :images="dummyImages"
      :opened-image-id="openedImage?.id"
      @open="openImage"
    >
      <!-- Hochkant wie eine Karte, so hoch wie die Bilder. -->
      <template #leading="{ tileStyle }">
        <CbFileUpload
          :accept="acceptedImageTypes"
          :max-file-size="maximumImageMegabytes * 1024 * 1024"
          @accept="uploadImages(projectId, $event)"
          @reject="showRejectedImage"
        >
          <CbAddTile
            icon="add_2"
            :label="dictionary.images.uploadImages"
            class="rounded-lg"
            :style="[tileStyle, { aspectRatio: cardFormat.width / cardFormat.height }]"
          />
        </CbFileUpload>
      </template>
    </CbImageGrid>
    <!-- TEMPORÄR (Schritt 5): Bildliste des Projekts als JSON, fliegt beim Aufräumen raus. -->
    <pre class="mt-6 text-xs break-all whitespace-pre-wrap">{{ JSON.stringify(projectImages, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CbAddTile from '../components/atoms/CbAddTile.vue'
import CbFileUpload, { type FileRejectionReason } from '../components/atoms/CbFileUpload.vue'
import CbFolder from '../components/atoms/CbFolder.vue'
import { showDangerToast } from '../components/atoms/toaster'
import CbImageGrid from '../images/CbImageGrid.vue'
import CbImageViewer from '../images/CbImageViewer.vue'
import { dummyImages, type DummyImage } from '../images/dummyImages'
import { loadProjectImages, projectImages } from '../images/projectImages'
import { uploadImages } from '../images/uploadImages'
import { useHeader } from '../components/organisms/headerState'
import { cardFormat } from '../card/cardFormat'

useHeader(() => ({ title: dictionary.header.allImages, searchbar: false }))

const folders = [1, 2, 3]

// Die Seite wird je Projekt neu eingehängt, die ID bleibt also fest.
const projectId = String(useRoute().params.projectId)

// Bei jedem Öffnen der Seite frisch, so erscheinen auch Bilder der anderen im
// Projekt.
loadProjectImages(projectId)

// Was das Backend an Bildern annimmt (10 MB wie in Spring: 10 · 1024 · 1024 Byte).
const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/gif']
const maximumImageMegabytes = 10

function showRejectedImage(file: File, reason: FileRejectionReason) {
  showDangerToast(
    dictionary.images.imageRejected(file.name),
    reason === 'wrongType'
      ? dictionary.images.wrongImageType
      : dictionary.images.imageTooLarge(maximumImageMegabytes),
  )
}

const openedImage = ref<DummyImage | null>(null)
// Where the clicked tile sits in the grid — the viewer starts its flight there.
const openedImageRect = ref<DOMRect | null>(null)

function openImage(image: DummyImage, tileRect: DOMRect) {
  openedImageRect.value = tileRect
  openedImage.value = image
}
</script>
