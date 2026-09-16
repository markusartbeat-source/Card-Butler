<template>
  <!-- Asks once more before a member is taken out of the project. -->
  <CbDialog
    :open="member !== null"
    :title="dictionary.userManagement.removeUser"
    size-class="w-120"
    panel-class="gap-6"
    @update:open="(open) => !open && $emit('close')"
  >
    <p class="text-sm">{{ dictionary.userManagement.removeUserQuestion(member?.name ?? '') }}</p>

    <template #footer>
      <CbButton variant="secondary" @click="$emit('close')">
        {{ dictionary.general.cancel }}
      </CbButton>
      <CbButton @click="$emit('confirm')">{{ dictionary.userManagement.remove }}</CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import type { ProjectMember } from './projectMembers'

// The dialog is open as long as it has a member to ask about.
defineProps<{ member: ProjectMember | null }>()
defineEmits<{ close: []; confirm: [] }>()
</script>
