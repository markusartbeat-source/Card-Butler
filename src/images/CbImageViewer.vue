<template>
  <div class="fixed inset-0 z-50">
    <CbDimLayer class="absolute inset-0" @click="$emit('close')" />

    <!-- Lets clicks beside the picture fall through to the dim layer. -->
    <div class="pointer-events-none relative flex h-full items-center justify-center p-8">
      <!-- The picture is as wide as the space allows, but never taller than
           the space either: 4rem is the padding above and below. -->
      <div
        class="w-full rounded-lg bg-gradient-to-br"
        :class="image.gradientClasses"
        :style="{ aspectRatio: ratio, maxWidth: `calc((100vh - 4rem) * ${ratio})` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import CbDimLayer from '../components/atoms/CbDimLayer.vue'
import type { DummyImage } from './dummyImages'

const props = defineProps<{ image: DummyImage }>()
const emit = defineEmits<{ close: [] }>()

const ratio = props.image.ratioWidth / props.image.ratioHeight

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>
