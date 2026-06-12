import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useAppSettings } from '@/providers/AppSettingsProvider';

const parsePrice = (priceStr: string): number => {
  const digits = priceStr.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
};

const DOMESTIC_FILTER_TABS = ['Hà Nội', 'Đà Nẵng', 'Phú Quốc', 'Nha Trang', 'Cần Thơ', 'Hồ Chí Minh'];
const INTERNATIONAL_FILTER_TABS = ['Singapore', 'Bangkok', 'Tokyo', 'Seoul', 'Paris', 'Melbourne'];

const MOCK_DOMESTIC_HOTELS = [
  {
    id: 'h-dom-1',
    name: 'Garden Boutique Sóc Sơn',
    rating: 4.8,
    reviews: 124,
    location: 'Sóc Sơn, Hà Nội',
    price: '920.000đ',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
    city: 'Hà Nội',
  },
  {
    id: 'h-dom-2',
    name: 'Da Nang Beach Villa',
    rating: 4.9,
    reviews: 248,
    location: 'Sơn Trà, Đà Nẵng',
    price: '1.850.000đ',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
    city: 'Đà Nẵng',
  },
  {
    id: 'h-dom-3',
    name: 'Sunset Resorts Phu Quoc',
    rating: 4.7,
    reviews: 312,
    location: 'Dương Đông, Phú Quốc',
    price: '2.100.000đ',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop',
    city: 'Phú Quốc',
  },
  {
    id: 'h-dom-4',
    name: 'Nha Trang Bay Hotel',
    rating: 4.6,
    reviews: 189,
    location: 'Trần Phú, Nha Trang',
    price: '1.450.000đ',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    city: 'Nha Trang',
  },
];

const MOCK_INTERNATIONAL_HOTELS = [
  {
    id: 'h-int-1',
    name: 'Marina Bay Sands',
    rating: 4.9,
    reviews: 1420,
    location: 'Marina Bay, Singapore',
    price: '6.800.000đ',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
    country: 'Singapore',
  },
  {
    id: 'h-int-2',
    name: 'Tokyo Grand Hyatt',
    rating: 4.8,
    reviews: 950,
    location: 'Roppongi, Tokyo',
    price: '5.200.000đ',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop',
    country: 'Tokyo',
  },
  {
    id: 'h-int-3',
    name: 'Paris Luxury Palace',
    rating: 4.9,
    reviews: 410,
    location: 'Champs-Élysées, Paris',
    price: '8.500.000đ',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
    country: 'Paris',
  },
];

