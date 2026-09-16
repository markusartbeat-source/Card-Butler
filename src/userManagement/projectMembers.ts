import { ref } from 'vue'

// What a member may do in the project — the same three steps as the share page.
export type Permission = 'view' | 'edit' | 'admin'

// The plan a member has bought, named like the cards on the upgrade page.
export type Plan = 'free' | 'pro' | 'professional'

export type ProjectMember = {
  id: string
  name: string
  permission: Permission
  plan: Plan
}

// Made-up members until the project has real ones.
export const projectMembers = ref<ProjectMember[]>([
  { id: 'member-1', name: 'Markus Weinert', permission: 'admin', plan: 'pro' },
  { id: 'member-2', name: 'Lena Hoffmann', permission: 'edit', plan: 'free' },
  { id: 'member-3', name: 'Jonas Becker', permission: 'view', plan: 'free' },
  { id: 'member-4', name: 'Sofia Rossi', permission: 'edit', plan: 'professional' },
])

export function removeProjectMember(id: string) {
  projectMembers.value = projectMembers.value.filter((member) => member.id !== id)
}
