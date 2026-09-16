<template>
  <CbRemoveMemberDialog
    :member="memberToRemove"
    @close="memberToRemove = null"
    @confirm="confirmRemove"
  />

  <!-- The spacers share the free height 2:3 — see ShareProjectPage. -->
  <div class="flex min-h-full flex-col">
    <div class="grow-2"></div>
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
             has the keyboard focus), so the list stays calm.
             The whole row feels like a button and a click on it opens the
             permission list, so nobody has to aim at the small field. -->
        <!-- The divider sits on a straight outer box: on the rounded row
             itself it would bend along the corners. -->
        <div class="flex flex-col divide-y divide-surface-light p-6">
          <div
            v-for="(member, index) in projectMembers"
            :key="member.id"
            class="animate-cb-rise"
            :style="riseDelay(index + 1)"
          >
          <div
            v-ripple
            :data-member-id="member.id"
            class="group cb-hover relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-2 py-1 text-sm text-white"
            @click="togglePermissionList($event, member.id)"
          >
            <CbAvatar :name="member.name" />
            <span class="flex-1 truncate" :title="member.name">{{ member.name }}</span>
            <!-- The select hands back a plain string, the member only knows
                 the three permissions — the list holds nothing else. -->
            <CbSelect
              :model-value="member.permission"
              :open="openPermissionListOf === member.id"
              variant="field"
              :items="permissions"
              class="flex-2"
              @update:model-value="member.permission = $event as Permission"
              @update:open="openPermissionListOf = $event ? member.id : null"
              @interact-outside="keepListOpenOnRowClick($event, member.id)"
            />
            <span class="flex-1">{{ dictionary.upgrade.plans[member.plan].name }}</span>
            <CbButton
              variant="icon"
              class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              :aria-label="dictionary.userManagement.removeUser"
              @click="memberToRemove = member"
            >
              <CbIcon name="delete" />
            </CbButton>
          </div>
          </div>
        </div>
      </CbSettingsGroup>
    </div>
    <div class="grow-3"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SelectInteractOutsideEvent } from '@ark-ui/vue'
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

// The member whose permission list is open — null while all are closed.
const openPermissionListOf = ref<string | null>(null)

// A click anywhere on the row opens or closes its permission list. The
// buttons in the row (the field itself, delete) already do their own thing,
// so a click on them is left alone.
function togglePermissionList(event: MouseEvent, memberId: string) {
  if ((event.target as HTMLElement).closest('button')) return
  openPermissionListOf.value = openPermissionListOf.value === memberId ? null : memberId
}

// Ark closes the list on any click outside of it — a click on the row too.
// Without this the row click would close the list and open it again at once.
function keepListOpenOnRowClick(event: SelectInteractOutsideEvent, memberId: string) {
  const clickedRow = (event.detail.originalEvent.target as HTMLElement).closest('[data-member-id]')
  if (clickedRow?.getAttribute('data-member-id') === memberId) event.preventDefault()
}

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