const MOCK_DESTINATIONS = [
  { id: '1', name: 'Phú Quốc', image: 'https://phuquocxanh.com/vi/wp-content/uploads/2017/02/bien-dao-Phu-Quoc-1.jpg' },
  { id: '2', name: 'Sa Pa', image: 'https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1741942656.jpg&w=3840&q=75' },
  { id: '3', name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop' },
];

export default function HotelsScreen() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomesticCity, setActiveDomesticCity] = useState('Hà Nội');
  const [activeIntCountry, setActiveIntCountry] = useState('Singapore');

  // Filter domestic list based on city selection
  const filteredDomestic = useMemo(() => {
    return MOCK_DOMESTIC_HOTELS.filter(
      (h) => h.city === activeDomesticCity || searchQuery.length > 0
    );
  }, [activeDomesticCity, searchQuery]);

  // Filter international list based on country selection
  const filteredInternational = useMemo(() => {
    return MOCK_INTERNATIONAL_HOTELS.filter(
      (h) => h.country === activeIntCountry || searchQuery.length > 0
    );
  }, [activeIntCountry, searchQuery]);

  const handleBookRoom = (hotelName: string) => {
    showSnackbar(`Đang kiểm tra phòng trống tại: ${hotelName}...`);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Top Banner section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
          style={styles.heroGradient}
        >
          {/* Header Back Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('hotels', 'Khách sạn')}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Banner Title overlay */}
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>{t('hotels_title', 'Đặt Khách Sạn Trực Tuyến')}</Text>
            <Text style={styles.bannerSub}>
              {t('hotels_subtitle', 'Tìm kiếm khách sạn, resort nghỉ dưỡng chất lượng cao với giá ưu đãi tốt nhất')}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Floating search input bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search" size={20} color={isDark ? '#94A3B8' : '#7D848D'} />
          <TextInput
            placeholder={t('explore_search_placeholder', 'Tìm địa điểm, tên khách sạn nghỉ dưỡng...')}
            placeholderTextColor={isDark ? '#94A3B8' : '#7D848D'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark && styles.searchInputDark]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Domestic Hotels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              {language === 'vi' ? 'Khách sạn nổi bật nội địa' : 'Featured Domestic Hotels'}
            </Text>
            <TouchableOpacity onPress={() => showSnackbar('Xem tất cả khách sạn nội địa')}>
              <Text style={styles.viewAllText}>{language === 'vi' ? 'Xem tất cả' : 'View all'}</Text>
            </TouchableOpacity>
          </View>

          {/* City Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {DOMESTIC_FILTER_TABS.map((city) => {
              const isActive = activeDomesticCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.filterChip,
                    isDark && styles.filterChipDark,
                    isActive && styles.filterChipActive,
                    isActive && isDark && styles.filterChipActiveDark,
                  ]}
                  onPress={() => setActiveDomesticCity(city)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isDark && styles.filterChipTextDark,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Hotels Horizontal Rail */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotelRail}
          >
            {filteredDomestic.map((hotel) => (
              <View key={hotel.id} style={[styles.hotelCard, isDark && styles.hotelCardDark]}>
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <View style={styles.hotelDetails}>
                  <Text style={[styles.hotelName, isDark && styles.textDark]} numberOfLines={1}>
                    {hotel.name}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#FFB800" />
                    <Text style={[styles.ratingText, isDark && styles.textDark]}>{hotel.rating}</Text>
                    <Text style={[styles.reviewsText, isDark && styles.reviewsTextDark]}>({hotel.reviews} {t('rating', 'đánh giá')})</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={12} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <Text style={[styles.locationText, isDark && styles.locationTextDark]} numberOfLines={1}>
                      {hotel.location}
                    </Text>
                  </View>
                  <View style={[styles.cardFooter, isDark && styles.cardFooterBorderDark]}>
                    <Text style={styles.priceText}>{formatPrice(parsePrice(hotel.price))}</Text>
                    <TouchableOpacity style={styles.bookBtn} onPress={() => handleBookRoom(hotel.name)}>
                      <Text style={styles.bookBtnText}>{language === 'vi' ? 'Xem phòng' : 'View rooms'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* International Hotels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              {language === 'vi' ? 'Khách sạn nổi bật quốc tế' : 'Featured International Hotels'}
            </Text>
            <TouchableOpacity onPress={() => showSnackbar('Xem tất cả khách sạn quốc tế')}>
              <Text style={styles.viewAllText}>{language === 'vi' ? 'Xem tất cả' : 'View all'}</Text>
            </TouchableOpacity>
          </View>

          {/* International Country Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {INTERNATIONAL_FILTER_TABS.map((country) => {
              const isActive = activeIntCountry === country;
              return (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.filterChip,
                    isDark && styles.filterChipDark,
                    isActive && styles.filterChipActive,
                    isActive && isDark && styles.filterChipActiveDark,
                  ]}
                  onPress={() => setActiveIntCountry(country)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isDark && styles.filterChipTextDark,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Hotels Horizontal Rail */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotelRail}
          >
            {filteredInternational.map((hotel) => (
              <View key={hotel.id} style={[styles.hotelCard, isDark && styles.hotelCardDark]}>
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <View style={styles.hotelDetails}>
                  <Text style={[styles.hotelName, isDark && styles.textDark]} numberOfLines={1}>
                    {hotel.name}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#FFB800" />
                    <Text style={[styles.ratingText, isDark && styles.textDark]}>{hotel.rating}</Text>
                    <Text style={[styles.reviewsText, isDark && styles.reviewsTextDark]}>({hotel.reviews})</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={12} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <Text style={[styles.locationText, isDark && styles.locationTextDark]} numberOfLines={1}>
                      {hotel.location}
                    </Text>
                  </View>
                  <View style={[styles.cardFooter, isDark && styles.cardFooterBorderDark]}>
                    <Text style={styles.priceText}>{formatPrice(parsePrice(hotel.price))}</Text>
                    <TouchableOpacity style={styles.bookBtn} onPress={() => handleBookRoom(hotel.name)}>
                      <Text style={styles.bookBtnText}>{language === 'vi' ? 'Xem phòng' : 'View rooms'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popular Destination Pills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              {language === 'vi' ? 'Điểm đến nổi bật' : 'Popular Destinations'}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destList}
          >
            {MOCK_DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                activeOpacity={0.9}
                style={styles.destCard}
                onPress={() => showSnackbar(`Xem khách sạn tại ${dest.name}`)}
              >
                <Image source={{ uri: dest.image }} style={styles.destCardImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.destCardOverlay}
                >
                  <Text style={styles.destName}>{dest.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Brand statement (Why TravelViet) */}
        <View style={[styles.statementCard, isDark && styles.statementCardDark]}>
          <Text style={[styles.statementTitle, isDark && styles.textDark]}>
            {language === 'vi' ? 'Nâng tầm trải nghiệm nghỉ dưỡng' : 'Elevating Resort Experience'}
          </Text>
          <Text style={[styles.statementBody, isDark && styles.subtextDark]}>
            {language === 'vi'
              ? 'Hệ thống đặt phòng trực tuyến của TravelViet kết nối hàng ngàn khách sạn, villa nghỉ dưỡng chuẩn quốc tế. Khách hàng dễ dàng tìm kiếm phòng tốt nhất với mức chi phí tiết kiệm đến 30% khi đặt trước 14 ngày.'
              : "TravelViet's online booking system connects thousands of international standard hotels & villas. Find your best stays and save up to 30% when booking 14 days in advance."}
          </Text>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark" size={18} color="#FF702A" />
            <Text style={[styles.featureText, isDark && styles.textDark]}>
              {language === 'vi' ? 'Thanh toán an toàn, bảo mật thông tin' : 'Secure payment, protected privacy'}
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="sparkles" size={18} color="#FF702A" />
            <Text style={[styles.featureText, isDark && styles.textDark]}>
              {language === 'vi' ? 'Hỗ trợ đổi trả phòng linh hoạt theo quy định' : 'Flexible reservation changes and cancellations'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFD',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBackground: {
    width: '100%',
    height: 240,
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 54,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerInfo: {
    gap: 6,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -26,
    marginBottom: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 27,
    height: 54,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF702A',
  },
  chipList: {
    paddingLeft: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#FFEFE6',
    borderColor: '#FF702A',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FF702A',
    fontWeight: '700',
  },
  hotelRail: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 16,
  },
  hotelCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  hotelImage: {
    width: '100%',
    height: 130,
  },
  hotelDetails: {
    padding: 12,
    gap: 6,
  },
  hotelName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  reviewsText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF702A',
  },
  bookBtn: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  bookBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1F2937',
  },
  destList: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 12,
  },
  destCard: {
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  destCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  destCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  destName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  statementCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
    marginTop: 10,
  },
  statementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  statementBody: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  featureText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  searchBarDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchInputDark: {
    color: '#F1F5F9',
  },
  textDark: {
    color: '#F1F5F9',
  },
  subtextDark: {
    color: '#94A3B8',
  },
  filterChipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  filterChipActiveDark: {
    backgroundColor: '#2C1D16',
    borderColor: '#FF702A',
  },
  filterChipTextDark: {
    color: '#94A3B8',
  },
  hotelCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  reviewsTextDark: {
    color: '#94A3B8',
  },
  locationTextDark: {
    color: '#94A3B8',
  },
  cardFooterBorderDark: {
    borderTopColor: '#334155',
  },
  statementCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
});
