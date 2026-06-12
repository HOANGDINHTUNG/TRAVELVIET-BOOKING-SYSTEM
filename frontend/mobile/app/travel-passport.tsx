import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '@/providers/SnackbarProvider';

export default function TravelPassportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();

  // Dynamic Passport Stats
  const [visitedDests, setVisitedDests] = useState<string[]>([]);
  const [checkins, setCheckins] = useState<{ id: string; location: string; time: string }[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [missions] = useState<string[]>([]);
  const [toursCount, setToursCount] = useState(0);

  const passportNumber = 'TVP260611200210C23D06';

  const handleNewCheckin = () => {
    Alert.prompt(
      'Check-in điểm đến',
      'Nhập tên địa điểm bạn đang ghé thăm (ví dụ: Vịnh Hạ Long, Phú Quốc...):',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Check-in',
          onPress: (locationName?: string) => {
            if (!locationName || !locationName.trim()) {
              Alert.alert('Lỗi', 'Tên địa điểm không được để trống.');
              return;
            }
            const loc = locationName.trim();
            const timeStr = new Date().toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            // Update check-ins
            setCheckins([{ id: String(Date.now()), location: loc, time: timeStr }, ...checkins]);

            // Update visited destinations list if not already checked in
            if (!visitedDests.includes(loc)) {
              setVisitedDests([...visitedDests, loc]);
            }

            // Increment tours count
            setToursCount(toursCount + 1);

            // Unlock a badge if first check-in
            if (checkins.length === 0) {
              setBadges(['Nhà thám hiểm đầu tiên']);
              showSnackbar(`Chúc mừng! Bạn đã mở khóa Huy hiệu: "Nhà thám hiểm đầu tiên"!`);
            } else {
              showSnackbar(`Đã check-in thành công tại ${loc}!`);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Gradient Header Banner */}
      <LinearGradient
        colors={['#0F2C2C', '#1D5A5A']}
        style={[styles.headerBanner, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerKicker}>TRAVEL PASSPORT</Text>
        <Text style={styles.headerTitle}>Hộ chiếu du lịch của bạn</Text>
        <Text style={styles.headerSubtitle}>
          Theo dõi điểm đã đi, huy hiệu đã mở khóa, check-in và nhiệm vụ thành viên.
        </Text>

        {/* Stats Row inside banner */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="airplane-outline" size={16} color="#FFF" />
            <Text style={styles.statValue}>{toursCount}</Text>
            <Text style={styles.statLabel}>TOUR ĐÃ ĐI</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location-outline" size={16} color="#FFF" />
            <Text style={styles.statValue}>{visitedDests.length}</Text>
            <Text style={styles.statLabel}>ĐIỂM ĐẾN</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkbox-outline" size={16} color="#FFF" />
            <Text style={styles.statValue}>{checkins.length}</Text>
            <Text style={styles.statLabel}>CHECK-IN</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="ribbon-outline" size={16} color="#FFF" />
            <Text style={styles.statValue}>{badges.length}</Text>
            <Text style={styles.statLabel}>HUY HIỆU</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back navigation button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={16} color="#1D5A5A" />
          <Text style={styles.backText}>Về tài khoản</Text>
        </TouchableOpacity>

        {/* Passport number card */}
        <View style={styles.passportCard}>
          <View style={styles.stampContainer}>
            <Ionicons name="ribbon" size={24} color="#C2410C" />
          </View>
          <Text style={styles.passportLabel}>SỐ HỘ CHIẾU</Text>
          <Text style={styles.passportNumber}>{passportNumber}</Text>
        </View>

        {/* Missions (Nhiệm vụ) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy-outline" size={18} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Nhiệm vụ</Text>
            <Text style={styles.cardCount}>{missions.length}</Text>
          </View>
          <View style={styles.cardBody}>
            {missions.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có nhiệm vụ.</Text>
            ) : (
              missions.map((m, idx) => (
                <Text key={idx} style={styles.itemText}>{m}</Text>
              ))
            )}
          </View>
        </View>

        {/* Badges (Huy hiệu) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="ribbon-outline" size={18} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Huy hiệu</Text>
            <Text style={styles.cardCount}>{badges.length}</Text>
          </View>
          <View style={styles.cardBody}>
            {badges.length === 0 ? (
              <Text style={styles.emptyText}>Chưa mở khóa huy hiệu.</Text>
            ) : (
              badges.map((b, idx) => (
                <View key={idx} style={styles.badgeItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={styles.badgeText}>{b}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Visited Destinations (Điểm đã ghé thăm) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="compass-outline" size={18} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Điểm đã ghé thăm</Text>
            <Text style={styles.cardCount}>{visitedDests.length}</Text>
          </View>
          <View style={styles.cardBody}>
            {visitedDests.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có điểm đến trong hộ chiếu.</Text>
            ) : (
              <View style={styles.chipsWrap}>
                {visitedDests.map((d, idx) => (
                  <View key={idx} style={styles.destChip}>
                    <Ionicons name="pin" size={11} color="#1D5A5A" style={{ marginRight: 3 }} />
                    <Text style={styles.destChipText}>{d}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Check-in History (Lịch sử check-in) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag-outline" size={18} color="#1D5A5A" />
            <Text style={styles.cardTitle}>Lịch sử check-in</Text>
            <Text style={styles.cardCount}>{checkins.length}</Text>
          </View>
          <View style={styles.cardBody}>
            {checkins.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có check-in.</Text>
            ) : (
              checkins.map((c) => (
                <View key={c.id} style={styles.checkinItem}>
                  <View style={styles.checkinLeft}>
                    <Ionicons name="pin-outline" size={14} color="#1D5A5A" />
                    <Text style={styles.checkinLocation}>{c.location}</Text>
                  </View>
                  <Text style={styles.checkinTime}>{c.time}</Text>
                </View>
              ))
            )}

            {/* Quick checkin CTA button */}
            <TouchableOpacity
              style={styles.checkinButton}
              onPress={handleNewCheckin}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.checkinButtonText}>Check-in điểm mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Beach Footer replicating web experience */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2DD4BF',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'flex-start',
    minHeight: 74,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '800',
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 14,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D5A5A',
    marginLeft: 4,
  },
  passportCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
    elevation: 1,
  },
  stampContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
    opacity: 0.75,
  },
  passportLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  passportNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E3A8A',
    marginTop: 6,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  cardCount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1D5A5A',
  },
  cardBody: {
    padding: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '500',
  },
  itemText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  destChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  destChipText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '700',
  },
  checkinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkinLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  checkinTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  checkinButton: {
    backgroundColor: '#1D5A5A',
    borderRadius: 8,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  checkinButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  // Footer styles
  footerBackground: {
    width: '100%',
    marginTop: 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  footerBigTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 30,
    lineHeight: 40,
    maxWidth: '90%',
  },
  newsletterSection: {
    marginBottom: 35,
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  newsletterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    height: 48,
  },
  newsletterInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  newsletterButton: {
    backgroundColor: '#0F2C2C',
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 30,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
  },
  footerColumn: {
    width: '45%',
    marginBottom: 10,
  },
  footerColumnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerLinkText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
    fontWeight: '600',
  },
  footerBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 10,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  footerCopyright: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
});
