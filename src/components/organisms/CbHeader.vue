<template>
  <!-- Height and side spacing come from the design: 100px tall, 24px inset. -->
  <!-- Liegt über der Seite, die verschwommen dahinter weiterläuft (Platz dafür
       lässt App.vue frei). z-20 hält ihn und seine Menüs über der Seite. -->
  <!-- Beim Ziehen tritt der Header zurück, jeder Teil für sich wird blass. -->
  <div class="absolute inset-x-0 top-0 z-20 flex h-25 items-center gap-2.5 px-6">
    <!-- Hintergrund: außen deckend, in der Mitte durchscheinend und verschwommen.
         Er reicht 12px über den Header hinaus und läuft ab 84px weich aus, so
         verschwindet die Seite ohne harte Kante darunter. Nicht weiter, sonst wäre
         der Anfang mancher Seiten (z.B. Bilder) auch ohne Scrollen verschwommen.
         In den Kontrastmodi deckend mit Linie und so hoch wie der Header, damit
         nichts halb verdeckt durchscheint. Klicks gehen hindurch. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 high-contrast:h-full">
      <div
        v-for="blurStep in blurSteps"
        :key="blurStep"
        class="absolute inset-0 high-contrast:hidden"
        :class="blurStep"
      />
      <div
        class="from-background via-background/50 to-background high-contrast:via-background absolute inset-0 border-b border-surface-edge bg-linear-to-r mask-b-from-21 high-contrast:mask-none"
      />
    </div>

    <!-- Goldene Linie an der Unterkante, blendet zur Mitte hin aus. Liegt im
         Header, damit dessen Höhe bei 100px bleibt. Nur wenn die Seite sie anschaltet. -->
    <div
      v-if="goldLine"
      class="from-gold-dark to-gold-dark absolute inset-x-0 bottom-0 h-px bg-linear-to-r via-transparent via-56%"
      :class="dimWhileDraggingClasses"
      aria-hidden="true"
    />

    <!-- Left side is as wide as the right side, so the search stays centered. -->
    <div class="flex min-w-0 flex-1 items-center gap-2.5">
      <template v-if="logo">
        <CbLogo class="size-12" :class="dimWhileDraggingClasses" />
        <span class="cb-headline-01" :class="dimWhileDraggingClasses">{{ dictionary.header.appName }}</span>
      </template>

      <!-- The back button belongs to the heading, so it only shows with one.
           A long title never wraps, it ends in "..." instead. min-w-0 lets
           the heading shrink below its text width, which flex items refuse
           to do by default. -->
      <template v-else-if="title">
        <!-- Zurück führt immer zur Startseite, darum ein Link statt Button.
             Sieht aus wie CbButton variant="icon". -->
        <router-link
          v-ripple
          to="/home"
          :aria-label="dictionary.header.backToHome"
          class="cb-hover relative flex items-center overflow-hidden rounded-full p-2 text-foreground"
          :class="dimWhileDraggingClasses"
        >
          <CbIcon name="west" />
        </router-link>
        <h1 class="cb-headline-01 truncate" :class="dimWhileDraggingClasses">{{ title }}</h1>
      </template>
    </div>

    <!-- Below laptop width the search leaves the header (it moves into the
         profile menu). -->
    <div
      v-if="searchbar"
      class="bg-surface hidden w-96 items-center rounded-full text-foreground shadow-lg ring ring-surface-edge laptop:flex"
      :class="dimWhileDraggingClasses"
    >
      <!-- The typing happens here. The label carries hover and ripple, because
           those need a child element and an input cannot have one. -->
      <label
        v-ripple
        class="cb-hover relative flex min-w-0 flex-1 items-center self-stretch overflow-hidden rounded-l-full pl-6"
      >
        <input
          ref="searchInput"
          v-model="searchWord"
          class="cb-regular-text w-full min-w-0 cursor-text bg-transparent outline-none placeholder:text-label focus:placeholder:text-transparent"
          :placeholder="dictionary.header.searchInCards"
        />
      </label>
      <div class="flex gap-0.5 p-1.5">
        <!-- The X only appears once there is something to clear. -->
        <CbInteractive
          v-if="searchWord"
          class="rounded-full p-2 text-foreground"
          :aria-label="dictionary.header.clearSearch"
          @click="clearSearch"
        >
          <CbIcon name="close" />
        </CbInteractive>
        <!-- Die Lupe zeigt nur, dass hier gesucht wird, und hält die Höhe der Leiste. -->
        <CbIcon name="search" class="m-2" />
      </div>
    </div>

    <!-- Only from laptop width both sides are equal (that centers the search).
         Below, the right side is as wide as its content, so the title keeps
         its room. -->
    <div class="flex items-center justify-end gap-3 laptop:flex-1" :class="dimWhileDraggingClasses">
      <!-- Die Menüs des Projekts. Sie öffnen dieselbe Liste wie jedes andere
           Menü im Header, das des Profils eingeschlossen. Unter desktop-Breite
           wandern sie ins Profilmenü. -->
      <CbDropdown
        v-for="menu in menus ? navigationMenus : []"
        :key="menu.value"
        :items="menu.items"
        :active-item="activeItemOf(menu.items)"
        @select="openDialog"
      >
        <CbButton
          variant="ghost"
          class="cb-header-menu hidden desktop:flex"
          :class="{ 'cb-header-menu-active': activeItemOf(menu.items) }"
        >
          {{ menu.label }}
          <CbIcon name="keyboard_arrow_down" class="cb-header-menu-arrow" />
        </CbButton>
      </CbDropdown>

      <template v-for="button in buttons" :key="button.key">
        <CbDropdown
          v-if="button.menuItems"
          :items="button.menuItems"
          @select="$emit('action', $event)"
        >
          <CbButton :variant="button.variant">
            <CbIcon v-if="button.icon" :name="button.icon" />
            {{ button.label }}
          </CbButton>
        </CbDropdown>

        <CbButton v-else :variant="button.variant" @click="$emit('action', button.key)">
          <CbIcon v-if="button.icon" :name="button.icon" />
          {{ button.label }}
        </CbButton>
      </template>

      <CbHeaderUser />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CbButton from '../atoms/CbButton.vue'
