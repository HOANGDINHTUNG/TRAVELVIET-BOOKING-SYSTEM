import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, Platform, Dimensions, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();

  // --- MENU ITEMS: Giữ nguyên đường dẫn chuẩn của Trứ ---
  const MENU_ITEMS = [
    { id: 1, title: 'Bài viết của tôi', icon: 'document-text-outline', color: '#005AAB', route: '/user/Nguyễn Công Trứ' },
    { id: 2, title: 'Voucher & Ưu đãi', icon: 'ticket-outline', color: '#FF2D55', route: '/vouchers' }, 
    { id: 3, title: 'Lịch sử đặt Tour', icon: 'time-outline', color: '#4CAF50', route: '/history' },   
    { id: 4, title: 'Yêu thích (Đã lưu)', icon: 'heart-outline', color: '#FF9800', route: '/favorites' }, 
    { id: 5, title: 'Cài đặt hệ thống', icon: 'settings-outline', color: '#607D8B', route: '/settings' },
    { id: 6, title: 'Hỗ trợ khách hàng', icon: 'help-circle-outline', color: '#9C27B0', route: '/support' },
  ];

  // --- HÀM ĐIỀU HƯỚNG: Đã mở khóa cho các trang đã xong ---
const handleMenuPress = (route: string, title: string) => {
  const completedRoutes = [
    '/user/Nguyễn Công Trứ', 
    '/vouchers', 
    '/history', 
    '/favorites'
  ];

  if (completedRoutes.includes(route)) {
    console.log("Đang chuyển đến:", route); // Xem ở terminal xem nó có hiện dòng này không
    router.push(route as any);
  } else {
    Alert.alert(
      'Thông báo',
      `Đường dẫn ${route} hiện chưa có file xử lý hoặc đang phát triển.`
    );
  }
};

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Trứ có chắc chắn muốn đăng xuất khỏi ứng dụng không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => {
            console.log("Đã đăng xuất!");
            router.replace('/'); 
          }
        }
      ]
    );
  };

  const handleEditAvatar = () => {
    Alert.alert("Đổi ảnh đại diện", "Vui lòng cấp quyền truy cập Thư viện ảnh để thay đổi Avatar.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 1. HEADER & AVATAR CARD */}
        <View style={styles.headerSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000' }} 
            style={styles.coverImage} 
          />
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.editAvatarBtn} onPress={handleEditAvatar}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>Công Trứ Nguyễn</Text>
            <Text style={styles.userCode}>Hạng Hội viên: Gold Member</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Bài viết</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2k</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>250</Text>
                <Text style={styles.statLabel}>Xu</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. MENU LIST */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quản lý cá nhân</Text>
          <View style={styles.menuGrid}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem} 
                activeOpacity={0.6}
                onPress={() => handleMenuPress(item.route, item.title)}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#FF2D55" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerSection: { height: 330, marginBottom: 20 }, // Giảm chiều cao header một chút cho cân đối
  coverImage: { width: '100%', height: 180, resizeMode: 'cover' },
  profileCard: { 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    borderRadius: 24, 
    marginTop: -70, 
    alignItems: 'center', 
    paddingBottom: 25, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, marginTop: -50, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  editAvatarBtn: { position: 'absolute', bottom: 5, right: 0, backgroundColor: '#005AAB', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginTop: 12 },
  userCode: { fontSize: 13, color: '#005AAB', fontWeight: '600', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 20 },
  statNumber: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 3 },
  statDivider: { width: 1, height: 25, backgroundColor: '#EEE' },
  menuSection: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15, marginLeft: 5 },
  menuGrid: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  iconCircle: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 30, padding: 16, backgroundColor: '#FFF0F3', borderRadius: 18 },
  logoutText: { color: '#FF2D55', fontWeight: 'bold', marginLeft: 10, fontSize: 15 }
});