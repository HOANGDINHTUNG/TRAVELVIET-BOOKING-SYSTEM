import type { LanguageMode } from '../../constants/preferences'

export type AiChatMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  createdAt: Date
  suggestions?: string[]
}

type WelcomeCopy = {
  text: string
  suggestions: string[]
}

const GUEST_WELCOME: Record<LanguageMode, WelcomeCopy> = {
  vi: {
    text: 'Xin chào! Mình là trợ lý AI của Travel Viet — có thể gợi ý tour, điểm đến và hỗ trợ thông tin đặt chỗ. Đăng nhập để nhận lời chào riêng và theo dõi đơn của bạn.',
    suggestions: [
      'Tìm tour Đà Lạt 3 ngày 2 đêm',
      'Tôi có 5 triệu nên đi đâu?',
      'Có địa điểm nào đẹp ở miền Trung không?',
    ],
  },
  en: {
    text: 'Hello! I am the Travel Viet AI assistant — I can suggest tours, destinations, and booking information. Sign in for a personal greeting and to track your orders.',
    suggestions: [
      'Find a 3-day Da Lat tour',
      'Where can I go with a $200 budget?',
      'Beautiful spots in central Vietnam?',
    ],
  },
}

function personalizedWelcomeVi(name: string): WelcomeCopy {
  return {
    text: `Xin chào ${name}! 👋

Rất vui được đồng hành cùng bạn trên Travel Viet. Mình là trợ lý AI — sẵn sàng gợi ý tour trong nước và quốc tế, tư vấn điểm đến theo ngân sách và sở thích, kiểm tra lịch khởi hành, hoặc hỗ trợ thông tin đặt tour và đơn đã đặt của bạn.

Bạn có thể hỏi bất cứ điều gì: tour biển cuối tuần, hành trình gia đình, combo tiết kiệm, hay điểm đến đang hot mùa này. Chúc bạn một ngày tràn đầy cảm hứng du lịch — hãy bắt đầu bằng một câu hỏi nhé!`,
    suggestions: [
      'Gợi ý tour phù hợp cho gia đình 4 người',
      'Tour biển khởi hành cuối tuần này',
      'Xem đơn đặt tour của tôi',
    ],
  }
}

function personalizedWelcomeEn(name: string): WelcomeCopy {
  return {
    text: `Hello ${name}! 👋

Welcome back to Travel Viet — great to have you here. I am your AI travel assistant, ready to suggest domestic and international tours, destinations that match your budget and style, departure schedules, and help with booking details or your existing orders.

Ask me anything: a weekend beach escape, a family itinerary, a value combo, or what is trending this season. Wishing you a day full of travel inspiration — start with a question whenever you are ready!`,
    suggestions: [
      'Suggest a tour for a family of four',
      'Beach tours departing this weekend',
      'Check my booking status',
    ],
  }
}

export function buildGuestWelcomeMessage(language: LanguageMode): AiChatMessage {
  const copy = GUEST_WELCOME[language]
  return {
    id: 'welcome-guest',
    role: 'ai',
    text: copy.text,
    createdAt: new Date(),
    suggestions: copy.suggestions,
  }
}

export function buildPersonalizedWelcomeMessage(
  displayName: string,
  language: LanguageMode,
): AiChatMessage {
  const name = displayName.trim() || (language === 'vi' ? 'bạn' : 'there')
  const copy =
    language === 'en' ? personalizedWelcomeEn(name) : personalizedWelcomeVi(name)

  return {
    id: `welcome-user-${Date.now()}`,
    role: 'ai',
    text: copy.text,
    createdAt: new Date(),
    suggestions: copy.suggestions,
  }
}

export function resolveUserDisplayName(
  user: {
    displayName?: string | null
    fullName?: string | null
    email?: string | null
  } | null,
  language: LanguageMode,
): string {
  if (!user) return language === 'vi' ? 'bạn' : 'there'
  const fromProfile = user.displayName?.trim() || user.fullName?.trim()
  if (fromProfile) return fromProfile.split(/\s+/)[0] ?? fromProfile
  const emailLocal = user.email?.split('@')[0]?.trim()
  if (emailLocal) return emailLocal
  return language === 'vi' ? 'bạn' : 'there'
}
