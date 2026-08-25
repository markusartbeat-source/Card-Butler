import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import type { CursorAnchor } from './cursorAnchor'

export type ForeignCursor = { senderId: string; anchor: CursorAnchor | null }

// Only one project exists so far, so the channel name is still fixed.
const channelName = 'projekt-1'
// About 20 messages per second — the smoothing happens at the receiver.
const sendIntervalMs = 50

/**
 * Sends my own anchor to everybody else in the project and collects theirs.
 * Returns the cursors of the other people, without my own.
 */
export function useLiveCursors(myAnchor: Ref<CursorAnchor | null>) {
  const foreignCursors = ref<ForeignCursor[]>([])
  const mySenderId = crypto.randomUUID()

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

  function receive(cursor: ForeignCursor) {
    const known = foreignCursors.value.find((other) => other.senderId === cursor.senderId)
    if (known) known.anchor = cursor.anchor
    else foreignCursors.value.push(cursor)
  }

  onMounted(() => {
    channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'cursor' }, ({ payload }) => receive(payload as ForeignCursor))
      .subscribe()

    sendTimer = window.setInterval(sendWhenChanged, sendIntervalMs)
  })

  onUnmounted(() => {
    window.clearInterval(sendTimer)
    if (channel) supabase.removeChannel(channel)
  })

  return { foreignCursors }
}
