<template>
  <!-- Takes the whole card area while no card matches the search word, so the
       box sits in its middle. A plain placeholder — the illustration and the
       final text come later. -->
  <div class="flex flex-1 items-center justify-center">
    <div
      class="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-label px-12 py-10 text-center text-label"
    >
      {{ dictionary.search.noResults }}
    </div>
  </div>
</template>
