import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ContinentInfo {
  nameVi: string;
  nameEn: string;
  coverImage: string;
  descriptionVi: string;
  descriptionEn: string;
  destinations: {
    name: string;
    image: string;
    toursCount: string;
    rating: string;
    price: string;
    tag?: string;
  }[];
}

const CONTINENTS_DATA: Record<string, ContinentInfo> = {
  'Việt Nam': {
    nameVi: 'Việt Nam',
    nameEn: 'Vietnam',
    coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000',
    descriptionVi: 'Khám phá dải đất hình chữ S xinh đẹp trải dài từ Hà Giang địa đầu Tổ quốc tới Đất mũi Cà Mau với vô vàn thắng cảnh kỳ vĩ, những bãi biển cát trắng mịn màng và chiều sâu văn hóa lịch sử hàng ngàn năm.',
    descriptionEn: 'Explore the beautiful S-shaped land stretching from the northern mountains of Ha Giang to the southern tip of Ca Mau, filled with majestic landscapes, pristine beaches, and thousands of years of history.',
    destinations: [
      { name: 'Sa Pa', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400', toursCount: '19 Tours', rating: '4.9', price: '1.250.000đ', tag: 'Bán chạy' },
      { name: 'Hà Nội', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', toursCount: '28 Tours', rating: '4.8', price: '790.000đ', tag: 'Văn hóa' },
      { name: 'Hạ Long', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400', toursCount: '28 Tours', rating: '4.9', price: '2.500.000đ', tag: 'Kỳ quan' },
      { name: 'Huế', image: 'https://images.unsplash.com/photo-1590564311439-909ac7f933b2?q=80&w=400', toursCount: '15 Tours', rating: '4.8', price: '950.000đ', tag: 'Cố đô' },
      { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400', toursCount: '22 Tours', rating: '4.9', price: '1.350.000đ', tag: 'Đáng sống' },
      { name: 'Nha Trang', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400', toursCount: '18 Tours', rating: '4.7', price: '1.500.000đ', tag: 'Biển xanh' },
      { name: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400', toursCount: '24 Tours', rating: '4.8', price: '1.290.000đ', tag: 'Lãng mạn' },
      { name: 'Hội An', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', toursCount: '14 Tours', rating: '4.8', price: '890.000đ', tag: 'Phố cổ' },
      { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', toursCount: '25 Tours', rating: '4.9', price: '2.200.000đ', tag: 'Thiên đường' },
      { name: 'Hà Giang', image: 'https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=400', toursCount: '15 Tours', rating: '4.9', price: '1.490.000đ', tag: 'Đứng đầu' },
      { name: 'Ninh Bình', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', toursCount: '16 Tours', rating: '4.8', price: '990.000đ', tag: 'Thiên nhiên' },
    ]
  },
  'Châu Á': {
    nameVi: 'Châu Á',
    nameEn: 'Asia',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000',
    descriptionVi: 'Châu Á là cái nôi của những nền văn minh cổ đại rực rỡ nhất thế giới. Nơi đây quyến rũ du khách bằng sự giao thoa ngoạn mục giữa những siêu đô thị tương lai phát sáng rực rỡ và những đền chùa cổ kính đầy tĩnh lặng thanh bình.',
    descriptionEn: 'Asia is the cradle of the world\'s most brilliant ancient civilizations. It charms travelers with a spectacular intersection between glowing future megacities and quiet, peaceful temples.',
    destinations: [
      { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400', toursCount: '32 Tours', rating: '4.9', price: '18.900.000đ', tag: 'Nổi bật' },
      { name: 'Seoul', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400', toursCount: '26 Tours', rating: '4.9', price: '14.500.000đ', tag: 'Hot Deal' },
      { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400', toursCount: '20 Tours', rating: '4.8', price: '6.800.000đ', tag: 'Phổ biến' },
      { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400', toursCount: '12 Tours', rating: '4.7', price: '11.200.000đ', tag: 'Hiện đại' },
      { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400', toursCount: '18 Tours', rating: '4.8', price: '9.900.000đ', tag: 'Nghỉ dưỡng' },
    ]
  },
  'Châu Âu': {
    nameVi: 'Châu Âu',
    nameEn: 'Europe',
    coverImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000',
    descriptionVi: 'Châu Âu mang vẻ đẹp lãng mạn, quý tộc với những thị trấn cổ kính thời trung cổ, các thánh đường Gothic uy nghiêm, nền văn hóa nghệ thuật vĩ đại cùng những cung đường thiên nhiên đẹp như tranh vẽ.',
    descriptionEn: 'Europe brings romantic, aristocratic beauty with ancient medieval towns, majestic Gothic cathedrals, great arts and culture, and picturesque natural landscapes.',
    destinations: [
      { name: 'Barcelona', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400', toursCount: '18 Tours', rating: '4.8', price: '34.900.000đ', tag: 'Kiến trúc' },
      { name: 'Venice', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400', toursCount: '21 Tours', rating: '4.8', price: '42.000.000đ', tag: 'Lãng mạn' },
      { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400', toursCount: '30 Tours', rating: '4.9', price: '48.900.000đ', tag: 'Kinh đô' },
      { name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400', toursCount: '15 Tours', rating: '4.8', price: '39.900.000đ', tag: 'Lịch sử' },
      { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?q=80&w=400', toursCount: '24 Tours', rating: '4.7', price: '45.500.000đ', tag: 'Quý tộc' },
    ]
  },
  'Châu Mỹ': {
    nameVi: 'Châu Mỹ & Châu Đại Dương',
    nameEn: 'Americas & Oceania',
    coverImage: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1000',
    descriptionVi: 'Khám phá thế giới mới với những kỳ quan thiên nhiên hoang dã rộng lớn kỳ vĩ cùng các siêu đô thị sầm uất đa dạng bản sắc văn hóa như Sydney, New York hay các kỳ quan thiên nhiên Nam bán cầu.',
    descriptionEn: 'Discover the New World with vast and majestic wild natural wonders combined with bustling megacities rich in cultural identity, such as Sydney, New York, and Southern Hemisphere sights.',
    destinations: [
      { name: 'Sydney', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400', toursCount: '15 Tours', rating: '4.8', price: '28.500.000đ', tag: 'Nổi bật' },
      { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400', toursCount: '22 Tours', rating: '4.8', price: '54.000.000đ', tag: 'Sầm uất' },
      { name: 'Melbourne', image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=400', toursCount: '10 Tours', rating: '4.7', price: '32.000.000đ' },
    ]
  }
};

export default function ContinentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { continent } = useLocalSearchParams<{ continent: string }>();
  const { theme, language } = useAppSettings();
  
  const isDark = theme === 'dark';
  const isVi = language === 'vi';

  const selectedContinent = continent || 'Việt Nam';
  const data = CONTINENTS_DATA[selectedContinent] || CONTINENTS_DATA['Việt Nam'];

  const handleDestinationPress = (name: string) => {
    router.push({ pathname: '/destination-detail', params: { pinId: name } });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Floating Back Button */}
      <TouchableOpacity
        style={[styles.floatingBackBtn, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Image Header */}
        <ImageBackground source={{ uri: data.coverImage }} style={styles.coverImage}>
          <LinearGradient
            colors={isDark ? ['rgba(15,23,42,0.2)', 'rgba(15,23,42,1)'] : ['rgba(0,0,0,0.35)', 'rgba(248, 250, 252, 1)']}
            style={styles.coverGradient}
          >
            <View style={styles.headerTitleContainer}>
              <Text style={styles.regionLabel}>
                {isVi ? 'KHU VỰC KHÁM PHÁ' : 'EXPLORE REGION'}
              </Text>
              <Text style={styles.continentTitle}>
                {isVi ? data.nameVi : data.nameEn}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Overview Description */}
        <View style={styles.contentSection}>
          <Text style={[styles.descriptionText, isDark && styles.textDark]}>
            {isVi ? data.descriptionVi : data.descriptionEn}
          </Text>
        </View>

        {/* Popular Destinations Grid */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textTitleDark]}>
              {isVi ? 'Các điểm đến nổi bật' : 'Key Destinations'}
            </Text>
            <Text style={[styles.sectionSub, isDark && styles.textSubDark]}>
              {isVi ? `Điểm dừng chân được yêu thích tại ${data.nameVi}` : `Most popular places in ${data.nameEn}`}
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {data.destinations.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                style={[styles.cardContainer, isDark && styles.cardContainerDark]}
                onPress={() => handleDestinationPress(item.name)}
              >
                <ImageBackground source={{ uri: item.image }} style={styles.cardImg}>
                  {item.tag && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{item.tag}</Text>
                    </View>
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardInfoRow}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={10} color="#FFB800" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.toursText}>{item.toursCount}</Text>
                    </View>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardPrice}>Chỉ từ {item.price}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tours Recommendation CTA */}
        <View style={[styles.contentSection, { marginBottom: 40 }]}>
          <View style={[styles.ctaBanner, isDark && styles.ctaBannerDark]}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.ctaTitle}>
                {isVi ? 'Sẵn sàng khởi hành?' : 'Ready to Take Off?'}
              </Text>
              <Text style={styles.ctaSub}>
                {isVi ? `Khám phá hàng trăm tour hấp dẫn đang chờ bạn tại ${data.nameVi}` : `Explore hundreds of exciting tours waiting in ${data.nameEn}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaBtn}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/(tabs)/tours', params: { searchQuery: selectedContinent } })}
            >
              <Text style={styles.ctaBtnText}>{isVi ? 'Tìm tour' : 'Find Tours'}</Text>
              <Ionicons name="airplane-outline" size={14} color="#FF5B22" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  floatingBackBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  coverImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  coverGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitleContainer: {
    gap: 4,
  },
  regionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF5B22',
    letterSpacing: 1.5,
  },
  continentTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  contentSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'justify',
  },
  textDark: {
    color: '#94A3B8',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  textTitleDark: {
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  textSubDark: {
    color: '#64748B',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardContainer: {
    width: '48%',
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  cardContainerDark: {
    backgroundColor: '#1E293B',
  },
  cardImg: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tagBadge: {
    backgroundColor: '#FF5B22',
    alignSelf: 'flex-start',
    margin: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  cardGradient: {
    padding: 10,
    paddingTop: 20,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  toursText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 8,
    fontWeight: '600',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cardPrice: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
  },
  ctaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFD9CC',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  ctaBannerDark: {
    backgroundColor: 'rgba(255, 91, 34, 0.08)',
    borderColor: 'rgba(255, 91, 34, 0.15)',
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5B22',
  },
  ctaSub: {
    fontSize: 11,
    color: '#7C2D12',
    fontWeight: '500',
    lineHeight: 15,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    elevation: 2,
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ctaBtnText: {
    color: '#FF5B22',
    fontSize: 11,
    fontWeight: '800',
  },
});
