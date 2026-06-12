import React, { useMemo, useState, useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/_index.styles';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { AppDrawer } from '@/components/ui/AppDrawer';
import { TOURS_DATA } from '@/constants/Tours';

const MOCK_POPULAR_DESTINATIONS = [
  { 
    id: '3', // maps to Phu Quoc details or similar
    name: 'Santorini', 
    region: 'Greece', 
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600' 
  },
  { 
    id: '2', // maps to Da Lat details
    name: 'Bali', 
    region: 'Indonesia', 
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600' 
  },
  { 
    id: '1', // maps to Mien Tay
    name: 'Dubai', 
    region: 'UAE', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600' 
  },
];

const LAST_MINUTE_DEALS = [
  {
    id: '1',
    title: 'Maldives Getaway',
    duration: '4 Days / 3 Nights',
    price: '13.120.000đ',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600',
  },
  {
    id: '2',
    title: 'Swiss Adventure',
    duration: '5 Days / 4 Nights',
    price: '18.380.000đ',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
  },
];

const TOP_EXPERIENCES = [
  { 
    id: 'e1', 
    name: 'Beach Vibes', 
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400' 
  },
  { 
    id: 'e2', 
    name: 'Mountain Hiking', 
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400' 
  },
  { 
    id: 'e3', 
    name: 'City Tours', 
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400' 
  },
  { 
    id: 'e4', 
    name: 'Hot Air Balloon', 
    image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=400' 
  },
];

const CUSTOMER_REVIEWS = [
  {
    id: 'r1',
    name: 'Nguyễn Văn Nam',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    role: 'Khách hàng tour Hàn Quốc',
    rating: 5,
    comment: 'Dịch vụ của THD rất chuyên nghiệp! Hướng dẫn viên nhiệt tình, chu đáo, lịch trình hợp lý. Khách sạn và đồ ăn đều tuyệt vời. Sẽ tiếp tục ủng hộ THD!',
  },
  {
    id: 'r2',
    name: 'Trần Thị Mai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    role: 'Khách hàng tour Phú Quốc',
    rating: 5,
    comment: 'Tôi vừa có chuyến đi Phú Quốc 3N2Đ cùng gia đình qua THD. Mọi thứ từ xe đưa đón, resort đến ăn uống đều được chuẩn bị rất kỹ càng. Rất hài lòng!',
  },
  {
    id: 'r3',
    name: 'Lê Minh Hoàng',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
    role: 'Khách hàng tour Nhật Bản',
    rating: 5,
    comment: 'Tour Nhật Bản của THD thật sự chất lượng. Trải nghiệm tàu Shinkansen và ngắm Phú Sĩ rất tuyệt vời. Hướng dẫn viên am hiểu sâu sắc về văn hóa địa phương.',
  },
  {
    id: 'r4',
    name: 'Phạm Thanh Thủy',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    role: 'Khách hàng tour Thái Lan',
    rating: 5,
    comment: 'Chuyến đi Thái Lan rất vui và nhiều kỷ niệm. THD hỗ trợ làm thủ tục nhanh chóng, giá tour cực kỳ cạnh tranh so với các bên khác. Đánh giá 5 sao!',
  },
];

function parsePrice(val: string): number {
  if (!val) return 0;
  const digits = val.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  
  const scrollViewRef = useRef<ScrollView>(null);
  useScrollToTop(scrollViewRef);

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === 'dark';

  const hotTours = useMemo(() => {
    const hotIds = ['t12', 't14', 't10', '4'];
    return TOURS_DATA.filter(t => hotIds.includes(t.id));
  }, []);

  const saleTours = useMemo(() => {
    const saleData = [
      { id: 't9', discount: '20% OFF', originalPrice: '7.490.000 đ' },
      { id: 't5', discount: '50% OFF', originalPrice: '400.000 đ' },
      { id: 't1', discount: '15% OFF', originalPrice: '1.050.000 đ' },
      { id: 't13', discount: '25% OFF', originalPrice: '2.860.000 đ' },
    ];
    return saleData.map(item => {
      const tour = TOURS_DATA.find(t => t.id === item.id);
      if (!tour) return null;
      return { ...tour, discount: item.discount, originalPrice: item.originalPrice };
    }).filter(Boolean) as any[];
  }, []);

  const topPurchasedTours = useMemo(() => {
    const purchasedData = [
      { id: 't12', bookings: '1.450+ lượt mua' },
      { id: 't9', bookings: '1.200+ lượt mua' },
      { id: 't14', bookings: '1.100+ lượt mua' },
      { id: 't11', bookings: '920+ lượt mua' },
    ];
    return purchasedData.map(item => {
      const tour = TOURS_DATA.find(t => t.id === item.id);
      if (!tour) return null;
      return { ...tour, bookingsCount: item.bookings };
    }).filter(Boolean) as any[];
  }, []);

  const domesticTours = useMemo(() => {
    // Domestic category is everything other than 'Nước ngoài'
    return TOURS_DATA.filter(t => t.category !== 'Nước ngoài').slice(0, 5);
  }, []);

  const internationalTours = useMemo(() => {
    // International category matches 'Nước ngoài'
    return TOURS_DATA.filter(t => t.category === 'Nước ngoài').slice(0, 5);
  }, []);

  // Unified search functionality
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const allItems = [
      ...MOCK_POPULAR_DESTINATIONS,
      ...LAST_MINUTE_DEALS,
    ];

    return allItems.filter((item) => {
      const matchText = 'name' in item 
        ? `${item.name} ${item.region || ''}` 
        : `${item.title}`;
      return matchText.toLowerCase().includes(query);
    });
  }, [searchQuery]);

  const handleCategoryPress = (category: string) => {
    if (category === 'Hotels' || category === 'Khách sạn') {
      router.push('/hotels');
    } else if (category === 'Flights' || category === 'Vé máy bay') {
      router.push('/flights');
    } else if (category === 'Activities' || category === 'Trải nghiệm') {
      router.push('/tours');
    } else if (category === 'Transport' || category === 'Di chuyển') {
      showSnackbar(language === 'vi' ? 'Đang mở dịch vụ di chuyển...' : 'Opening transport services...');
      router.push('/transport');
    }
  };

  const handleTourPress = (tourId: string) => {
    let targetId = tourId;
    if (tourId === '1') targetId = '3'; // Ha Long
    else if (tourId === '2') targetId = '2'; // Da Lat
    else if (tourId === '3') targetId = '4'; // Phu Quoc

    showSnackbar(language === 'vi' ? 'Mở chi tiết hành trình' : 'Opening tour details');
    router.push({ pathname: '/tour/[id]', params: { id: targetId } });
  };

  const renderTourCard = (tour: typeof LAST_MINUTE_DEALS[0]) => (
    <TouchableOpacity
      activeOpacity={0.9}
      key={tour.id}
      onPress={() => handleTourPress(tour.id)}
      style={[styles.tourCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
    >
      <Image source={{ uri: tour.image }} style={styles.tourImage} />
      <View style={styles.tourDetails}>
        <Text style={[styles.tourTitle, isDark && { color: '#F1F5F9' }]} numberOfLines={1}>
          {tour.title}
        </Text>
        <Text style={[styles.tourMeta, isDark && { color: '#94A3B8' }]}>
          {tour.duration}
        </Text>
      </View>
      <View style={styles.tourRight}>
        <Text style={styles.tourPrice}>{formatPrice(parsePrice(tour.price))}</Text>
        <TouchableOpacity style={[styles.tourBookBtn, isDark && { backgroundColor: '#451A03' }]} onPress={() => handleTourPress(tour.id)}>
          <Text style={styles.tourBookBtnText}>{t('book_now', 'Đặt ngay')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Santorini Header Background */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800' }}
          style={styles.heroImageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={isDark ? ['rgba(15, 23, 42, 0.45)', 'rgba(15, 23, 42, 0.98)'] : ['rgba(0, 0, 0, 0.25)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.heroGradient}
          >
            {/* Top Header Row */}
            <View style={styles.headerRow}>
              <TouchableOpacity 
                style={styles.transparentButton} 
                onPress={() => setDrawerVisible(true)}
              >
                <Ionicons name="menu-outline" size={28} color={isDark ? '#FFFFFF' : '#1E293B'} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.transparentButton, styles.notificationContainer]} 
                onPress={() => router.push('/notifications')}
              >
                <Ionicons name="notifications-outline" size={26} color={isDark ? '#FFFFFF' : '#1E293B'} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>

            {/* Header Text Info */}
            <View style={styles.welcomeSection}>
              <Text style={[styles.titleLine1, isDark && { color: '#FFFFFF' }]}>
                {language === 'vi' ? 'Khám phá\nThế giới' : 'Explore\nthe World'}
              </Text>
              <Text style={[styles.subtitle, isDark && { color: '#E2E8F0' }]}>
                {language === 'vi' 
                  ? 'Khám phá những điểm đến biểu tượng và trải nghiệm khó quên.' 
                  : 'Discover iconic places and unforgettable experiences.'}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Search Bar Floating Overlay */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBarWrapper, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
            <Ionicons name="search-outline" size={20} color="#7D848D" style={styles.searchIcon} />
            <TextInput
              placeholder={language === 'vi' ? 'Bạn muốn đi đâu hôm nay?' : 'Where do you want to go?'}
              placeholderTextColor="#7D848D"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchPlaceholder, isDark && { color: '#FFFFFF' }]}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              activeOpacity={0.8}
              onPress={() => {
                if (searchQuery) {
                  showSnackbar(language === 'vi' ? `Đang tìm kiếm: ${searchQuery}` : `Searching: ${searchQuery}`);
                } else {
                  showSnackbar(language === 'vi' ? 'Hãy nhập từ khóa để tìm kiếm!' : 'Please enter search query!');
                }
              }}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {searchQuery.trim().length > 0 ? (
          /* Search results section */
          <View style={styles.toursSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                {language === 'vi' ? 'Kết quả tìm kiếm' : 'Search Results'}
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.viewAllText}>{language === 'vi' ? 'Xóa bộ lọc' : 'Clear filter'}</Text>
              </TouchableOpacity>
            </View>

            {searchResults.length === 0 ? (
              <View style={[styles.emptyState, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                <Ionicons name="search-outline" size={34} color="#FF702A" />
                <Text style={[styles.emptyTitle, isDark && { color: '#F1F5F9' }]}>
                  {language === 'vi' ? 'Không tìm thấy tour phù hợp' : 'No matching tours found'}
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.resetButtonText}>{language === 'vi' ? 'Xem tất cả' : 'View all'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tourList}>
                {searchResults.map((item) => renderTourCard(item as any))}
              </View>
            )}
          </View>
        ) : (
          /* Normal Home feed */
          <>
            {/* 4 Categories Row */}
            <View style={styles.categoriesSection}>
              <View style={styles.categoriesContainer}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress('Flights')}
                >
                  <View style={[styles.categoryIconCircle, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <Ionicons name="airplane-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text style={[styles.categoryText, isDark && { color: '#E2E8F0' }]}>
                    {language === 'vi' ? 'Vé máy bay' : 'Flights'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress('Hotels')}
                >
                  <View style={[styles.categoryIconCircle, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <Ionicons name="bed-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text style={[styles.categoryText, isDark && { color: '#E2E8F0' }]}>
                    {language === 'vi' ? 'Khách sạn' : 'Hotels'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress('Activities')}
                >
                  <View style={[styles.categoryIconCircle, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <Ionicons name="star-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text style={[styles.categoryText, isDark && { color: '#E2E8F0' }]}>
                    {language === 'vi' ? 'Trải nghiệm' : 'Activities'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress('Transport')}
                >
                  <View style={[styles.categoryIconCircle, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                    <Ionicons name="car-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text style={[styles.categoryText, isDark && { color: '#E2E8F0' }]}>
                    {language === 'vi' ? 'Di chuyển' : 'Transport'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Popular Destinations */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Điểm Đến Ưa Thích' : 'Popular Destinations'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {MOCK_POPULAR_DESTINATIONS.map((destination) => (
                  <TouchableOpacity
                    key={destination.id}
                    activeOpacity={0.9}
                    style={styles.destinationCard}
                    onPress={() => handleTourPress(destination.id)}
                  >
                    <Image
                      source={{ uri: destination.image }}
                      style={styles.destinationImage}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.destGradient}
                    >
                      <Text style={styles.destName}>{destination.name}</Text>
                      <Text style={styles.destCountry}>{destination.region}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Best Deals (List of Row Cards) */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Ưu Đãi Tốt Nhất' : 'Best Deals'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { type: 'sale' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tourList, { paddingHorizontal: 20 }]}>
                {LAST_MINUTE_DEALS.map((deal) => (
                  <TouchableOpacity
                    key={deal.id}
                    activeOpacity={0.9}
                    style={[styles.tourCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(deal.id)}
                  >
                    <Image source={{ uri: deal.image }} style={styles.tourImage} />
                    
                    <View style={styles.tourDetails}>
                      <Text style={[styles.tourTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>
                        {deal.title}
                      </Text>
                      <Text style={[styles.tourMeta, isDark && { color: '#94A3B8' }]}>
                        {deal.duration}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text style={styles.tourPrice}>
                          {formatPrice(parsePrice(deal.price))}
                        </Text>
                        <View style={styles.dealBadge}>
                          <Text style={styles.dealBadgeText}>{deal.discount}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Top Experiences */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Trải Nghiệm Hàng Đầu' : 'Top Experiences'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { type: 'hot' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {TOP_EXPERIENCES.map((exp) => (
                  <TouchableOpacity
                    key={exp.id}
                    activeOpacity={0.9}
                    style={styles.destinationCard}
                    onPress={() => showSnackbar(language === 'vi' ? `Xem trải nghiệm: ${exp.name}` : `Viewing experience: ${exp.name}`)}
                  >
                    <Image
                      source={{ uri: exp.image }}
                      style={styles.destinationImage}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.85)']}
                      style={styles.destGradient}
                    >
                      <Text style={[styles.destName, { fontSize: 13, textAlign: 'center' }]}>
                        {exp.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* HOT Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Tour HOT Bậc Nhất' : 'Super HOT Tours'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { type: 'hot' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {hotTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[styles.hotCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image source={{ uri: tour.image }} style={styles.hotCardImage} />
                    <View style={styles.hotBadge}>
                      <Ionicons name="flame" size={12} color="#FFF" />
                      <Text style={styles.hotBadgeText}>HOT</Text>
                    </View>
                    <View style={styles.hotCardDetails}>
                      <Text style={[styles.hotCardTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>{tour.price}</Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#DDA15E" />
                          <Text style={[styles.hotCardRatingText, isDark && { color: '#94A3B8' }]}>
                            {tour.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* SALE Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Khuyến Mãi Siêu Khủng' : 'Mega Sales & Deals'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { type: 'sale' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {saleTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[styles.hotCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image source={{ uri: tour.image }} style={styles.hotCardImage} />
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>{tour.discount}</Text>
                    </View>
                    <View style={styles.hotCardDetails}>
                      <Text style={[styles.hotCardTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <View style={{ marginTop: 6 }}>
                        <Text style={styles.originalPriceText}>{tour.originalPrice}</Text>
                        <View style={styles.hotCardBottom}>
                          <Text style={styles.hotCardPrice}>{tour.price}</Text>
                          <View style={styles.hotCardRating}>
                            <Ionicons name="star" size={12} color="#DDA15E" />
                            <Text style={[styles.hotCardRatingText, isDark && { color: '#94A3B8' }]}>
                              {tour.rating.toFixed(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Most Purchased Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Tour Mua Nhiều Nhất' : 'Most Purchased Tours'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { type: 'purchased' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tourList, { paddingHorizontal: 20 }]}>
                {topPurchasedTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[styles.tourCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image source={{ uri: tour.image }} style={styles.tourImage} />
                    
                    <View style={styles.tourDetails}>
                      <Text style={[styles.tourTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>
                        {tour.title}
                      </Text>
                      <Text style={[styles.tourMeta, isDark && { color: '#94A3B8' }]}>
                        {tour.days} • {tour.location}
                      </Text>
                      <View style={[
                        styles.purchasedBadge,
                        isDark && { backgroundColor: 'rgba(52, 211, 153, 0.12)', borderColor: '#065F46' }
                      ]}>
                        <Ionicons name="cart-outline" size={11} color={isDark ? '#34D399' : '#059669'} />
                        <Text style={[styles.purchasedBadgeText, isDark && { color: '#34D399' }]}>
                          {tour.bookingsCount}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tourRight}>
                      <Text style={styles.tourPrice}>{tour.price}</Text>
                      <TouchableOpacity 
                        style={[styles.tourBookBtn, isDark && { backgroundColor: '#451A03' }]} 
                        onPress={() => handleTourPress(tour.id)}
                      >
                        <Text style={styles.tourBookBtnText}>{t('book_now', 'Đặt ngay')}</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Domestic Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Tour Trong Nước' : 'Domestic Tours'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { region: 'Trong nước' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {domesticTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[styles.hotCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image source={{ uri: tour.image }} style={styles.hotCardImage} />
                    <View style={styles.hotCardDetails}>
                      <Text style={[styles.hotCardTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>{tour.price}</Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#DDA15E" />
                          <Text style={[styles.hotCardRatingText, isDark && { color: '#94A3B8' }]}>
                            {tour.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* International Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Tour Nước Ngoài' : 'International Tours'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/tours', params: { region: 'Nước ngoài' } })}>
                  <Text style={styles.viewAllText}>{t('view_all', 'Xem tất cả')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {internationalTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[styles.hotCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image source={{ uri: tour.image }} style={styles.hotCardImage} />
                    <View style={styles.hotCardDetails}>
                      <Text style={[styles.hotCardTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>{tour.price}</Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#DDA15E" />
                          <Text style={[styles.hotCardRatingText, isDark && { color: '#94A3B8' }]}>
                            {tour.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Customer Testimonials */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
                    {language === 'vi' ? 'Khách hàng nói gì về Lữ Hành Quốc Tế THD' : 'Customer Reviews on THD Travel'}
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {CUSTOMER_REVIEWS.map((review) => (
                  <View
                    key={review.id}
                    style={[styles.testimonialCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  >
                    <View style={styles.testimonialHeader}>
                      <Image source={{ uri: review.avatar }} style={styles.testimonialAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.testimonialName, isDark && { color: '#FFFFFF' }]}>
                          {review.name}
                        </Text>
                        <Text style={styles.testimonialRole}>{review.role}</Text>
                        <View style={styles.testimonialStars}>
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Ionicons key={i} name="star" size={12} color="#DDA15E" />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.testimonialComment, isDark && { color: '#94A3B8' }]} numberOfLines={4}>
                      &quot;{review.comment}&quot;
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
      <AppDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
