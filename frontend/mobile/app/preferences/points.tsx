import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  FlatList, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dữ liệu giả lập lịch sử điểm
const POINT_HISTORY = [
  { id: '1', title: 'Hoàn thành Tour Hà Giang', date: '28/04/2026', type: 'earn', points: 500 },
  { id: '2', title: 'Đổi Voucher Giảm 20%', date: '20/04/2026', type: 'spend', points: 200 },
  { id: '3', title: 'Đánh giá Khách sạn Vũng Tàu', date: '15/04/2026', type: 'earn', points: 100 },
  { id: '4', title: 'Đăng ký tài khoản thành công', date: '01/04/2026', type: 'earn', points: 100 },
];

export default function PointsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // 'all', 'earn', 'spend'

  // Lọc lịch sử
  const filteredHistory = POINT_HISTORY.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Render thẻ hiển thị điểm (Nằm trên cùng của FlatList)
  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* Thẻ Điểm TViet */}
      <View style={styles.pointCard}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>Điểm TViet hiện tại</Text>
          <Ionicons name={"star" as any} size={24} color="#FFD700" />
        </View>
        <Text style={styles.pointTotal}>500</Text>
        <Text style={styles.moneyEquivalent}>≈ 50.000 đ</Text>
        
        <View style={styles.cardBottom}>
          <View style={styles.memberBadge}>
            <Ionicons name={"diamond" as any} size={14} color="#FFD700" />
            <Text style={styles.memberText}>Thành viên Vàng</Text>
          </View>
          <TouchableOpacity style={styles.redeemBtn} onPress={() => router.push('/preferences/vouchers' as any)}>
            <Text style={styles.redeemText}>Đổi quà ngay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Bộ lọc */}
      <Text style={styles.sectionTitle}>Lịch sử điểm</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabBtn, filter === 'all' && styles.activeTab]} onPress={() => setFilter('all')}>
          <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, filter === 'earn' && styles.activeTab]} onPress={() => setFilter('earn')}>
          <Text style={[styles.tabText, filter === 'earn' && styles.activeTabText]}>Điểm nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, filter === 'spend' && styles.activeTab]} onPress={() => setFilter('spend')}>
          <Text style={[styles.tabText, filter === 'spend' && styles.activeTabText]}>Điểm dùng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render từng dòng lịch sử
  const renderHistoryItem = ({ item }: any) => {
    const isEarn = item.type === 'earn';
    return (
      <View style={styles.historyItem}>
        <View style={[styles.iconBox, { backgroundColor: isEarn ? '#E8F5E9' : '#FFEBEB' }]}>
          <Ionicons 
            name={isEarn ? "arrow-down-outline" as any : "arrow-up-outline" as any} 
            size={20} 
            color={isEarn ? "#4CAF50" : "#FF3B30"} 
          />
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historyDate}>{item.date}</Text>
        </View>
        <Text style={[styles.historyPoints, { color: isEarn ? '#4CAF50' : '#FF3B30' }]}>
          {isEarn ? '+' : '-'}{item.points}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name={"arrow-back" as any} size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Điểm thưởng</Text>
        <TouchableOpacity onPress={() => router.push('/preferences/points-help' as any)}>
          <Ionicons name={"help-circle-outline" as any} size={26} color="#005AAB" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={renderHistoryItem}
        ListHeaderComponent={renderHeader} // Gắn phần thẻ điểm lên đầu List
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  
  /* Navbar */
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 5 },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  headerComponent: { padding: 20, paddingBottom: 10 },
  
  /* Point Card */
  pointCard: { backgroundColor: '#005AAB', borderRadius: 20, padding: 20, elevation: 5, shadowColor: '#005AAB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginBottom: 25 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#B3D4FF', fontSize: 14, fontWeight: '500' },
  pointTotal: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 10 },
  moneyEquivalent: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginTop: 5, marginBottom: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 15 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  memberText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  redeemBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  redeemText: { color: '#005AAB', fontSize: 13, fontWeight: 'bold' },

  /* Tabs */
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4, marginBottom: 15 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#fff', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#005AAB', fontWeight: 'bold' },

  /* History List */
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, elevation: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#888' },
  historyPoints: { fontSize: 16, fontWeight: '900' }
});