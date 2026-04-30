import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  FlatList, Image, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dữ liệu giả lập (Lấy ảnh từ Unsplash cho ổn định)
const PROMOS = [
  { 
    id: '1', type: 'hot', 
    title: 'GIA NHẬP VIETRAVELPLUS - ĐẶC QUYỀN DÀNH CHO HỘI VIÊN MỚI', 
    date: '02/07/2025', 
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80' 
  },
  { 
    id: '2', type: 'hot', 
    title: '✨ TRẢI NGHIỆM DU LỊCH 5 SAO VỚI TOP 3 HÃNG HÀNG KHÔNG TỐT NHẤT', 
    date: '21/06/2025', 
    image: 'https://images.unsplash.com/photo-1436491865332-7a61e109cc05?w=800&q=80' 
  },
  { 
    id: '3', type: 'partner', 
    title: 'Chạm hành trình - Nhận quà xinh cùng Vietravel & JCB', 
    likes: 0, comments: 0, 
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' 
  },
  { 
    id: '4', type: 'partner', 
    title: 'Du Xuân tiết kiệm cùng Vietravel và Sacombank: Giảm ngay 500.000 đồng', 
    likes: 0, comments: 0, 
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' 
  }
];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('hot');

  // Lọc dữ liệu theo tab
  const filteredPromos = PROMOS.filter(item => item.type === activeTab);

  const renderPromoCard = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        
        {/* Render bottom info based on type */}
        {item.type === 'hot' ? (
          <View style={styles.metaRow}>
            <Ionicons name={"calendar-outline" as any} size={16} color="#666" />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
        ) : (
          <View style={styles.metaRow}>
            <Ionicons name={"thumbs-up-outline" as any} size={16} color="#888" />
            <Text style={styles.metaText}>{item.likes}</Text>
            <View style={styles.dot} />
            <Ionicons name={"chatbubble-outline" as any} size={16} color="#888" />
            <Text style={styles.metaText}>{item.comments} Đánh giá</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KHUYẾN MÃI</Text>
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'hot' && styles.activeTab]}
            onPress={() => setActiveTab('hot')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'hot' && styles.activeTabText]}>Hot nhất</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'partner' && styles.activeTab]}
            onPress={() => setActiveTab('partner')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'partner' && styles.activeTabText]}>Đối tác Vietravel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách Khuyến mãi */}
      <FlatList
        data={filteredPromos}
        keyExtractor={item => item.id}
        renderItem={renderPromoCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  header: { paddingVertical: 15, backgroundColor: '#fff', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#005AAB' },

  tabContainer: { backgroundColor: '#fff', paddingHorizontal: 15, paddingBottom: 15 },
  tabBackground: { flexDirection: 'row', backgroundColor: '#F0F5FA', borderRadius: 25, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  activeTab: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#005AAB', fontWeight: 'bold' },

  listContainer: { padding: 15, paddingBottom: 100 }, // Padding bottom để không bị lẹm vào Tab Bar
  
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, lineHeight: 20, textTransform: 'uppercase' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: '#666', marginLeft: 6, marginRight: 15 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ccc', marginRight: 15 }
});