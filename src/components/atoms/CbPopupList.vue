<template>
  <!-- Die Liste, die unter einem Feld aufklappt. Ark legt sein Verhalten per
       as-child darauf, z.B. <Select.Content as-child>. z-50 hält sie über
       allem anderen, Ark übernimmt den Wert für seinen Positioner.
       cb-collapse rollt sie auf und zu: Der äußere Kasten wird abgeschnitten,
       die Liste darin behält ihre volle Höhe, damit die Einträge nicht
       zusammenrutschen. Das Polster sitzt innen, sonst bliebe es als schmaler
       Streifen stehen. -->
  <div
    class="cb-collapse z-50 overflow-hidden rounded-lg bg-surface-light text-sm text-white shadow-lg"
  >
    <div>
      <div class="flex flex-col p-1">
        <slot />
      </div>
    </div>
  </div>
</template>
