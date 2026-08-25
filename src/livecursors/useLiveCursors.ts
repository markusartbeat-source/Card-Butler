import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { listenOnProjectChannel, mySenderId, projectChannel } from '../realtime/projectChannel'
import { usePeopleBroadcast, type Person } from '../presence/usePeopleBroadcast'
import type { CursorAnchor } from './cursorAnchor'

/** Where somebody is. Sent about 10 times per second via Broadcast. */
type CursorMessage = { senderId: string; anchor: CursorAnchor | null }

export type ForeignCursor = CursorMessage & Person

// The smoothing happens at the receiver, see the cb-cursor transition.
const sendIntervalMs = 100

// Only the position — who somebody is comes from the shared people list.
const anchors = ref<Record<string, CursorAnchor | null>>({})

function receivePosition({ senderId, anchor }: CursorMessage) {
  anchors.value = { ...anchors.value, [senderId]: anchor }
}

// Listening starts with the app, not with the project page: the shared channel
// must not collect a new listener on every visit.
listenOnProjectChannel((channel) =>
  channel.on('broadcast', { event: 'cursor' }, ({ payload }) =>
    receivePosition(payload as CursorMessage),
  ),
)

function sendAnchor(anchor: CursorAnchor | null) {
  projectChannel()?.send({
    type: 'broadcast',
    event: 'cursor',
    payload: { senderId: mySenderId, anchor },
  })
}

/**
 * Sends my own cursor to everybody else in the project and collects theirs.
 * Returns the cursors of the other people, without my own.
 */
export function useLiveCursors(myAnchor: Ref<CursorAnchor | null>) {
  const { people } = usePeopleBroadcast()

  // The people list decides who exists, so somebody who left leaves no cursor
  // behind, and a newcomer is drawn with the right name and color at once.
  const foreignCursors = computed<ForeignCursor[]>(() =>
    Object.entries(people.value).map(([senderId, person]) => ({
      senderId,
      anchor: anchors.value[senderId] ?? null,
      ...person,
    })),
  )

  let sendTimer = 0
  let lastSentAnchor = ''

  function sendWhenChanged() {
    if (!projectChannel()) return

    const anchorAsText = JSON.stringify(myAnchor.value)
    if (anchorAsText === lastSentAnchor) return
    lastSentAnchor = anchorAsText

    sendAnchor(myAnchor.value)
  }

  onMounted(() => {
    sendTimer = window.setInterval(sendWhenChanged, sendIntervalMs)
  })

  onUnmounted(() => {
    window.clearInterval(sendTimer)
    // Leaving the page takes my cursor away for the others as well.
    sendAnchor(null)
  })

  return { foreignCursors }
}
