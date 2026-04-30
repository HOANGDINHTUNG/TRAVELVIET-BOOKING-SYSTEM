import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WeatherNoticeCard } from '../../components/WeatherNoticeCard';
import { SERVICE_ITEMS, TOURS_DATA } from '../../constants/Tours';
import { styles } from './tour-detail.styles';

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const tour = TOURS_DATA.find((item) => item.id === id);

  if (!tour) {
    return (
      <View style={styles.emptyPage}>
        <Ionicons name="compass-outline" size={34} color="#606c38" />
        <Text style={styles.emptyTitle}>Không tìm thấy thông tin tour</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
          <Text style={styles.emptyButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={{ uri: tour.image }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(6,16,18,0.16)', 'rgba(6,16,18,0.9)']}
            style={styles.heroOverlay}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#283618" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setIsFavorite((value) => !value)}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? '#bc6c25' : '#283618'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{tour.category}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Ionicons name="partly-sunny-outline" size={14} color="#fff" />
                  <Text style={styles.heroBadgeText}>{tour.weather}</Text>
                </View>
              </View>
              <Text style={styles.title}>{tour.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#e9f5ef" />
                <Text style={styles.locationText}>{tour.location}</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.engagementPanel}>
            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={22} color="#dda15e" />
              <View>
                <Text style={styles.ratingValue}>{tour.rating.toFixed(1)}</Text>
                <Text style={styles.ratingLabel}>{tour.reviewCount} đánh giá</Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Giá từ</Text>
              <Text style={styles.priceValue}>{tour.price}</Text>
            </View>
          </View>

          <WeatherNoticeCard
            destinationUuid={tour.destinationUuid}
            destinationId={tour.destinationId}
            destinationName={tour.destinationName}
            variant="detail"
          />

          <View style={styles.factGrid}>
            <View style={styles.factItem}>
              <Ionicons name="calendar-outline" size={18} color="#087f9c" />
              <Text style={styles.factLabel}>Thời gian</Text>
              <Text style={styles.factValue}>{tour.days}</Text>
            </View>
            <View style={styles.factItem}>
              <Ionicons name="map-outline" size={18} color="#087f9c" />
              <Text style={styles.factLabel}>Khu vực</Text>
              <Text style={styles.factValue}>{tour.category}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>Tổng quan</Text>
            <Text style={styles.sectionTitle}>Lý do nên chọn hành trình này</Text>
            <Text style={styles.description}>{tour.description}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitleSmall}>Điểm nhấn</Text>
            {tour.highlights.map((highlight) => (
              <View style={styles.highlightItem} key={highlight}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#087f9c" />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>Lịch trình</Text>
            <Text style={styles.sectionTitle}>Các chặng chính</Text>
            <View style={styles.itineraryList}>
              {tour.itinerary.map((item) => (
                <View style={styles.itineraryItem} key={item.day}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{item.day}</Text>
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryTitle}>{item.title}</Text>
                    <Text style={styles.itineraryDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitleSmall}>Dịch vụ đi kèm</Text>
            <View style={styles.serviceGrid}>
              {SERVICE_ITEMS.map((service) => (
                <View style={styles.serviceItem} key={service}>
                  <Ionicons name="shield-checkmark-outline" size={17} color="#087f9c" />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Tổng từ</Text>
          <Text style={styles.bottomPrice}>{tour.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({ pathname: '/checkout/[id]', params: { id: tour.id } })
          }
        >
          <Text style={styles.bookButtonText}>Đặt tour ngay</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
