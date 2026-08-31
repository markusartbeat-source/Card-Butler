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
        <div class="mt-6 flex flex-col gap-3">
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
      </template>
    </CbTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbTabs from '../components/atoms/CbTabs.vue'
import CbToggle from '../components/atoms/CbToggle.vue'

const activeTab = ref('settings')

// The values only live in the panel for now, they do not change the card yet.
const width = ref('20')
const height = ref('90')
const areSizesLinked = ref(false)
const unit = ref('cm')

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
