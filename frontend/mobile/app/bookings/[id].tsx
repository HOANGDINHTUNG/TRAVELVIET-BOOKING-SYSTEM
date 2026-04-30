import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết vé</Text>
        <TouchableOpacity><Ionicons name="share-outline" size={24} /></TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.ticketCard}>
          <View style={styles.qrSection}>
            {/* Mock QR Code */}
            <View style={styles.qrBox}>
              <Ionicons name="qr-code" size={150} color="#333" />
            </View>
            <Text style={styles.qrHint}>Đưa mã này cho hướng dẫn viên khi khởi hành</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.infoSection}>
            <Text style={styles.tourLabel}>Tên tour</Text>
            <Text style={styles.tourValue}>Hà Giang - Lũng Cú - Đồng Văn (4N3Đ)</Text>

            <View style={styles.rowInfo}>
              <View>
                <Text style={styles.tourLabel}>Ngày đi</Text>
                <Text style={styles.tourValueSmall}>15/05/2026</Text>
              </View>
              <View>
                <Text style={styles.tourLabel}>Mã đặt chỗ</Text>
                <Text style={styles.tourValueSmall}>{id}</Text>
              </View>
            </View>

            <Text style={styles.tourLabel}>Hành khách</Text>
            <Text style={styles.tourValueSmall}>Nguyễn Công Trứ (Người lớn)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#005AAB' }, // Nền xanh cho giống app du lịch
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  ticketCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  qrSection: { alignItems: 'center', padding: 30 },
  qrBox: { padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
  qrHint: { marginTop: 15, fontSize: 12, color: '#888', textAlign: 'center' },
  dashedLine: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ddd', marginHorizontal: 20 },
  infoSection: { padding: 25 },
  tourLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
  tourValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  tourValueSmall: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between' }
});