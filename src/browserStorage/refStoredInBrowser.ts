import { shallowRef, watch } from 'vue'

/** Ein Wert, den sich der Browser merkt (localStorage) – nach dem Neuladen ist er
    wieder da. Für Einstellungen, die das Backend noch nicht kennt; später lassen
    sie sich durch Felder im Backend ersetzen. Ohne Speicher (z.B. gesperrt im
    privaten Fenster) gilt der Wert nur bis zum Neuladen.
    Den Wert immer als Ganzes ersetzen, nicht darin ändern – sonst merkt der
    Browser sich die Änderung nicht. */
export function refStoredInBrowser<T>(key: string, fallback: T) {
  const storageKey = `cardButler.${key}`
  const value = shallowRef<T>(readFromBrowser(storageKey) ?? fallback)

  watch(value, (changed) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(changed))
    } catch {
      // Speicher voll oder gesperrt: Der Wert gilt nur bis zum Neuladen.
    }
  })
  return value
}

function readFromBrowser(storageKey: string) {
  try {
    const text = localStorage.getItem(storageKey)
    return text === null ? undefined : JSON.parse(text)
  } catch {
    return undefined
  }
}
