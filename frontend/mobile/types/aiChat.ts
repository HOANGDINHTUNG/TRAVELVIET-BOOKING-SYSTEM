export type AiChatResponse = {
  intent: string;
  answer: string;
  dataFound: boolean;
  suggestions: string[];
};

export type AiChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  createdAt: Date;
  suggestions?: string[];
};
