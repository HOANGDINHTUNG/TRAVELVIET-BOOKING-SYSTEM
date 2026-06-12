import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';

interface Voucher {
  id: string;
  code: string;
  discountVi: string;
  discountEn: string;
  titleVi: string;
  titleEn: string;
  expiryVi: string;
  expiryEn: string;
  type: 'tour' | 'flight' | 'hotel';
}

const ALL_VOUCHERS: Voucher[] = [
  // Tour Vouchers
  { id: 'v1', code: 'THDTOUR200', discountVi: 'Giảm 200K', discountEn: '200K OFF', titleVi: 'Cho Tour Sa Pa, Hạ Long', titleEn: 'For Sapa, Halong Tours', expiryVi: 'Hạn: 30/06/2026', expiryEn: 'Exp: 30/06/2026', type: 'tour' },
  { id: 'v4', code: 'THDTOUR50', discountVi: 'Giảm 50K', discountEn: '50K OFF', titleVi: 'Cho Tour Một Ngày', titleEn: 'For 1-Day Tours', expiryVi: 'Hạn: 30/06/2026', expiryEn: 'Exp: 30/06/2026', type: 'tour' },
  { id: 'v7', code: 'THDTOUR1000', discountVi: 'Giảm 1M', discountEn: '1M OFF', titleVi: 'Cho Tour Nước Ngoài', titleEn: 'For International Tours', expiryVi: 'Hạn: 31/12/2026', expiryEn: 'Exp: 31/12/2026', type: 'tour' },
  
  // Flight Vouchers
  { id: 'v2', code: 'THDFLIGHT15', discountVi: 'Giảm 15%', discountEn: '15% OFF', titleVi: 'Cho vé máy bay đi Phú Quốc', titleEn: 'For Phu Quoc Flights', expiryVi: 'Hạn: 15/07/2026', expiryEn: 'Exp: 15/07/2026', type: 'flight' },
  { id: 'v5', code: 'THDFLIGHT100', discountVi: 'Giảm 100K', discountEn: '100K OFF', titleVi: 'Vé máy bay nội địa', titleEn: 'Domestic Flights', expiryVi: 'Hạn: 31/08/2026', expiryEn: 'Exp: 31/08/2026', type: 'flight' },
  { id: 'v8', code: 'THDFLIGHT300', discountVi: 'Giảm 300K', discountEn: '300K OFF', titleVi: 'Vé bay quốc tế khứ hồi', titleEn: 'Roundtrip Int\'l Flights', expiryVi: 'Hạn: 30/09/2026', expiryEn: 'Exp: 30/09/2026', type: 'flight' },

  // Hotel Vouchers
  { id: 'v3', code: 'THDHOTEL500', discountVi: 'Giảm 500K', discountEn: '500K OFF', titleVi: 'Cho khách sạn 4-5 sao', titleEn: 'For 4-5 Star Hotels', expiryVi: 'Hạn: 31/07/2026', expiryEn: 'Exp: 31/07/2026', type: 'hotel' },
  { id: 'v6', code: 'THDHOTEL200', discountVi: 'Giảm 200K', discountEn: '200K OFF', titleVi: 'Cho Homestay Đà Lạt', titleEn: 'For Dalat Homestays', expiryVi: 'Hạn: 15/08/2026', expiryEn: 'Exp: 15/08/2026', type: 'hotel' },
  { id: 'v9', code: 'THDHOTEL80', discountVi: 'Giảm 80K', discountEn: '80K OFF', titleVi: 'Đặt phòng chặng ngắn', titleEn: 'Short-stay Bookings', expiryVi: 'Hạn: 31/07/2026', expiryEn: 'Exp: 31/07/2026', type: 'hotel' }
];

