import { axiosBackend } from '../../utils/axiosInstance'

export type AiChatRequest = {
  message: string
  conversationId?: string | null
}

export type AiChatResponse = {
  intent: string
  answer: string
  dataFound: boolean
  suggestions: string[]
}

export async function sendAiMessage(message: string, conversationId?: string | null) {
  const response = await axiosBackend.post<AiChatResponse>('ai/chat', {
    message,
    conversationId: conversationId ?? null,
  } satisfies AiChatRequest)

  return response.data
}
