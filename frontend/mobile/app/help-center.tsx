import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: string;
  attachmentUrl?: string;
}

interface SupportSession {
  id: string;
  title: string;
  status: 'active' | 'closed';
  createdAt: string;
  messages: Message[];
  rating?: number;
  ratingComment?: string;
}

const INITIAL_SESSIONS: SupportSession[] = [
  {
    id: 's1',
    title: 'Hỏi về chính sách hoàn hủy tour Vịnh Hạ Long',
    status: 'active',
    createdAt: '2026-06-10 14:30',
    messages: [
      {
        id: 'm1',
        text: 'Xin chào, tôi muốn hỏi về chính sách hủy tour Vịnh Hạ Long 2 ngày 1 đêm của tôi vào tuần sau.',
        isUser: true,
        createdAt: '14:30',
      },
      {
        id: 'm2',
        text: 'Chào bạn, theo chính sách của TravelViet, nếu bạn hủy trước 7 ngày khởi hành sẽ được hoàn 100% chi phí. Hủy trước 3-6 ngày sẽ hoàn 50%. Hủy trong vòng 48h sẽ không được hoàn trả. Tour của bạn khởi hành ngày nào ạ?',
        isUser: false,
        createdAt: '14:35',
      },
    ],
  },
];

export default function HelpCenterScreen() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sessions, setSessions] = useState<SupportSession[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s1');

  // New Request Form State
  const [newContent, setNewContent] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  // Reply Form State
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState('');

  // Rating State
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);
  const activeSessionCount = sessions.filter((s) => s.status === 'active').length;

  const handleCreateRequest = () => {
    if (!newContent.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung cần hỗ trợ.');
      return;
    }

    const newSessionId = `s-${Date.now()}`;
    const newSession: SupportSession = {
      id: newSessionId,
      title: newContent.trim().substring(0, 50) + (newContent.length > 50 ? '...' : ''),
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: `m-${Date.now()}-1`,
          text: newContent.trim(),
          isUser: true,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachmentUrl: newAttachment.trim() || undefined,
        },
      ],
    };

    setSessions([newSession, ...sessions]);
    setSelectedSessionId(newSessionId);
    setNewContent('');
    setNewAttachment('');
    showSnackbar('Đã tạo yêu cầu hỗ trợ mới thành công!');

    // Simulate auto response
    setTimeout(() => {
      setSessions((prevSessions) =>
        prevSessions.map((s) => {
          if (s.id === newSessionId) {
            return {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: `m-auto-${Date.now()}`,
                  text: 'Cảm ơn bạn đã liên hệ. Đội ngũ CSKH của TravelViet đã ghi nhận yêu cầu và sẽ liên hệ phản hồi bạn sớm nhất qua điện thoại hoặc email đăng ký.',
                  isUser: false,
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            };
          }
          return s;
        })
      );
    }, 1500);
  };

  const handleSendReply = () => {
    if (!selectedSessionId || !replyText.trim()) return;

    const newMsg: Message = {
      id: `m-rep-${Date.now()}`,
      text: replyText.trim(),
      isUser: true,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl: replyAttachment.trim() || undefined,
    };

    setSessions((prevSessions) =>
      prevSessions.map((s) => {
        if (s.id === selectedSessionId) {
          return {
            ...s,
            messages: [...s.messages, newMsg],
          };
        }
        return s;
      })
    );

    setReplyText('');
    setReplyAttachment('');
    showSnackbar('Đã gửi tin nhắn phản hồi.');

    // Simulate staff typing and reply
    setTimeout(() => {
      setSessions((prevSessions) =>
        prevSessions.map((s) => {
          if (s.id === selectedSessionId) {
            return {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: `m-staff-${Date.now()}`,
                  text: 'Dạ vâng, yêu cầu của bạn đang được nhân viên chuyên trách xử lý. Chúng tôi sẽ cập nhật kết quả tại đây hoặc gọi điện cho bạn ngay khi có thông tin mới.',
                  isUser: false,
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            };
          }
          return s;
        })
      );
    }, 1500);
  };

  const handleSaveRating = () => {
    if (!selectedSessionId) return;

    setSessions((prevSessions) =>
      prevSessions.map((s) => {
        if (s.id === selectedSessionId) {
          return {
            ...s,
            rating: ratingVal,
            ratingComment: ratingComment.trim(),
          };
        }
        return s;
      })
    );

    showSnackbar('Cảm ơn bạn đã đánh giá phiên hỗ trợ!');
    setRatingComment('');
  };

  return (
    <View style={styles.container}>
      {/* Header Banner Section */}
      <LinearGradient
        colors={['#0F2C2C', '#1D5A5A']}
        style={[styles.headerBanner, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Về tài khoản</Text>
        </TouchableOpacity>

        <Text style={styles.headerKicker}>HỖ TRỢ KHÁCH HÀNG</Text>
        <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
        <Text style={styles.headerSubtitle}>
          Tạo yêu cầu, theo dõi hội thoại và gửi thêm thông tin cho đội ngũ TravelViet.
        </Text>

        <View style={styles.statBox}>
          <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
          <View style={styles.statTextWrap}>
            <Text style={styles.statCount}>{activeSessionCount}</Text>
            <Text style={styles.statLabel}>PHIÊN HỖ TRỢ</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Support Sessions Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="list-outline" size={20} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Phiên hỗ trợ</Text>
          </View>
          <View style={styles.cardBody}>
            {sessions.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có phiên hỗ trợ.</Text>
            ) : (
              sessions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.sessionItem,
                    selectedSessionId === s.id && styles.sessionItemActive,
                  ]}
                  onPress={() => setSelectedSessionId(s.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.sessionItemHeader}>
                    <Text
                      style={[
                        styles.sessionItemTitle,
                        selectedSessionId === s.id && styles.sessionItemTitleActive,
                      ]}
                      numberOfLines={1}
                    >
                      {s.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        s.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeClosed,
                      ]}
                    >
                      <Text style={styles.statusBadgeText}>
                        {s.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sessionItemTime}>{s.createdAt}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Create New Request Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="add-circle-outline" size={20} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Tạo yêu cầu mới</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.inputLabel}>NỘI DUNG CẦN HỖ TRỢ</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Nhập chi tiết yêu cầu hỗ trợ của bạn..."
              value={newContent}
              onChangeText={setNewContent}
              style={[styles.textInput, styles.textArea]}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>LINK ĐÍNH KÈM</Text>
            <TextInput
              placeholder="Dán link ảnh hoặc tài liệu đính kèm nếu có..."
              value={newAttachment}
              onChangeText={setNewAttachment}
              style={styles.textInput}
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateRequest}
              activeOpacity={0.85}
            >
              <Ionicons name="paper-plane" size={16} color="#FFF" style={styles.btnIcon} />
              <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conversation Messaging Section */}
        {selectedSession && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1D5A5A" />
              <Text style={styles.cardTitle}>Hội thoại</Text>
              <View style={styles.msgCountBadge}>
                <Text style={styles.msgCountText}>
                  {selectedSession.messages.length} TIN NHẮN
                </Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              {/* Message History list */}
              <View style={styles.messageList}>
                {selectedSession.messages.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.msgBubbleContainer,
                      m.isUser ? styles.msgUserContainer : styles.msgStaffContainer,
                    ]}
                  >
                    <View
                      style={[
                        styles.msgBubble,
                        m.isUser ? styles.msgUserBubble : styles.msgStaffBubble,
                      ]}
                    >
                      <Text style={[styles.msgText, m.isUser ? styles.msgUserText : styles.msgStaffText]}>
                        {m.text}
                      </Text>
                      {m.attachmentUrl ? (
                        <TouchableOpacity
                          style={styles.attachmentLink}
                          onPress={() => Alert.alert('Liên kết đính kèm', m.attachmentUrl)}
                        >
                          <Ionicons name="attach" size={14} color={m.isUser ? '#FFF' : '#1D5A5A'} />
                          <Text
                            style={[
                              styles.attachmentLinkText,
                              { color: m.isUser ? '#FFF' : '#1D5A5A' },
                            ]}
                            numberOfLines={1}
                          >
                            Tệp đính kèm
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      <Text style={[styles.msgTime, m.isUser ? styles.msgUserTime : styles.msgStaffTime]}>
                        {m.createdAt}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Reply message form */}
              <View style={styles.replyForm}>
                <Text style={styles.inputLabel}>TIN NHẮN</Text>
                <TextInput
                  multiline
                  numberOfLines={3}
                  placeholder="Nhập câu trả lời hoặc gửi thêm thông tin..."
                  value={replyText}
                  onChangeText={setReplyText}
                  style={[styles.textInput, styles.replyTextArea]}
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.inputLabel}>LINK ĐÍNH KÈM</Text>
                <TextInput
                  placeholder="Dán link ảnh hoặc tài liệu đính kèm..."
                  value={replyAttachment}
                  onChangeText={setReplyAttachment}
                  style={styles.textInput}
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={handleSendReply}
                  activeOpacity={0.85}
                >
                  <Ionicons name="paper-plane" size={16} color="#FFF" style={styles.btnIcon} />
                  <Text style={styles.replyButtonText}>Gửi phản hồi</Text>
                </TouchableOpacity>
              </View>

              {/* Rating Section (Góp ý) */}
              <View style={styles.ratingSection}>
                <View style={styles.ratingHeader}>
                  <Text style={styles.ratingSectionTitle}>GÓP Ý VÀ ĐÁNH GIÁ</Text>
                </View>

                <View style={styles.ratingSelectorRow}>
                  <Text style={styles.ratingLabel}>ĐÁNH GIÁ PHIÊN: {ratingVal}/5</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <TouchableOpacity key={val} onPress={() => setRatingVal(val)}>
                        <Ionicons
                          name={val <= ratingVal ? 'star' : 'star-outline'}
                          size={24}
                          color="#EAB308"
                          style={{ marginRight: 4 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TextInput
                  placeholder="Nhập ý kiến góp ý của bạn..."
                  value={ratingComment}
                  onChangeText={setRatingComment}
                  style={styles.textInput}
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  style={styles.ratingButton}
                  onPress={handleSaveRating}
                  activeOpacity={0.85}
                >
                  <Ionicons name="star" size={16} color="#FFF" style={styles.btnIcon} />
                  <Text style={styles.ratingButtonText}>Lưu đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Footer Section replicating web experience */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2DD4BF',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    lineHeight: 18,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    gap: 12,
  },
  statTextWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statCount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  msgCountBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  msgCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  cardBody: {
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '500',
  },
  sessionItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  sessionItemActive: {
    borderColor: '#1D5A5A',
    backgroundColor: '#F0FDF4',
  },
  sessionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
    marginRight: 10,
  },
  sessionItemTitleActive: {
    color: '#111827',
  },
  sessionItemTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeClosed: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  replyTextArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1D5A5A',
    borderRadius: 8,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  btnIcon: {
    marginRight: 6,
  },
  messageList: {
    marginBottom: 20,
    gap: 12,
  },
  msgBubbleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  msgUserContainer: {
    justifyContent: 'flex-end',
  },
  msgStaffContainer: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '85%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  msgUserBubble: {
    backgroundColor: '#1D5A5A',
    borderTopRightRadius: 2,
  },
  msgStaffBubble: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 19,
  },
  msgUserText: {
    color: '#FFFFFF',
  },
  msgStaffText: {
    color: '#1F2937',
  },
  attachmentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
  },
  attachmentLinkText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgUserTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  msgStaffTime: {
    color: '#9CA3AF',
  },
  replyForm: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  replyButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  ratingSection: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  ratingHeader: {
    marginBottom: 12,
  },
  ratingSectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1D5A5A',
    letterSpacing: 0.5,
  },
  ratingSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingButton: {
    backgroundColor: '#0F2C2C',
    borderRadius: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ratingButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  // Footer styles
  footerBackground: {
    width: '100%',
    marginTop: 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  footerBigTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 30,
    lineHeight: 40,
    maxWidth: '90%',
  },
  newsletterSection: {
    marginBottom: 35,
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  newsletterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    height: 48,
  },
  newsletterInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  newsletterButton: {
    backgroundColor: '#0F2C2C',
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 30,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
  },
  footerColumn: {
    width: '45%',
    marginBottom: 10,
  },
  footerColumnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerLinkText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
    fontWeight: '600',
  },
  footerBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 10,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  footerCopyright: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
});
