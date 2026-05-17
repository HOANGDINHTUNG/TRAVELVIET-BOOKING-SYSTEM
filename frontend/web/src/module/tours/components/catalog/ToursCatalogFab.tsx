import { useState } from 'react'
import { ArrowUp, Phone, Sparkles } from 'lucide-react'

import { AiChatBox } from '@/components/ai/AiChatBox'

const HOTLINE = 'tel:+0883459876'

export function ToursCatalogFab() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <>
      <AiChatBox
        hideTrigger
        open={aiOpen}
        onOpenChange={setAiOpen}
        className="ai-chatbox--tours-fab"
      />

      <div className="tours-vt-fab-stack" aria-label="Tiện ích nhanh">
        <button
          className="tours-vt-fab is-muted"
          type="button"
          aria-label="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={22} strokeWidth={2.2} aria-hidden />
        </button>

        <button
          className={`tours-vt-fab tours-vt-fab--ai${aiOpen ? ' is-active' : ''}`}
          type="button"
          aria-label={aiOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
          aria-expanded={aiOpen}
          onClick={() => setAiOpen((open) => !open)}
        >
          <Sparkles size={22} strokeWidth={2.2} aria-hidden />
        </button>

        <a className="tours-vt-fab" href={HOTLINE} aria-label="Gọi tư vấn">
          <Phone size={22} strokeWidth={2.2} aria-hidden />
        </a>
      </div>
    </>
  )
}
