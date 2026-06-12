import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Cruise = {
  id: string;
  name: string;
  route: string;
  routeKey: 'halong' | 'lanha';
  priceNum: number;
  image: string;
  stars: number;
  reviewCount: number;
  badge: 'BÁN CHẠY' | 'LUXURY' | 'GIÁ TỐT' | 'ƯU ĐÃI';
  amenities: string[];
  amenitiesEn: string[];
};

export const MOCK_CRUISES: Cruise[] = [
  {
    id: 'c1',
    name: 'Signature Halong Cruise 5★',
    route: 'Vịnh Hạ Long - Vịnh Lan Hạ',
    routeKey: 'lanha',
    priceNum: 3200000,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
    stars: 5,
    reviewCount: 48,
    badge: 'BÁN CHẠY',
    amenities: ['Bể bơi vô cực', 'Buffet hải sản', 'Cabin ban công'],
    amenitiesEn: ['Infinity Pool', 'Seafood Buffet', 'Balcony Cabin'],
  },
  {
    id: 'c2',
    name: 'Heritage Bình Chuẩn Cát Bà 5★',
    route: 'Cát Bà - Vịnh Lan Hạ',
    routeKey: 'lanha',
    priceNum: 4500000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    stars: 5,
    reviewCount: 32,
    badge: 'LUXURY',
    amenities: ['Trà chiều', 'Triển lãm nghệ thuật', 'Spa cao cấp'],
    amenitiesEn: ['Afternoon Tea', 'Art Gallery', 'Premium Spa'],
  },
  {
    id: 'c3',
    name: 'Paradise Elegance Cruise 5★',
    route: 'Vịnh Hạ Long',
    routeKey: 'halong',
    priceNum: 3800000,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600',
    stars: 5,
    reviewCount: 56,
    badge: 'GIÁ TỐT',
    amenities: ['Piano Bar', 'Sân tắm nắng rộng', 'BBQ hải sản tối'],
    amenitiesEn: ['Piano Bar', 'Large Sundeck', 'Evening Seafood BBQ'],
  },
  {
    id: 'c4',
    name: 'Ambassador Cruise Halong 5★',
    route: 'Vịnh Hạ Long',
    routeKey: 'halong',
    priceNum: 4200000,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600',
    stars: 5,
    reviewCount: 72,
    badge: 'ƯU ĐÃI',
    amenities: ['Bể sục Jacuzzi', 'Cầu kính check-in', 'Show nhạc sống'],
    amenitiesEn: ['Jacuzzi Pool', 'Glass Bridge Check-in', 'Live Music Show'],
  },
];

