<template>
  <CbPanel :title="dictionary.cardEditor.cardSettings">
    <CbTabs v-model="activeTab" class="mt-6" :items="tabs">
      <template #settings>
        <!-- The key rebuilds the whole block whenever another set of groups is
             shown, so the groups rise in again instead of only once. -->
        <div v-if="isVisible" :key="activeTab" class="mt-6">
          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(0)">
            <div class="flex items-center gap-1.5">
              <CbSettingsHeading>{{ dictionary.cardEditor.printGroup }}</CbSettingsHeading>
              <CbTooltip :text="dictionary.cardEditor.printInfo">
                <CbButton
                  variant="icon"
                  size="small"
                  :aria-label="dictionary.cardEditor.printInfo"
                >
                  <CbIcon name="info" size="small" />
                </CbButton>
              </CbTooltip>
            </div>
            <CbInput v-model="printCount" :label="dictionary.cardEditor.printCount" />
          </div>

          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(1)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(1)">
            <CbSettingsHeading>{{ dictionary.cardEditor.sizesGroup }}</CbSettingsHeading>
            <CbSizeFields
              :width="size.width"
              :height="size.height"
              :width-label="dictionary.cardEditor.width"
              :height-label="dictionary.cardEditor.height"
              :link-label="dictionary.cardEditor.linkSizes"
              @change="(side, value) => (size[side] = value)"
            />
            <CbSelect
              v-model="unit"
              variant="field"
              :label="dictionary.cardEditor.unit"
              :items="units"
            />
          </div>

          <!-- A divider rises in together with the group below it. -->
          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(2)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(2)">
            <CbSettingsHeading>{{ dictionary.cardEditor.cornersGroup }}</CbSettingsHeading>
            <CbCornerRadiusFields :radii="cornerRadii" @change="(radii) => (cornerRadii = radii)" />
          </div>

          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(3)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(3)">
            <CbSettingsHeading>{{ dictionary.cardEditor.colorGroup }}</CbSettingsHeading>
            <CbColorPicker v-model="color" :label="dictionary.cardEditor.pickColor" />
          </div>

          <CbDivider class="animate-cb-rise my-6" :style="riseDelay(4)" />

          <div class="animate-cb-rise flex flex-col gap-3" :style="riseDelay(4)">
            <div class="flex items-center gap-1.5">
              <CbSettingsHeading>{{ dictionary.cardEditor.bleedGroup }}</CbSettingsHeading>
              <CbTooltip :text="dictionary.cardEditor.bleedInfo">
                <CbButton
                  variant="icon"
                  size="small"
                  :aria-label="dictionary.cardEditor.bleedInfo"
                >
                  <CbIcon name="info" size="small" />
                </CbButton>
              </CbTooltip>
            </div>
            <CbSizeFields
              :width="bleed.width"
              :height="bleed.height"
              :width-label="dictionary.cardEditor.width"
              :height-label="dictionary.cardEditor.height"
              :link-label="dictionary.cardEditor.linkSizes"
              @change="(side, value) => (bleed[side] = value)"
            />
          </div>
        </div>
      </template>
    </CbTabs>
  </CbPanel>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbColorPicker from '../components/atoms/CbColorPicker.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbPanel from '../components/atoms/CbPanel.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbTabs from '../components/atoms/CbTabs.vue'
import CbTooltip from '../components/atoms/CbTooltip.vue'
import CbCornerRadiusFields from '../components/molecules/CbCornerRadiusFields.vue'
import CbSizeFields from '../components/molecules/CbSizeFields.vue'
import { cardFormat } from '../card/cardFormat'
import { uniformCornerRadii } from '../card/cornerRadii'

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
const printCount = ref('1')
// Startet beim echten Kartenformat in mm, ändert es aber noch nicht.
const size = ref({ width: cardFormat.value.width, height: cardFormat.value.height })
const unit = ref('mm')
const cornerRadii = ref(uniformCornerRadii(20))
const color = ref('#ffffff')
const bleed = ref({ width: 3, height: 3 })

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
