import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, FlatList, 
  TouchableOpacity, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dữ liệu ban đầu
const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Đặt tour thành công!', desc: 'Booking #TV12345 đi Hà Giang của bạn đã được xác nhận. Vui lòng kiểm tra email.', time: '10 phút trước', type: 'success', unread: true },
  { id: '2', title: 'Khuyến mãi khủng cuối tuần', desc: 'Giảm ngay 20% cho các tour Phú Quốc. Số lượng có hạn, đặt ngay kẻo lỡ!', time: '2 giờ trước', type: 'promo', unread: true },
  { id: '3', title: 'Biến động số dư điểm', desc: 'Bạn vừa được cộng +500 Điểm vàng từ chuyến đi Đà Lạt.', time: '1 ngày trước', type: 'points', unread: false },
  { id: '4', title: 'Cảnh báo thời tiết', desc: 'Sapa hiện đang có mưa lớn, nhiệt độ giảm sâu. Nhớ mang theo áo ấm nhé!', time: '2 ngày trước', type: 'alert', unread: false },
];

export default function NotificationsScreen() {
  const router = useRouter();
  
  // State quản lý danh sách thông báo và Tab đang chọn
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'promo'

  // Hàm cấu hình icon theo từng loại thông báo
  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return { name: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' };
      case 'promo': return { name: 'gift', color: '#FF2D55', bg: '#FFEBEB' };
      case 'points': return { name: 'star', color: '#FF9800', bg: '#FFF3E0' };
      case 'alert': return { name: 'warning', color: '#FFC107', bg: '#FFF8E1' };
      default: return { name: 'notifications', color: '#005AAB', bg: '#E3F2FD' };
    }
  };

  // Hàm 1: Đánh dấu 1 thông báo là đã đọc
  const handleReadNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(noti => noti.id === id ? { ...noti, unread: false } : noti)
    );
  };

  // Hàm 2: Đánh dấu TẤT CẢ là đã đọc
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(noti => ({ ...noti, unread: false })));
  };

  // Hàm 3: Lọc dữ liệu theo Tab đang chọn
  const filteredNotifications = notifications.filter(noti => {
    if (activeTab === 'unread') return noti.unread;
    if (activeTab === 'promo') return noti.type === 'promo';
    return true; // 'all'
  });

  // Render 1 dòng thông báo
  const renderItem = ({ item }: any) => {
    const iconConfig = getIcon(item.type);
    return (
      <TouchableOpacity 
        style={[styles.notiItem, item.unread && styles.unreadItem]}
        activeOpacity={0.7}
        onPress={() => {
          // 1. Đánh dấu đã đọc
          handleReadNotification(item.id);
          
          // 2. Chuyển trang và ép kiểu toàn bộ Object thành 'any' để TypeScript không báo lỗi
          router.push({
            pathname: `/notification/${item.id}`,
            params: {
              title: item.title,
              desc: item.desc,
              time: item.time,
              type: item.type
            }
          } as any);
        }}
      >
        <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
          {/* Ép kiểu iconConfig.name để Ionicons không bắt lỗi chữ */}
          <Ionicons name={iconConfig.name as any} size={24} color={iconConfig.color} />
        </View>
        <View style={styles.notiContent}>
          <Text style={[styles.notiTitle, item.unread && styles.unreadText]}>{item.title}</Text>
          <Text style={styles.notiDesc} numberOfLines={2}>{item.desc}</Text>
          <Text style={styles.notiTime}>{item.time}</Text>
        </View>
        {item.unread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  // Render màn hình Trống
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={60} color="#ddd" />
      <Text style={styles.emptyTitle}>Không có thông báo nào</Text>
      <Text style={styles.emptyDesc}>
        {activeTab === 'unread' ? 'Bạn đã đọc hết tất cả thông báo rồi!' : 'Chưa có khuyến mãi nào trong hôm nay.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done-circle-outline" size={26} color="#005AAB" />
        </TouchableOpacity>
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'all' && styles.activeTabBtn]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'unread' && styles.activeTabBtn]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Chưa đọc</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'promo' && styles.activeTabBtn]}
          onPress={() => setActiveTab('promo')}
        >
          <Text style={[styles.tabText, activeTab === 'promo' && styles.activeTabText]}>Khuyến mãi</Text>
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH THÔNG BÁO */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={filteredNotifications.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
        ListEmptyComponent={renderEmptyState} // Hiển thị khi danh sách rỗng
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', gap: 10 },
  tabBtn: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#F0F0F0' },
  activeTabBtn: { backgroundColor: '#E3F2FD' },
  tabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#005AAB', fontWeight: 'bold' },

  // Item list
  notiItem: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  unreadItem: { backgroundColor: '#F4F9FF' }, // Nền xanh nhạt cho thông báo chưa đọc
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  notiContent: { flex: 1, justifyContent: 'center' },
  notiTitle: { fontSize: 15, fontWeight: '500', color: '#333', marginBottom: 4 },
  unreadText: { fontWeight: 'bold', color: '#005AAB' },
  notiDesc: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 6 },
  notiTime: { fontSize: 12, color: '#999' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF2D55', marginTop: 5 },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15 },
  emptyDesc: { fontSize: 14, color: '#888', marginTop: 5, textAlign: 'center', paddingHorizontal: 40 }
});