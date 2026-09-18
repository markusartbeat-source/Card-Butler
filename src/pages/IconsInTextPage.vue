<template>
  <!-- One centred column, the same width as a settings group. -->
  <div class="mx-auto flex max-w-160 flex-col gap-12 px-4 py-6 tablet:px-6">
    <CbExampleTextEditor />

    <CbDivider />

    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-1.5">
        <h2 class="text-xl text-white">{{ dictionary.textIcons.myIcons }}</h2>
        <CbTooltip :text="dictionary.textIcons.shortcodeHint">
          <CbButton variant="icon" size="small" :aria-label="dictionary.textIcons.shortcodeHint">
            <CbIcon name="info" />
          </CbButton>
        </CbTooltip>
      </div>
      <!-- The dark panel: settings on top, the icon tiles below a line. -->
      <div class="rounded-3xl bg-surface shadow-lg">
        <CbTextIconSettings />
        <CbDivider />
        <CbTextIconTiles />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbTooltip from '../components/atoms/CbTooltip.vue'
import { useHeader } from '../components/organisms/headerState'
import CbExampleTextEditor from '../textIcons/CbExampleTextEditor.vue'
import CbTextIconSettings from '../textIcons/CbTextIconSettings.vue'
import CbTextIconTiles from '../textIcons/CbTextIconTiles.vue'

useHeader(() => ({ title: dictionary.header.iconsInText, searchbar: false }))
</script>
