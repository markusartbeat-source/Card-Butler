<template>
  <!-- Height and side spacing come from the design: 100px tall, 24px inset. -->
  <!-- Liegt über der Seite, die verschwommen dahinter weiterläuft (Platz dafür
       lässt App.vue frei). z-20 hält ihn und seine Menüs über der Seite. -->
  <!-- Beim Ziehen (Karte, Bild) tritt der Header zurück – bis auf den Pfad, auf
       den sich Gezogenes legen lässt. Darum wird jeder Teil für sich blass. -->
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
        <!-- Groß der Titel, klein darunter die zweite Zeile: der Pfad oder
             ein Text. Alles endet lang in „…“. -->
        <div class="flex min-w-0 flex-col">
          <h1 class="cb-headline-01 truncate" :class="dimWhileDraggingClasses">{{ title }}</h1>
          <CbBreadcrumbs v-if="path" :entries="path" :label="dictionary.header.path" class="cb-regular-text-muted" />
          <p v-else-if="subtitle" class="cb-regular-text-muted truncate" :class="dimWhileDraggingClasses">
            {{ subtitle }}
          </p>
        </div>
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
      <!-- The three menus of the design. They open the same list as every other
           menu in the header, the one of the profile included. Below desktop
           width only the cards menu stays, the others move into the profile
           menu. -->
      <CbDropdown
        v-for="menu in menus ? navigationMenus : []"
        :key="menu.value"
        :items="menu.items"
        :active-item="activeItemOf(menu.items)"
        @select="runMenuAction"
      >
        <CbButton
          variant="ghost"
          class="cb-header-menu"
          :class="{
            'cb-header-menu-active': activeItemOf(menu.items),
            'hidden desktop:flex': menu.value !== 'cards',
          }"
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
import CbBreadcrumbs, { type BreadcrumbEntry } from '../molecules/CbBreadcrumbs.vue'
import CbHeaderUser from './CbHeaderUser.vue'
import { cardSetIdToShow, cardSets } from '../../cardSets/cardSets'
import { createCardSet } from '../../cardSets/createCardSet'
import { visibleCardSetId } from '../../cardSets/visibleCardSet'
import { currentProject } from '../../project/currentProject'
import { dimWhileDraggingClasses } from '../../dragAndDrop/dimWhileDragging'
import { clearSearchWord, searchWord } from '../../search/searchWord'
import type { HeaderButton } from './headerButton'
import { collaborationPages, headerPageAt, headerPageRoute, imagePages } from './headerPages'

withDefaults(
  defineProps<{
    logo?: boolean
    menus?: boolean
    goldLine?: boolean
    title?: string
    subtitle?: string
    path?: BreadcrumbEntry[]
    searchbar?: boolean
    buttons?: HeaderButton[]
  }>(),
  {
    menus: true,
    searchbar: true,
    buttons: () => [],
  },
)
const emit = defineEmits<{ action: [key: string] }>()

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

// Der Eintrag der offenen Seite. Ihn hat immer nur ein Menü, so ist stets klar,
// wo man ist. Auf den Kartensets des Projekts ist es das Set, das gerade zu
// sehen ist.
const activeMenuItem = computed(
  () => headerPageAt(route.name) ?? (route.params.projectId ? visibleCardSetId.value : undefined),
)

function activeItemOf(menuItems: { value: string }[]) {
  return menuItems.find((item) => item.value === activeMenuItem.value)?.value
}

// A set (new or existing) is shown on the project page, an entry with a page
// opens it, every other entry is left to the page.
function runMenuAction(value: string) {
  if (value === 'new-card-set') {
    addCardSet()
    return
  }

  if (cardSets.value?.some((cardSet) => cardSet.id === value)) {
    showCardSet(value)
    return
  }

  const pageRoute = headerPageRoute(value)
  if (pageRoute) router.push(pageRoute)
  else emit('action', value)
}

// Ohne geöffnetes Projekt wird nichts angelegt, es geht zur Startseite mit der
// Projektliste.
async function addCardSet() {
  if (!currentProject.value) return router.push('/home')

  const cardSet = await createCardSet(currentProject.value.id)
  if (cardSet) showCardSet(cardSet.id)
}

// Kartensets liegen im geöffneten Projekt. Ist noch keins offen, geht es zur
// Startseite mit der Projektliste.
function showCardSet(cardSetId: string) {
  cardSetIdToShow.value = cardSetId
  router.push(currentProject.value ? `/project/${currentProject.value.id}` : '/home')
}

// The menus of the design. They belong to the header itself, so they stand in
// every page.
const navigationMenus = computed(() => [
  {
    value: 'cards',
    label: dictionary.header.cards,
    items: [
      // Every card set stands here with its own name, the last entry adds one.
      ...(cardSets.value ?? []).map((cardSet) => ({
        value: cardSet.id,
        label: cardSet.data.name,
        icon: 'playing_cards' as const,
      })),
      { value: 'new-card-set', label: dictionary.header.newCardSet, icon: 'add_2' as const },
    ],
  },
  { value: 'images', label: dictionary.images.title, items: imagePages.value },
  { value: 'collaboration', label: dictionary.header.collaboration, items: collaborationPages.value },
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
