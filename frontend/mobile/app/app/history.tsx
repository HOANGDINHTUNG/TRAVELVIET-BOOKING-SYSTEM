import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BOOKINGS = [
  { id: '1', code: 'VN8823', title: 'Đà Nẵng - Hội An - Bà Nà Hills', date: '15/07/2026', price: '4,500,000đ', status: 'upcoming', image: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?w=400' },
  { id: '2', code: 'VN7719', title: 'Khám phá Mù Cang Chải', date: '10/05/2026', price: '3,200,000đ', status: 'completed', image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?w=400' },
  { id: '3', code: 'VN9901', title: 'Tour Phú Quốc 3N2Đ', date: '01/01/2026', price: '5,800,000đ', status: 'cancelled', image: 'https://images.pexels.com/photos/3208039/pexels-photo-3208039.jpeg?w=400' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredBookings = BOOKINGS.filter(b => b.status === activeTab);

  const getStatusColor = (status: string) => {
    if (status === 'upcoming') return '#FF9800'; // Cam
    if (status === 'completed') return '#4CAF50'; // Xanh lá
    return '#FF2D55'; // Đỏ
  };

  const getStatusText = (status: string) => {
    if (status === 'upcoming') return 'Sắp khởi hành';
    if (status === 'completed') return 'Đã hoàn thành';
    return 'Đã hủy';
  };

  const renderBooking = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingCode}>Mã Đặt: {item.code}</Text>
        <Text style={[styles.statusBadge, { color: getStatusColor(item.status) }]}>{getStatusText(item.status)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.tourTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.tourDate}>Khởi hành: {item.date}</Text>
          <Text style={styles.tourPrice}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        {item.status === 'upcoming' && <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Xem vé</Text></TouchableOpacity>}
        {item.status === 'completed' && <TouchableOpacity style={[styles.actionBtn, styles.reviewBtn]}><Text style={[styles.actionText, {color: '#fff'}]}>Đánh giá</Text></TouchableOpacity>}
        {item.status === 'cancelled' && <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>Đặt lại</Text></TouchableOpacity>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1A1A1A" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đặt Tour</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'upcoming' ? 'Sắp đi' : tab === 'completed' ? 'Đã đi' : 'Đã hủy'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="receipt-outline" size={60} color="#DDD" /><Text style={styles.emptyText}>Chưa có chuyến đi nào ở mục này.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff' },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#005AAB' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '500' },
  tabTextActive: { color: '#005AAB', fontWeight: 'bold' },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, padding: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10, marginBottom: 10 },
  bookingCode: { fontSize: 13, fontWeight: 'bold', color: '#555' },
  statusBadge: { fontSize: 13, fontWeight: 'bold' },
  cardBody: { flexDirection: 'row' },
  cardImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  cardInfo: { flex: 1, justifyContent: 'space-between' },
  tourTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  tourDate: { fontSize: 12, color: '#666' },
  tourPrice: { fontSize: 15, fontWeight: 'bold', color: '#FF2D55' },
  cardFooter: { marginTop: 15, alignItems: 'flex-end' },
  actionBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#005AAB' },
  reviewBtn: { backgroundColor: '#005AAB' },
  actionText: { color: '#005AAB', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#888', marginTop: 15 }
});