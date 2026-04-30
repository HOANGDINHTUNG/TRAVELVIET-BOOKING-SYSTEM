import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Image, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// ĐÃ THÊM: Import kho dữ liệu Profile
import { useProfile } from '../../constants/ProfileContext';

export default function PreferencesScreen() {
  const router = useRouter();
  // ĐÃ THÊM: Lấy dữ liệu profile từ kho tổng
  const { profile } = useProfile();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất khỏi TravelViet?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: () => router.replace('/(auth)/login' as any) }
    ]);
  };

  const MENU_ITEMS = [
    { id: 1, title: 'Chuyến đi của tôi', icon: 'briefcase-outline', color: '#005AAB', route: '/bookings' },
    { id: 2, title: 'Kho Voucher', icon: 'ticket-outline', color: '#FF2D55', route: '/preferences/vouchers' },
    { id: 3, title: 'Điểm thưởng (500 điểm)', icon: 'star-outline', color: '#FF9800', route: '/preferences/points' },
    { id: 4, title: 'Chính sách & Bảo mật', icon: 'shield-checkmark-outline', color: '#4CAF50', route: '' },
    { id: 5, title: 'Trung tâm trợ giúp', icon: 'help-circle-outline', color: '#607D8B', route: '' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* HEADER: Thông tin user */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTop}>
            <Image 
              // ĐÃ SỬA: Lấy avatar từ kho tổng
              source={{ uri: profile.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Xin chào,</Text>
              {/* ĐÃ SỬA: Lấy tên từ kho tổng */}
              <Text style={styles.userName}>{profile.name}</Text>
              <View style={styles.memberBadge}>
                <Ionicons name="diamond" size={12} color="#FFD700" />
                <Text style={styles.memberText}>Thành viên Vàng</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => router.push('/preferences/edit-profile' as any)}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* THẺ TÍCH ĐIỂM (Nằm đè lên header) */}
        <View style={styles.pointsCardWrapper}>
          <View style={styles.pointsCard}>
            <View style={styles.pointItem}>
              <Ionicons name="wallet-outline" size={28} color="#005AAB" />
              <Text style={styles.pointValue}>1,250,000đ</Text>
              <Text style={styles.pointLabel}>Số dư ví</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.pointItem}>
              <Ionicons name="star" size={28} color="#FF9800" />
              <Text style={styles.pointValue}>500</Text>
              <Text style={styles.pointLabel}>Điểm TViet</Text>
            </View>
          </View>
        </View>

        {/* DANH SÁCH MENU */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Cài đặt & Tiện ích</Text>
          <View style={styles.menuBox}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.menuRow, index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => item.route ? router.push(item.route as any) : Alert.alert('Thông báo', 'Tính năng đang phát triển!')}
              >
                <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NÚT ĐĂNG XUẤT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBackground: { backgroundColor: '#005AAB', paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 60, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#fff' },
  userInfo: { flex: 1, marginLeft: 15 },
  greeting: { fontSize: 13, color: '#B3D4FF', marginBottom: 2 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  memberText: { color: '#FFD700', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  pointsCardWrapper: { paddingHorizontal: 20, marginTop: -35, zIndex: 10 },
  pointsCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  pointItem: { flex: 1, alignItems: 'center' },
  pointValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 8 },
  pointLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  divider: { width: 1, backgroundColor: '#eee', marginVertical: 5 },

  menuContainer: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuBox: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTitle: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginTop: 25, paddingVertical: 15, borderRadius: 16, borderWidth: 1, borderColor: '#FFEBEB' },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#FF3B30', marginLeft: 10 }
});