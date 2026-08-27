import { computed } from 'vue'

// The three plans shown on the upgrade page. The texts come from the
// dictionary, the prices live here — so the list follows the chosen language.
export const plans = computed(() => [
  { ...dictionary.upgrade.plans.free, price: 0 },
  { ...dictionary.upgrade.plans.pro, price: 12 },
  { ...dictionary.upgrade.plans.professional, price: 22 },
])
