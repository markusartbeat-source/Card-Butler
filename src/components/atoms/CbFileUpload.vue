<template>
  <!-- Ark UI bringt nur das Verhalten. Das Element im Slot wird selbst zur
       Ablagefläche: Ein Klick öffnet die Dateiauswahl, und man kann Dateien
       darauf ziehen. Der Rahmen um beides nimmt keinen Platz ein (contents). -->
  <FileUpload.RootProvider :value="fileUpload" class="contents">
    <!-- Das Element im Slot ist ein echter Button und öffnet die Auswahl bei
         Klick, Enter und Leertaste selbst. Hörte Zag zusätzlich auf die Tasten,
         ginge sie doppelt auf (disable-click). Zags role="application" und sein
         englisches aria-label fallen weg. So behält der Button seine Rolle und
         seinen sichtbaren Text. -->
    <!-- Gesperrt nimmt Zag keine Dateien an. Ohne preventDefault öffnete der
         Browser eine abgelegte Datei dann selbst und verließe die App. -->
    <FileUpload.Dropzone
      as-child
      disable-click
      :role="undefined"
      :aria-label="undefined"
      @click="fileUpload.openFilePicker()"
      @dragover.prevent
      @drop.prevent
    >
      <slot />
    </FileUpload.Dropzone>
    <FileUpload.HiddenInput />
  </FileUpload.RootProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileUpload, useFileUpload } from '@ark-ui/vue'

export type FileRejectionReason = 'wrongType' | 'tooLarge'

// accept: erlaubte MIME-Typen, z.B. 'image/png'. maxFileSize in Byte.
// disabled: nimmt nichts an, bleibt aber per Tastatur erreichbar (aria-disabled).
const props = defineProps<{ accept: string[]; maxFileSize: number; disabled?: boolean }>()

// accept: die angenommenen Dateien einer Auswahl. reject: einmal je abgelehnter Datei.
const emit = defineEmits<{
  accept: [files: File[]]
  reject: [file: File, reason: FileRejectionReason]
}>()

const fileUpload = useFileUpload(
  computed(() => ({
    accept: props.accept,
    maxFileSize: props.maxFileSize,
    disabled: props.disabled,
    maxFiles: Number.POSITIVE_INFINITY,
    // Immer leer: Jede Auswahl wird nur gemeldet, nicht gesammelt. Sonst lehnte
    // Zag eine schon einmal gewählte Datei als doppelt ab.
    acceptedFiles: [],
    onFileAccept: reportAcceptedFiles,
    onFileReject: reportRejectedFiles,
  })),
)

function reportAcceptedFiles({ files }: FileUpload.FileAcceptDetails) {
  if (files.length > 0) emit('accept', files)
}

function reportRejectedFiles({ files }: FileUpload.FileRejectDetails) {
  for (const { file, errors } of files) {
    if (errors.includes('FILE_INVALID_TYPE')) emit('reject', file, 'wrongType')
    else if (errors.includes('FILE_TOO_LARGE')) emit('reject', file, 'tooLarge')
    // Sonst ist sie nur doppelt in derselben Auswahl und schon angenommen.
  }
  // Zag meldet nur Änderungen. Erst geleert meldet es dieselbe falsche Datei
  // beim nächsten Versuch wieder.
  fileUpload.value.clearRejectedFiles()
}
</script>
