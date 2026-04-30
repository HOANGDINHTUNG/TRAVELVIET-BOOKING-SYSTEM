import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MOCK_BOOKINGS = [
  { id: 'TV12345', title: 'Hà Giang - Lũng Cú - Đồng Văn', date: '15/05/2026', price: '3,990,000 đ', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { id: 'TV67890', title: 'Đà Lạt - Thành phố ngàn hoa', date: '20/04/2026', price: '2,450,000 đ', status: 'Completed', img: 'https://images.unsplash.com/photo-1583417657208-11e2dc40d7c3?w=400' },
];

export default function BookingHistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');

  const renderBooking = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/bookings/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.img }} style={styles.cardImg} />
      <View style={styles.cardInfo}>
        <View style={styles.statusRow}>
          <Text style={styles.bookingId}>#{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Confirmed' ? '#E8F5E9' : '#F5F5F5' }]}>
            <Text style={[styles.statusText, { color: item.status === 'Confirmed' ? '#4CAF50' : '#888' }]}>
              {item.status === 'Confirmed' ? 'Đã xác nhận' : 'Hoàn thành'}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.date}><Ionicons name="calendar-outline" /> {item.date}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Chuyến đi của tôi</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={MOCK_BOOKINGS}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  cardImg: { width: 100, height: 120 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingId: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 13, color: '#666' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#FF2D55' }
});