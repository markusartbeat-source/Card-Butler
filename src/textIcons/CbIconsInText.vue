<template>
  <div class="flex flex-col gap-12">
    <CbExampleTextEditor />

    <CbDivider />

    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-1.5">
        <h3 class="cb-headline-01">{{ dictionary.textIcons.myIcons }}</h3>
        <CbTooltip :text="dictionary.textIcons.shortcodeHint">
          <CbButton variant="icon" size="small" :aria-label="dictionary.textIcons.shortcodeHint">
            <CbIcon name="info" />
          </CbButton>
        </CbTooltip>
      </div>
      <!-- The dark panel: settings on top, the icon tiles below a line. -->
      <div class="rounded-3xl bg-surface shadow-lg ring ring-surface-edge">
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
import CbExampleTextEditor from './CbExampleTextEditor.vue'
import CbTextIconSettings from './CbTextIconSettings.vue'
import CbTextIconTiles from './CbTextIconTiles.vue'
</script>
