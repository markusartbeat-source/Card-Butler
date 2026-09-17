<template>
  <div class="bg-background/80 backdrop-blur-md">
    <!-- Darkens and blurs whatever lies behind it. Where it goes and how big
         it is comes from the caller. The comment sits inside the div on
         purpose: a comment next to the root would make "$el" point at an
         empty text node instead of this div. -->
    <slot />
  </div>
</template>
