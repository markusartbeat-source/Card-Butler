<template>
  <CbImageViewer
    v-if="openedImage"
    :key="openedImage.image.id"
    :image="openedImage.image"
    :ratio="openedImage.ratio"
    :start-rect="openedImage.tileRect"
    @close="openedImage = null"
  />

  <!-- Seitlich Überstehendes wird abgeschnitten: Beim Sortieren gleiten
       Kacheln kurz von ihrem alten Platz herüber und würden sonst für einen
       Moment einen waagrechten Scrollbalken bringen. -->
  <div class="mx-auto max-w-315 overflow-x-clip px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <div class="-mx-2 flex gap-2">
      <CbFolder v-for="folder in folders" :key="folder" :name="dictionary.images.placeholderFolderName" />
    </div>
    <CbImageGrid
      class="mt-6"
      :images="projectImages ?? []"
      @update:images="projectImages = $event"
      :opened-image-id="openedImage?.image.id"
      @open="openImage"
    >
      <!-- Hochkant wie eine Karte, wächst mit der Zeile wie die Bilder. -->
      <template #leading="{ tileStyle }">
        <!-- Während des Hochladens gesperrt. Das Ergebnis meldet danach ein
             Toast, den Screenreader vorlesen. Kein Kommentar vor CbAddTile:
             Ark legt sich per as-child darauf. -->
        <CbFileUpload
          :accept="acceptedImageTypes"
          :max-file-size="maximumImageMegabytes * 1024 * 1024"
          :disabled="isUploadingImages"
          @accept="uploadImages(projectId, $event)"
          @reject="showRejectedImage"
        >
          <CbAddTile
            icon="add_2"
            :label="isUploadingImages ? dictionary.images.uploadingImages : dictionary.images.uploadImages"
            :aria-busy="isUploadingImages"
            class="rounded-lg data-disabled:cursor-progress"
            :class="dimWhileDraggingClasses"
            :style="tileStyle(cardFormat.width / cardFormat.height)"
          />
        </CbFileUpload>
      </template>
    </CbImageGrid>
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
import type { ImageResource } from '../api/images/imagesApi'
import { loadProjectImages, projectImages } from '../images/projectImages'
import { isUploadingImages, uploadImages } from '../images/uploadImages'
import { useHeader } from '../components/organisms/headerState'
import { cardFormat } from '../card/cardFormat'
import { currentProject } from '../project/currentProject'
import { dimWhileDraggingClasses } from '../dragAndDrop/dimWhileDragging'

useHeader(() => ({
  title: currentProject.value?.name,
  subtitle: dictionary.header.allImages,
  searchbar: false,
}))

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

// Das geöffnete Bild samt Seitenverhältnis und dem Platz seiner Kachel im
// Raster, dort startet der Flug des Betrachters.
const openedImage = ref<{ image: ImageResource; tileRect: DOMRect; ratio: number } | null>(null)

function openImage(image: ImageResource, tileRect: DOMRect, ratio: number) {
  openedImage.value = { image, tileRect, ratio }
}
</script>
