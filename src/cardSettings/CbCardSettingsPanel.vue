<template>
  <div class="bg-surface rounded-2xl p-6">
    <!-- Title framed by a short golden stroke on each side. -->
    <div class="flex items-center justify-center gap-3">
      <span class="bg-gold h-px w-4.5"></span>
      <h2 class="text-xl text-white">{{ dictionary.cardEditor.cardSettings }}</h2>
      <span class="bg-gold h-px w-4.5"></span>
    </div>

    <CbTabs v-model="activeTab" class="mt-6" :items="tabs">
      <template #settings>
        <!-- The key rebuilds the whole block whenever another set of groups is
             shown, so the groups rise in again instead of only once. -->
        <div v-if="isVisible" :key="activeTab" class="mt-6">
          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(0)">
            <h3 class="text-base font-bold text-white">{{ dictionary.cardEditor.sizesGroup }}</h3>
            <div class="flex items-center gap-3">
              <CbInput v-model="width" class="flex-1" :label="dictionary.cardEditor.width" />
              <CbToggle
                v-model="areSizesLinked"
                icon="link"
                :aria-label="dictionary.cardEditor.linkSizes"
              />
              <CbInput v-model="height" class="flex-1" :label="dictionary.cardEditor.height" />
            </div>
            <CbSelect
              v-model="unit"
              variant="field"
              :label="dictionary.cardEditor.unit"
              :items="units"
            />
          </div>

          <!-- A divider rises in together with the group below it. -->
          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(1)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(1)">
            <h3 class="text-base font-bold text-white">{{ dictionary.cardEditor.cornersGroup }}</h3>
            <div class="flex items-center gap-3">
              <!-- One field for all corners, or one field per corner. -->
              <CbSlideSwap class="grow" :show-second="areCornersSeparate">
                <template #first>
                  <CbInput
                    v-model="cornerRadius"
                    icon="crop_free"
                    :label="dictionary.cardEditor.cornerRadius"
                  />
                </template>
                <!-- Two rows of two, each field takes the same share of the row. -->
                <template #second>
                  <div class="flex flex-col gap-3">
                    <div v-for="(row, index) in cornerRows" :key="index" class="flex gap-3">
                      <CbInput
                        v-for="corner in row"
                        :key="corner.key"
                        v-model="corners[corner.key]"
                        class="flex-1"
                        :icon="corner.icon"
                        :label="corner.label"
                      />
                    </div>
                  </div>
                </template>
              </CbSlideSwap>
              <CbToggle
                v-model="areCornersSeparate"
                icon="crop_free"
                :aria-label="dictionary.cardEditor.separateCorners"
              />
            </div>
          </div>

          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(2)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(2)">
            <h3 class="text-base font-bold text-white">{{ dictionary.cardEditor.colorGroup }}</h3>
            <CbColorPicker v-model="color" :label="dictionary.cardEditor.pickColor" />
          </div>

          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(3)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(3)">
            <div class="flex items-center gap-1.5">
              <h3 class="text-base font-bold text-white">{{ dictionary.cardEditor.bleedGroup }}</h3>
              <CbTooltip :text="dictionary.cardEditor.bleedInfo">
                <CbButton
                  variant="ghost"
                  size="small"
                  :aria-label="dictionary.cardEditor.bleedInfo"
                >
                  <CbIcon name="info" size="small" />
                </CbButton>
              </CbTooltip>
            </div>
            <div class="flex items-center gap-3">
              <CbInput v-model="bleedWidth" class="flex-1" :label="dictionary.cardEditor.width" />
              <CbToggle
                v-model="isBleedLinked"
                icon="link"
                :aria-label="dictionary.cardEditor.linkSizes"
              />
              <CbInput v-model="bleedHeight" class="flex-1" :label="dictionary.cardEditor.height" />
            </div>
          </div>
        </div>
      </template>
    </CbTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbColorPicker from '../components/atoms/CbColorPicker.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSlideSwap from '../components/atoms/CbSlideSwap.vue'
import CbTabs from '../components/atoms/CbTabs.vue'
import CbToggle from '../components/atoms/CbToggle.vue'
import CbTooltip from '../components/atoms/CbTooltip.vue'

// The panel is already on the page while the card is still flying in. The
// groups are only built once it is really on screen, otherwise their entrance
// would already be over by the time anyone can see it.
defineProps<{ isVisible: boolean }>()

const activeTab = ref('settings')

// Every group waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom instead of appearing at once.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}

// The values only live in the panel for now, they do not change the card yet.
const width = ref('20')
const height = ref('90')
const areSizesLinked = ref(false)
const unit = ref('cm')
const cornerRadius = ref('20')
const areCornersSeparate = ref(false)
const corners = ref({ topLeft: '20', topRight: '20', bottomLeft: '20', bottomRight: '20' })
const color = ref('#ffffff')
const bleedWidth = ref('3')
const bleedHeight = ref('3')
const isBleedLinked = ref(false)

// The single field can hold all four values separated by commas. A missing
// value falls back to the first one, so "20" fills every corner.
watch(areCornersSeparate, (separate) => {
  if (separate) {
    const values = cornerRadius.value.split(',').map((value) => value.trim())
    corners.value = {
      topLeft: values[0],
      topRight: values[1] ?? values[0],
      bottomLeft: values[2] ?? values[0],
      bottomRight: values[3] ?? values[0],
    }
    return
  }

  const { topLeft, topRight, bottomLeft, bottomRight } = corners.value
  const values = [topLeft, topRight, bottomLeft, bottomRight]
  const areAllTheSame = values.every((value) => value === values[0])
  cornerRadius.value = areAllTheSame ? values[0] : values.join(', ')
})

const cornerRows = computed(() => [
  [
    {
      key: 'topLeft' as const,
      icon: 'north_west' as const,
      label: dictionary.cardEditor.cornerTopLeft,
    },
    {
      key: 'topRight' as const,
      icon: 'north_east' as const,
      label: dictionary.cardEditor.cornerTopRight,
    },
  ],
  [
    {
      key: 'bottomLeft' as const,
      icon: 'south_west' as const,
      label: dictionary.cardEditor.cornerBottomLeft,
    },
    {
      key: 'bottomRight' as const,
      icon: 'south_east' as const,
      label: dictionary.cardEditor.cornerBottomRight,
    },
  ],
])

const units = computed(() => [
  { value: 'cm', label: dictionary.cardEditor.unitCentimeters },
  { value: 'mm', label: dictionary.cardEditor.unitMillimeters },
  { value: 'in', label: dictionary.cardEditor.unitInches },
])

const tabs = computed(() => [
  { value: 'settings', label: dictionary.cardEditor.settingsTab },
  { value: 'layers', label: dictionary.cardEditor.layersTab },
])
</script>
