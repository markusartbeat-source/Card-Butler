import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { mySenderId, usePresence, type Person } from '../presence/usePresence'
import type { CursorAnchor } from './cursorAnchor'

/** Where somebody is. Sent about 20 times per second via Broadcast. */
type CursorPosition = { senderId: string; anchor: CursorAnchor | null }

export type ForeignCursor = CursorPosition & Person

// Only one project exists so far, so the channel name is still fixed.
const channelName = 'projekt-1-cursors'
// About 20 messages per second — the smoothing happens at the receiver.
const sendIntervalMs = 50

/**
 * Sends my own cursor to everybody else in the project and collects theirs.
 * Returns the cursors of the other people, without my own.
 */
export function useLiveCursors(myAnchor: Ref<CursorAnchor | null>) {
  const { people } = usePresence()

  const positions = ref<CursorPosition[]>([])

  // Somebody who has left, or whose name has not arrived yet, is not drawn.
  const foreignCursors = computed<ForeignCursor[]>(() =>
    positions.value.flatMap((position) => {
      const person = people.value[position.senderId]
      return person ? [{ ...position, ...person }] : []
    }),
  )

  let channel: RealtimeChannel | null = null
  let sendTimer = 0
  let lastSentAnchor = ''

  function sendWhenChanged() {
    const anchorAsText = JSON.stringify(myAnchor.value)
    if (anchorAsText === lastSentAnchor) return
    lastSentAnchor = anchorAsText

    channel?.send({
      type: 'broadcast',
      event: 'cursor',
      payload: { senderId: mySenderId, anchor: myAnchor.value },
    })
  }

  function receivePosition(position: CursorPosition) {
    const known = positions.value.find((other) => other.senderId === position.senderId)
    if (known) known.anchor = position.anchor
    else positions.value.push(position)
  }

  onMounted(() => {
    channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'cursor' }, ({ payload }) =>
        receivePosition(payload as CursorPosition),
      )
      .subscribe()

    sendTimer = window.setInterval(sendWhenChanged, sendIntervalMs)
  })

  onUnmounted(() => {
    window.clearInterval(sendTimer)
    if (channel) supabase.removeChannel(channel)
  })

  return { foreignCursors }
}
