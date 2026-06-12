import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { StatusBar } from 'expo-status-bar';
import { TOURS_DATA } from '@/constants/Tours';

// ─── Popular Destinations Database ───────────────────────────────────────────
interface DestinationItem {
  id: string;
  name: string;
  region: string;
  activeTours: number;
  rating: string;
  image: string;
  descVi: string;
  descEn: string;
}

const POPULAR_DESTINATIONS: DestinationItem[] = [
  { 
    id: 'pin1', 
    name: 'Sa Pa', 
    region: 'Lào Cai', 
    activeTours: 19, 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400', 
    descVi: 'Thiên đường sương mù với dãy Hoàng Liên Sơn hùng vĩ và ruộng bậc thang.', 
    descEn: 'Misty heaven with majestic Hoang Lien Son range and rice terraces.' 
  },
  { 
    id: 'pin2', 
    name: 'Hà Nội', 
    region: 'Việt Nam', 
    activeTours: 15, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', 
    descVi: 'Thủ đô ngàn năm văn hiến cổ kính, Hồ Gươm tĩnh lặng và ẩm thực vỉa hè.', 
    descEn: 'Ancient capital of thousand years, peaceful Sword Lake and street foods.' 
  },
  { 
    id: 'pin3', 
    name: 'Hạ Long', 
    region: 'Quảng Ninh', 
    activeTours: 28, 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400', 
    descVi: 'Kỳ quan thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ.', 
    descEn: 'Natural world wonder featuring thousands of karst limestone islands.' 
  },
  { 
    id: 'pin4', 
    name: 'Huế', 
    region: 'Thừa Thiên Huế', 
    activeTours: 12, 
    rating: '4.7', 
    image: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=400', 
    descVi: 'Cố đô yên bình mang đậm nét lịch sử vương triều Nguyễn xưa.', 
    descEn: 'Peaceful imperial city loaded with historical monuments of Nguyen dynasty.' 
  },
  { 
    id: 'pin5', 
    name: 'Đà Nẵng', 
    region: 'Việt Nam', 
    activeTours: 22, 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400', 
    descVi: 'Thành phố biển đáng sống nhất Việt Nam sở hữu Cầu Vàng lừng danh.', 
    descEn: 'Most liveable coastal city in Vietnam home to the world famous Golden Bridge.' 
  },
  { 
    id: 'pin6', 
    name: 'Nha Trang', 
    region: 'Khánh Hòa', 
    activeTours: 18, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400', 
    descVi: 'Vịnh biển ngọc cát trắng với khí hậu chan hòa nắng ấm bốn mùa.', 
    descEn: 'Emerald bay and white sandy shore blessed with warm sunshine all year round.' 
  },
  { 
    id: 'pin7', 
    name: 'Đà Lạt', 
    region: 'Lâm Đồng', 
    activeTours: 20, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600', 
    descVi: 'Thành phố ngàn hoa ngập tràn thông xanh ôn đới quanh năm dịu mát.', 
    descEn: 'Romantic highland town covered in green pines and temperate blossoms.' 
  },
  { 
    id: 'pin8', 
    name: 'Sài Gòn', 
    region: 'TP. Hồ Chí Minh', 
    activeTours: 16, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600', 
    descVi: 'Đô thị phồn hoa năng động với nhịp sống đêm sôi nổi và hiện đại.', 
    descEn: 'Vibrant economic hub of the south featuring glowing nights and skyscrapers.' 
  },
  { 
    id: 'pin9', 
    name: 'Phú Quốc', 
    region: 'Kiên Giang', 
    activeTours: 25, 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', 
    descVi: 'Đảo Ngọc hoang sơ ngập tràn nắng vàng lấp lánh và Bãi Sao cát mịn.', 
    descEn: 'Pristine pearl island featuring glowing sunset views and calm oceans.' 
  },
  { 
    id: 'pin10', 
    name: 'Tokyo', 
    region: 'Nhật Bản', 
    activeTours: 32, 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400', 
    descVi: 'Siêu đô thị tương lai phát sáng ngã tư Shibuya và các ngôi đền rêu cổ.', 
    descEn: 'Futuristic mega metropolis home to Shibuya scramble and mossy shrines.' 
  },
  { 
    id: 'pin11', 
    name: 'Seoul', 
    region: 'Hàn Quốc', 
    activeTours: 24, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400', 
    descVi: 'Thành phố văn hóa K-Pop sầm uất hòa trộn những mái nhà Hanok cổ xưa.', 
    descEn: 'Lively city of K-Pop and tech juxtaposed against ancient Hanok roofs.' 
  },
  { 
    id: 'pin12', 
    name: 'Bangkok', 
    region: 'Thái Lan', 
    activeTours: 20, 
    rating: '4.8', 
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400', 
    descVi: 'Đất nước nụ cười thân thiện ngập tràn chùa vàng và chợ nổi mua sắm.', 
    descEn: 'Land of smiles packed with golden temples and floating shopping canals.' 
  }
];

