// Zeigt einen Fehler der Poststelle als Toast. Die Fehler-ID verbindet ihn mit
// dem Eintrag in der Konsole (und später im Backend-Protokoll).
import { showDangerToast } from '../../components/atoms/toaster'
import type { ApiError } from './apiError'

export function showErrorToast(error: ApiError) {
  showDangerToast(errorTitle(error), dictionary.serverErrors.errorId(error.requestId))
}

function errorTitle(error: ApiError) {
  if (error.isUnreachable) return dictionary.serverErrors.unreachable
  if (error.status === 403) return dictionary.serverErrors.forbidden
  if (error.status === 404) return dictionary.serverErrors.notFound
  // Die mitgeschickte Version ist veraltet.
  if (error.status === 412) return dictionary.serverErrors.changedMeanwhile
  return dictionary.serverErrors.general
}
