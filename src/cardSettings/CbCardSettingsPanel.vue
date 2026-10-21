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
              :width="cardSet.data.width"
              :height="cardSet.data.height"
              :width-label="dictionary.cardEditor.width"
              :height-label="dictionary.cardEditor.height"
              :link-label="dictionary.cardEditor.linkSizes"
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
            <CbColorPicker :model-value="cardSet.data.color" :label="dictionary.cardEditor.pickColor" />
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
              :width="cardSet.data.bleedWidth"
              :height="cardSet.data.bleedHeight"
              :width-label="dictionary.cardEditor.width"
              :height-label="dictionary.cardEditor.height"
              :link-label="dictionary.cardEditor.linkSizes"
            />
            <!-- TEMPORÄR: Set-Version zum Prüfen, ob Speichern sie hochzählt. -->
            <p class="text-sm text-white">{{ cardSet.version }}</p>
          </div>
        </div>
      </template>
      <template #layers>
        <CbLayerList
          v-if="isVisible"
          :key="activeTab"
          class="animate-cb-rise mt-6"
          :card-set="cardSet"
          :card="card"
        />
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
import { uniformCornerRadii } from '../card/cornerRadii'
import type { Card, CardSet } from '../cardSets/cardSets'
import CbLayerList from '../layers/CbLayerList.vue'

// The panel is already on the page while the card is still flying in. The
// groups are only built once it is really on screen, otherwise their entrance
// would already be over by the time anyone can see it.
// card ist die offene Karte, cardSet ihr Set – seine Elemente sind die Ebenen,
// die Liste stellt sie beim Sortieren um.
defineProps<{ isVisible: boolean; card: Card; cardSet: CardSet }>()

const activeTab = ref('settings')

// Every group waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom instead of appearing at once.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}

// Größe, Farbe und Anschnitt kommen aus dem Set. Die übrigen Werte leben
// vorerst nur im Panel und ändern die Karte noch nicht.
const printCount = ref('1')
const unit = ref('mm')
const cornerRadii = ref(uniformCornerRadii(20))

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
