<template>
  <CbImageViewer
    v-if="openedImage"
    :key="openedImage.image.id"
    :image="openedImage.image"
    :ratio="openedImage.ratio"
    :start-rect="openedImage.tileRect"
    @close="openedImage = null"
  />

  <CbNameDialog
    v-model:open="isNewFolderDialogOpen"
    :title="dictionary.images.newFolder"
    :save="saveNewFolder"
  />

  <!-- Seitlich Überstehendes wird abgeschnitten: Beim Sortieren gleiten
       Kacheln kurz von ihrem alten Platz herüber und würden sonst für einen
       Moment einen waagrechten Scrollbalken bringen. -->
  <div class="mx-auto flex max-w-315 flex-col gap-6 overflow-x-clip px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <div v-if="projectFolders?.length" class="-mx-2 flex flex-wrap gap-2">
      <CbFolder v-for="folder in projectFolders" :key="folder.id" :name="folder.data.name" />
    </div>
    <CbImageGrid
      :images="projectImages ?? []"
      @update:images="projectImages = $event"
      :opened-image-id="openedImage?.image.id"
      @open="openImage"
      @drag-end="finishImageDrag"
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
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CbAddTile from '../components/atoms/CbAddTile.vue'
import CbFileUpload, { type FileRejectionReason } from '../components/atoms/CbFileUpload.vue'
import CbFolder from '../components/atoms/CbFolder.vue'
import { showDangerToast } from '../components/atoms/toaster'
import CbNameDialog from '../components/organisms/CbNameDialog.vue'
import CbImageGrid from '../images/CbImageGrid.vue'
import CbImageViewer from '../images/CbImageViewer.vue'
import type { ImageResource } from '../api/images/imagesApi'
import { loadProjectImages, projectImages } from '../images/projectImages'
import { isUploadingImages, uploadImages } from '../images/uploadImages'
import { useHeader } from '../components/organisms/headerState'
import { cardFormat } from '../card/cardFormat'
import { currentProject } from '../project/currentProject'
import { dimWhileDraggingClasses } from '../dragAndDrop/dimWhileDragging'
import { endDrag, releaseDrag } from '../dragAndDrop/dragState'
import { deleteDroppedImage } from '../images/deleteDroppedImage'
import { undoDeletionOnKey } from '../deletion/undoDeletionOnKey'
import { loadProjectFolders, projectFolders } from '../folders/projectFolders'
import { createFolder } from '../folders/createFolder'

useHeader(() => ({
  title: currentProject.value?.name,
  subtitle: dictionary.header.allImages,
  searchbar: false,
}))

// Die Seite wird je Projekt neu eingehängt, die ID bleibt also fest.
const projectId = String(useRoute().params.projectId)

// Bei jedem Öffnen der Seite frisch, so erscheinen auch Bilder und Ordner der
// anderen im Projekt.
loadProjectImages(projectId)
loadProjectFolders(projectId)

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

// Loslassen über einem Feld der Drop-Leiste sortiert nicht – das Feld
// entscheidet. Löschen bringt eine Animation mit und gibt den Zieh-Zustand
// darum selbst frei. „In neuen Ordner“ fragt erst nach dem Namen.
function finishImageDrag() {
  const { droppedOn, index, element } = endDrag()
  if (droppedOn === 'deleteImage') return deleteDroppedImage(index, element)
  if (droppedOn === 'moveIntoNewFolder') isNewFolderDialogOpen.value = true
  releaseDrag()
}

const isNewFolderDialogOpen = ref(false)

// Das Bild wandert noch nicht mit in den neuen Ordner.
async function saveNewFolder(name: string) {
  return (await createFolder(projectId, name)) !== null
}

onMounted(() => window.addEventListener('keydown', undoDeletionOnKey))
onUnmounted(() => window.removeEventListener('keydown', undoDeletionOnKey))
</script>
