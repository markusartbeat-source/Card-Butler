<template>
  <!-- Darkens and blurs whatever lies behind it. Where it goes and how big it
       is comes from the caller. -->
  <div class="bg-background/80 backdrop-blur-md">
    <slot />
  </div>
</template>
