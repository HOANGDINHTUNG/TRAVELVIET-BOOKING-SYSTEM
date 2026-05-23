import { create } from 'zustand'
import i18n from '../lib/i18n'

export const SITE_TAB_TITLE = 'Travel Viet'

/** Khoảng đổi chữ trên tab (ms) — tạo hiệu ứng nhấp nháy thu hút chú ý */
const TAB_TITLE_BLINK_MS = 1000

let tabBlinkTimer: ReturnType<typeof setInterval> | null = null
let tabBlinkShowsAlert = true

type AiChatNotificationState = {
  unreadCount: number
  setUnreadCount: (count: number) => void
  markAsRead: () => void
  reset: () => void
}

function getUnreadTabAlertTitle(count: number): string {
  const safe = Math.max(1, Math.min(99, Math.floor(count)))
  if (safe === 1) {
    return i18n.t('siteFab.tabUnreadOne')
  }
  return i18n.t('siteFab.tabUnreadMany', { count: safe })
}

function stopTabTitleBlink() {
  if (tabBlinkTimer !== null) {
    clearInterval(tabBlinkTimer)
    tabBlinkTimer = null
  }
}

function startTabTitleBlink(unreadCount: number) {
  stopTabTitleBlink()
  if (typeof document === 'undefined' || unreadCount <= 0) return

  const alertTitle = getUnreadTabAlertTitle(unreadCount)
  tabBlinkShowsAlert = true
  document.title = alertTitle

  tabBlinkTimer = setInterval(() => {
    tabBlinkShowsAlert = !tabBlinkShowsAlert
    document.title = tabBlinkShowsAlert ? alertTitle : SITE_TAB_TITLE
  }, TAB_TITLE_BLINK_MS)
}

export function syncBrowserTabTitle(unreadCount: number) {
  if (typeof document === 'undefined') return
  if (unreadCount > 0) {
    startTabTitleBlink(unreadCount)
    return
  }
  stopTabTitleBlink()
  document.title = SITE_TAB_TITLE
}

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', () => {
    const { unreadCount } = useAiChatNotificationStore.getState()
    syncBrowserTabTitle(unreadCount)
  })
}

export const useAiChatNotificationStore = create<AiChatNotificationState>(
  (set) => ({
    unreadCount: 0,
    setUnreadCount: (count) => {
      const safe = Math.max(0, Math.min(99, Math.floor(count)))
      syncBrowserTabTitle(safe)
      set({ unreadCount: safe })
    },
    markAsRead: () => {
      syncBrowserTabTitle(0)
      set({ unreadCount: 0 })
    },
    reset: () => {
      syncBrowserTabTitle(0)
      set({ unreadCount: 0 })
    },
  }),
)