export default function VouchersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language } = useAppSettings();
  const { showSnackbar } = useSnackbar();

  const isDark = theme === 'dark';
  const isVi = language === 'vi';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tour' | 'flight' | 'hotel'>('all');
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);

  // Load claimed list on mount
  useEffect(() => {
    const loadClaimed = async () => {
      try {
        const val = await SecureStore.getItemAsync('travelviet.claimed_vouchers');
        if (val) {
          setClaimedVouchers(JSON.parse(val));
        }
      } catch {}
    };
    loadClaimed();
  }, []);

  // Claim voucher handler
  const handleClaim = async (voucherId: string, code: string) => {
    if (claimedVouchers.includes(voucherId)) return;
    const next = [...claimedVouchers, voucherId];
    setClaimedVouchers(next);
    try {
      await SecureStore.setItemAsync('travelviet.claimed_vouchers', JSON.stringify(next));
    } catch {}
    showSnackbar(isVi ? `Nhận thành công mã: ${code}!` : `Successfully claimed code: ${code}!`);
  };

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    let list = ALL_VOUCHERS;

    // Filter by type
    if (activeTab !== 'all') {
      list = list.filter((v) => v.type === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.code.toLowerCase().includes(q) ||
          v.discountVi.toLowerCase().includes(q) ||
          v.discountEn.toLowerCase().includes(q) ||
          v.titleVi.toLowerCase().includes(q) ||
          v.titleEn.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  // Tab configurations
  const tabs = [
    { id: 'all', labelVi: 'Tất cả', labelEn: 'All' },
    { id: 'tour', labelVi: 'Tour', labelEn: 'Tours' },
    { id: 'flight', labelVi: 'Vé máy bay', labelEn: 'Flights' },
    { id: 'hotel', labelVi: 'Khách sạn', labelEn: 'Hotels' },
  ];

  // Helper colors for left coupon tag
  const getTagColor = (type: 'tour' | 'flight' | 'hotel') => {
    if (type === 'tour') return { light: '#FFF0EA', dark: '#3B1A10', text: '#FF5B22' };
    if (type === 'flight') return { light: '#EEF2FF', dark: '#1E1B4B', text: '#4F46E5' };
    return { light: '#ECFDF5', dark: '#064E3B', text: '#10B981' };
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E1B4B'] : ['#E0F2FE', '#F8FAFC']}
      style={styles.container}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} translucent />

      {/* Glassmorphism Dynamic Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, isDark && styles.textDark]} numberOfLines={1}>
            {isVi ? 'Nhận Voucher' : 'Claim Vouchers'}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {isVi ? 'Nhận ưu đãi hot & tiết kiệm hơn khi đặt' : 'Grab hot deals & save more on bookings'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Control Console */}
      <View style={styles.controlPanel}>
        {/* Search Input */}
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder={isVi ? 'Tìm kiếm mã giảm giá...' : 'Search discount codes...'}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark && styles.textDark]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabBtn,
                  active && styles.tabBtnActive,
                  isDark && active && styles.tabBtnActiveDark,
                ]}
                onPress={() => setActiveTab(tab.id as any)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    active && styles.tabBtnTextActive,
                    isDark && !active && { color: '#94A3B8' },
                  ]}
                >
                  {isVi ? tab.labelVi : tab.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Voucher Scroll List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.listContainer}>
          {filteredVouchers.length === 0 ? (
            <View style={[styles.emptyBox, isDark && styles.emptyBoxDark]}>
              <Ionicons name="gift-outline" size={48} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={[styles.emptyText, isDark && styles.textDark]}>
                {isVi ? 'Không tìm thấy voucher phù hợp.' : 'No matching vouchers found.'}
              </Text>
            </View>
          ) : (
            filteredVouchers.map((voucher) => {
              const isClaimed = claimedVouchers.includes(voucher.id);
              const tagColors = getTagColor(voucher.type);
              const tagBg = isDark ? tagColors.dark : tagColors.light;

              return (
                <View
                  key={voucher.id}
                  style={[styles.voucherCard, isDark && styles.voucherCardDark]}
                >
                  {/* Left coupon label block */}
                  <View style={[styles.voucherLeft, { backgroundColor: tagBg }]}>
                    <Text style={[styles.voucherDiscount, { color: tagColors.text }]}>
                      {isVi ? voucher.discountVi : voucher.discountEn}
                    </Text>
                    <View style={styles.voucherTypeBadge}>
                      <Text style={[styles.voucherTypeBadgeText, { color: tagColors.text }]}>
                        {voucher.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Dashed Separator */}
                  <View style={[styles.voucherDivider, isDark && styles.voucherDividerDark]} />

                  {/* Right coupon details & claim CTA */}
                  <View style={styles.voucherRight}>
                    <View style={styles.codeRow}>
                      <Text style={[styles.voucherCode, isDark && { color: '#F1F5F9' }]}>
                        {voucher.code}
                      </Text>
                    </View>

                    <Text style={[styles.voucherTitle, isDark && { color: '#E2E8F0' }]} numberOfLines={2}>
                      {isVi ? voucher.titleVi : voucher.titleEn}
                    </Text>

                    <Text style={[styles.voucherExpiry, isDark && { color: '#94A3B8' }]}>
                      {isVi ? voucher.expiryVi : voucher.expiryEn}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.claimBtn,
                        isClaimed && styles.claimBtnClaimed,
                      ]}
                      onPress={() => handleClaim(voucher.id, voucher.code)}
                      disabled={isClaimed}
                      activeOpacity={0.85}
                    >
                      {isClaimed ? (
                        <View style={styles.claimedRow}>
                          <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                          <Text style={styles.claimBtnText}>
                            {isVi ? 'Đã nhận' : 'Claimed'}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.claimBtnText}>
                          {isVi ? 'Nhận ngay' : 'Claim Now'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  textDark: {
    color: '#FFFFFF',
  },
  controlPanel: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchBarDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  tabBtnActiveDark: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  listContainer: {
    gap: 16,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyBoxDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  voucherCard: {
    height: 128,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  voucherCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  voucherLeft: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  voucherDiscount: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  voucherTypeBadge: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  voucherTypeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },
  voucherDivider: {
    width: 1,
    height: '70%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  voucherDividerDark: {
    borderColor: '#334155',
  },
  voucherRight: {
    flex: 1,
    height: '100%',
    padding: 12,
    justifyContent: 'space-between',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voucherCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  voucherTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 16,
  },
  voucherExpiry: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  claimBtn: {
    backgroundColor: '#FF5B22',
    borderRadius: 8,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
  },
  claimBtnClaimed: {
    backgroundColor: '#94A3B8',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  claimedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
