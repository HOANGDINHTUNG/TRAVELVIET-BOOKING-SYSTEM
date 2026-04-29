import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeStyles } from './styles';
import { TourCard } from '@/components/TourCard';
import { Tour } from '@/types/Tour';
import { Colors } from '@/constants/theme';

// Mock Data - Tour List
const MOCK_TOURS: Tour[] = [
  {
    id: '1',
    name: 'Hà Nội - Hạ Long Bay 3 Ngày',
    description: 'Khám phá vịnh Hạ Long - di sản thế giới UNESCO với những hang động kỳ bí',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    price: 2500000,
    originalPrice: 3500000,
    location: {
      id: 'loc_1',
      name: 'Hạ Long, Quảng Ninh',
      latitude: 20.8552,
      longitude: 107.1725,
    },
    duration: 3,
    rating: 4.8,
    reviewCount: 248,
    weather: {
      temperature: 28,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
    },
    startDate: '2024-06-01',
    endDate: '2024-06-03',
    maxParticipants: 30,
    currentParticipants: 18,
    highlights: ['Vịnh Hạ Long', 'Hang Sơn Đông', 'Đảo Titop'],
    itinerary: [],
  },
  {
    id: '2',
    name: 'Đà Lạt - Thành Phố Ngàn Hoa 2 Ngày',
    description: 'Thưởng thức không khí mát mẻ, thác nước đẹp và các khu vườn hoa tươi tắn',
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    price: 1800000,
    originalPrice: 2500000,
    location: {
      id: 'loc_2',
      name: 'Đà Lạt, Lâm Đồng',
      latitude: 11.94,
      longitude: 108.44,
    },
    duration: 2,
    rating: 4.6,
    reviewCount: 312,
    weather: {
      temperature: 18,
      condition: 'cloudy',
      humidity: 75,
      windSpeed: 8,
    },
    maxParticipants: 25,
    currentParticipants: 12,
    highlights: ['Thác Prenn', 'Hoa Dalat', 'Nhà Thờ Domaine'],
    itinerary: [],
  },
  {
    id: '3',
    name: 'Nha Trang - Vịnh Thiên Đường 3 Ngày',
    description: 'Bãi biển trắng mịn, nước biển xanh trong cùng những hoạt động water sports',
    imageUrl:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
    price: 2200000,
    location: {
      id: 'loc_3',
      name: 'Nha Trang, Khánh Hòa',
      latitude: 12.2389,
      longitude: 109.1967,
    },
    duration: 3,
    rating: 4.7,
    reviewCount: 421,
    weather: {
      temperature: 32,
      condition: 'sunny',
      humidity: 70,
      windSpeed: 15,
    },
    maxParticipants: 35,
    currentParticipants: 28,
    highlights: ['Bãi biển', 'Lặn ngắm san hô', 'Đảo Naman Bay'],
    itinerary: [],
  },
  {
    id: '4',
    name: 'Hoi An - Hội An Cổ Kính 2 Ngày',
    description: 'Khám phá thành phố cổ kính với kiến trúc độc đáo, cầu Nhật Bản và cơm Hội An',
    imageUrl:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop',
    price: 1500000,
    originalPrice: 1900000,
    location: {
      id: 'loc_4',
      name: 'Hội An, Quảng Nam',
      latitude: 15.8788,
      longitude: 108.335,
    },
    duration: 2,
    rating: 4.9,
    reviewCount: 567,
    weather: {
      temperature: 26,
      condition: 'sunny',
      humidity: 72,
      windSpeed: 10,
    },
    maxParticipants: 20,
    currentParticipants: 8,
    highlights: ['Phố cổ', 'Cầu Nhật Bản', 'Chợ đêm'],
    itinerary: [],
  },
  {
    id: '5',
    name: 'Mekong Delta - Miền Tây 3 Ngày',
    description: 'Trải nghiệm cuộc sống trên sông nước, chợ nổi và các làng nghề truyền thống',
    imageUrl:
      'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=300&fit=crop',
    price: 1900000,
    location: {
      id: 'loc_5',
      name: 'Mekong Delta, An Giang',
      latitude: 10.3703,
      longitude: 105.1243,
    },
    duration: 3,
    rating: 4.5,
    reviewCount: 189,
    weather: {
      temperature: 30,
      condition: 'sunny',
      humidity: 80,
      windSpeed: 12,
    },
    maxParticipants: 25,
    currentParticipants: 15,
    highlights: ['Chợ nổi Cái Bè', 'Làng chuối', 'Cơm gà'],
    itinerary: [],
  },
];

