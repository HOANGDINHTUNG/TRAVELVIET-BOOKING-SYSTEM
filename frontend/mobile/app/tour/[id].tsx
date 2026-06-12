import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SERVICE_ITEMS_DATA, TOURS_DATA } from '../../constants/Tours';
import { styles } from './tour-detail.styles';
import { useAppSettings } from '@/providers/AppSettingsProvider';

const parsePrice = (priceStr: string): number => {
  const digits = priceStr.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
};

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeService, setActiveService] = useState<{
    title: string;
    desc: string;
    icon: string;
  } | null>(null);
  const tour = TOURS_DATA.find((item) => item.id === id);

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === 'dark';

  const dynamicStyles = {
    container: [styles.container, isDark && { backgroundColor: '#0F172A' }],
    engagementPanel: [styles.engagementPanel, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }],
    ratingValue: [styles.ratingValue, isDark && { color: '#F1F5F9' }],
    ratingLabel: [styles.ratingLabel, isDark && { color: '#94A3B8' }],
    priceLabel: [styles.priceLabel, isDark && { color: '#94A3B8' }],
    factItem: [styles.factItem, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }],
    factLabel: [styles.factLabel, isDark && { color: '#94A3B8' }],
    factValue: [styles.factValue, isDark && { color: '#F1F5F9' }],
    sectionTitle: [styles.sectionTitle, isDark && { color: '#F1F5F9' }],
    sectionTitleSmall: [styles.sectionTitleSmall, isDark && { color: '#F1F5F9' }],
    description: [styles.description, isDark && { color: '#94A3B8' }],
    highlightText: [styles.highlightText, isDark && { color: '#F1F5F9' }],
    itineraryContent: [styles.itineraryContent, isDark && { borderBottomColor: '#334155' }],
    itineraryTitle: [styles.itineraryTitle, isDark && { color: '#F1F5F9' }],
    itineraryDescription: [styles.itineraryDescription, isDark && { color: '#94A3B8' }],
    serviceItem: [styles.serviceItem, isDark && { backgroundColor: 'rgba(45, 212, 191, 0.12)' }],
    serviceText: [styles.serviceText, isDark && { color: '#F1F5F9' }],
    bottomBar: [styles.bottomBar, isDark && { backgroundColor: '#1E293B', borderTopColor: '#334155' }],
    bottomLabel: [styles.bottomLabel, isDark && { color: '#94A3B8' }],
    bottomPrice: [styles.bottomPrice, isDark && { color: '#F1F5F9' }],
    sectionCard: [styles.sectionCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }],
    emptyPage: [styles.emptyPage, isDark && { backgroundColor: '#0F172A' }],
    emptyTitle: [styles.emptyTitle, isDark && { color: '#F1F5F9' }],
  };

  if (!tour) {
    return (
      <View style={dynamicStyles.emptyPage}>
        <Ionicons name="compass-outline" size={34} color={isDark ? '#2DD4BF' : '#606c38'} />
        <Text style={dynamicStyles.emptyTitle}>{t('bookings_no_trips', 'Không tìm thấy thông tin tour')}</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.back()}>
          <Text style={styles.emptyButtonText}>{t('logout', 'Quay lại')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
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
                  <Text style={styles.heroBadgeText}>
                    {language === 'vi' ? tour.category : (tour.category === 'Trong nước' ? 'Domestic' : 'International')}
                  </Text>
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
          <View style={dynamicStyles.engagementPanel}>
            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={22} color="#FFB800" />
              <View>
                <Text style={dynamicStyles.ratingValue}>{tour.rating.toFixed(1)}</Text>
                <Text style={dynamicStyles.ratingLabel}>{tour.reviewCount} {t('rating', 'đánh giá')}</Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={dynamicStyles.priceLabel}>{t('tour_price', 'Giá từ')}</Text>
              <Text style={styles.priceValue}>{formatPrice(parsePrice(tour.price))}</Text>
            </View>
          </View>

          <View style={styles.factGrid}>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="calendar-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>{t('duration', 'Thời gian')}</Text>
              <Text style={dynamicStyles.factValue}>{tour.days}</Text>
            </View>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="map-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>{t('explore_region_prefix', 'Khu vực')}</Text>
              <Text style={dynamicStyles.factValue}>
                {language === 'vi' ? tour.category : (tour.category === 'Trong nước' ? 'Domestic' : 'International')}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>{t('tour_info', 'Tổng quan')}</Text>
            <Text style={dynamicStyles.sectionTitle}>{t('tour_description', 'Lý do nên chọn hành trình này')}</Text>
            <Text style={dynamicStyles.description}>{tour.description}</Text>
          </View>

          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitleSmall}>{t('tour_details', 'Điểm nhấn')}</Text>
            {tour.highlights.map((highlight) => (
              <View style={styles.highlightItem} key={highlight}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#087f9c" />
                <Text style={dynamicStyles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>{t('tour_program', 'Lịch trình')}</Text>
            <Text style={dynamicStyles.sectionTitle}>{t('tour_itinerary', 'Các chặng chính')}</Text>
            <View style={styles.itineraryList}>
              {tour.itinerary.map((item) => (
                <View style={styles.itineraryItem} key={item.day}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{item.day}</Text>
                  </View>
                  <View style={dynamicStyles.itineraryContent}>
                    <Text style={dynamicStyles.itineraryTitle}>{item.title}</Text>
                    <Text style={dynamicStyles.itineraryDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitleSmall}>{t('additional_services', 'Dịch vụ đi kèm')}</Text>
            <View style={styles.serviceGrid}>
              {SERVICE_ITEMS_DATA.map((service) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={dynamicStyles.serviceItem}
                  key={service.key}
                  onPress={() =>
                    setActiveService({
                      title: language === 'vi' ? service.titleVi : service.titleEn,
                      desc: language === 'vi' ? service.descVi : service.descEn,
                      icon: service.icon,
                    })
                  }
                >
                  <Ionicons name={service.icon as any} size={17} color="#087f9c" />
                  <Text style={dynamicStyles.serviceText}>
                    {language === 'vi' ? service.titleVi : service.titleEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={dynamicStyles.bottomBar}>
        <View>
          <Text style={dynamicStyles.bottomLabel}>{t('price_from', 'Tổng từ')}</Text>
          <Text style={dynamicStyles.bottomPrice}>{formatPrice(parsePrice(tour.price))}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({ pathname: '/checkout/[id]', params: { id: tour.id } })
          }
        >
          <Text style={styles.bookButtonText}>{t('tour_book_now', 'Đặt tour ngay')}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={activeService !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveService(null)}
      >
        <Pressable style={modalStyles.backdrop} onPress={() => setActiveService(null)}>
          <Pressable
            style={[modalStyles.modalCard, isDark && modalStyles.modalCardDark]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[modalStyles.iconContainer, isDark && modalStyles.iconContainerDark]}>
              <Ionicons
                name={activeService?.icon as any || 'shield-checkmark-outline'}
                size={32}
                color={isDark ? '#2DD4BF' : '#087f9c'}
              />
            </View>
            <Text style={[modalStyles.modalTitle, isDark && modalStyles.modalTitleDark]}>
              {activeService?.title}
            </Text>
            <Text style={[modalStyles.modalDesc, isDark && modalStyles.modalDescDark]}>
              {activeService?.desc}
            </Text>
            <TouchableOpacity
              style={[modalStyles.closeBtn, isDark && modalStyles.closeBtnDark]}
              onPress={() => setActiveService(null)}
              activeOpacity={0.8}
            >
              <Text style={[modalStyles.closeBtnText, isDark && modalStyles.closeBtnTextDark]}>
                {t('assistant_close', 'Đóng')}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(8, 127, 156, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainerDark: {
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTitleDark: {
    color: '#F1F5F9',
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  modalDescDark: {
    color: '#94A3B8',
  },
  closeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#087f9c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#2DD4BF',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtnTextDark: {
    color: '#0F172A',
  },
});
