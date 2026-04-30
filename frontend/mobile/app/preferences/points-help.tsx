import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PointsHelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name={"arrow-back" as any} size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quy định & Thể lệ</Text>
        <View style={{ width: 34 }} /> {/* Để cân bằng tiêu đề ra giữa */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name={"information-circle" as any} size={40} color="#005AAB" />
          <Text style={styles.bannerTitle}>Cẩm nang Điểm TViet</Text>
          <Text style={styles.bannerDesc}>Khám phá cách tích lũy và sử dụng điểm thưởng để có những chuyến đi tiết kiệm nhất!</Text>
        </View>

        {/* Section 1: Giá trị quy đổi */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={"cash-outline" as any} size={22} color="#4CAF50" />
            <Text style={styles.cardTitle}>Giá trị quy đổi</Text>
          </View>
          <Text style={styles.textBody}>
            Mỗi điểm TViet tương đương với giá trị tiền mặt là <Text style={styles.highlightText}>100 VNĐ</Text>.
          </Text>
          <Text style={styles.textBody}>
            Ví dụ: 500 điểm TViet = 50.000 VNĐ. Điểm này có thể dùng để đổi Voucher hoặc giảm giá trực tiếp khi thanh toán Tour.
          </Text>
        </View>

        {/* Section 2: Cách tích lũy */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={"add-circle-outline" as any} size={22} color="#FF9800" />
            <Text style={styles.cardTitle}>Làm sao để có điểm?</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name={"checkmark" as any} size={18} color="#005AAB" />
            <Text style={styles.listText}><Text style={styles.boldText}>Đặt Tour / Khách sạn:</Text> Nhận ngay 1% giá trị đơn hàng thành điểm thưởng.</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name={"checkmark" as any} size={18} color="#005AAB" />
            <Text style={styles.listText}><Text style={styles.boldText}>Đánh giá chuyến đi:</Text> Nhận 100 điểm cho mỗi đánh giá có kèm hình ảnh.</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name={"checkmark" as any} size={18} color="#005AAB" />
            <Text style={styles.listText}><Text style={styles.boldText}>Quà tặng sinh nhật:</Text> Tặng ngay 500 điểm vào tháng sinh nhật của bạn.</Text>
          </View>
        </View>

        {/* Section 3: Hạng thành viên */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={"diamond-outline" as any} size={22} color="#FF2D55" />
            <Text style={styles.cardTitle}>Hạng thành viên</Text>
          </View>
          <View style={styles.tierRow}>
            <Text style={[styles.tierName, { color: '#888' }]}>Bạc (Silver)</Text>
            <Text style={styles.tierCondition}>Mặc định khi đăng ký</Text>
          </View>
          <View style={styles.tierRow}>
            <Text style={[styles.tierName, { color: '#FFD700' }]}>Vàng (Gold)</Text>
            <Text style={styles.tierCondition}>Tích lũy > 5.000 điểm</Text>
          </View>
          <View style={styles.tierRow}>
            <Text style={[styles.tierName, { color: '#00C4B5' }]}>Kim Cương</Text>
            <Text style={styles.tierCondition}>Tích lũy > 20.000 điểm</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  content: { padding: 20 },
  
  banner: { alignItems: 'center', backgroundColor: '#E3F2FD', padding: 20, borderRadius: 16, marginBottom: 20 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#005AAB', marginTop: 10, marginBottom: 5 },
  bannerDesc: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 22 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  
  textBody: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 10 },
  highlightText: { fontWeight: 'bold', color: '#FF2D55' },
  
  listItem: { flexDirection: 'row', marginBottom: 12, paddingRight: 15 },
  listText: { fontSize: 14, color: '#555', lineHeight: 20, marginLeft: 8 },
  boldText: { fontWeight: 'bold', color: '#333' },

  tierRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tierName: { fontSize: 15, fontWeight: 'bold' },
  tierCondition: { fontSize: 13, color: '#666' }
});