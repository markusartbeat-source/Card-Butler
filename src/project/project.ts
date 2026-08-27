import { computed } from 'vue'

// The one project that exists for now. Sidebar and project page read the name
// from here, so both always show the same thing. Real projects come later.
export const projectName = computed(() => dictionary.project.name)