// ─── Experiences Database ───────────────────────────────────────────────────
interface ExperienceCategory {
  id: string;
  nameVi: string;
  nameEn: string;
  icon: string;
  keywords: string[];
}

const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  { id: 'beach', nameVi: 'Biển đảo', nameEn: 'Beach Vibes', icon: 'sunny-outline', keywords: ['phú quốc', 'nha trang', 'vịnh', 'hạ long', 'cát bà', 'biển'] },
  { id: 'mountain', nameVi: 'Leo núi & Thiên nhiên', nameEn: 'Mountain Hiking', icon: 'mountain-outline', keywords: ['sa pa', 'fansipan', 'hà giang', 'cao bằng', 'ninh bình', 'phong nha', 'núi'] },
  { id: 'city', nameVi: 'Khám phá Đô thị', nameEn: 'City Exploration', icon: 'business-outline', keywords: ['hà nội', 'sài gòn', 'tokyo', 'seoul', 'bangkok', 'thành phố', 'phố cổ'] },
  { id: 'history', nameVi: 'Văn hóa & Di sản', nameEn: 'Culture & Heritage', icon: 'library-outline', keywords: ['huế', 'đại nội', 'văn miếu', 'chùa', 'đền', 'di sản', 'cố đô', 'hội an'] }
];

