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

const FILTER_TABS = ['Tất cả', 'Máy bay + Khách sạn', 'Xe + Khách sạn'];

const MOCK_COMBOS = [
  {
    id: 'c-1',
    title: 'Combo Premium TP. Hồ Chí Minh',
    rating: 5,
    hotel: 'Khách sạn 5* trung tâm',
    transport: 'Vé máy bay khứ hồi Vietjet/VNA',
    hotelStandard: 'Tiêu chuẩn nghỉ dưỡng 5*',
    price: '5.065.000đ',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    type: 'Máy bay + Khách sạn',
  },
  {
    id: 'c-2',
    title: 'Combo Nghỉ dưỡng Phú Quốc',
    rating: 5,
    hotel: 'Vinpearl Resort & Spa',
    transport: 'Vé máy bay khứ hồi bao gồm hành lý',
    hotelStandard: 'Tiêu chuẩn nghỉ dưỡng 5*',
    price: '12.466.000đ',
    image: 'https://phuquocxanh.com/vi/wp-content/uploads/2017/02/bien-dao-Phu-Quoc-1.jpg',
    type: 'Máy bay + Khách sạn',
  },
  {
    id: 'c-3',
    title: 'Combo Khám phá Vịnh Hạ Long',
    rating: 5,
    hotel: 'Du thuyền 5* Heritage',
    transport: 'Xe đưa đón Limousine khứ hồi',
    hotelStandard: 'Tiêu chuẩn nghỉ dưỡng 5*',
    price: '13.165.000đ',
    image: 'https://nangluongsachvietnam.vn/userfile/User/thanhtam/images/2020/7/6/vinh-Ha-long-2-20200706112849136.jpeg',
    type: 'Xe + Khách sạn',
  },
  {
    id: 'c-4',
    title: 'Combo Gia đình Đà Nẵng',
    rating: 5,
    hotel: 'InterContinental Danang',
    transport: 'Vé máy bay khứ hồi + đưa đón sân bay',
    hotelStandard: 'Tiêu chuẩn nghỉ dưỡng 5*',
    price: '12.582.000đ',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop',
    type: 'Máy bay + Khách sạn',
  },
];

