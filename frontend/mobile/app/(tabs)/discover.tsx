import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, Platform, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- MOCK DATA ---
const TRENDING_PLACES = [
  { id: '1', name: 'Đà Lạt', image: 'https://images.pexels.com/photos/1680249/pexels-photo-1680249.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', name: 'Sapa', image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', name: 'Phú Quốc', image: 'https://images.pexels.com/photos/3208039/pexels-photo-3208039.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '4', name: 'Hội An', image: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5', name: 'Hạ Long', image: 'https://images.pexels.com/photos/2048056/pexels-photo-2048056.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const INITIAL_ARTICLES = [
  {
    id: '1', category: 'Cẩm nang', title: 'Kinh nghiệm du lịch bụi Hà Giang mùa hoa tam giác mạch 2026',
    author: 'Nguyễn Công Trứ', readTime: '5 phút đọc', likesCount: 1200, isLiked: false,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
  },
  {
    id: '2', category: 'Review', title: 'Top 5 Resort sang chảnh nhất Phú Quốc cho kỳ nghỉ hoàn hảo',
    author: 'Travel Blogger', readTime: '8 phút đọc', likesCount: 856, isLiked: true, // Bài này ví dụ đã tim sẵn
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: '3', category: 'Ẩm thực', title: 'Phá đảo Food Tour Hải Phòng chỉ với 500k trong một ngày',
    author: 'Foodie VN', readTime: '4 phút đọc', likesCount: 2400, isLiked: false,
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'
  }
];

export default function DiscoverScreen() {
  const router = useRouter();
  
  // States cho Tìm kiếm và Thả tim
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  // CHỨC NĂNG 1: XỬ LÝ LỌC BÀI VIẾT (TÌM KIẾM)
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CHỨC NĂNG 2: XỬ LÝ THẢ TIM
  const toggleLike = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => {
        if (article.id === id) {
          // Nếu đang like thì trừ 1, chưa like thì cộng 1, và đảo ngược trạng thái isLiked
          return {
            ...article,
            isLiked: !article.isLiked,
            likesCount: article.isLiked ? article.likesCount - 1 : article.likesCount + 1
          };
        }
        return article;
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER TÌM KIẾM MỚI */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Tìm cẩm nang, điểm đến..."
            value={searchQuery}
            onChangeText={setSearchQuery} // Tự động lọc khi gõ phím
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ĐIỂM ĐẾN THỊNH HÀNH (Ẩn đi nếu người dùng đang tìm kiếm bài viết) */}
        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điểm đến thịnh hành 🌍</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingList}>
              {TRENDING_PLACES.map((place) => (
                <TouchableOpacity key={place.id} style={styles.trendingItem} activeOpacity={0.8}>
                  <Image source={{ uri: place.image }} style={styles.trendingImage} resizeMode="cover" />
                  <View style={styles.trendingOverlay} />
                  <Text style={styles.trendingName}>{place.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* CẨM NANG & BÀI VIẾT */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {searchQuery.length > 0 ? 'Kết quả tìm kiếm 🔍' : 'Cẩm nang & Trải nghiệm ✍️'}
            </Text>
          </View>

          {filteredArticles.length === 0 ? (
            <Text style={styles.emptyText}>Không tìm thấy bài viết nào phù hợp.</Text>
          ) : (
            filteredArticles.map((article) => (
              // CHỨC NĂNG 3: BẤM VÀO CARD ĐỂ CHUYỂN SANG TRANG CHI TIẾT
              <TouchableOpacity 
                key={article.id} 
                style={styles.articleCard} 
                activeOpacity={0.9}
                onPress={() => router.push(`/article/${article.id}` as any)} 
              >
                <View style={styles.articleImageContainer}>
                  <Image source={{ uri: article.image }} style={styles.articleImage} />
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                  
                  {/* NÚT TIM GỌI HÀM toggleLike */}
                  <TouchableOpacity 
                    style={[styles.heartButton, article.isLiked && { backgroundColor: '#fff' }]}
                    onPress={() => toggleLike(article.id)}
                  >
                    <Ionicons 
                      name={article.isLiked ? "heart" : "heart-outline"} 
                      size={20} 
                      color={article.isLiked ? "#FF2D55" : "#fff"} 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                  
                  <View style={styles.articleFooter}>
                    <View style={styles.authorInfo}>
                      <Image source={{ uri: article.avatar }} style={styles.authorAvatar} />
                      <View>
                        <Text style={styles.authorName}>{article.author}</Text>
                        <Text style={styles.readTime}>{article.readTime}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.likesInfo}>
                      <Ionicons name="heart" size={16} color="#FF2D55" />
                      {/* Định dạng số người like cho đẹp (vd: 1200 -> 1.2k) */}
                      <Text style={styles.likesText}>
                        {article.likesCount >= 1000 ? (article.likesCount / 1000).toFixed(1) + 'k' : article.likesCount}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  /* HEADER TÌM KIẾM */
  header: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: 12, paddingHorizontal: 15, height: 45 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  scrollContent: { paddingBottom: 100 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginLeft: 20, marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },

  /* TRENDING PLACES */
  trendingList: { paddingHorizontal: 20, gap: 15 },
  trendingItem: { width: 100, height: 130, borderRadius: 16, overflow: 'hidden', backgroundColor: '#E0E0E0' },
  trendingImage: { width: 100, height: 130 },
  trendingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  trendingName: { position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

  /* ARTICLE CARDS */
  articleCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  articleImageContainer: { position: 'relative', width: '100%', height: 200 },
  articleImage: { width: '100%', height: '100%' },
  categoryBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: '#005AAB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  categoryText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  heartButton: { position: 'absolute', top: 15, right: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  
  articleContent: { padding: 15 },
  articleTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', lineHeight: 24, marginBottom: 15 },
  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F5FA', paddingTop: 12 },
  
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#eee' },
  authorName: { fontSize: 14, fontWeight: 'bold', color: '#444' },
  readTime: { fontSize: 12, color: '#888', marginTop: 2 },
  
  likesInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F3', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15 },
  likesText: { fontSize: 13, fontWeight: 'bold', color: '#FF2D55', marginLeft: 4 },
  
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888', fontSize: 15 }
});