import { axiosBackend } from '../../utils/axiosInstance'

export type AiChatRequest = {
  message: string
  conversationId?: string | null
}

export type AiRelatedItem = {
  type: 'TOUR' | 'DESTINATION' | 'BOOKING' | string
  id?: string | null
  title: string
  subtitle?: string | null
  description?: string | null
  imageUrl?: string | null
  detailUrl?: string | null
  meta?: string | null
}

export type AiChatResponse = {
  intent: string
  answer: string
  dataFound: boolean
  suggestions: string[]
  relatedItems?: AiRelatedItem[]
}

export async function sendAiMessage(message: string, conversationId?: string | null) {
  const response = await axiosBackend.post<AiChatResponse>('ai/chat', {
    message,
    conversationId: conversationId ?? null,
  } satisfies AiChatRequest)

  return response.data
}