export default function CruisesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language, formatPrice, t } = useAppSettings();

  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRouteFilter, setActiveRouteFilter] = useState<'all' | 'halong' | 'lanha'>('all');

  const filteredCruises = useMemo(() => {
    let list = [...MOCK_CRUISES];

    // Filter by search text
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.route.toLowerCase().includes(q));
    }

    // Filter by route category
    if (activeRouteFilter !== 'all') {
      list = list.filter((c) => c.routeKey === activeRouteFilter);
    }

    return list;
  }, [searchQuery, activeRouteFilter]);

  const handleBookCruise = (cruise: Cruise) => {
    router.push({ pathname: '/cruise/[id]', params: { id: cruise.id } });
  };

  const renderCruiseCard = ({ item }: { item: Cruise }) => {
    const amenitiesList = language === 'vi' ? item.amenities : item.amenitiesEn;
    const amenitiesText = amenitiesList.join(' • ');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/cruise/[id]', params: { id: item.id } })}
        style={[styles.card, isDark && styles.cardDark]}
      >
        <View style={styles.cardLeft}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={[styles.cruiseName, isDark && styles.textLight]} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color="#FF702A" />
              <Text style={[styles.metaText, isDark && styles.textMutedDark]} numberOfLines={1}>
                {item.route} • ★ {item.stars.toFixed(1)} ({item.reviewCount})
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="sparkles-outline" size={12} color="#FF702A" />
              <Text style={[styles.metaText, isDark && styles.textMutedDark]} numberOfLines={1}>
                {amenitiesText}
              </Text>
            </View>
          </View>

          <View style={[styles.cardFooter, isDark && styles.cardFooterDark]}>
            <View>
              <Text style={[styles.priceLabel, isDark && styles.textMutedDark]}>
                {t('cruises_price_from', 'Giá từ')}
              </Text>
              <Text style={styles.priceValue}>{formatPrice(item.priceNum)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.bookButton, isDark && styles.bookButtonDark]}
              onPress={() => handleBookCruise(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>{t('cruises_book_now', 'Đặt cabin')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        {/* Banner Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000' }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={isDark ? ['rgba(15, 23, 42, 0.25)', 'rgba(15, 23, 42, 0.9)'] : ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.75)']}
            style={[styles.heroGradient, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : 16 }]}
          >
            <TouchableOpacity
              style={[styles.backBtn, isDark && styles.backBtnDark]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.heroTitle}>{t('cruises_title', 'Du thuyền hạng sang')}</Text>
            <Text style={styles.heroSubtitle}>{t('cruises_subtitle')}</Text>
          </LinearGradient>
        </ImageBackground>

        {/* Search Panel */}
        <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
          <Ionicons name="search-outline" size={20} color="#7D848D" style={styles.searchIcon} />
          <TextInput
            placeholder={t('cruises_search_placeholder', 'Tìm tên du thuyền, vịnh biển...')}
            placeholderTextColor={isDark ? '#64748B' : '#7D848D'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark && styles.searchInputDark]}
          />
        </View>

        {/* Category Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChipHeader,
              isDark && styles.filterChipHeaderDark,
              activeRouteFilter === 'all' && styles.filterChipHeaderActive,
            ]}
            onPress={() => setActiveRouteFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.textLight,
                activeRouteFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              {language === 'vi' ? 'Tất cả' : 'All Bays'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChipHeader,
              isDark && styles.filterChipHeaderDark,
              activeRouteFilter === 'halong' && styles.filterChipHeaderActive,
            ]}
            onPress={() => setActiveRouteFilter('halong')}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.textLight,
                activeRouteFilter === 'halong' && styles.filterChipTextActive,
              ]}
            >
              Vịnh Hạ Long
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChipHeader,
              isDark && styles.filterChipHeaderDark,
              activeRouteFilter === 'lanha' && styles.filterChipHeaderActive,
            ]}
            onPress={() => setActiveRouteFilter('lanha')}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.textLight,
                activeRouteFilter === 'lanha' && styles.filterChipTextActive,
              ]}
            >
              Vịnh Lan Hạ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      null
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={filteredCruises}
        keyExtractor={(item) => item.id}
        renderItem={renderCruiseCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
            <Ionicons name="boat-outline" size={48} color={isDark ? '#475569' : '#BDC3C7'} />
            <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
              {t('cruises_empty', 'Không tìm thấy du thuyền phù hợp')}
            </Text>
            <Text style={[styles.emptySubtitle, isDark && styles.textMutedDark]}>
              {t('cruises_empty_sub')}
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  listContent: {
    paddingBottom: 0,
  },
  heroBackground: {
    width: '100%',
    height: 180,
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 40,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backBtnDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginTop: 34,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: '85%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: -18,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainerDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '500',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  filterChipHeader: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterChipHeaderDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  filterChipHeaderActive: {
    backgroundColor: '#FF702A',
    borderColor: '#FF702A',
  },
  filterChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  cardLeft: {
    width: 100,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  cardRight: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cruiseName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
  },
  metaContainer: {
    gap: 3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  amenityChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  amenityChipDark: {
    backgroundColor: '#334155',
  },
  amenityText: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '600',
  },
  amenityTextDark: {
    color: '#CBD5E1',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingValue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 4,
  },
  cardFooterDark: {
    borderTopColor: '#334155',
  },
  priceLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF702A',
  },
  bookButton: {
    backgroundColor: '#EAB308',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bookButtonDark: {
    backgroundColor: '#EAB308',
  },
  bookButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  textLight: {
    color: '#F1F5F9',
  },
  textMutedDark: {
    color: '#94A3B8',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 8,
  },
  emptyContainerDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // Footer styling
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
