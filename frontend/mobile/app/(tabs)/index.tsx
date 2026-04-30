import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  DESTINATIONS_DATA,
  HOME_STATS,
  TOURS_DATA,
  type TourData,
} from '../../constants/Tours';
import { styles } from '../styles/_index.styles';

const ALL_CATEGORY = 'Tất cả';
const CATEGORIES = [
  ALL_CATEGORY,
  'Miền Bắc',
  'Miền Trung',
  'Miền Nam',
  'Biển đảo',
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const router = useRouter();

  const filteredTours = useMemo(() => {
    const query = normalize(searchQuery);

    return TOURS_DATA.filter((tour) => {
      const matchCategory =
        selectedCategory === ALL_CATEGORY || tour.category === selectedCategory;
      const matchSearch =
        query.length === 0 ||
        normalize(
          [
            tour.title,
            tour.location,
            tour.category,
            tour.description,
            tour.highlights.join(' '),
          ].join(' '),
        ).includes(query);

      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const heroTour = TOURS_DATA[0];
  const featuredTours = filteredTours.slice(0, 2);
  const regularTours = filteredTours.slice(2);

  const openTour = (tourId: string) => {
    router.push({ pathname: '/tour/[id]', params: { id: tourId } });
  };

  const renderTourCard = (tour: TourData, featured = false) => (
    <TouchableOpacity
      activeOpacity={0.9}
      key={tour.id}
      onPress={() => openTour(tour.id)}
      style={featured ? styles.featuredTourCard : styles.tourCard}
    >
      <ImageBackground
        source={{ uri: tour.image }}
        style={featured ? styles.featuredTourImage : styles.cardImage}
        imageStyle={styles.cardImageRadius}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.82)']}
          style={styles.gradient}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{tour.category}</Text>
            </View>
            <View style={styles.weatherBadge}>
              <Ionicons name="partly-sunny" size={15} color="#283618" />
              <Text style={styles.weatherText}>{tour.weather}</Text>
            </View>
          </View>

          <View style={styles.tourInfo}>
            <Text style={styles.tourTitle} numberOfLines={2}>
              {tour.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={15} color="#e9f5ef" />
              <Text style={styles.locationText} numberOfLines={1}>
                {tour.location}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaPill}>{tour.days}</Text>
              <Text style={styles.metaPill}>★ {tour.rating.toFixed(1)}</Text>
              <Text style={styles.metaPill}>{tour.reviewCount} đánh giá</Text>
            </View>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Giá từ</Text>
                <Text style={styles.priceText}>{tour.price}</Text>
              </View>
              <View style={styles.bookTextWrap}>
                <Text style={styles.bookText}>Đặt ngay</Text>
                <Ionicons name="arrow-forward" size={15} color="#fff" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{ uri: heroTour.image }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(4,13,14,0.12)', 'rgba(4,13,14,0.86)']}
          style={styles.heroOverlay}
        >
          <View style={styles.heroTop}>
            <Text style={styles.brandText}>TravelViet</Text>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles-outline" size={14} color="#fff" />
              <Text style={styles.heroBadgeText}>Signature tours</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.greeting}>Xin chào, Trứ!</Text>
            <Text style={styles.subtitle}>Bạn muốn đi đâu hôm nay?</Text>
            <Text style={styles.heroDescription}>
              Chọn điểm đến, xem thời tiết, giữ chỗ nhanh và theo dõi hành trình
              ngay trong một màn hình.
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.searchPanel}>
        <Searchbar
          placeholder="Tìm tour, địa điểm, trải nghiệm..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#087f9c"
        />
        <View style={styles.quickBookingGrid}>
          <View style={styles.quickBookingItem}>
            <Ionicons name="map-outline" size={18} color="#087f9c" />
            <View>
              <Text style={styles.quickLabel}>Điểm đến</Text>
              <Text style={styles.quickValue}>Tất cả</Text>
            </View>
          </View>
          <View style={styles.quickBookingItem}>
            <Ionicons name="calendar-outline" size={18} color="#087f9c" />
            <View>
              <Text style={styles.quickLabel}>Ngày đi</Text>
              <Text style={styles.quickValue}>Linh hoạt</Text>
            </View>
          </View>
          <View style={styles.quickBookingItem}>
            <Ionicons name="people-outline" size={18} color="#087f9c" />
            <View>
              <Text style={styles.quickLabel}>Số khách</Text>
              <Text style={styles.quickValue}>2 người</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsStrip}>
        {HOME_STATS.map((item) => (
          <View style={styles.statItem} key={item.label}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((item) => {
            const isActive = selectedCategory === item;

            return (
              <Chip
                key={item}
                style={[styles.chip, isActive && styles.chipActive]}
                textStyle={[styles.chipText, isActive && styles.chipTextActive]}
                onPress={() => setSelectedCategory(item)}
              >
                {item}
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.weatherPanel}>
        <View style={styles.weatherIconWrap}>
          <Ionicons name="cloudy-night-outline" size={22} color="#087f9c" />
        </View>
        <View style={styles.weatherCopy}>
          <Text style={styles.panelTitle}>Cập nhật thời tiết và mật độ</Text>
          <Text style={styles.panelText}>
            Mobile đã bổ sung lớp cảnh báo giống web để khách chọn lịch trình
            an toàn hơn trước khi giữ chỗ.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Điểm đến nổi bật</Text>
        <Text style={styles.sectionTitle}>Chọn cảm hứng cho chuyến đi</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationRail}
      >
        {DESTINATIONS_DATA.map((destination) => (
          <ImageBackground
            key={destination.id}
            source={{ uri: destination.image }}
            style={styles.destinationCard}
            imageStyle={styles.destinationImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.76)']}
              style={styles.destinationOverlay}
            >
              <Text style={styles.destinationRegion}>{destination.region}</Text>
              <View>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationTours}>{destination.tours}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        ))}
      </ScrollView>

      {filteredTours.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={34} color="#606c38" />
          <Text style={styles.emptyTitle}>Không tìm thấy tour phù hợp</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory(ALL_CATEGORY);
            }}
          >
            <Text style={styles.resetButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Gói tour đề xuất</Text>
            <Text style={styles.sectionTitle}>Lịch trình sẵn sàng để giữ chỗ</Text>
          </View>

          <View style={styles.featuredList}>
            {featuredTours.map((tour) => renderTourCard(tour, true))}
          </View>

          {regularTours.length > 0 && (
            <>
              <View style={styles.sectionHeaderCompact}>
                <Text style={styles.sectionTitleSmall}>Tất cả tour</Text>
                <Text style={styles.resultCount}>
                  {filteredTours.length}/{TOURS_DATA.length} tour
                </Text>
              </View>
              <View style={styles.tourList}>
                {regularTours.map((tour) => renderTourCard(tour))}
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}
