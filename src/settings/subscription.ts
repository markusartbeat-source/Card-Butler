import { computed } from 'vue'

// Fixed example values for the subscription card. No database behind it yet.
// The texts come from the dictionary, so they follow the chosen language.
export const subscription = computed(() => ({
  planName: dictionary.upgrade.plans.pro.name,
  pricePerMonth: 12,
  storageUsedMb: 12,
  storageTotalMb: 50,
  projectsUsed: 1,
  projectsTotal: 1,
  // Where the data is stored, shown as a small map.
  dataCityName: dictionary.settings.dataCityName,
  dataLatitude: 52.0302,
  dataLongitude: 8.5325,
}))
