import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  Platform, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NotificationDetailScreen() {
  const router = useRouter();
  // Lấy dữ liệu được truyền sang từ trang danh sách
  const { id, title, desc, time, type } = useLocalSearchParams();

  // Hàm lấy màu sắc và icon tương ứng
  const getIcon = (notiType: string) => {
    switch(notiType) {
      case 'success': return { name: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' };
      case 'promo': return { name: 'gift', color: '#FF2D55', bg: '#FFEBEB' };
      case 'points': return { name: 'star', color: '#FF9800', bg: '#FFF3E0' };
      case 'alert': return { name: 'warning', color: '#FFC107', bg: '#FFF8E1' };
      default: return { name: 'notifications', color: '#005AAB', bg: '#E3F2FD' };
    }
  };

  const iconConfig = getIcon(type as string);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thông báo</Text>
        <View style={{ width: 34 }} /> {/* Để cân bằng layout với nút Back */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ICON BIG SIZE */}
        <View style={styles.topSection}>
          <View style={[styles.bigIconBox, { backgroundColor: iconConfig.bg }]}>
            <Ionicons name={iconConfig.name as any} size={40} color={iconConfig.color} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>

        {/* NỘI DUNG CHI TIẾT (BỌC TRONG CARD) */}
        <View style={styles.card}>
          <Text style={styles.descText}>{desc}</Text>
          
          {/* Nút hành động (Call to Action) tùy theo loại thông báo */}
          {type === 'promo' && (
            <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: '#FF2D55' }]}>
              <Text style={styles.ctaText}>Sử dụng ưu đãi ngay</Text>
            </TouchableOpacity>
          )}
          {type === 'success' && (
            <TouchableOpacity 
              style={[styles.ctaBtn, { backgroundColor: '#4CAF50' }]}
              // Sửa thành cách điều hướng Object cho chắc chắn
              onPress={() => router.push({ pathname: '/bookings/[id]', params: { id: 'TV12345' } })}
            >
              <Text style={styles.ctaText}>Xem chi tiết Booking</Text>
            </TouchableOpacity>
          )}
          {type === 'points' && (
            <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.ctaText}>Đổi quà ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  content: { padding: 20 },
  topSection: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  bigIconBox: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10, paddingHorizontal: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 14, color: '#888', marginLeft: 5 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  descText: { fontSize: 16, color: '#444', lineHeight: 24, textAlign: 'justify' },
  
  ctaBtn: { marginTop: 25, paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});