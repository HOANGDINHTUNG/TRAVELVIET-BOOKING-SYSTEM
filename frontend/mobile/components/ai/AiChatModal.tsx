import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sendAiMessage } from '@/services/aiChatApi';
import type { AiChatMessage } from '@/types/aiChat';
import { useAppSettings } from '@/providers/AppSettingsProvider';

type AiChatModalProps = {
  visible: boolean;
  onClose: () => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AiChatModal({ visible, onClose }: AiChatModalProps) {
  const { theme, language, t } = useAppSettings();
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<AiChatMessage> | null>(null);

  // Initialize and dynamically update welcome message translation
  useEffect(() => {
    setMessages((current) => {
      if (current.length === 0) {
        return [
          {
            id: 'welcome',
            role: 'ai',
            text: t('assistant_welcome'),
            createdAt: new Date(),
            suggestions: [
              t('assistant_suggest_1'),
              t('assistant_suggest_2'),
              t('assistant_suggest_3'),
            ],
          },
        ];
      }
      return current.map((m) => {
        if (m.id === 'welcome') {
          return {
            ...m,
            text: t('assistant_welcome'),
            suggestions: [
              t('assistant_suggest_1'),
              t('assistant_suggest_2'),
              t('assistant_suggest_3'),
            ],
          };
        }
        return m;
      });
    });
  }, [language, t]);

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
          : t('assistant_error');
      setError(fallback);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: 'ai',
          text: t('assistant_error'),
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
        style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 14) : 14 }]}>
          <View style={styles.titleRow}>
            <View style={styles.avatar}>
              <Ionicons name="sparkles-outline" size={18} color="#283618" />
            </View>
            <Text style={styles.title}>AI Assistant</Text>
          </View>
          <Pressable accessibilityLabel={t('assistant_close')} onPress={onClose} style={styles.iconButton}>
            <Ionicons name="close" size={22} color="#FEFAE0" />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.aiBubble,
              item.role === 'ai' && isDark ? styles.aiBubbleDark : null
            ]}>
              <Text style={[
                styles.messageText,
                item.role === 'user' ? styles.userText : styles.aiText,
                item.role === 'ai' && isDark ? styles.aiTextDark : null
              ]}>
                {item.text}
              </Text>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={[styles.messageBubble, styles.aiBubble, isDark && styles.aiBubbleDark]}>
                <Text style={[styles.aiText, isDark && styles.aiTextDark]}>{t('assistant_typing')}</Text>
              </View>
            ) : null
          }
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {latestSuggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            {latestSuggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                disabled={loading}
                onPress={() => void handleSend(suggestion)}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  isDark && styles.suggestionChipDark,
                  pressed && !loading ? styles.suggestionPressed : null,
                  loading ? styles.disabled : null,
                ]}>
                <Ionicons
                  name="bulb-outline"
                  size={14}
                  color={isDark ? '#FF702A' : '#0A7EA4'}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.suggestionText, isDark && styles.suggestionTextDark]}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={[
          styles.inputRow,
          isDark && styles.inputRowDark,
          { paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 18) : 18 }
        ]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t('assistant_placeholder')}
            placeholderTextColor={isDark ? '#94A3B8' : '#7A7A7A'}
            maxLength={2000}
            multiline
            style={[styles.input, isDark && styles.inputDark]}
          />
          <Pressable
            accessibilityLabel={t('assistant_send')}
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
  containerDark: {
    backgroundColor: '#0F172A',
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
  aiBubbleDark: {
    backgroundColor: '#1E293B',
    shadowColor: '#000000',
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
  aiTextDark: {
    color: '#F1F5F9',
  },
  errorText: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    color: '#9B2226',
    fontSize: 13,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.22)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#EEF9FC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionChipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  suggestionPressed: {
    opacity: 0.78,
  },
  suggestionText: {
    color: '#0A4D69',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  suggestionTextDark: {
    color: '#E2E8F0',
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
  inputRowDark: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
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
  inputDark: {
    color: '#FFFFFF',
    backgroundColor: '#1E293B',
    borderColor: '#334155',
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
