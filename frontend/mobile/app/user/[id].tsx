import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dữ liệu giả lập các bài viết của tác giả này
const AUTHOR_ARTICLES = [
  { id: '1', title: 'Kinh nghiệm du lịch bụi Hà Giang 2026', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400', likes: '1.2k' },
  { id: '2', title: 'Khám phá Mù Cang Chải mùa lúa chín', image: 'https://images.unsplash.com/photo-1509030464150-1b921474001e?w=400', likes: '850' },
  { id: '3', title: 'Săn mây Tà Xùa cuối tuần', image: 'https://images.unsplash.com/photo-1583417657208-11e2dc40d7c3?w=400', likes: '2.1k' },
];

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Nhận ID hoặc tên tác giả từ màn hình trước truyền qua
  
  // Tên tác giả lấy tạm từ ID truyền vào (ví dụ thực tế sẽ fetch từ Database)
  const authorName = typeof id === 'string' ? id.replace(/-/g, ' ') : 'Nguyễn Công Trứ';
  
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Chứa nút Back và Ảnh Bìa */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000' }} style={styles.coverImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* THÔNG TIN TÁC GIẢ (Kéo lồi lên trên ảnh bìa) */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} style={styles.avatar} />
          </View>
          
          <Text style={styles.userName}>{authorName}</Text>
          <Text style={styles.bio}>Đam mê xê dịch, thích chụp ảnh và ghi lại những khoảnh khắc đẹp của cuộc sống. 📸🌍</Text>
          
          {/* Cụm Thống kê */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Bài viết</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12.5k</Text>
              <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45k</Text>
              <Text style={styles.statLabel}>Lượt thích</Text>
            </View>
          </View>

          {/* Nút Theo dõi */}
          <TouchableOpacity 
            style={[styles.followBtn, isFollowing && styles.followingBtn]} 
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
              {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DANH SÁCH BÀI VIẾT CỦA TÁC GIẢ NÀY */}
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>Bài viết của {authorName}</Text>
          
          <View style={styles.gridContainer}>
            {AUTHOR_ARTICLES.map((article) => (
              <TouchableOpacity key={article.id} style={styles.articleCard} onPress={() => router.push(`/article/${article.id}` as any)}>
                <Image source={{ uri: article.image }} style={styles.articleImg} />
                <View style={styles.articleOverlay}>
                  <Ionicons name="heart" size={14} color="#fff" />
                  <Text style={styles.articleLikes}>{article.likes}</Text>
                </View>
                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { height: 180, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: { position: 'absolute', top: Platform.OS === 'android' ? 40 : 20, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  
  profileSection: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingHorizontal: 20, alignItems: 'center', paddingBottom: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: -45, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  avatar: { width: 82, height: 82, borderRadius: 41 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginTop: 10, marginBottom: 8 },
  bio: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20, marginBottom: 20 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 20 },
  statItem: { alignItems: 'center', paddingHorizontal: 15 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#005AAB' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: '#E0E0E0' },
  
  followBtn: { backgroundColor: '#005AAB', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  followingBtn: { backgroundColor: '#E5F0FA' },
  followBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  followingBtnText: { color: '#005AAB' },

  articlesSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  articleCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  articleImg: { width: '100%', height: 120 },
  articleOverlay: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  articleLikes: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  articleTitle: { fontSize: 13, fontWeight: '600', color: '#333', padding: 10, lineHeight: 18 },
});