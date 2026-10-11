// TEMPORÄR (Poststellen-Protokoll): ganzer Ordner wird im Aufräumschritt gelöscht.
import { reactive } from 'vue'

export type RequestLogEntry = {
  method: string
  path: string
  /** 0, wenn das Backend nicht geantwortet hat. */
  status: number
  durationInMilliseconds: number
  requestId: string
  unreachable: boolean
  /** Mitgeschickte Version, z.B. `"3"`, falls der Aufruf etwas ändert. */
  ifMatch?: string
}

/** Alle Aufrufe der Poststelle, der neueste zuerst. */
export const requestLog = reactive<RequestLogEntry[]>([])
