import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, Platform, Image, FlatList, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TRENDING = ['Sapa mùa lúa chín', 'Hà Giang', 'Đà Nẵng', 'Du lịch Thái Lan'];

const ALL_TOURS = [
  { id: '1', title: 'Hà Giang - Lũng Cú - Đồng Văn', price: '3,990,000 đ', rating: 4.8, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { id: '2', title: 'Đà Lạt - Săn mây Đồi Chè Cầu Đất', price: '2,490,000 đ', rating: 4.5, image: 'https://images.unsplash.com/photo-1583417657208-11e2dc40d7c3?w=400' },
  { id: '3', title: 'Phú Quốc - Ngắm hoàng hôn Sunset Sanato', price: '5,990,000 đ', rating: 4.9, image: 'https://images.unsplash.com/photo-1596423735880-5c6fa86cb6d2?w=400' },
  { id: '4', title: 'Sapa - Chinh phục đỉnh Fansipan', price: '2,890,000 đ', rating: 4.7, image: 'https://images.unsplash.com/photo-1509030464150-1b921474001e?w=400' },
  { id: '5', title: 'Đà Nẵng - Hội An - Bà Nà Hills', price: '4,500,000 đ', rating: 4.6, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // ĐÃ SỬA: Đưa lịch sử tìm kiếm vào useState
  const [recentSearches, setRecentSearches] = useState(['Đà Lạt', 'Tour Phú Quốc 3N2Đ', 'Khách sạn Vũng Tàu']);

  const handleSearch = (text: string) => {
    setKeyword(text);
    if (text.trim() === '') {
      setSearchResults([]); 
    } else {
      const filtered = ALL_TOURS.filter(tour => 
        tour.title.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  // ĐÃ THÊM: Hàm xóa toàn bộ lịch sử tìm kiếm
  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  const renderResultItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.resultItem} 
      activeOpacity={0.8}
      onPress={() => {
        Keyboard.dismiss();
        router.push(`/tour/${item.id}` as any);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.resultImg} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.resultMeta}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.resultRating}>{item.rating}</Text>
        </View>
        <Text style={styles.resultPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER TÌM KIẾM */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Đà Lạt, Phú Quốc..."
            autoFocus={true}
            value={keyword}
            onChangeText={handleSearch} 
            returnKeyType="search"
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* NỘI DUNG CHÍNH */}
      {keyword.length === 0 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* ĐÃ SỬA: Chỉ hiển thị khối Lịch sử nếu mảng recentSearches có dữ liệu */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Lịch sử tìm kiếm</Text>
                {/* Gắn hàm handleClearHistory vào nút Xóa */}
                <TouchableOpacity onPress={handleClearHistory}>
                  <Text style={styles.clearText}>Xóa</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item, index) => (
                <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleSearch(item)}>
                  <Ionicons name={"time-outline" as any} size={20} color="#888" />
                  <Text style={styles.recentText}>{item}</Text>
                  <Ionicons name={"arrow-undo-outline" as any} size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Xu hướng tìm kiếm</Text>
            <View style={styles.tagsContainer}>
              {TRENDING.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearch(tag)}>
                  <Ionicons name={"trending-up-outline" as any} size={14} color="#FF2D55" style={{ marginRight: 5 }} />
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultCount}>Tìm thấy {searchResults.length} kết quả cho "{keyword}"</Text>
          
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderResultItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled" 
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#ddd" />
              <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
              <Text style={styles.emptyDesc}>Thử thay đổi từ khóa tìm kiếm xem sao.</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5, marginRight: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: 10, paddingHorizontal: 10, height: 45 },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  clearText: { fontSize: 14, color: '#005AAB' },
  recentItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  recentText: { flex: 1, fontSize: 15, color: '#555', marginLeft: 10 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F3', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#FFEBEB' },
  tagText: { fontSize: 13, color: '#FF2D55', fontWeight: '500' },
  resultsContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  resultCount: { fontSize: 14, color: '#666', paddingHorizontal: 20, paddingVertical: 15 },
  resultItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  resultImg: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  resultInfo: { flex: 1, justifyContent: 'space-between' },
  resultTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', lineHeight: 20 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  resultRating: { fontSize: 13, color: '#666', marginLeft: 4 },
  resultPrice: { fontSize: 16, fontWeight: '900', color: '#FF2D55', marginTop: 5 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15 },
  emptyDesc: { fontSize: 14, color: '#888', marginTop: 5 }
});