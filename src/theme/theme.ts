import { computed, ref, watchEffect } from 'vue'
import { refStoredInBrowser } from '../browserStorage/refStoredInBrowser'

// Das Design der App: hell oder dunkel, dazu wahlweise hoher Kontrast (WCAG AAA).
// Beides folgt dem Gerät (Browser bzw. Betriebssystem), bis man selbst wählt.
// Die Farben je Modus stehen in colors.css, hier wird nur umgeschaltet. Vorerst
// merkt sich das der Browser, später der Benutzer im Backend.

/** „device“ folgt der Einstellung des Geräts. */
export type ThemeChoice = 'device' | 'dark' | 'light'

export const theme = refStoredInBrowser<ThemeChoice>('theme', 'device')
// null: wie das Gerät.
const highContrastChoice = refStoredInBrowser<boolean | null>('highContrast', null)

/** Eine Einstellung des Geräts. Stellt man sie dort um, zieht die App sofort mit. */
function deviceSetting(mediaQuery: string) {
  const query = window.matchMedia(mediaQuery)
  const matches = ref(query.matches)
  query.addEventListener('change', (event) => (matches.value = event.matches))
  return matches
}

const devicePrefersDark = deviceSetting('(prefers-color-scheme: dark)')
const devicePrefersContrast = deviceSetting('(prefers-contrast: more)')

// Für den Schalter: zeigt, was gilt. Wer ihn wieder auf den Wert des Geräts
// stellt, folgt danach wieder dem Gerät.
export const isHighContrast = computed({
  get: () => highContrastChoice.value ?? devicePrefersContrast.value,
  set: (value: boolean) =>
    (highContrastChoice.value = value === devicePrefersContrast.value ? null : value),
})

// Läuft sofort beim ersten Import (main.ts), also noch vor dem ersten Zeichnen.
watchEffect(() => {
  const deviceTheme = devicePrefersDark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme.value === 'device' ? deviceTheme : theme.value
  document.documentElement.toggleAttribute('data-high-contrast', isHighContrast.value)
})
