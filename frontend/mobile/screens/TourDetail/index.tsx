import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createTourDetailStyles } from './styles';
import { Tour } from '@/types/Tour';
import { Colors } from '@/constants/theme';

interface TourDetailProps {
  route: any;
  navigation: any;
}

// Mock tour data - được truyền từ Home screen
const MOCK_DETAILED_TOUR: Tour = {
  id: '1',
  name: 'Hà Nội - Hạ Long Bay 3 Ngày 2 Đêm',
  description:
    'Khám phá vẻ đẹp tuyệt vời của vịnh Hạ Long - di sản thế giới UNESCO. Chương trình du lịch 3 ngày 2 đêm sẽ đưa bạn tham quan các hang động kỳ bí, đảo Titop, và trải nghiệm đời sống ngư dân trên vịnh. Đây là hành trình không thể bỏ lỡ khi đến Việt Nam.',
  imageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
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
  highlights: [
    'Vịnh Hạ Long - Di sản thế giới UNESCO',
    'Hang động Sơn Đông với những stalagmite độc đáo',
    'Đảo Titop với view panorama tuyệt đẹp',
    'Cảm nhận đời sống ngư dân trên sông nước',
    'Ăn hải sản tươi ngon tại bè nổi',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Hà Nội - Hạ Long',
      description:
        'Khởi hành sáng từ Hà Nội, đi qua đảo Cát Bà, tới bè du lịch trên vịnh Hạ Long vào chiều. Ăn tối tại bè và ngủ đêm trên vịnh.',
      locations: ['Hà Nội', 'Hạ Long', 'Bè nổi'],
    },
    {
      day: 2,
      title: 'Vịnh Hạ Long - Hang Sơn Đông',
      description:
        'Tham quan các hang động nổi tiếng như Hang Sơn Đông, Hang Trinh Nữ. Trèo lên Đảo Titop ngắm cảnh vịnh toàn cảnh. Ăn hải sản tươi ngon tại bè.',
      locations: ['Hang Sơn Đông', 'Đảo Titop', 'Bè nổi'],
    },
    {
      day: 3,
      title: 'Hạ Long - Hà Nội',
      description:
        'Sáng ăn sáng trên vịnh, thăm chợ nổi Cái Bè. Trở về Hà Nội vào chiều tối.',
      locations: ['Hạ Long', 'Chợ nổi Cái Bè', 'Hà Nội'],
    },
  ],
};

const REVIEWS = [
  {
    id: '1',
    name: 'Nguyễn Thị A',
    rating: 5,
    date: '2024-05-15',
    text: 'Tour rất tuyệt vời! Hướng dẫn viên thân thiện, tổ chức chặt chẽ. Hạ Long thực sự đẹp lắm.',
  },
  {
    id: '2',
    name: 'Trần Văn B',
    rating: 4.5,
    date: '2024-05-10',
    text: 'Chuyến đi hay, các bạn hướng dẫn nhiệt tình. Chỉ tiếc là thời gian quá ngắn.',
  },
  {
    id: '3',
    name: 'Lê Thị C',
    rating: 5,
    date: '2024-05-01',
    text: 'Tuyệt vời! Đồ ăn ngon, bè sạch sẽ, mọi người rất vui.',
  },
];

export default function TourDetailScreen({ route, navigation }: TourDetailProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createTourDetailStyles(isDark);
  const themeColors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get tour data from route params or use mock
  const tour: Tour = route?.params?.tour || MOCK_DETAILED_TOUR;

  const handleBooking = () => {
    navigation.navigate('Checkout', {
      tour,
      selectedCount: {
        adults: 1,
        children: 0,
      },
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercentage = tour.originalPrice
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0;

  // Render rating stars
  const renderStars = (rating: number) => {
    return (
      <View style={styles.ratingStars}>
        {[...Array(5)].map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name={i < Math.floor(rating) ? 'star' : 'star-outline'}
            size={12}
            color="#FFB800"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View
        style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleGoBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleFavorite}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#E74C3C' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: tour.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Pagination Dots */}
          <View style={styles.imagePagination}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.tourName}>{tour.name}</Text>

            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={themeColors.icon}
              />
              <Text style={styles.locationText}>{tour.location.name}</Text>
            </View>

            {/* Rating Row */}
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                {renderStars(tour.rating)}
                <Text style={styles.ratingScore}>
                  {tour.rating.toFixed(1)}
                </Text>
                <Text style={styles.reviewCount}>
                  ({tour.reviewCount} đánh giá)
                </Text>
              </View>

              <Text style={styles.metaValue}>
                {tour.currentParticipants}/{tour.maxParticipants} người
              </Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>{formatPrice(tour.price)}</Text>
            {tour.originalPrice && (
              <>
                <Text style={styles.originalPrice}>
                  {formatPrice(tour.originalPrice)}
                </Text>
                <Text style={styles.discount}>-{discountPercentage}%</Text>
              </>
            )}
            <Text style={styles.priceUnit}>/người</Text>
          </View>

          {/* Duration & Participants */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="calendar-range"
                size={18}
                color={themeColors.tint}
              />
              <View>
                <Text style={styles.metaLabel}>Thời gian</Text>
                <Text style={styles.metaValue}>{tour.duration} ngày</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={18}
                color={themeColors.tint}
              />
              <View>
                <Text style={styles.metaLabel}>Thời tiết</Text>
                <Text style={styles.metaValue}>
                  {tour.weather?.temperature}°C
                </Text>
              </View>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlightsSection}>
            <Text style={styles.sectionTitle}>✨ Điểm nhấn</Text>
            <View style={styles.highlightsList}>
              {tour.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.highlightBullet}>•</Text>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>📝 Mô tả</Text>
            <Text style={styles.descriptionText}>{tour.description}</Text>
          </View>

          {/* Itinerary */}
          <View style={styles.itinerarySection}>
            <Text style={styles.sectionTitle}>🗺️ Lộ trình</Text>
            <View style={styles.itineraryList}>
              {tour.itinerary.map((item) => (
                <View key={item.day} style={styles.itineraryItem}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>Ngày {item.day}</Text>
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryTitle}>{item.title}</Text>
                    <Text style={styles.itineraryDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.itineraryLocations}>
                      📍 {item.locations.join(' → ')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>⭐ Đánh giá từ khách</Text>
            <View style={styles.reviewsList}>
              {REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={{ marginBottom: 6 }}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + 12 },
        ]}
      >
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>🎫 Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
