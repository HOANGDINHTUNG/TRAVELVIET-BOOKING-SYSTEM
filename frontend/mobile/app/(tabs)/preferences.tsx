import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PreferencesScreen() {
  const router = useRouter();

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi TravelViet?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => router.replace('/(auth)/login') // Đá văng ra màn hình Login
        }
      ]
    );
  };

  // Component tạo ra từng dòng Menu cho lẹ
  const MenuItem = ({ icon, title, color = "#333", onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={color} style={styles.menuIcon} />
        <Text style={[styles.menuTitle, { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Phần Header Avatar */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>Trứ (Admin)</Text>
        <Text style={styles.userEmail}>admin@gmail.com</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Thành viên Vàng</Text>
        </View>
      </View>

      {/* Danh sách Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quản lý dịch vụ</Text>
        <MenuItem icon="ticket-outline" title="Lịch sử đặt Tour" onPress={() => Alert.alert("Thông báo", "Chức năng đang phát triển")} />
        <MenuItem icon="heart-outline" title="Tour yêu thích" onPress={() => {}} />
        <MenuItem icon="star-outline" title="Đánh giá của tôi" onPress={() => {}} />

        <Text style={styles.sectionTitle}>Tài khoản & Cài đặt</Text>
        <MenuItem icon="person-circle-outline" title="Chỉnh sửa thông tin" onPress={() => {}} />
        <MenuItem icon="notifications-outline" title="Cài đặt thông báo" onPress={() => {}} />
        <MenuItem icon="headset-outline" title="Trung tâm trợ giúp" onPress={() => {}} />
        
        {/* Nút Đăng xuất */}
        <View style={{ marginTop: 20 }}>
          <MenuItem icon="log-out-outline" title="Đăng xuất" color="#FF3B30" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  profileHeader: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#FF2D55' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  userEmail: { fontSize: 16, color: '#666', marginBottom: 10 },
  badge: { backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontWeight: 'bold', color: '#856404' },
  menuContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#888', marginTop: 15, marginBottom: 10, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 15 },
  menuTitle: { fontSize: 16, fontWeight: '500' }
});