import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  FlatList, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- MOCK DATA VOUCHERS ---
const VOUCHERS = [
  { id: '1', title: 'Giảm 500K cho Tour Nội địa', code: 'VN500K', exp: '30/05/2026', type: 'valid', color: '#FF2D55' },
  { id: '2', title: 'Miễn phí xe đưa đón Sân bay', code: 'FREEBUS', exp: '15/06/2026', type: 'valid', color: '#005AAB' },
  { id: '3', title: 'Giảm 10% Tour Châu Âu', code: 'EU10', exp: '01/05/2026', type: 'valid', color: '#FF9800' },
  { id: '4', title: 'Giảm 200K vé máy bay', code: 'AIR200', exp: '01/04/2026', type: 'expired', color: '#999' },
  { id: '5', title: 'Voucher Buffet 5 Sao', code: 'BUFFET', exp: '20/03/2026', type: 'used', color: '#999' },
];

export default function VouchersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('valid');

  // Lọc voucher theo trạng thái
  const filteredVouchers = VOUCHERS.filter(v => v.type === activeTab);

  const renderVoucher = ({ item }: any) => (
    <View style={styles.voucherCard}>
      {/* Cột trái: Icon / Màu sắc */}
      <View style={[styles.voucherLeft, { backgroundColor: item.color }]}>
        <Ionicons name={item.id === '2' ? "car" : "ticket"} size={32} color="#fff" />
      </View>
      
      {/* Đường răng cưa cắt giữa vé */}
      <View style={styles.tearLineContainer}>
        <View style={styles.halfCircleTop} />
        <View style={styles.dashedLine} />
        <View style={styles.halfCircleBottom} />
      </View>

      {/* Cột phải: Thông tin */}
      <View style={styles.voucherRight}>
        <Text style={[styles.voucherTitle, activeTab !== 'valid' && { color: '#888' }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.voucherDate}>HSD: {item.exp}</Text>
        
        <View style={styles.voucherAction}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{item.code}</Text>
          </View>
          {activeTab === 'valid' ? (
            <TouchableOpacity style={styles.useBtn}>
              <Text style={styles.useBtnText}>Dùng ngay</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.statusText}>{activeTab === 'used' ? 'Đã sử dụng' : 'Đã hết hạn'}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kho Voucher</Text>
        <View style={{ width: 24 }} /> {/* Spacer để căn giữa tiêu đề */}
      </View>

      {/* TABS LỌC TRẠNG THÁI */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'valid' && styles.tabBtnActive]}
          onPress={() => setActiveTab('valid')}
        >
          <Text style={[styles.tabText, activeTab === 'valid' && styles.tabTextActive]}>Khả dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'used' && styles.tabBtnActive]}
          onPress={() => setActiveTab('used')}
        >
          <Text style={[styles.tabText, activeTab === 'used' && styles.tabTextActive]}>Đã sử dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'expired' && styles.tabBtnActive]}
          onPress={() => setActiveTab('expired')}
        >
          <Text style={[styles.tabText, activeTab === 'expired' && styles.tabTextActive]}>Hết hạn</Text>
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH VOUCHER */}
      <FlatList
        data={filteredVouchers}
        keyExtractor={item => item.id}
        renderItem={renderVoucher}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>Không có voucher nào ở mục này.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  /* HEADER */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },

  /* TABS */
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#005AAB' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '500' },
  tabTextActive: { color: '#005AAB', fontWeight: 'bold' },

  /* LIST & CARD */
  listContainer: { padding: 20, paddingBottom: 50 },
  voucherCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  
  // Cột trái (Màu sắc)
  voucherLeft: { width: 90, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  // Đường răng cưa tàng hình
  tearLineContainer: { width: 15, backgroundColor: '#fff', alignItems: 'center', position: 'relative' },
  halfCircleTop: { position: 'absolute', top: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#F8F9FA' },
  halfCircleBottom: { position: 'absolute', bottom: -8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#F8F9FA' },
  dashedLine: { width: 1, height: '100%', borderWidth: 1, borderColor: '#EEE', borderStyle: 'dashed', marginTop: 8, marginBottom: 8 },

  // Cột phải (Nội dung)
  voucherRight: { flex: 1, padding: 15, borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  voucherTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  voucherDate: { fontSize: 12, color: '#888', marginBottom: 12 },
  voucherAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeBadge: { backgroundColor: '#F5F6F8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0' },
  codeText: { fontSize: 12, fontWeight: 'bold', color: '#666', letterSpacing: 1 },
  useBtn: { backgroundColor: '#FF2D55', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  useBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statusText: { fontSize: 12, color: '#AAA', fontStyle: 'italic' },

  /* EMPTY STATE */
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#888', marginTop: 15, fontSize: 14 }
});