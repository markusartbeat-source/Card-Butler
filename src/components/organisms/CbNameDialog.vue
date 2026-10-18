<template>
  <!-- Fragt nach einem Namen, z.B. beim Anlegen und Umbenennen eines Projekts
       oder beim Anlegen eines Ordners. -->
  <CbDialog
    :open="open"
    :title="title"
    size-class="w-120"
    panel-class="gap-6"
    @update:open="$emit('update:open', $event)"
  >
    <!-- Das Formular sorgt dafür, dass Enter im Feld speichert. -->
    <form @submit.prevent="submit">
      <CbInput v-model="name" :label="dictionary.nameDialog.name" autofocus />
    </form>

    <template #footer>
      <CbButton variant="secondary" @click="$emit('update:open', false)">
        {{ dictionary.general.cancel }}
      </CbButton>
      <CbButton :disabled="!trimmedName || isSaving" @click="submit">
        {{ dictionary.general.save }}
      </CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbButton from '../atoms/CbButton.vue'
import CbDialog from '../atoms/CbDialog.vue'
import CbInput from '../atoms/CbInput.vue'

const props = defineProps<{
  open: boolean
  title: string
  /** Startwert des Feldes, z.B. der bisherige Name beim Umbenennen. */
  initialName?: string
  /** Speichert den Namen und liefert, ob es geklappt hat – nur dann schließt
   *  der Dialog. */
  save: (name: string) => Promise<boolean>
}>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const name = ref('')
const trimmedName = computed(() => name.value.trim())
// Verhindert, dass doppeltes Enter zweimal speichert.
const isSaving = ref(false)

// Bei jedem Öffnen mit dem Startwert beginnen.
watch(
  () => props.open,
  (open) => {
    if (open) name.value = props.initialName ?? ''
  },
)

async function submit() {
  if (!trimmedName.value || isSaving.value) return
  isSaving.value = true
  const isSaved = await props.save(trimmedName.value)
  isSaving.value = false
  if (isSaved) emit('update:open', false)
}
</script>
