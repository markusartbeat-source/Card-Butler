import { ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../supabase'

// One id per browser tab: the same person may have two windows open.
export const mySenderId = crypto.randomUUID()

/** True while the channel really carries messages. */
export const isProjectChannelJoined = ref(false)

const listeners: ((channel: RealtimeChannel) => void)[] = []
const joinedCallbacks: (() => void)[] = []
let currentChannel: RealtimeChannel | null = null

/** The channel to send on, or null while nothing can be sent. */
export function projectChannel() {
  return isProjectChannelJoined.value ? currentChannel : null
}

/**
 * Registers a listener for the one project channel. It is put on every fresh
 * channel again, so it has to be registered before the channel is opened.
 */
export function listenOnProjectChannel(listener: (channel: RealtimeChannel) => void) {
  listeners.push(listener)
}

/**
 * Opens the one channel of the project when the app starts. Callers may ask
 * for it more than once — the channel itself is built only the first time,
 * because Supabase refuses to join the same channel twice.
 */
export function openProjectChannel(onJoined: () => void) {
  joinedCallbacks.push(onJoined)
  if (currentChannel) return

  const channel = supabase.channel('projekt-1')
  currentChannel = channel

  for (const listener of listeners) listener(channel)

  channel.subscribe((status, error) => {
    // Debug output while we hunt the dying channel — remove once it holds.
    console.log('project channel:', status, error ?? '')

    isProjectChannelJoined.value = status === 'SUBSCRIBED'
    if (status === 'SUBSCRIBED') for (const callback of joinedCallbacks) callback()
  })
}
