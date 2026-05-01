import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
  SafeAreaView, Platform, Share, Modal, TextInput, KeyboardAvoidingView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dữ liệu bình luận mẫu
const INITIAL_COMMENTS = [
  { id: '1', user: 'Minh Trí', content: 'Bài viết hay quá, tháng sau mình cũng đi!', time: '2 giờ trước' },
  { id: '2', user: 'Anh Thư', content: 'Hà Giang mùa này đẹp thật sự.', time: '5 giờ trước' },
];

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // --- STATES ---
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1200);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  // --- CHỨC NĂNG 1: LIKE ---
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // --- CHỨC NĂNG 2: SHARE (Sử dụng API mặc định của điện thoại) ---
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem cẩm nang du lịch cực hay: Kinh nghiệm đi Hà Giang của Nguyễn Công Trứ! Link: https://vietravel.com/article/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // --- CHỨC NĂNG 3: COMMENT ---
  const postComment = () => {
    if (newComment.trim().length === 0) return;
    const commentObj = {
      id: Math.random().toString(),
      user: 'Công Trứ Nguyễn', // Lấy từ Profile của Trứ
      content: newComment,
      time: 'Vừa xong'
    };
    setComments([commentObj, ...comments]);
    setNewComment('');
    setShowCommentModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. NỘI DUNG BÀI VIẾT */}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image source={{ uri: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1000&q=80' }} style={styles.coverImage} />

        <View style={styles.contentWrapper}>
          <View style={styles.categoryBadge}><Text style={styles.categoryText}>Cẩm nang</Text></View>
          <Text style={styles.title}>Kinh nghiệm du lịch bụi Hà Giang 2026</Text>

          {/* BẤM VÀO ĐỂ SANG TRANG CÁ NHÂN TÁC GIẢ CHÍNH */}
          <TouchableOpacity 
            style={styles.authorRow} 
            activeOpacity={0.7}
            onPress={() => router.push(`/user/Nguyễn Công Trứ` as any)}
          >
            <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>Nguyễn Công Trứ</Text>
              <Text style={styles.dateText}>30 Tháng 4, 2026 • 5 phút đọc</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.paragraph}>
            Hà Giang – vùng đất địa đầu Tổ quốc luôn mang một vẻ đẹp hùng vĩ, hoang sơ và đầy kiêu hãnh...
          </Text>

          {/* HIỂN THỊ DANH SÁCH BÌNH LUẬN NGAY TRÊN TRANG */}
          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>Bình luận ({comments.length})</Text>
            {comments.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                
                {/* BẤM VÀO AVATAR CỦA NGƯỜI BÌNH LUẬN */}
                <TouchableOpacity 
                  style={styles.commentUserCircle}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowCommentModal(false);
                    router.push(`/user/${item.user}` as any);
                  }}
                >
                  <Text style={{color:'#fff', fontWeight:'bold'}}>{item.user[0]}</Text>
                </TouchableOpacity>

                <View style={styles.commentBody}>
                  {/* BẤM VÀO TÊN NGƯỜI BÌNH LUẬN */}
                  <TouchableOpacity onPress={() => {
                    setShowCommentModal(false);
                    router.push(`/user/${item.user}` as any);
                  }}>
                    <Text style={styles.commentUser}>{item.user}</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.commentContent}>{item.content}</Text>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 2. THANH TƯƠNG TÁC DƯỚI CÙNG */}
      <View style={styles.bottomBar}>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? "#FF2D55" : "#333"} />
            <Text style={[styles.actionText, isLiked && {color: "#FF2D55"}]}>{likeCount >= 1000 ? (likeCount/1000).toFixed(1) + 'k' : likeCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCommentModal(true)}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
            <Text style={styles.actionText}>{comments.length}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 3. MODAL VIẾT BÌNH LUẬN */}
      <Modal visible={showCommentModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Viết bình luận</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.commentInput}
              placeholder="Chia sẻ cảm nghĩ của Trứ..."
              multiline
              value={newComment}
              onChangeText={setNewComment}
              autoFocus
            />

            <TouchableOpacity style={styles.sendBtn} onPress={postComment}>
              <Text style={styles.sendBtnText}>Gửi bình luận</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  coverImage: { width: '100%', height: 300 },
  contentWrapper: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#E5F0FA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  categoryText: { color: '#005AAB', fontSize: 13, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorName: { fontSize: 15, fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#888' },
  paragraph: { fontSize: 16, color: '#444', lineHeight: 26, marginBottom: 30 },

  /* BÌNH LUẬN LIST */
  commentSection: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20, paddingBottom: 100 },
  commentHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  commentItem: { flexDirection: 'row', marginBottom: 20 },
  commentUserCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005AAB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  commentBody: { flex: 1 },
  commentUser: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  commentContent: { fontSize: 14, color: '#555', marginTop: 4 },
  commentTime: { fontSize: 11, color: '#bbb', marginTop: 4 },

  /* BOTTOM BAR */
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingBottom: Platform.OS === 'ios' ? 35 : 15 },
  actionGroup: { flexDirection: 'row', gap: 25 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 6 },
  shareButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F6F8', justifyContent: 'center', alignItems: 'center' },

  /* MODAL STYLE */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, minHeight: 300 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  commentInput: { backgroundColor: '#F5F6F8', borderRadius: 15, padding: 15, height: 120, textAlignVertical: 'top', fontSize: 15 },
  sendBtn: { backgroundColor: '#005AAB', borderRadius: 15, paddingVertical: 15, alignItems: 'center', marginTop: 20 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});