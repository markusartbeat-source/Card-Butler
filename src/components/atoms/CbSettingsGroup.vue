<template>
  <!-- One block of settings: a small title above a dark rounded panel.
       divide-y draws the thin line between the rows on its own, so a row
       never has to bring its own separator. The lines run from edge to edge,
       which is why the padding sits in the rows and not in the panel.
       auto-rows-fr gives every row the height of the tallest one, so no row
       needs a height of its own. -->
  <section class="w-160 max-w-full">
    <h2 class="mb-3 text-xl text-white">{{ title }}</h2>
    <div
      class="grid auto-rows-fr divide-y divide-surface-light rounded-3xl bg-surface shadow-lg"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
