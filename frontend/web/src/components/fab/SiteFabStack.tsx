import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp, Phone, Sparkles } from 'lucide-react'

import { AiChatBox } from '@/components/ai/AiChatBox'
import { useAiChatNotificationStore } from '../../stores/aiChatNotificationStore'
import './SiteFabStack.css'

const HOTLINE = 'tel:+0883459876'

/**
 * Ba nút FAB cố định (lên đầu · AI · gọi) — dùng toàn site public.
 */
export function SiteFabStack() {
  const { t } = useTranslation('translation')
  const [aiOpen, setAiOpen] = useState(false)
  const unreadCount = useAiChatNotificationStore((state) => state.unreadCount)

  return (
    <>
      <AiChatBox
        hideTrigger
        open={aiOpen}
        onOpenChange={setAiOpen}
        className="ai-chatbox--site-fab"
      />

      <div className="site-vt-fab-stack" aria-label={t('siteFab.aria')}>
        <button
          className="site-vt-fab is-muted site-vt-fab--wiggle"
          type="button"
          style={{ animationDelay: '0s' }}
          aria-label={t('siteFab.scrollTop')}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={22} strokeWidth={2.2} aria-hidden />
        </button>

        <button
          className={`site-vt-fab site-vt-fab--ai site-vt-fab--wiggle${aiOpen ? ' is-active' : ''}`}
          type="button"
          style={{ animationDelay: '0.45s' }}
          aria-label={
            unreadCount > 0 && !aiOpen
              ? t('siteFab.aiOpenUnread', { count: unreadCount })
              : aiOpen
                ? t('siteFab.aiClose')
                : t('siteFab.aiOpen')
          }
          aria-expanded={aiOpen}
          onClick={() => setAiOpen((open) => !open)}
        >
          <Sparkles size={22} strokeWidth={2.2} aria-hidden />
          {unreadCount > 0 && !aiOpen ? (
            <span className="site-vt-fab__badge" aria-hidden>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </button>

        <a
          className="site-vt-fab site-vt-fab--wiggle"
          href={HOTLINE}
          style={{ animationDelay: '0.9s' }}
          aria-label={t('siteFab.call')}
        >
          <Phone size={22} strokeWidth={2.2} aria-hidden />
        </a>
      </div>
    </>
  )
}
