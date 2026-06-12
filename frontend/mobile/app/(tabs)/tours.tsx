import React, { useMemo, useState, useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '@/providers/SnackbarProvider';

type Tour = {
  id: string;
  title: string;
  image: string;
  price: string;
  priceNum: number;
  badge: 'GIÁ TỐT' | 'GIỜ CHÓT' | 'ESG & LỢI';
  departure: string;
  duration: string;
  startDate: string;
  slotsLeft: number;
  rating: number;
  reviewCount: number;
  tourLine: 'Cao cấp' | 'Tiêu chuẩn' | 'Tiết kiệm' | 'Giá tốt' | 'Tour ESG & LỢI';
  transport: 'Máy bay' | 'Xe';
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam' | 'Nước ngoài';
};

const MOCK_TOURS: Tour[] = [
  {
    id: 't1',
    title: 'Hải Phòng 1N – Khám phá Đảo Cát Bà',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600',
    price: '900.000 đ',
    priceNum: 900000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '1 ngày 0 đêm',
    startDate: '22/05/2026',
    slotsLeft: 12,
    rating: 4.8,
    reviewCount: 24,
    tourLine: 'Giá tốt',
    transport: 'Xe',
    region: 'Miền Bắc',
  },
  {
    id: 't2',
    title: 'Hải Phòng 2N – Khám phá Vịnh Lan Hạ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    price: '1.800.000 đ',
    priceNum: 1800000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '2 ngày 1 đêm',
    startDate: '19/06/2026',
    slotsLeft: 10,
    rating: 4.9,
    reviewCount: 30,
    tourLine: 'Tiêu chuẩn',
    transport: 'Xe',
    region: 'Miền Bắc',
  },
  {
    id: 't3',
    title: 'Quảng Ninh 1N – Khám phá Vịnh Hạ Long',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600',
    price: '900.000 đ',
    priceNum: 900000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '1 ngày 0 đêm',
    startDate: '23/05/2026',
    slotsLeft: 15,
    rating: 4.7,
    reviewCount: 18,
    tourLine: 'Tiết kiệm',
    transport: 'Xe',
    region: 'Miền Bắc',
  },
  {
    id: 't4',
    title: 'Quảng Ngãi 2N – Khám phá Biển Mỹ Khê Quảng Ngãi',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600',
    price: '1.800.000 đ',
    priceNum: 1800000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '2 ngày 1 đêm',
    startDate: '03/06/2026',
    slotsLeft: 8,
    rating: 4.6,
    reviewCount: 15,
    tourLine: 'Tiêu chuẩn',
    transport: 'Xe',
    region: 'Miền Trung',
  },
  {
    id: 't5',
    title: 'Khánh Hòa 1N – Khám phá Nha Trang',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    price: '200.000 đ',
    priceNum: 200000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '1 ngày 0 đêm',
    startDate: '11/06/2026',
    slotsLeft: 20,
    rating: 4.5,
    reviewCount: 12,
    tourLine: 'Giá tốt',
    transport: 'Xe',
    region: 'Miền Trung',
  },
  {
    id: 't6',
    title: 'Nghỉ dưỡng Phú Quốc 3N2Đ',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
    price: '3.750.000 đ',
    priceNum: 3750000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '3 ngày 2 đêm',
    startDate: '12/07/2026',
    slotsLeft: 12,
    rating: 4.9,
    reviewCount: 45,
    tourLine: 'Cao cấp',
    transport: 'Máy bay',
    region: 'Miền Nam',
  },
  {
    id: 't7',
    title: 'Nghỉ dưỡng Côn Đảo 3N2Đ',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600',
    price: '3.700.000 đ',
    priceNum: 3700000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '3 ngày 2 đêm',
    startDate: '19/07/2026',
    slotsLeft: 12,
    rating: 4.8,
    reviewCount: 22,
    tourLine: 'Cao cấp',
    transport: 'Máy bay',
    region: 'Miền Nam',
  },
  {
    id: 't8',
    title: 'Nghỉ dưỡng Nha Trang 3N2Đ',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600',
    price: '3.700.000 đ',
    priceNum: 3700000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '3 ngày 2 đêm',
    startDate: '19/07/2026',
    slotsLeft: 16,
    rating: 4.7,
    reviewCount: 19,
    tourLine: 'Tiêu chuẩn',
    transport: 'Xe',
    region: 'Miền Trung',
  },
  {
    id: 't9',
    title: 'Thái Lan 5N4Đ: Bangkok - Pattaya',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600',
    price: '5.990.000 đ',
    priceNum: 5990000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '5 ngày 4 đêm',
    startDate: '18/06/2026',
    slotsLeft: 15,
    rating: 4.8,
    reviewCount: 120,
    tourLine: 'Tiêu chuẩn',
    transport: 'Máy bay',
    region: 'Nước ngoài',
  },
  {
    id: 't10',
    title: 'Nhật Bản 6N5Đ: Tokyo - Fuji - Kyoto - Osaka',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
    price: '24.900.000 đ',
    priceNum: 24900000,
    badge: 'GIÁ TỐT',
    departure: 'TP. Hồ Chí Minh',
    duration: '6 ngày 5 đêm',
    startDate: '20/07/2026',
    slotsLeft: 8,
    rating: 4.9,
    reviewCount: 85,
    tourLine: 'Cao cấp',
    transport: 'Máy bay',
    region: 'Nước ngoài',
  },
];

export default function ToursScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();

  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === 'dark';

  // Search form states
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departureCity, setDepartureCity] = useState('Tất cả');
  const [destinationRegion, setDestinationRegion] = useState('Du lịch trong nước');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  // Mega menu category filters
  const [selectedMegaCategory, setSelectedMegaCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'hot' | 'sale' | 'purchased' | null>(null);

  const params = useLocalSearchParams<{
    region?: string;
    keyword?: string;
    tourLine?: string;
    type?: string;
  }>();

  React.useEffect(() => {
    if (params.region) {
      if (params.region === 'Du lịch nước ngoài' || params.region === 'Nước ngoài') {
        setDestinationRegion('Du lịch nước ngoài');
        setSelectedMegaCategory('quốc tế');
      } else if (params.region === 'Du lịch trong nước' || params.region === 'Trong nước') {
        setDestinationRegion('Du lịch trong nước');
        setSelectedMegaCategory('trong nước');
      }
    }
    if (params.type) {
      if (params.type === 'hot' || params.type === 'sale' || params.type === 'purchased') {
        setSelectedType(params.type as any);
      }
    }
    if (params.keyword) {
      setSearchQuery(params.keyword);
      setIsSearchExpanded(true);
    }
    if (params.tourLine) {
      setSelectedTourLine(params.tourLine);
      setIsFilterVisible(false);
    }
  }, [params.region, params.keyword, params.tourLine, params.type]);

  // Filter Modal States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTourLine, setSelectedTourLine] = useState<string>('Tất cả');
  const [selectedTransport, setSelectedTransport] = useState<string>('Tất cả');
  const [maxBudget, setMaxBudget] = useState<number>(5000000); // Default 5M

  // Filter and sort logic
  const filteredTours = useMemo(() => {
    let list = [...MOCK_TOURS];

    // Text search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Departure City filter
    if (departureCity !== 'Tất cả') {
      list = list.filter((t) => t.departure.includes(departureCity));
    }

    // Destination Scope (Miền đến) filter
    if (destinationRegion === 'Du lịch nước ngoài') {
      list = list.filter((t) => t.region === 'Nước ngoài');
    } else if (destinationRegion === 'Du lịch trong nước') {
      list = list.filter((t) => t.region !== 'Nước ngoài');
    }

    // Mega Category filter
    if (selectedMegaCategory === 'biển đảo') {
      list = list.filter((t) =>
        t.title.includes('Cát Bà') ||
        t.title.includes('Lan Hạ') ||
        t.title.includes('Phú Quốc') ||
        t.title.includes('Nha Trang') ||
        t.title.includes('Côn Đảo')
      );
    } else if (selectedMegaCategory === 'giờ chót') {
      list = list.filter((t) => t.badge === 'GIÁ TỐT' || t.badge === 'GIỜ CHÓT');
    } else if (selectedMegaCategory === 'quốc tế') {
      list = list.filter((t) => t.region === 'Nước ngoài');
    } else if (selectedMegaCategory === 'trong nước') {
      list = list.filter((t) => t.region !== 'Nước ngoài');
    }

    // Type filter (Hot, Sale, Purchased)
    if (selectedType === 'hot') {
      list = list.filter((t) => t.rating >= 4.8);
    } else if (selectedType === 'sale') {
      const saleIds = ['t9', 't5', 't1', 't13'];
      list = list.filter((t) => saleIds.includes(t.id) || t.badge === 'GIÁ TỐT');
    } else if (selectedType === 'purchased') {
      list = list.filter((t) => t.reviewCount >= 20);
    }

    // Tour Line filter
    if (selectedTourLine !== 'Tất cả') {
      list = list.filter((t) => t.tourLine === selectedTourLine);
    }

    // Transport filter
    if (selectedTransport !== 'Tất cả') {
      list = list.filter((t) => t.transport === selectedTransport);
    }

    // Budget filter
    if (maxBudget < 5000000) {
      list = list.filter((t) => t.priceNum <= maxBudget);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.priceNum - a.priceNum);
    } else {
      // Newest or default (no sort, keep original order)
    }

    return list;
  }, [searchQuery, departureCity, destinationRegion, selectedTourLine, selectedTransport, maxBudget, sortBy, selectedMegaCategory, selectedType]);

  const handleBookNow = (tour: Tour) => {
    showSnackbar(`Đang kết nối cổng thanh toán đặt giữ chỗ: ${tour.title}...`);
    // Redirect to detail route if it exists or normal alert
    router.push({ pathname: '/tour/[id]', params: { id: tour.id } });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartureCity('Tất cả');
    setDestinationRegion('Du lịch trong nước');
    setSelectedTourLine('Tất cả');
    setSelectedTransport('Tất cả');
    setMaxBudget(5000000);
    setSortBy('newest');
    setSelectedMegaCategory(null);
    setSelectedType(null);
    showSnackbar('Đã thiết lập lại toàn bộ bộ lọc!');
  };

  const renderTourCard = ({ item }: { item: Tour }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleBookNow(item)}
        style={[styles.card, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
      >
        <View style={styles.cardLeft}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.tourTitle, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color="#FF5B22" />
              <Text style={[styles.metaText, isDark && { color: '#94A3B8' }]} numberOfLines={1}>
                {item.departure} • {item.duration}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="bus-outline" size={12} color="#FF5B22" />
              <Text style={[styles.metaText, isDark && { color: '#94A3B8' }]} numberOfLines={1}>
                {item.transport} • {language === 'vi' ? 'Còn:' : 'Left:'} {item.slotsLeft} • ★ {item.rating} ({item.reviewCount})
              </Text>
            </View>
          </View>

          <View style={[styles.cardFooter, isDark && { borderTopColor: '#334155' }]}>
            <Text style={styles.price}>{formatPrice(item.priceNum)}</Text>
            <TouchableOpacity style={styles.bookButton} onPress={() => handleBookNow(item)} activeOpacity={0.8}>
              <Text style={styles.bookButtonText}>{t('book_now', 'Đặt ngay')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        {/* Banner Header Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000' }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
          >
            <Text style={styles.heroTitle}>KẾT QUẢ TOUR</Text>
            <Text style={styles.heroSubtitle}>
              Danh sách chương trình tour phù hợp với bộ lọc bạn đã chọn.
            </Text>
          </LinearGradient>
        </ImageBackground>

        {/* Search Panel Card: "TÌM TOUR PHÙ HỢP" */}
        <View style={[styles.searchCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <TouchableOpacity
            style={styles.searchCardHeader}
            onPress={() => setIsSearchExpanded(!isSearchExpanded)}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={20} color={isDark ? '#FF5B22' : '#1D5A5A'} />
            <Text style={[styles.searchCardTitle, isDark && { color: '#FFFFFF' }]}>Tìm tour phù hợp</Text>
            <Ionicons
              name={isSearchExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>

          {isSearchExpanded && (
            <View style={[styles.searchCardBody, isDark && { borderTopColor: '#334155' }]}>
              <Text style={[styles.inputLabel, isDark && { color: '#94A3B8' }]}>TỪ KHÓA</Text>
              <TextInput
                placeholder="Tên tour, điểm đến..."
                placeholderTextColor={isDark ? '#64748B' : '#9CA3AF'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.textInput, isDark && { backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFFFFF' }]}
              />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, isDark && { color: '#94A3B8' }]}>KHỞI HÀNH</Text>
                  <View style={[styles.dropdownPicker, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.pickerText, isDark && { color: '#FFFFFF' }]}>{departureCity}</Text>
                    <Ionicons name="caret-down" size={12} color="#6B7280" />
                    {/* Simplified selector toggles */}
                    <TouchableOpacity
                      style={styles.pickerCoverBtn}
                      onPress={() => {
                        Alert.alert('Chọn thành phố khởi hành', '', [
                          { text: 'Tất cả', onPress: () => setDepartureCity('Tất cả') },
                          { text: 'TP. Hồ Chí Minh', onPress: () => setDepartureCity('TP. Hồ Chí Minh') },
                          { text: 'Hà Nội', onPress: () => setDepartureCity('Hà Nội') },
                        ]);
                      }}
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, isDark && { color: '#94A3B8' }]}>MIỀN ĐẾN</Text>
                  <View style={[styles.dropdownPicker, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                    <Text style={[styles.pickerText, isDark && { color: '#FFFFFF' }]}>{destinationRegion}</Text>
                    <Ionicons name="caret-down" size={12} color="#6B7280" />
                    <TouchableOpacity
                      style={styles.pickerCoverBtn}
                      onPress={() => {
                        Alert.alert('Chọn miền đến', '', [
                          { text: 'Tất cả', onPress: () => setDestinationRegion('Tất cả') },
                          { text: 'Du lịch trong nước', onPress: () => setDestinationRegion('Du lịch trong nước') },
                          { text: 'Du lịch nước ngoài', onPress: () => setDestinationRegion('Du lịch nước ngoài') },
                        ]);
                      }}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setIsSearchExpanded(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="search" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.searchButtonText}>Tìm tour</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mega Menu Dòng Tour Categories Horizontal Rail */}
        <View style={styles.megaCatSection}>
          <Text style={[styles.megaCatTitle, isDark && { color: '#FFFFFF' }]}>Dòng tour phổ biến</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.megaCatScroll}
          >
            {/* Biển đảo Việt Nam */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.megaCatCard,
                selectedMegaCategory === 'biển đảo' && styles.megaCatCardActive
              ]}
              onPress={() => {
                if (selectedMegaCategory === 'biển đảo') {
                  setSelectedMegaCategory(null);
                } else {
                  setSelectedMegaCategory('biển đảo');
                }
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300' }}
                style={styles.megaCatCardImg}
              />
              <View style={styles.megaCatOverlay}>
                <Text style={styles.megaCatName}>Biển đảo Việt Nam</Text>
                <Text style={styles.megaCatDesc} numberOfLines={1}>Phú Quốc, Nha Trang...</Text>
              </View>
            </TouchableOpacity>

            {/* Ưu đãi giờ chót */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.megaCatCard,
                selectedMegaCategory === 'giờ chót' && styles.megaCatCardActive
              ]}
              onPress={() => {
                if (selectedMegaCategory === 'giờ chót') {
                  setSelectedMegaCategory(null);
                } else {
                  setSelectedMegaCategory('giờ chót');
                }
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=300' }}
                style={styles.megaCatCardImg}
              />
              <View style={styles.megaCatOverlay}>
                <Text style={styles.megaCatName}>Ưu đãi giờ chót</Text>
                <Text style={styles.megaCatDesc} numberOfLines={1}>Giá tốt, suất giới hạn</Text>
              </View>
            </TouchableOpacity>

            {/* Quốc tế đang hot */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.megaCatCard,
                selectedMegaCategory === 'quốc tế' && styles.megaCatCardActive
              ]}
              onPress={() => {
                if (selectedMegaCategory === 'quốc tế') {
                  setSelectedMegaCategory(null);
                } else {
                  setSelectedMegaCategory('quốc tế');
                }
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=300' }}
                style={styles.megaCatCardImg}
              />
              <View style={styles.megaCatOverlay}>
                <Text style={styles.megaCatName}>Quốc tế đang hot</Text>
                <Text style={styles.megaCatDesc} numberOfLines={1}>Thái Lan, Nhật Bản...</Text>
              </View>
            </TouchableOpacity>

            {/* Tour trong nước */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.megaCatCard,
                selectedMegaCategory === 'trong nước' && styles.megaCatCardActive
              ]}
              onPress={() => {
                if (selectedMegaCategory === 'trong nước') {
                  setSelectedMegaCategory(null);
                } else {
                  setSelectedMegaCategory('trong nước');
                }
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=300' }}
                style={styles.megaCatCardImg}
              />
              <View style={styles.megaCatOverlay}>
                <Text style={styles.megaCatName}>Tour trong nước</Text>
                <Text style={styles.megaCatDesc} numberOfLines={1}>Lọc theo ngân sách</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Active Filters Row */}
        {(selectedType !== null || selectedMegaCategory !== null || selectedTourLine !== 'Tất cả' || selectedTransport !== 'Tất cả' || maxBudget < 5000000) && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
              {selectedType && (
                <TouchableOpacity
                  style={[styles.activeFilterChip, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => setSelectedType(null)}
                >
                  <Text style={[styles.activeFilterText, isDark && { color: '#F1F5F9' }]}>
                    {selectedType === 'hot' ? 'HOT' : selectedType === 'sale' ? 'Khuyến mãi' : 'Bán chạy'}
                  </Text>
                  <Ionicons name="close" size={14} color="#FF5B22" />
                </TouchableOpacity>
              )}
              {selectedMegaCategory && (
                <TouchableOpacity
                  style={[styles.activeFilterChip, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => setSelectedMegaCategory(null)}
                >
                  <Text style={[styles.activeFilterText, isDark && { color: '#F1F5F9' }]}>
                    Dòng: {selectedMegaCategory === 'biển đảo' ? 'Biển đảo' : selectedMegaCategory === 'giờ chót' ? 'Giờ chót' : selectedMegaCategory === 'quốc tế' ? 'Quốc tế' : 'Trong nước'}
                  </Text>
                  <Ionicons name="close" size={14} color="#FF5B22" />
                </TouchableOpacity>
              )}
              {selectedTourLine !== 'Tất cả' && (
                <TouchableOpacity
                  style={[styles.activeFilterChip, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => setSelectedTourLine('Tất cả')}
                >
                  <Text style={[styles.activeFilterText, isDark && { color: '#F1F5F9' }]}>Dòng: {selectedTourLine}</Text>
                  <Ionicons name="close" size={14} color="#FF5B22" />
                </TouchableOpacity>
              )}
              {selectedTransport !== 'Tất cả' && (
                <TouchableOpacity
                  style={[styles.activeFilterChip, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => setSelectedTransport('Tất cả')}
                >
                  <Text style={[styles.activeFilterText, isDark && { color: '#F1F5F9' }]}>Xe: {selectedTransport}</Text>
                  <Ionicons name="close" size={14} color="#FF5B22" />
                </TouchableOpacity>
              )}
              {maxBudget < 5000000 && (
                <TouchableOpacity
                  style={[styles.activeFilterChip, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
                  onPress={() => setMaxBudget(5000000)}
                >
                  <Text style={[styles.activeFilterText, isDark && { color: '#F1F5F9' }]}>Ngân sách: &lt; {maxBudget / 1000000}M</Text>
                  <Ionicons name="close" size={14} color="#FF5B22" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.activeFilterChip, { backgroundColor: '#FFF0EA', borderColor: '#FF5B22' }]}
                onPress={handleResetFilters}
              >
                <Text style={[styles.activeFilterText, { color: '#FF5B22' }]}>Xóa tất cả</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Results Info and Filter drawer button bar */}
        <View style={[styles.controlBar, isDark && { backgroundColor: '#0F172A' }]}>
          <Text style={[styles.resultCountText, isDark && { color: '#94A3B8' }]}>Kết quả: {filteredTours.length} chương trình tour</Text>

          <View style={styles.controlBarRight}>
            <TouchableOpacity style={[styles.filterDrawerBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]} onPress={() => setIsFilterVisible(true)}>
              <Ionicons name="funnel-outline" size={15} color={isDark ? '#FF5B22' : '#1D5A5A'} />
              <Text style={[styles.filterDrawerBtnText, isDark && { color: '#FF5B22' }]}>Bộ lọc</Text>
            </TouchableOpacity>

            {/* Sắp xếp dropdown toggler */}
            <TouchableOpacity
              style={[styles.sortBtn, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
              onPress={() => {
                Alert.alert('Sắp xếp theo', '', [
                  { text: 'Mới nhất', onPress: () => setSortBy('newest') },
                  { text: 'Giá tăng dần', onPress: () => setSortBy('priceAsc') },
                  { text: 'Giá giảm dần', onPress: () => setSortBy('priceDesc') },
                ]);
              }}
            >
              <Text style={[styles.sortBtnText, isDark && { color: '#FFFFFF' }]}>
                {sortBy === 'newest' ? 'Mới nhất' : sortBy === 'priceAsc' ? 'Giá ↑' : 'Giá ↓'}
              </Text>
              <Ionicons name="swap-vertical-outline" size={13} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={[styles.emptyContainer, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
        <Ionicons name="compass-outline" size={54} color={isDark ? '#475569' : '#BDC3C7'} />
        <Text style={[styles.emptyTitle, isDark && { color: '#FFFFFF' }]}>Không tìm thấy tour phù hợp</Text>
        <Text style={[styles.emptySubtitle, isDark && { color: '#94A3B8' }]}>Vui lòng thay đổi từ khóa hoặc thiết lập lại bộ lọc.</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetFilters} activeOpacity={0.8}>
          <Text style={styles.resetBtnText}>Xóa tất cả bộ lọc</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      null
    );
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
      <FlatList
        ref={flatListRef}
        data={filteredTours}
        keyExtractor={(item) => item.id}
        renderItem={renderTourCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Filter Modal Drawer */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E293B' }]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#334155' }]}>
              <Text style={[styles.modalTitle, isDark && { color: '#FFFFFF' }]}>Bộ lọc kết quả</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)} activeOpacity={0.8}>
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Tour Line Filter */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>Dòng tour</Text>
              <View style={styles.chipRow}>
                {['Tất cả', 'Cao cấp', 'Tiêu chuẩn', 'Tiết kiệm', 'Giá tốt', 'Tour ESG & LỢI'].map((line) => {
                  const isActive = selectedTourLine === line;
                  return (
                    <TouchableOpacity
                      key={line}
                      style={[styles.filterChip, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }, isActive && styles.filterChipActive]}
                      onPress={() => setSelectedTourLine(line)}
                    >
                      <Text style={[styles.filterChipText, isDark && { color: '#94A3B8' }, isActive && styles.filterChipTextActive]}>
                        {line}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Transport Filter */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>Phương tiện</Text>
              <View style={styles.chipRow}>
                {['Tất cả', 'Máy bay', 'Xe'].map((trans) => {
                  const isActive = selectedTransport === trans;
                  return (
                    <TouchableOpacity
                      key={trans}
                      style={[styles.filterChip, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }, isActive && styles.filterChipActive]}
                      onPress={() => setSelectedTransport(trans)}
                    >
                      <Text style={[styles.filterChipText, isDark && { color: '#94A3B8' }, isActive && styles.filterChipTextActive]}>
                        {trans}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Budget options range buttons */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>Ngân sách tối đa</Text>
              <View style={styles.budgetOptions}>
                <TouchableOpacity
                  style={[styles.budgetRangeBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }, maxBudget === 1000000 && styles.budgetRangeBtnActive]}
                  onPress={() => setMaxBudget(1000000)}
                >
                  <Text style={[styles.budgetRangeBtnText, isDark && { color: '#94A3B8' }, maxBudget === 1000000 && styles.budgetRangeBtnTextActive]}>
                    Dưới 1 Triệu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.budgetRangeBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }, maxBudget === 2000000 && styles.budgetRangeBtnActive]}
                  onPress={() => setMaxBudget(2000000)}
                >
                  <Text style={[styles.budgetRangeBtnText, isDark && { color: '#94A3B8' }, maxBudget === 2000000 && styles.budgetRangeBtnTextActive]}>
                    Dưới 2 Triệu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.budgetRangeBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }, maxBudget === 5000000 && styles.budgetRangeBtnActive]}
                  onPress={() => setMaxBudget(5000000)}
                >
                  <Text style={[styles.budgetRangeBtnText, isDark && { color: '#94A3B8' }, maxBudget === 5000000 && styles.budgetRangeBtnTextActive]}>
                    Tất cả mức giá
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, isDark && { borderTopColor: '#334155' }]}>
              <TouchableOpacity style={[styles.modalResetBtn, isDark && { borderColor: '#334155' }]} onPress={handleResetFilters} activeOpacity={0.8}>
                <Text style={[styles.modalResetBtnText, isDark && { color: '#94A3B8' }]}>Thiết lập lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setIsFilterVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalApplyBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '85%',
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 10,
  },
  searchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  searchCardBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  dropdownPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    height: 38,
    position: 'relative',
  },
  pickerText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  pickerCoverBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  searchButton: {
    backgroundColor: '#FF702A',
    borderRadius: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 6,
  },
  resultCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
  },
  controlBarRight: {
    flexDirection: 'row',
    gap: 8,
  },
  filterDrawerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4F4',
    borderWidth: 1,
    borderColor: '#1D5A5A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  filterDrawerBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D5A5A',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
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
    fontSize: 9,
    fontWeight: '800',
  },
  cardRight: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 18,
    marginBottom: 6,
  },
  metaContainer: {
    gap: 3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
  },
  reviewText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563EB', // Blue price matching mockup
  },
  bookButton: {
    backgroundColor: '#EAB308', // Yellow book button matching mockup
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bookButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
  },
  // Empty State Styles
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  resetBtn: {
    backgroundColor: '#FF702A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  modalScroll: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#E6F4F4',
    borderColor: '#1D5A5A',
  },
  filterChipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#1D5A5A',
    fontWeight: '800',
  },
  budgetOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  budgetRangeBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  budgetRangeBtnActive: {
    backgroundColor: '#E6F4F4',
    borderColor: '#1D5A5A',
  },
  budgetRangeBtnText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  budgetRangeBtnTextActive: {
    color: '#1D5A5A',
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  modalResetBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalResetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalApplyBtn: {
    flex: 2,
    backgroundColor: '#1D5A5A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalApplyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
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
  megaCatSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  megaCatTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  megaCatScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  megaCatCard: {
    width: 145,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  megaCatCardActive: {
    borderColor: '#FF702A',
  },
  megaCatCardImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.7,
  },
  megaCatOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  megaCatName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  megaCatDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  activeFiltersScroll: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
});
