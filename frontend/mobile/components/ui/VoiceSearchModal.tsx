import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

// Safely load ExpoSpeechRecognition
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = () => {};
let isSpeechRecognitionAvailable = false;

try {
  const SpeechModule = require('expo-speech-recognition');
  if (SpeechModule) {
    ExpoSpeechRecognitionModule = SpeechModule.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = SpeechModule.useSpeechRecognitionEvent;
    if (ExpoSpeechRecognitionModule) {
      isSpeechRecognitionAvailable = true;
    }
  }
} catch (e) {
  console.warn('ExpoSpeechRecognition is not available on this platform/build:', e);
}

// Wave bar animation component
function WaveBar({ active, index }: { active: boolean; index: number }) {
  const height = useSharedValue(10);

  useEffect(() => {
    if (active) {
      const minHeight = 10;
      const maxHeight = 20 + (index % 3) * 15; // 20, 35, 50, 20...
      const duration = 200 + (index % 4) * 80;
      height.value = withRepeat(
        withSequence(
          withTiming(maxHeight, { duration }),
          withTiming(minHeight, { duration })
        ),
        -1,
        true
      );
    } else {
      height.value = withTiming(8, { duration: 200 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.waveBar,
        active ? styles.waveBarActive : styles.waveBarInactive,
        animatedStyle,
      ]}
    />
  );
}

interface VoiceSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (text: string) => void;
}

export function VoiceSearchModal({ visible, onClose, onSearch }: VoiceSearchModalProps) {
  const { theme, language } = useAppSettings();
  const { showSnackbar } = useSnackbar();
  const isDark = theme === 'dark';
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationIntervalRef = useRef<any>(null);

  // Suggestions for quick simulation & real voice searches
  const suggestions = language === 'vi' 
    ? ['Tour du lịch Sa Pa', 'Vé máy bay Phú Quốc', 'Khách sạn Đà Lạt 5 sao', 'Voucher Hạ Long']
    : ['Sa Pa Tour', 'Phu Quoc Flight', 'Da Lat 5 Star Hotel', 'Halong Voucher'];

  // Register real speech recognition event listeners if available
  if (isSpeechRecognitionAvailable) {
    useSpeechRecognitionEvent('start', () => {
      setIsRecording(true);
      setTranscript('');
    });

    useSpeechRecognitionEvent('end', () => {
      setIsRecording(false);
    });

    useSpeechRecognitionEvent('result', (event: any) => {
      if (event.results && event.results.length > 0) {
        const text = event.results[0]?.transcript || '';
        setTranscript(text);
      }
    });

    useSpeechRecognitionEvent('error', (event: any) => {
      console.error('Speech recognition error:', event.error, event.message);
      setIsRecording(false);
      showSnackbar(
        language === 'vi'
          ? `Lỗi nhận dạng: ${event.message || event.error}`
          : `Recognition error: ${event.message || event.error}`
      );
    });
  }

  // Cleanup simulation and speech on close/unmount
  const cleanup = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
    setIsRecording(false);
    setTranscript('');

    if (isSpeechRecognitionAvailable) {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch {}
    }
  };

  useEffect(() => {
    if (!visible) {
      cleanup();
    }
  }, [visible]);

  useEffect(() => {
    return cleanup;
  }, []);

  const handleStartRealSpeech = async () => {
    try {
      const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (status !== 'granted') {
        showSnackbar(
          language === 'vi'
            ? 'Quyền truy cập Micro và nhận dạng giọng nói bị từ chối. Vui lòng cấp quyền trong Cài đặt.'
            : 'Microphone and speech recognition permissions denied. Please enable them in Settings.'
        );
        return;
      }

      await ExpoSpeechRecognitionModule.start({
        lang: language === 'vi' ? 'vi-VN' : 'en-US',
        interimResults: true,
        continuous: false,
      });
    } catch (err: any) {
      console.error('Error starting voice recognition:', err);
      setIsRecording(false);
      showSnackbar(
        language === 'vi'
          ? `Lỗi hệ thống ghi âm: ${err.message || err}`
          : `Speech system error: ${err.message || err}`
      );
    }
  };

  const handleMicPress = () => {
    // If simulating, cancel it
    if (isSimulating) {
      cleanup();
      return;
    }

    if (isRecording) {
      if (isSpeechRecognitionAvailable) {
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch {}
      } else {
        setIsRecording(false);
      }
      return;
    }

    if (isSpeechRecognitionAvailable) {
      handleStartRealSpeech();
    } else {
      // Simulating in Expo Go
      setIsRecording(true);
      setTranscript(language === 'vi' ? 'Đang lắng nghe (Giả lập)... Hãy chọn gợi ý dưới đây để thử.' : 'Listening (Simulation)... Tap a suggestion below to try.');
    }
  };

  // Simulate speech typing when user clicks a suggestion
  const handleSuggestionPress = (text: string) => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    if (isSpeechRecognitionAvailable) {
      // In native build, suggestion just types directly or helps user speak
      setTranscript(text);
      return;
    }

    // Expo Go Simulation Mode
    setIsSimulating(true);
    setIsRecording(true);
    setTranscript('');

    let currentText = '';
    let index = 0;
    
    simulationIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setTranscript(currentText);
        index++;
      } else {
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
          simulationIntervalRef.current = null;
        }
        setIsRecording(false);
        setIsSimulating(false);
        
        // Auto search after a brief delay
        setTimeout(() => {
          onSearch(text);
          onClose();
        }, 800);
      }
    }, 60);
  };

  const handleConfirmSearch = () => {
    if (transcript && transcript !== 'Đang lắng nghe (Giả lập)... Hãy chọn gợi ý dưới đây để thử.' && transcript !== 'Listening (Simulation)... Tap a suggestion below to try.') {
      onSearch(transcript);
      onClose();
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, isDark && styles.sheetDark]}>
              
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.headerTitle, isDark && styles.textWhite]}>
                  {language === 'vi' ? 'Tìm kiếm giọng nói' : 'Voice Search'}
                </Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDark && styles.closeBtnDark]}>
                  <Ionicons name="close" size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
                </TouchableOpacity>
              </View>

              {/* Status Indicator */}
              <View style={styles.statusContainer}>
                {isSpeechRecognitionAvailable ? (
                  <View style={[styles.badge, styles.badgeLive]}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.badgeText}>LIVE</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, styles.badgeSim]}>
                    <Text style={styles.badgeText}>DEMO MODE (EXPO GO)</Text>
                  </View>
                )}
              </View>

              {/* Voice Soundwaves Visualizer */}
              <View style={styles.waveContainer}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <WaveBar key={i} index={i} active={isRecording} />
                ))}
              </View>

              {/* Speech Output Box */}
              <View style={[styles.speechBox, isDark && styles.speechBoxDark]}>
                <Text style={[
                  styles.speechText, 
                  isDark && styles.textWhite,
                  !transcript && styles.speechPlaceholder
                ]}>
                  {transcript || (language === 'vi' ? 'Nhấn vào Micro để nói...' : 'Tap the microphone to speak...')}
                </Text>
              </View>

              {/* Control Action Buttons */}
              <View style={styles.controlsRow}>
                {/* Large Mic button */}
                <TouchableOpacity 
                  onPress={handleMicPress} 
                  style={[
                    styles.micButton,
                    isRecording && styles.micButtonRecording
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={isRecording ? 'mic' : 'mic-outline'} 
                    size={32} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>

                {/* Confirm checkmark button (only visible when we have a result) */}
                {transcript.length > 0 && !isRecording && !isSimulating && (
                  <TouchableOpacity 
                    onPress={handleConfirmSearch} 
                    style={styles.confirmButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Suggestion Chips */}
              <View style={styles.suggestionsContainer}>
                <Text style={[styles.sectionTitle, isDark && styles.textMuted]}>
                  {language === 'vi' ? 'Hoặc chọn từ khóa để thử:' : 'Or tap a suggestion to try:'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                  {suggestions.map((text, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSuggestionPress(text)}
                      style={[styles.chip, isDark && styles.chipDark]}
                    >
                      <Ionicons name="trending-up-outline" size={14} color="#FF5B22" style={{ marginRight: 4 }} />
                      <Text style={[styles.chipText, isDark && styles.textWhite]}>{text}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Native build instruction (when on Expo Go) */}
              {!isSpeechRecognitionAvailable && (
                <View style={[styles.instructionsCard, isDark && styles.instructionsCardDark]}>
                  <View style={styles.instructionsHeader}>
                    <Ionicons name="information-circle-outline" size={18} color="#D97706" style={{ marginRight: 6 }} />
                    <Text style={[styles.instructionsTitle, isDark && styles.textWhite]}>
                      {language === 'vi' ? 'Hướng dẫn kích hoạt Micro thật:' : 'To enable real microphone input:'}
                    </Text>
                  </View>
                  <Text style={[styles.instructionStep, isDark && styles.textMuted]}>
                    {language === 'vi' 
                      ? '1. Đóng trình quản lý Expo Go.\n2. Chạy lệnh: npx expo run:android (hoặc run:ios) để biên dịch native.\n3. Khởi chạy app để sử dụng nhận dạng giọng nói chuẩn.' 
                      : '1. Close Expo Go.\n2. Run: npx expo run:android (or run:ios) to compile native build.\n3. Launch the app to use real microphone speech-to-text.'
                    }
                  </Text>
                </View>
              )}

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetDark: {
    backgroundColor: '#0F172A',
    borderTopColor: '#334155',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#1E293B',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeLive: {
    backgroundColor: '#DC2626',
  },
  badgeSim: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    marginVertical: 12,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  waveBarActive: {
    backgroundColor: '#FF5B22',
  },
  waveBarInactive: {
    backgroundColor: '#CBD5E1',
  },
  speechBox: {
    minHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  speechBoxDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  speechText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 26,
  },
  speechPlaceholder: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 96,
    marginBottom: 24,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5B22',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    transform: [{ scale: 1.05 }],
  },
  confirmButton: {
    position: 'absolute',
    right: 36,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 10,
  },
  suggestionsScroll: {
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFEBE3',
  },
  chipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF5B22',
  },
  instructionsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  instructionsCardDark: {
    backgroundColor: '#1C1917',
    borderColor: '#44403C',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  instructionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  instructionStep: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textMuted: {
    color: '#94A3B8',
  },
});