const CATEGORIES = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Biển Đảo', 'Hồ Núi'];

export default function HomeScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createHomeStyles(isDark);
  const themeColors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(false);

  // Filter tours based on search and category
  const filteredTours = useMemo(() => {
    let filtered = MOCK_TOURS;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter((tour) => {
        switch (selectedCategory) {
          case 'Miền Bắc':
            return tour.location.latitude > 18;
          case 'Miền Trung':
            return tour.location.latitude > 14 && tour.location.latitude <= 18;
          case 'Miền Nam':
            return tour.location.latitude <= 14;
          case 'Biển Đảo':
            return ['Nha Trang', 'Hạ Long', 'Phú Quốc'].some(
              (city) => tour.location.name.includes(city)
            );
          case 'Hồ Núi':
            return ['Đà Lạt', 'Hà Giang'].some(
              (city) => tour.location.name.includes(city)
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Featured tours (first 3)
  const featuredTours = useMemo(() => filteredTours.slice(0, 3), [filteredTours]);

  // Other tours (rest)
  const otherTours = useMemo(() => filteredTours.slice(3), [filteredTours]);

  const handleTourPress = useCallback(
    (tourId: string) => {
      // Navigate to tour detail screen
      console.log('Tour pressed:', tourId);
      // navigation.push('TourDetail', { tourId });
    },
    [navigation]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('Tất cả');
  }, []);

  // Render filter chip
  const renderFilterChip = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.filterChip,
        selectedCategory === item && styles.filterChipActive,
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedCategory === item && styles.filterChipTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Render horizontal tour item (featured)
  const renderHorizontalTour = ({ item }: { item: Tour }) => (
    <TourCard
      tour={item}
      size="small"
      showWeather={true}
      onPress={() => handleTourPress(item.id)}
    />
  );

  // Render vertical tour item
  const renderVerticalTour = ({ item }: { item: Tour }) => (
    <TourCard
      tour={item}
      size="medium"
      showWeather={false}
      onPress={() => handleTourPress(item.id)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào, bạn! 👋</Text>
        <Text style={styles.title}>Bạn muốn đi đâu?</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={themeColors.icon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tour, địa điểm..."
            placeholderTextColor={themeColors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={themeColors.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.tint} />
          <Text style={styles.loadingText}>Đang tải tours...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Chips */}
          <View style={styles.filterContainer}>
            <FlatList
              horizontal
              data={CATEGORIES}
              renderItem={renderFilterChip}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              contentContainerStyle={styles.filtersScrollView}
            />
          </View>

          {filteredTours.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons
                name="beach"
                size={48}
                color={themeColors.icon}
              />
              <Text style={styles.noResultsText}>
                Không tìm thấy tour phù hợp
              </Text>
              <TouchableOpacity
                onPress={handleResetFilters}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Featured/Recommended Section */}
              {featuredTours.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>✨ Tours Nổi Bật</Text>
                    <Text style={styles.sectionSubtitle}>
                      Các tour được yêu thích nhất
                    </Text>
                  </View>

                  <FlatList
                    data={featuredTours}
                    renderItem={renderHorizontalTour}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContent}
                    style={styles.horizontalList}
                  />
                </View>
              )}

              {/* Promotion Banner */}
              <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>🎉 Ưu Đãi Đặc Biệt</Text>
                <Text style={styles.bannerSubtitle}>
                  Giảm 20% cho các tour Miền Bắc - Hạn chế 48 giờ
                </Text>
              </View>

              {/* All Tours Section */}
              {otherTours.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tất cả Tours</Text>
                    <Text style={styles.sectionSubtitle}>
                      {otherTours.length} tours đang có
                    </Text>
                  </View>

                  <View style={styles.verticalListContainer}>
                    <FlatList
                      data={otherTours}
                      renderItem={renderVerticalTour}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      nestedScrollEnabled={false}
                    />
                  </View>
                </View>
              )}

              <View style={styles.footerSpacing} />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
