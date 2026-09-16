<template>
  <CbRemoveMemberDialog
    :member="memberToRemove"
    @close="memberToRemove = null"
    @confirm="confirmRemove"
  />

  <div class="flex min-h-full flex-col">
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.userManagement.title">
        <!-- Image row: a dark box in the photo's shape until the real image
             arrives — the same box as on the share page. -->
        <div class="animate-cb-rise border-b-0 px-6 pt-6" :style="riseDelay(0)">
          <div class="member-image-placeholder w-full rounded-2xl bg-background"></div>
        </div>

        <!-- One row per member: avatar, name, permission, plan. The delete
             button only shows up while the mouse is on the row (or the button
             has the keyboard focus), so the list stays calm. -->
        <div class="flex flex-col divide-y divide-surface-light p-6">
          <div
            v-for="(member, index) in projectMembers"
            :key="member.id"
            class="group animate-cb-rise flex items-center gap-3 p-2 text-sm text-white"
            :style="riseDelay(index + 1)"
          >
            <CbAvatar :name="member.name" />
            <span class="flex-1">{{ member.name }}</span>
            <!-- The select hands back a plain string, the member only knows
                 the three permissions — the list holds nothing else. -->
            <CbSelect
              :model-value="member.permission"
              variant="field"
              :items="permissions"
              class="flex-1"
              @update:model-value="member.permission = $event as Permission"
            />
            <span class="flex-1">{{ dictionary.upgrade.plans[member.plan].name }}</span>
            <CbButton
              variant="icon"
              size="small"
              class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              :aria-label="dictionary.userManagement.removeUser"
              @click="memberToRemove = member"
            >
              <CbIcon name="delete" />
            </CbButton>
          </div>
        </div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import { useHeader } from '../components/organisms/headerState'
import CbRemoveMemberDialog from '../userManagement/CbRemoveMemberDialog.vue'
import {
  projectMembers,
  removeProjectMember,
  type Permission,
  type ProjectMember,
} from '../userManagement/projectMembers'

useHeader(() => ({ title: dictionary.header.userManagement, searchbar: false }))

// The same three steps a person can be invited with on the share page.
const permissions = computed(() => [
  { value: 'view', label: dictionary.shareProject.permissionView },
  { value: 'edit', label: dictionary.shareProject.permissionEdit },
  { value: 'admin', label: dictionary.shareProject.permissionAdmin },
])

// The member the dialog is asking about — null while no dialog is open.
const memberToRemove = ref<ProjectMember | null>(null)

function confirmRemove() {
  if (memberToRemove.value) removeProjectMember(memberToRemove.value.id)
  memberToRemove.value = null
}

// Every row waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom — the same feel as the share page.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>

<style scoped>
/* The photo's shape from the design (582 × 125). */
.member-image-placeholder {
  aspect-ratio: 582 / 125;
}
</style>
