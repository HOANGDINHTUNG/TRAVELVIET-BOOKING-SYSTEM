import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { sendAiMessage } from '@/services/aiChatApi';
import type { AiChatMessage } from '@/types/aiChat';

type AiChatModalProps = {
  visible: boolean;
  onClose: () => void;
};

const initialMessage: AiChatMessage = {
  id: 'welcome',
  role: 'ai',
  text: 'Xin chào! Tôi hỗ trợ tra cứu nhanh tour, khuyến mãi và thông tin vận hành TravelViet khi bạn đang dùng Commerce Desk.',
  createdAt: new Date(),
  suggestions: [
    'Liệt kê campaign đang bật',
    'Gợi ý kiểm tra voucher sắp hết hạn',
    'Tóm tắt quy trình bật/tắt sản phẩm trên desk',
  ],
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AiChatModal({ visible, onClose }: AiChatModalProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<AiChatMessage> | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => clearTimeout(timer);
  }, [messages, loading, visible]);

  const latestSuggestions =
    [...messages].reverse().find((message) => message.role === 'ai' && message.suggestions?.length)
      ?.suggestions ?? [];

  const handleSend = async (rawMessage?: string) => {
    const message = (rawMessage ?? input).trim();
    if (!message || loading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: createId(),
        role: 'user',
        text: message,
        createdAt: new Date(),
      },
    ]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await sendAiMessage(message);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: 'ai',
          text: response.answer,
          createdAt: new Date(),
          suggestions: response.suggestions,
        },
      ]);
    } catch (err) {
      const fallback =
        err instanceof Error
          ? err.message
          : 'Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.';
      setError(fallback);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: 'ai',
          text: 'Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.avatar}>
              <Ionicons name="sparkles-outline" size={18} color="#283618" />
            </View>
            <Text style={styles.title}>AI Assistant</Text>
          </View>
          <Pressable accessibilityLabel="Đóng chat" onPress={onClose} style={styles.iconButton}>
            <Ionicons name="close" size={22} color="#FEFAE0" />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.aiText]}>
                {item.text}
              </Text>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <Text style={styles.aiText}>AI đang trả lời...</Text>
              </View>
            ) : null
          }
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {latestSuggestions.length > 0 ? (
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}>
            {latestSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                disabled={loading}
                onPress={() => void handleSend(suggestion)}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  pressed && !loading ? styles.suggestionPressed : null,
                  loading ? styles.disabled : null,
                ]}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi..."
            placeholderTextColor="#7A7A7A"
            maxLength={2000}
            multiline
            style={styles.input}
          />
          <Pressable
            accessibilityLabel="Gửi câu hỏi"
            disabled={loading || !input.trim()}
            onPress={() => void handleSend()}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && !loading ? styles.sendPressed : null,
              loading || !input.trim() ? styles.disabled : null,
            ]}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EA',
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#283618',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDA15E',
  },
  title: {
    color: '#FEFAE0',
    fontSize: 17,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254, 250, 224, 0.12)',
  },
  messageList: {
    padding: 16,
    gap: 10,
  },
  messageBubble: {
    maxWidth: '84%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#283618',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
    backgroundColor: '#0A7EA4',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#283618',
  },
  errorText: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    color: '#9B2226',
    fontSize: 13,
  },
  suggestions: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.22)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EEF9FC',
  },
  suggestionPressed: {
    opacity: 0.78,
  },
  suggestionText: {
    color: '#0A4D69',
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#FFFEF7',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 108,
    borderWidth: 1,
    borderColor: 'rgba(40, 54, 24, 0.16)',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#283618',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A7EA4',
  },
  sendPressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.55,
  },
});