export default function CombosScreen() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCombos = useMemo(() => {
    return MOCK_COMBOS.filter((combo) => {
      const matchTab = activeTab === 'Tất cả' || combo.type === activeTab;
      const matchSearch = searchQuery.length === 0 || 
        combo.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  const handleViewDetails = (comboTitle: string) => {
    showSnackbar(`Mở chi tiết gói combo: ${comboTitle}`);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Top Banner section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.85)']}
          style={styles.heroGradient}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{language === 'vi' ? 'Máy bay + Khách sạn' : 'Flight + Hotel'}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Banner Info */}
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>{t('combos_title', 'Combo Vé Máy Bay & Khách Sạn')}</Text>
            <Text style={styles.bannerSub}>
              {t('combos_subtitle', 'Giải pháp tối ưu kết hợp vé máy bay và phòng khách sạn giúp tiết kiệm chi phí đến 35%')}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Search Bar overlay */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search" size={20} color={isDark ? '#94A3B8' : '#7D848D'} />
          <TextInput
            placeholder={t('explore_search_placeholder', 'Tìm kiếm điểm đến, tên combo...')}
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
        {/* Hot Deals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWrapper}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                {language === 'vi' ? '🔥 Hot deal combo du lịch' : '🔥 Hot Tour Combos'}
              </Text>
              <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                {language === 'vi'
                  ? 'Sự kết hợp hoàn hảo mang lại cho quý khách dịch vụ tốt nhất với mức giá tối ưu'
                  : 'Perfect package matching airport transfers & luxury hotel rooms'}
              </Text>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterChip,
                    isDark && styles.filterChipDark,
                    isActive && styles.filterChipActive,
                    isActive && isDark && styles.filterChipActiveDark,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isDark && styles.filterChipTextDark,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {tab === 'Tất cả'
                      ? t('filter_all', 'Tất cả')
                      : tab === 'Máy bay + Khách sạn'
                      ? language === 'vi'
                        ? 'Máy bay + Khách sạn'
                        : 'Flight + Hotel'
                      : language === 'vi'
                      ? 'Xe + Khách sạn'
                      : 'Car + Hotel'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Combos list (Horizontal scroll) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.comboRail}
          >
            {filteredCombos.map((combo) => (
              <View key={combo.id} style={[styles.comboCard, isDark && styles.comboCardDark]}>
                <Image source={{ uri: combo.image }} style={styles.comboImage} />
                <View style={styles.comboDetails}>
                  <Text style={[styles.comboName, isDark && styles.textDark]} numberOfLines={2}>
                    {combo.title}
                  </Text>
                  
                  {/* Stars */}
                  <View style={styles.starRow}>
                    {Array.from({ length: combo.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={13} color="#FFB800" />
                    ))}
                  </View>
 
                  {/* Metadata fields */}
                  <View style={styles.metaRow}>
                    <Ionicons name="bed-outline" size={14} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <Text style={[styles.metaText, isDark && styles.metaTextDark]} numberOfLines={1}>
                      {combo.hotel}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="airplane-outline" size={14} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <Text style={[styles.metaText, isDark && styles.metaTextDark]} numberOfLines={1}>
                      {combo.transport}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="ribbon-outline" size={14} color={isDark ? '#94A3B8' : '#6B7280'} />
                    <Text style={[styles.metaText, isDark && styles.metaTextDark]} numberOfLines={1}>
                      {combo.hotelStandard === 'Tiêu chuẩn nghỉ dưỡng 5*'
                        ? language === 'vi'
                          ? 'Tiêu chuẩn nghỉ dưỡng 5*'
                          : '5* Luxury Resort Standard'
                        : combo.hotelStandard}
                    </Text>
                  </View>
 
                  <View style={[styles.cardFooter, isDark && styles.cardFooterBorderDark]}>
                    <Text style={styles.priceText}>{formatPrice(parsePrice(combo.price))}</Text>
                    <TouchableOpacity style={styles.bookBtn} onPress={() => handleViewDetails(combo.title)}>
                      <Text style={styles.bookBtnText}>{language === 'vi' ? 'Xem chi tiết' : 'View details'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
 
        {/* Benefits text list (Web Parity) */}
        <View style={[styles.benefitsCard, isDark && styles.benefitsCardDark]}>
          <Text style={[styles.benefitsMainTitle, isDark && styles.textDark]}>
            {language === 'vi' ? 'Linh hoạt trải nghiệm theo cách bạn muốn' : 'Flexible travel experiences on your terms'}
          </Text>
          <Text style={[styles.benefitsIntro, isDark && styles.subtextDark]}>
            {language === 'vi'
              ? 'Với combo du lịch tự chọn vé máy bay & phòng khách sạn, TravelViet mang đến giải pháp giúp bạn làm chủ chuyến đi:'
              : 'With customizable flights & hotel packages, TravelViet lets you control your journey:'}
          </Text>
 
          <View style={styles.benefitItem}>
            <Text style={styles.benefitHeader}>✓ {language === 'vi' ? 'Tự do lựa chọn - Chủ động hành trình' : 'Ultimate flexibility - Controlled itinerary'}</Text>
            <Text style={[styles.benefitDesc, isDark && styles.subtextDark]}>
              {language === 'vi'
                ? 'Hãng bay phù hợp ngân sách, khách sạn theo tiêu chuẩn, thời gian khởi hành linh hoạt theo kế hoạch của bạn.'
                : 'Budget-friendly airline selections, premium stays, flexible flight schedules matching your plans.'}
            </Text>
          </View>
 
          <View style={styles.benefitItem}>
            <Text style={styles.benefitHeader}>✓ {language === 'vi' ? 'Tối ưu chi phí - Giá sốc giờ chót' : 'Optimized budget - Last-minute savings'}</Text>
            <Text style={[styles.benefitDesc, isDark && styles.subtextDark]}>
              {language === 'vi'
                ? 'Tận dụng mức chiết khấu liên kết giữa hàng không và khách sạn giúp tiết kiệm giá tổng thể hơn đặt lẻ dịch vụ.'
                : 'Save up to 35% compared to booking flights and hotels separately.'}
            </Text>
          </View>
 
          <View style={styles.benefitItem}>
            <Text style={styles.benefitHeader}>✓ {language === 'vi' ? 'Phù hợp với mọi nhu cầu nghỉ dưỡng' : 'Tailored for all travel purposes'}</Text>
            <Text style={[styles.benefitDesc, isDark && styles.subtextDark]}>
              {language === 'vi'
                ? 'Chuyến công tác ngắn ngày, tuần trăng mật lãng mạn hay kỳ nghỉ ấm cúng cùng đại gia đình.'
                : 'Short business trips, romantic honeymoons, or cozy family holidays.'}
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
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleWrapper: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  sectionSubtext: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
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
  comboRail: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 16,
  },
  comboCard: {
    width: 240,
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
  comboImage: {
    width: '100%',
    height: 130,
  },
  comboDetails: {
    padding: 12,
    gap: 6,
  },
  comboName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 18,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF702A',
  },
  bookBtn: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
  },
  benefitsCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    marginTop: 10,
  },
  benefitsMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  benefitsIntro: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  benefitItem: {
    gap: 4,
    marginTop: 4,
  },
  benefitHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF702A',
  },
  benefitDesc: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    paddingLeft: 14,
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
  comboCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  metaTextDark: {
    color: '#94A3B8',
  },
  cardFooterBorderDark: {
    borderTopColor: '#334155',
  },
  benefitsCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
});
