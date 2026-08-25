import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { listenOnProjectChannel, mySenderId, projectChannel } from '../realtime/projectChannel'
import { usePeopleBroadcast, type Person } from '../presence/usePeopleBroadcast'
import type { CursorAnchor } from './cursorAnchor'

/** Where somebody is. Sent about 10 times per second via Broadcast. */
type CursorPosition = { senderId: string; anchor: CursorAnchor | null }

export type ForeignCursor = CursorPosition & Person

// The smoothing happens at the receiver, see the cb-cursor transition.
const sendIntervalMs = 100

const positions = ref<CursorPosition[]>([])

function receivePosition(position: CursorPosition) {
  const known = positions.value.find((other) => other.senderId === position.senderId)
  if (known) known.anchor = position.anchor
  else positions.value.push(position)
}

// Listening starts with the app, not with the project page: the shared channel
// must not collect a new listener on every visit.
listenOnProjectChannel((channel) =>
  channel.on('broadcast', { event: 'cursor' }, ({ payload }) =>
    receivePosition(payload as CursorPosition),
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

  // Somebody who has left, or whose name has not arrived yet, is not drawn.
  const foreignCursors = computed<ForeignCursor[]>(() =>
    positions.value.flatMap((position) => {
      const person = people.value[position.senderId]
      return person ? [{ ...position, ...person }] : []
    }),
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
