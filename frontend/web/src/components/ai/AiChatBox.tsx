import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowRight, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendAiMessage } from '../../api/server/AiChat.api'
import type { AiRelatedItem } from '../../api/server/AiChat.api'
import { cn } from '@/lib/utils'
import { buildAssetUrl } from '../../utils/buildAssetUrl'
import './AiChatBox.css'

export type AiChatBoxProps = {
  /** Ẩn nút trigger mặc định — dùng nút FAB ngoài (vd. trang /tours). */
  hideTrigger?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  createdAt: Date
  suggestions?: string[]
  relatedItems?: AiRelatedItem[]
}

const initialMessage: ChatMessage = {
  id: 'welcome',
  role: 'ai',
  text: 'Xin chào, mình có thể tìm tour, gợi ý điểm đến và hỗ trợ thông tin đặt tour dựa trên dữ liệu hiện có của TravelViet.',
  createdAt: new Date(),
  suggestions: [
    'Tìm tour Đà Lạt 3 ngày 2 đêm',
    'Tôi có 5 triệu nên đi đâu?',
    'Có địa điểm nào đẹp ở miền Trung không?',
  ],
}

function relatedItemLabel(type: string) {
  switch (type) {
    case 'TOUR':
      return 'Tour'
    case 'DESTINATION':
      return 'Điểm đến'
    case 'BOOKING':
      return 'Booking'
    default:
      return 'Gợi ý'
  }
}

function renderRelatedItem(item: AiRelatedItem) {
  const imageUrl = buildAssetUrl(item.imageUrl)

  return (
    <article className="ai-chatbox-related-card" key={`${item.type}-${item.id ?? item.title}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={item.title} loading="lazy" />
      ) : (
        <div className="ai-chatbox-related-empty" aria-hidden="true">
          <Sparkles size={18} />
        </div>
      )}
      <div className="ai-chatbox-related-body">
        <span className="ai-chatbox-related-type">{relatedItemLabel(item.type)}</span>
        <strong>{item.title}</strong>
        {item.subtitle ? <small>{item.subtitle}</small> : null}
        {item.description ? <p>{item.description}</p> : null}
        <div className="ai-chatbox-related-footer">
          {item.meta ? <span>{item.meta}</span> : <span />}
          {item.detailUrl ? (
            <Link to={item.detailUrl}>
              Xem chi tiết
              <ArrowRight size={14} />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function AiChatBox({
  hideTrigger = false,
  open: controlledOpen,
  onOpenChange,
  className,
}: AiChatBoxProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen

  const setIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    const next =
      typeof value === 'function' ? value(controlledOpen ?? internalOpen) : value
    onOpenChange?.(next)
    if (controlledOpen === undefined) {
      setInternalOpen(next)
    }
  }
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const node = messagesRef.current
    if (node) {
      node.scrollTop = node.scrollHeight
    }
  }, [isOpen, messages, loading])

  const sendMessage = async (rawMessage?: string) => {
    const message = (rawMessage ?? input).trim()
    if (!message || loading) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
      createdAt: new Date(),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const response = await sendAiMessage(message)
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: response.answer,
        createdAt: new Date(),
        suggestions: response.suggestions,
        relatedItems: response.relatedItems ?? [],
      }

      setMessages((currentMessages) => [...currentMessages, aiMessage])
    } catch (err) {
      const fallback =
        err instanceof Error
          ? err.message
          : 'Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.'
      setError(fallback)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: 'Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.',
          createdAt: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const latestSuggestions =
    messages
      .slice()
      .reverse()
      .find((message) => message.role === 'ai' && message.suggestions?.length)
      ?.suggestions ?? []

  return (
    <div className={cn('ai-chatbox', isOpen && 'is-open', className)}>
      {isOpen && (
        <section className="ai-chatbox-panel" aria-label="AI Assistant">
          <header className="ai-chatbox-header">
            <div className="ai-chatbox-title">
              <span className="ai-chatbox-avatar" aria-hidden="true">
                <Sparkles size={18} />
              </span>
              <strong>AI Assistant</strong>
            </div>
            <button
              className="ai-chatbox-icon-button"
              type="button"
              aria-label="Đóng chat"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          <div className="ai-chatbox-messages" ref={messagesRef}>
            {messages.map((message) => (
              <article
                className={`ai-chatbox-message is-${message.role} ${
                  message.relatedItems?.length ? 'has-related' : ''
                }`}
                key={message.id}
              >
                <p>{message.text}</p>
                {message.relatedItems?.length ? (
                  <div className="ai-chatbox-related-list">
                    {message.relatedItems.map(renderRelatedItem)}
                  </div>
                ) : null}
              </article>
            ))}
            {loading && (
              <article className="ai-chatbox-message is-ai">
                <p>Đang tìm thông tin phù hợp...</p>
              </article>
            )}
          </div>

          {error && <p className="ai-chatbox-error">{error}</p>}

          {latestSuggestions.length > 0 && (
            <div className="ai-chatbox-suggestions" aria-label="Gợi ý câu hỏi">
              {latestSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form className="ai-chatbox-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={2000}
              placeholder="Nhập câu hỏi..."
              aria-label="Nhập câu hỏi cho AI"
            />
            <button
              className="ai-chatbox-send"
              type="submit"
              aria-label="Gửi câu hỏi"
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      {!hideTrigger ? (
        <button
          className="ai-chatbox-trigger"
          type="button"
          aria-label={isOpen ? 'Đóng AI Assistant' : 'Mở AI Assistant'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        </button>
      ) : null}
    </div>
  )
}