import CbDropdown from '../atoms/CbDropdown.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import CbLogo from '../atoms/CbLogo.vue'
import CbHeaderUser from './CbHeaderUser.vue'
import { dimWhileDraggingClasses } from '../../dragAndDrop/dimWhileDragging'
import { clearSearchWord, searchWord } from '../../search/searchWord'
import type { HeaderButton } from './headerButton'
import { collaborationDialogs, headerDialogAt, headerDialogRoute, imageDialogs } from './headerDialogs'

withDefaults(
  defineProps<{
    logo?: boolean
    menus?: boolean
    goldLine?: boolean
    title?: string
    searchbar?: boolean
    buttons?: HeaderButton[]
  }>(),
  {
    menus: true,
    searchbar: true,
    buttons: () => [],
  },
)
defineEmits<{ action: [key: string] }>()

const router = useRouter()
const route = useRoute()

// Unschärfe in Stufen, übereinander: Jede verschwimmt stärker und endet etwas
// höher. So wird es nach unten allmählich schärfer, statt dass eine volle
// Unschärfe nur ausblendet (das wirkt wie ein Doppelbild).
const blurSteps = [
  'backdrop-blur-xs mask-b-from-25 mask-b-to-28',
  'backdrop-blur-sm mask-b-from-23 mask-b-to-26',
  'backdrop-blur-md mask-b-from-21 mask-b-to-24',
]

// Das X verschwindet mit dem Leeren – der Fokus geht darum ins Suchfeld, nicht
// auf die Seite.
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')

function clearSearch() {
  clearSearchWord()
  searchInput.value?.focus()
}

// Der Eintrag des offenen Dialogs. Ihn hat immer nur ein Menü, so ist stets
// klar, wo man ist.
const activeMenuItem = computed(() => headerDialogAt(route)?.value)

function activeItemOf(menuItems: { value: string }[]) {
  return menuItems.find((item) => item.value === activeMenuItem.value)?.value
}

function openDialog(value: string) {
  const dialogRoute = headerDialogRoute(value, route)
  if (dialogRoute) router.push(dialogRoute)
}

// The menus of the design. They belong to the header itself, so they stand in
// every page.
const navigationMenus = computed(() => [
  { value: 'images', label: dictionary.images.title, items: imageDialogs.value },
  { value: 'collaboration', label: dictionary.header.collaboration, items: collaborationDialogs.value },
])
</script>

<style scoped>
/* Ark UI marks the open menu on its trigger. The button stays lit as long as
   its list is open, and its arrow points at the list below. */
.cb-header-menu[data-state='open'] {
  background-color: var(--color-surface);
}

.cb-header-menu[data-state='open'] .cb-header-menu-arrow {
  rotate: 180deg;
}

.cb-header-menu-arrow {
  transition: rotate 250ms ease;
}

/* The menu the user is in is gold and carries a straight gold line under its
   label. The line is drawn as its own element, not as a border: the button is
   rounded and clips its content, so a border would bend up at the corners. The
   line starts inside the corner radius (8px, the button's padding) and so stays
   straight. It is a ::before, because ::after already belongs to the hover
   lightening of cb-hover. */
.cb-header-menu-active {
  color: var(--color-accent);
}

.cb-header-menu-active::before {
  content: '';
  position: absolute;
  right: 8px;
  bottom: 0;
  left: 8px;
  height: 2px;
  background-color: var(--color-accent);
}
</style>
