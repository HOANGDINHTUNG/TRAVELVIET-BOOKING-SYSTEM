import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, FlatList, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const VOUCHERS = [
  { id: '1', code: 'TRAVEL20', title: 'Giảm 20% Tour Nội Địa', desc: 'Áp dụng cho đơn từ 2.000.000đ. Tối đa 500k.', exp: 'Hết hạn: 30/05/2026' },
  { id: '2', code: 'HOTEL50', title: 'Giảm 50K Khách Sạn', desc: 'Áp dụng cho mọi booking khách sạn tại Đà Lạt.', exp: 'Hết hạn: 15/05/2026' },
  { id: '3', code: 'FREEBUS', title: 'Miễn phí xe đưa đón', desc: 'Áp dụng cho khách hàng xuất phát từ TP.HCM.', exp: 'Hết hạn: 10/06/2026' },
];

export default function VouchersScreen() {
  const router = useRouter();

  // Hàm xử lý khi bấm nút Dùng ngay
  const handleUseVoucher = (voucherCode: string) => {
    Alert.alert(
      "Đã lưu Voucher", 
      `Mã ${voucherCode} đã sẵn sàng. Bạn hãy chọn một chuyến đi để áp dụng ưu đãi này nhé!`,
      [
        { text: "Để sau", style: "cancel" },
        { 
          text: "Chọn Tour ngay", 
          style: "default",
          // Nhảy về trang chủ (tabs) để bắt đầu quá trình booking
          onPress: () => router.push('/(tabs)' as any) 
        }
      ]
    );
  };

  const renderVoucher = ({ item }: any) => (
    <View style={styles.voucherCard}>
      <View style={styles.leftPart}>
        <Ionicons name="ticket" size={30} color="#FF2D55" />
        <Text style={styles.codeText}>{item.code}</Text>
      </View>
      <View style={styles.rightPart}>
        <Text style={styles.vTitle}>{item.title}</Text>
        <Text style={styles.vDesc}>{item.desc}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.vExp}>{item.exp}</Text>
          <TouchableOpacity 
            style={styles.useBtn}
            activeOpacity={0.8}
            onPress={() => handleUseVoucher(item.code)}
          >
            <Text style={styles.useBtnText}>Dùng ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kho Voucher của tôi</Text>
        <View style={{ width: 34 }} /> {/* Cân bằng layout với nút back */}
      </View>
      
      <FlatList
        data={VOUCHERS}
        keyExtractor={item => item.id}
        renderItem={renderVoucher}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  voucherCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  leftPart: { backgroundColor: '#FFF0F3', width: 95, justifyContent: 'center', alignItems: 'center', padding: 10, borderRightWidth: 1, borderRightColor: '#FFEBEB', borderStyle: 'dashed' },
  codeText: { fontSize: 13, fontWeight: '900', color: '#FF2D55', marginTop: 8, textAlign: 'center' },
  
  rightPart: { flex: 1, padding: 15, justifyContent: 'space-between' },
  vTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  vDesc: { fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 18 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vExp: { fontSize: 12, color: '#888', fontWeight: '500' },
  
  useBtn: { backgroundColor: '#005AAB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  useBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});