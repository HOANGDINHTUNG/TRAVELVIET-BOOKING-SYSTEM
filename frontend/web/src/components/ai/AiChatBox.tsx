import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { sendAiMessage } from '../../api/server/AiChat.api'
import './AiChatBox.css'

type ChatMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  createdAt: Date
  suggestions?: string[]
}

const initialMessage: ChatMessage = {
  id: 'welcome',
  role: 'ai',
  text: 'Xin chào, tôi có thể tư vấn tour, địa điểm và hỗ trợ thông tin đặt tour dựa trên dữ liệu hiện có của TravelViet.',
  createdAt: new Date(),
  suggestions: [
    'Tôi muốn đi Đà Lạt 3 ngày 2 đêm',
    'Tôi có 5 triệu nên đi đâu?',
    'Có địa điểm nào đẹp ở miền Trung không?',
  ],
}

export function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false)
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
    <div className={`ai-chatbox ${isOpen ? 'is-open' : ''}`}>
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
                className={`ai-chatbox-message is-${message.role}`}
                key={message.id}
              >
                <p>{message.text}</p>
              </article>
            ))}
            {loading && (
              <article className="ai-chatbox-message is-ai">
                <p>AI đang trả lời...</p>
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

      <button
        className="ai-chatbox-trigger"
        type="button"
        aria-label={isOpen ? 'Đóng AI Assistant' : 'Mở AI Assistant'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  )
}