export default function ViewAllScreen() {
  const params = useLocalSearchParams<{ type: string }>();
  const viewType = params.type || 'popular-destinations';

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language, formatPrice } = useAppSettings();
  const { showSnackbar } = useSnackbar();

  const isDark = theme === 'dark';
  const isVi = language === 'vi';

  // ─── States ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'ratingDesc'>('default');
  const [selectedExpId, setSelectedExpId] = useState('beach');

  // Parse price helper
  const parsePriceNum = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/\D/g, '');
    return parseInt(cleanStr, 10) || 0;
  };

  // ─── Category Title & Data Mapping ─────────────────────────────────────────
  const categoryMeta = useMemo(() => {
    switch (viewType) {
      case 'popular-destinations':
        return {
          titleVi: 'Điểm Đến Ưa Thích',
          titleEn: 'Popular Destinations',
          subtitleVi: 'Khám phá các tọa độ du lịch hot nhất trong và ngoài nước',
          subtitleEn: 'Explore the hottest travel spots both domestic and abroad',
        };
      case 'best-deals':
        return {
          titleVi: 'Ưu Đãi Tốt Nhất',
          titleEn: 'Best Deals',
          subtitleVi: 'Các chương trình du lịch giảm giá cực lớn, đặt ngay kẻo lỡ',
          subtitleEn: 'Big discount travel packages, book now before they sell out',
        };
      case 'mega-sales':
        return {
          titleVi: 'Khuyến Mãi Siêu Khủng',
          titleEn: 'Mega Sales & Deals',
          subtitleVi: 'Giảm giá kịch sàn phục vụ những hành trình trải nghiệm lớn',
          subtitleEn: 'Rock-bottom price drops curated for your grand adventures',
        };
      case 'top-experiences':
        return {
          titleVi: 'Trải Nghiệm Hàng Đầu',
          titleEn: 'Top Experiences',
          subtitleVi: 'Tìm kiếm tour theo phong cách và sở thích kỳ nghỉ của bạn',
          subtitleEn: 'Discover tour packages tailored to your vacation style',
        };
      case 'hot-tours':
        return {
          titleVi: 'Tour HOT Bậc Nhất',
          titleEn: 'Super HOT Tours',
          subtitleVi: 'Những hành trình xu hướng được quan tâm hàng đầu hiện nay',
          subtitleEn: 'Trending itineraries receiving maximum views and booking demand',
        };
      case 'most-purchased':
        return {
          titleVi: 'Tour Mua Nhiều Nhất',
          titleEn: 'Most Purchased Tours',
          subtitleVi: 'Hàng ngàn du khách đã lựa chọn và trải nghiệm hài lòng',
          subtitleEn: 'Chosen by thousands of travelers with glowing feedback',
        };
      case 'domestic-tours':
        return {
          titleVi: 'Tour Trong Nước',
          titleEn: 'Domestic Tours',
          subtitleVi: 'Hành trình khám phá dải đất hình chữ S tươi đẹp thân thương',
          subtitleEn: 'Itineraries to explore our beautiful and friendly Vietnam S-land',
        };
      case 'international-tours':
        return {
          titleVi: 'Tour Nước Ngoài',
          titleEn: 'International Tours',
          subtitleVi: 'Khám phá những nền văn minh lớn và kỳ quan thế giới',
          subtitleEn: 'Discover global civilizations and wonders around the world',
        };
      default:
        return {
          titleVi: 'Xem Tất Cả',
          titleEn: 'View All Listings',
          subtitleVi: 'Danh sách tổng hợp các chương trình du lịch',
          subtitleEn: 'Aggregated travel program list',
        };
    }
  }, [viewType]);

  // ─── Filter & Process Tour Data ────────────────────────────────────────────
  const listData = useMemo(() => {
    // 1. Fetch raw list based on category
    if (viewType === 'popular-destinations') {
      let list = [...POPULAR_DESTINATIONS];
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.region.toLowerCase().includes(query)
        );
      }
      // Sort filter
      if (sortBy === 'ratingDesc') {
        list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      }
      return list;
    }

    let tours = [...TOURS_DATA];

    // Filter by viewType specific criteria
    if (viewType === 'best-deals' || viewType === 'mega-sales') {
      // Filter tours that are on sale (defined hardcoded sale mapping here)
      const saleIds = ['t9', 't5', 't1', 't13', 't8'];
      tours = tours.filter((t) => saleIds.includes(t.id));
    } else if (viewType === 'hot-tours') {
      tours = tours.filter((t) => t.rating >= 4.8);
    } else if (viewType === 'most-purchased') {
      // Sort or mock purchase demand
      tours = tours.filter((t) => ['t12', 't9', 't14', 't11', 't10', '2'].includes(t.id));
    } else if (viewType === 'domestic-tours') {
      tours = tours.filter((t) => t.category !== 'Nước ngoài');
    } else if (viewType === 'international-tours') {
      tours = tours.filter((t) => t.category === 'Nước ngoài');
    } else if (viewType === 'top-experiences') {
      // Lọc theo từ khóa của trải nghiệm được chọn
      const selectedExp = EXPERIENCE_CATEGORIES.find((e) => e.id === selectedExpId);
      if (selectedExp) {
        tours = tours.filter((t) => {
          const content = `${t.title} ${t.location} ${t.category} ${t.description}`.toLowerCase();
          return selectedExp.keywords.some((keyword) => content.includes(keyword));
        });
      }
    }

    // Apply text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      tours = tours.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query)
      );
    }

    // Apply sort filters
    if (sortBy === 'priceAsc') {
      tours.sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price));
    } else if (sortBy === 'priceDesc') {
      tours.sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price));
    } else if (sortBy === 'ratingDesc') {
      tours.sort((a, b) => b.rating - a.rating);
    }

    return tours;
  }, [viewType, searchQuery, sortBy, selectedExpId]);

  // Mock original price and discounts for best-deals
  const getSaleMeta = (tourId: string) => {
    switch (tourId) {
      case 't9':
        return { discount: '20% OFF', original: '7.490.000đ' };
      case 't5':
        return { discount: '50% OFF', original: '400.000đ' };
      case 't1':
        return { discount: '15% OFF', original: '1.050.000đ' };
      case 't13':
        return { discount: '25% OFF', original: '2.860.000đ' };
      default:
        return { discount: '30% OFF', original: '3.500.000đ' };
    }
  };

  const handleItemPress = (item: any) => {
    if (viewType === 'popular-destinations') {
      // Find matching pin
      router.push({ pathname: '/destination-detail', params: { pinId: item.id } });
    } else {
      showSnackbar(isVi ? `Đang tải chi tiết tour: ${item.title}` : `Loading tour details: ${item.title}`);
      router.push({ pathname: '/tour/[id]', params: { id: item.id } });
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E1B4B'] : ['#E0F2FE', '#F8FAFC']}
      style={styles.container}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} translucent />
      
      {/* Dynamic Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, isDark && styles.textDark]} numberOfLines={1}>
            {isVi ? categoryMeta.titleVi : categoryMeta.titleEn}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {isVi ? categoryMeta.subtitleVi : categoryMeta.subtitleEn}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Local Filter Control Console */}
      <View style={styles.controlPanel}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder={isVi ? 'Tìm kiếm nhanh trong trang...' : 'Quick search on this page...'}
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

        {/* Sort Row */}
        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, isDark && { color: '#94A3B8' }]}>
            {isVi ? `Kết quả (${listData.length})` : `Results (${listData.length})`}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'default' && styles.sortOptionActive]}
              onPress={() => setSortBy('default')}
            >
              <Text style={[styles.sortOptionText, sortBy === 'default' && styles.sortOptionTextActive]}>
                {isVi ? 'Mặc định' : 'Default'}
              </Text>
            </TouchableOpacity>
            
            {viewType !== 'popular-destinations' && (
              <>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'priceAsc' && styles.sortOptionActive]}
                  onPress={() => setSortBy('priceAsc')}
                >
                  <Ionicons name="arrow-up" size={10} color={sortBy === 'priceAsc' ? '#FFF' : '#64748B'} />
                  <Text style={[styles.sortOptionText, sortBy === 'priceAsc' && styles.sortOptionTextActive]}>
                    {isVi ? 'Giá rẻ nhất' : 'Cheapest'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'priceDesc' && styles.sortOptionActive]}
                  onPress={() => setSortBy('priceDesc')}
                >
                  <Ionicons name="arrow-down" size={10} color={sortBy === 'priceDesc' ? '#FFF' : '#64748B'} />
                  <Text style={[styles.sortOptionText, sortBy === 'priceDesc' && styles.sortOptionTextActive]}>
                    {isVi ? 'Giá cao nhất' : 'Highest Price'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.sortOption, sortBy === 'ratingDesc' && styles.sortOptionActive]}
              onPress={() => setSortBy('ratingDesc')}
            >
              <Ionicons name="star" size={10} color={sortBy === 'ratingDesc' ? '#FFF' : '#64748B'} style={{ marginRight: 2 }} />
              <Text style={[styles.sortOptionText, sortBy === 'ratingDesc' && styles.sortOptionTextActive]}>
                {isVi ? 'Đánh giá cao' : 'Top Rated'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Experience switcher (Sub-tab) if category is top-experiences */}
      {viewType === 'top-experiences' && (
        <View style={styles.expBarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.expScroll}>
            {EXPERIENCE_CATEGORIES.map((exp) => {
              const active = selectedExpId === exp.id;
              return (
                <TouchableOpacity
                  key={exp.id}
                  style={[styles.expChip, active && styles.expChipActive]}
                  onPress={() => setSelectedExpId(exp.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={exp.icon as any} size={14} color={active ? '#FFFFFF' : '#FF5B22'} style={{ marginRight: 4 }} />
                  <Text style={[styles.expChipText, active && styles.expChipTextActive]}>
                    {isVi ? exp.nameVi : exp.nameEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Listing Views */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          viewType === 'popular-destinations' && styles.destListContainer
        ]}
      >
        {listData.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="compass-outline" size={48} color="#94A3B8" style={{ marginBottom: 8 }} />
            <Text style={[styles.emptyText, isDark && styles.textDark]}>
              {isVi ? 'Không có nội dung nào phù hợp bộ lọc.' : 'No matching results found.'}
            </Text>
          </View>
        ) : (
          viewType === 'popular-destinations' ? (
            // Destinations Grid Layout (2 columns)
            (listData as DestinationItem[]).map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={[styles.destCard, isDark && styles.destCardDark]}
                activeOpacity={0.9}
                onPress={() => handleItemPress(dest)}
              >
                <Image source={{ uri: dest.image }} style={styles.destImage} />
                <View style={styles.destInfo}>
                  <Text style={[styles.destName, isDark && styles.textDark]} numberOfLines={1}>{dest.name}</Text>
                  <Text style={styles.destRegion} numberOfLines={1}>{dest.region}</Text>
                  <View style={styles.destMetaRow}>
                    <Text style={styles.destToursCount}>{dest.activeTours} Tours</Text>
                    <View style={styles.destRating}>
                      <Ionicons name="star" size={10} color="#FFB800" />
                      <Text style={[styles.destRatingText, isDark && styles.textDark]}>{dest.rating}</Text>
                    </View>
                  </View>
                  <Text style={[styles.destDesc, isDark && { color: '#64748B' }]} numberOfLines={2}>
                    {isVi ? dest.descVi : dest.descEn}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            // Tours List Layout
            (listData as typeof TOURS_DATA).map((tour) => {
              const isSale = viewType === 'best-deals' || viewType === 'mega-sales';
              const sale = getSaleMeta(tour.id);
              return (
                <TouchableOpacity
                  key={tour.id}
                  style={[styles.tourCard, isDark && styles.tourCardDark]}
                  activeOpacity={0.9}
                  onPress={() => handleItemPress(tour)}
                >
                  <Image source={{ uri: tour.image }} style={styles.tourImage} />
                  
                  {isSale && (
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>{sale.discount}</Text>
                    </View>
                  )}

                  <View style={styles.tourInfo}>
                    <Text style={[styles.tourTitle, isDark && styles.textDark]} numberOfLines={1}>
                      {tour.title}
                    </Text>
                    
                    <Text style={[styles.tourMeta, isDark && { color: '#94A3B8' }]}>
                      {tour.days} • {tour.location}
                    </Text>

                    <View style={styles.tourFooter}>
                      <View style={{ flex: 1 }}>
                        {isSale && (
                          <Text style={styles.originalPrice}>{sale.original}</Text>
                        )}
                        <Text style={styles.tourPrice}>
                          {isSale ? tour.price : formatPrice(parsePriceNum(tour.price))}
                        </Text>
                      </View>
                      
                      <View style={styles.tourRatingBlock}>
                        <Ionicons name="star" size={12} color="#FFB800" style={{ marginRight: 2 }} />
                        <Text style={[styles.tourRatingText, isDark && styles.textDark]}>
                          {tour.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.tourReviewCount}>({tour.reviewCount})</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )
        )}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  backBtn: {
    padding: 6,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  textDark: {
    color: '#FFFFFF',
  },
  controlPanel: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  sortButtons: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 2,
  },
  sortOptionActive: {
    backgroundColor: '#FF5B22',
  },
  sortOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  expBarContainer: {
    paddingBottom: 10,
  },
  expScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  expChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFD9CC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  expChipActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  expChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5B22',
  },
  expChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  destListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    width: '100%',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  destCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 4,
  },
  destCardDark: {
    backgroundColor: '#1E293B',
  },
  destImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#CBD5E1',
  },
  destInfo: {
    padding: 10,
  },
  destName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  destRegion: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  destMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  destToursCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5B22',
  },
  destRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  destRatingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  destDesc: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 12,
    fontWeight: '500',
  },
  tourCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    position: 'relative',
  },
  tourCardDark: {
    backgroundColor: '#1E293B',
  },
  tourImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#CBD5E1',
  },
  saleBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tourInfo: {
    padding: 14,
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  tourMeta: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  tourFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  tourPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FF5B22',
  },
  tourRatingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tourRatingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  tourReviewCount: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 2,
  },
});
