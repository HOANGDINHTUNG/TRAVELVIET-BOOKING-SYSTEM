import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  FlatList, Image, Platform, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA XỊN SÒ ---
const CATEGORIES = ['Tất cả', 'Tour trong nước', 'Tour quốc tế', 'Khách sạn', 'Vé máy bay'];

const PROMOS = [
  { 
    id: '1', tab: 'hot', category: 'Tour trong nước',
    title: 'Hè rực rỡ - Giảm ngay 500K khi thanh toán qua VNPay', 
    code: 'VNPAY500', 
    date: 'Hết hạn: 30/06/2026', 
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    badge: 'Giảm 500K'
  },
  { 
    id: '2', tab: 'hot', category: 'Khách sạn',
    title: 'Nghỉ dưỡng 5 sao - Tặng voucher ăn uống 1 Triệu VNĐ', 
    code: 'LUXURY1M', 
    date: 'Hết hạn: 15/07/2026', 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    badge: 'Quà tặng'
  },
  { 
    id: '3', tab: 'hot', category: 'Tour quốc tế',
    title: 'Khám phá Nhật Bản mùa thu - Tặng eSIM 4G tốc độ cao', 
    code: 'JAPAN26', 
    date: 'Hết hạn: 20/08/2026', 
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    badge: 'Độc quyền'
  },
  { 
    id: '4', tab: 'partner', category: 'Tất cả',
    title: 'Hoàn tiền 10% tối đa 1 Triệu khi mở thẻ tín dụng Sacombank', 
    code: '', 
    date: 'Hết hạn: 31/12/2026', 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    badge: 'Ngân hàng'
  },
  { 
    id: '5', tab: 'partner', category: 'Vé máy bay',
    title: 'Vietnam Airlines: Mua chiều đi tặng chiều về nội địa', 
    code: 'VNAFREE', 
    date: 'Hết hạn: 05/05/2026', 
    image: 'https://images.unsplash.com/photo-1436491865332-7a61e109cc05?w=800&q=80',
    badge: 'Giờ vàng'
  }
];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('hot');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Logic lọc dữ liệu 2 tầng (Lọc theo Tab -> Lọc theo Category)
  const filteredPromos = PROMOS.filter(item => {
    const matchTab = item.tab === activeTab;
    const matchCategory = activeCategory === 'Tất cả' || item.category === activeCategory;
    return matchTab && matchCategory;
  });

  const handleCopyCode = (code: string) => {
    // Demo chức năng Copy (Sẽ dùng Clipboard API trong thực tế)
    Alert.alert("Thành công", `Đã lưu mã giảm giá: ${code}`);
  };

  // UI Thẻ Khuyến Mãi
  const renderPromoCard = ({ item }: any) => (
    <View style={styles.card}>
      {/* Ảnh banner */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        
        {/* Khu vực Mã giảm giá (Chỉ hiện nếu có mã) */}
        {item.code ? (
          <View style={styles.actionRow}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{item.code}</Text>
            </View>
            <TouchableOpacity 
              style={styles.copyButton} 
              activeOpacity={0.8}
              onPress={() => handleCopyCode(item.code)}
            >
              <Text style={styles.copyButtonText}>Lưu mã</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.useNowButton} activeOpacity={0.8}>
              <Text style={styles.useNowText}>Xem chi tiết</Text>
              <Ionicons name="arrow-forward" size={16} color="#005AAB" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER CHUẨN PHẲNG */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khuyến mãi</Text>
        <TouchableOpacity style={styles.historyIcon}>
          <Ionicons name="time-outline" size={24} color="#005AAB" />
        </TouchableOpacity>
      </View>

      {/* 2. MAIN TABS (Hot nhất / Đối tác) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'hot' && styles.activeTab]}
          onPress={() => setActiveTab('hot')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'hot' && styles.activeTabText]}>Hot nhất</Text>
          {activeTab === 'hot' && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'partner' && styles.activeTab]}
          onPress={() => setActiveTab('partner')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'partner' && styles.activeTabText]}>Đối tác Vietravel</Text>
          {activeTab === 'partner' && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      {/* 3. CATEGORY SCROLL (Tất cả, Tour, Khách sạn...) */}
      <View style={styles.categoryWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.catChip, activeCategory === cat && styles.activeCatChip]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.activeCatText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4. DANH SÁCH KHUYẾN MÃI */}
      {filteredPromos.length > 0 ? (
        <FlatList
          data={filteredPromos}
          keyExtractor={item => item.id}
          renderItem={renderPromoCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Hiện chưa có khuyến mãi nào cho mục này.</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  // Header Phẳng
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  historyIcon: { position: 'absolute', right: 20 },

  // Tabs Phẳng (Đường line gạch chân)
  tabContainer: { flexDirection: 'row',marginBottom: 15, backgroundColor: '#fff', paddingHorizontal: 20 },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 15, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#005AAB', fontWeight: 'bold' },
  activeLine: { position: 'absolute', bottom: 0, width: '40%', height: 3, backgroundColor: '#005AAB', borderRadius: 2 },

  // Categories (Chips)
  categoryWrapper: { backgroundColor: '#fff', paddingBottom: 15 },
  categoryScroll: { paddingHorizontal: 20, gap: 10 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F5FA', borderWidth: 1, borderColor: 'transparent' },
  activeCatChip: { backgroundColor: '#E0F0FF', borderColor: '#005AAB' },
  catText: { fontSize: 13, color: '#555', fontWeight: '500' },
  activeCatText: { color: '#005AAB', fontWeight: 'bold' },

  // Danh sách
  listContainer: { padding: 15, paddingBottom: 100 },
  
  // Card Phẳng
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#EAEAEA', overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 160, resizeMode: 'cover' },
  badgeContainer: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FF2D55', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  // Card Content
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6, lineHeight: 22 },
  cardDate: { fontSize: 13, color: '#888', marginBottom: 15 },
  
  // Nút Hành Động
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  
  codeBox: { backgroundColor: '#F8F9FA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#EAEAEA', borderStyle: 'dashed' },
  codeText: { fontSize: 14, fontWeight: 'bold', color: '#333', letterSpacing: 1 },
  
  copyButton: { backgroundColor: '#005AAB', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  copyButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  
  useNowButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F0FF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  useNowText: { color: '#005AAB', fontSize: 13, fontWeight: 'bold', marginRight: 5 },

  // Empty State
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 14, color: '#888' }
});