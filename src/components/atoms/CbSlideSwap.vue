<template>
  <!-- Two blocks sit above each other in one cut-off box and only one of them
       shows. On a switch the strip slides by the distance between the blocks
       while the box grows to the new height — one even movement. -->
  <div class="cb-swap" :style="{ height: boxHeight }">
    <div class="cb-swap-strip flex flex-col gap-3" :style="{ transform: stripOffset }">
      <div ref="firstBlock" :inert="showSecond">
        <slot name="first" />
      </div>
      <div ref="secondBlock" :inert="!showSecond">
        <slot name="second" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{ showSecond: boolean }>()

// Both blocks keep their natural height; only the visible box is animated, so
// the sizes are read from the page instead of being written down anywhere.
const firstBlock = ref<HTMLElement>()
const secondBlock = ref<HTMLElement>()
const firstHeight = ref(0)
const secondHeight = ref(0)
// The distance between the two blocks already holds the gap between them.
const stripDistance = ref(0)

onMounted(() => {
  firstHeight.value = firstBlock.value?.offsetHeight ?? 0
  secondHeight.value = secondBlock.value?.offsetHeight ?? 0
  stripDistance.value = (secondBlock.value?.offsetTop ?? 0) - (firstBlock.value?.offsetTop ?? 0)
})

const boxHeight = computed(() => {
  const height = props.showSecond ? secondHeight.value : firstHeight.value
  return height ? `${height}px` : 'auto'
})

const stripOffset = computed(() => `translateY(-${props.showSecond ? stripDistance.value : 0}px)`)
</script>
