import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SERVICE_ITEMS_DATA } from "../../constants/Tours";
import { styles } from "@/styles/tour-detail.styles";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { fetchTourDetails, TourResponse } from "@/services/toursApi";

const parsePrice = (priceStr: string): number => {
  const digits = priceStr.replace(/\D/g, "");
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

  const [tour, setTour] = useState<TourResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchTourDetails(id)
      .then((res) => {
        if (active && res.data) {
          setTour(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === "dark";

  const dynamicStyles = {
    container: [styles.container, isDark && { backgroundColor: "#0F172A" }],
    engagementPanel: [
      styles.engagementPanel,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    ratingValue: [styles.ratingValue, isDark && { color: "#F1F5F9" }],
    ratingLabel: [styles.ratingLabel, isDark && { color: "#94A3B8" }],
    priceLabel: [styles.priceLabel, isDark && { color: "#94A3B8" }],
    factItem: [
      styles.factItem,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    factLabel: [styles.factLabel, isDark && { color: "#94A3B8" }],
    factValue: [styles.factValue, isDark && { color: "#F1F5F9" }],
    sectionTitle: [styles.sectionTitle, isDark && { color: "#F1F5F9" }],
    sectionTitleSmall: [
      styles.sectionTitleSmall,
      isDark && { color: "#F1F5F9" },
    ],
    description: [styles.description, isDark && { color: "#94A3B8" }],
    highlightText: [styles.highlightText, isDark && { color: "#F1F5F9" }],
    itineraryContent: [
      styles.itineraryContent,
      isDark && { borderBottomColor: "#334155" },
    ],
    itineraryTitle: [styles.itineraryTitle, isDark && { color: "#F1F5F9" }],
    itineraryDescription: [
      styles.itineraryDescription,
      isDark && { color: "#94A3B8" },
    ],
    serviceItem: [
      styles.serviceItem,
      isDark && { backgroundColor: "rgba(45, 212, 191, 0.12)" },
    ],
    serviceText: [styles.serviceText, isDark && { color: "#F1F5F9" }],
    bottomBar: [
      styles.bottomBar,
      isDark && { backgroundColor: "#1E293B", borderTopColor: "#334155" },
    ],
    bottomLabel: [styles.bottomLabel, isDark && { color: "#94A3B8" }],
    bottomPrice: [styles.bottomPrice, isDark && { color: "#F1F5F9" }],
    sectionCard: [
      styles.sectionCard,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    emptyPage: [styles.emptyPage, isDark && { backgroundColor: "#0F172A" }],
    emptyTitle: [styles.emptyTitle, isDark && { color: "#F1F5F9" }],
  };

  if (loading) {
    return (
      <View
        style={[
          dynamicStyles.emptyPage,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF5B22" />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={dynamicStyles.emptyPage}>
        <Ionicons
          name="compass-outline"
          size={34}
          color={isDark ? "#2DD4BF" : "#606c38"}
        />
        <Text style={dynamicStyles.emptyTitle}>
          {t("bookings_no_trips", "Không tìm thấy thông tin tour")}
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.back()}
        >
          <Text style={styles.emptyButtonText}>{t("logout", "Quay lại")}</Text>
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
          source={{
            uri:
              tour.media?.[0]?.url ||
              tour.thumbnailUrl ||
              "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800",
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={["rgba(6,16,18,0.16)", "rgba(6,16,18,0.9)"]}
            style={styles.heroOverlay}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color="#283618" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setIsFavorite((value) => !value)}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite ? "#bc6c25" : "#283618"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>
                    {tour.destinations?.[0]?.destinationName?.includes(
                      "Việt Nam",
                    )
                      ? "Trong nước"
                      : "Tour"}
                  </Text>
                </View>
                <View style={styles.heroBadge}>
                  <Ionicons
                    name="partly-sunny-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.heroBadgeText}>{"28°C Haze"}</Text>
                </View>
              </View>
              <Text style={styles.title}>{tour.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#e9f5ef" />
                <Text style={styles.locationText}>
                  {tour.destinations?.[0]?.destinationName || "Vietnam"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <View style={dynamicStyles.engagementPanel}>
            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={22} color="#FFB800" />
              <View>
                <Text style={dynamicStyles.ratingValue}>
                  {tour.averageRating?.toFixed(1) || "5.0"}
                </Text>
                <Text style={dynamicStyles.ratingLabel}>
                  {tour.totalReviews || 0} {t("rating", "đánh giá")}
                </Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={dynamicStyles.priceLabel}>
                {t("tour_price", "Giá từ")}
              </Text>
              <Text style={styles.priceValue}>
                {formatPrice(tour.basePrice)}
              </Text>
            </View>
          </View>

          <View style={styles.factGrid}>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="calendar-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>
                {t("duration", "Thời gian")}
              </Text>
              <Text style={dynamicStyles.factValue}>
                {tour.durationDays}N {tour.durationNights}Đ
              </Text>
            </View>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="map-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>
                {t("explore_region_prefix", "Khu vực")}
              </Text>
              <Text style={dynamicStyles.factValue}>
                {tour.destinations?.[0]?.destinationName || "Various"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>
              {t("tour_info", "Tổng quan")}
            </Text>
            <Text style={dynamicStyles.sectionTitle}>
              {t("tour_description", "Lý do nên chọn hành trình này")}
            </Text>
            <Text style={dynamicStyles.description}>{tour.description}</Text>
          </View>

          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitleSmall}>
              {t("tour_details", "Điểm nhấn")}
            </Text>
            <Text style={[dynamicStyles.description, { marginHorizontal: 16 }]}>
              {tour.highlights || "Không có điểm nhấn nào."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>
              {t("tour_program", "Lịch trình")}
            </Text>
            <Text style={dynamicStyles.sectionTitle}>
              {t("tour_itinerary", "Các chặng chính")}
            </Text>
            <View style={styles.itineraryList}>
              {tour.itineraryDays?.map((item) => (
                <View style={styles.itineraryItem} key={item.dayNumber}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>
                      Ngày {item.dayNumber}
                    </Text>
                  </View>
                  <View style={dynamicStyles.itineraryContent}>
                    <Text style={dynamicStyles.itineraryTitle}>
                      {item.title}
                    </Text>
                    <Text style={dynamicStyles.itineraryDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitleSmall}>
              {t("additional_services", "Dịch vụ đi kèm")}
            </Text>
            <View style={styles.serviceGrid}>
              {SERVICE_ITEMS_DATA.map((service) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={dynamicStyles.serviceItem}
                  key={service.key}
                  onPress={() =>
                    setActiveService({
                      title:
                        language === "vi" ? service.titleVi : service.titleEn,
                      desc: language === "vi" ? service.descVi : service.descEn,
                      icon: service.icon,
                    })
                  }
                >
                  <Ionicons
                    name={service.icon as any}
                    size={17}
                    color="#087f9c"
                  />
                  <Text style={dynamicStyles.serviceText}>
                    {language === "vi" ? service.titleVi : service.titleEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={dynamicStyles.bottomBar}>
        <View>
          <Text style={dynamicStyles.bottomLabel}>
            {t("price_from", "Tổng từ")}
          </Text>
          <Text style={dynamicStyles.bottomPrice}>
            {formatPrice(tour.basePrice)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: "/checkout/[id]",
              params: {
                id: tour.id,
                scheduleId: tour.nextOpenSchedule?.scheduleId,
              },
            })
          }
        >
          <Text style={styles.bookButtonText}>
            {t("tour_book_now", "Đặt tour ngay")}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={activeService !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveService(null)}
      >
        <Pressable
          style={modalStyles.backdrop}
          onPress={() => setActiveService(null)}
        >
          <Pressable
            style={[modalStyles.modalCard, isDark && modalStyles.modalCardDark]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[
                modalStyles.iconContainer,
                isDark && modalStyles.iconContainerDark,
              ]}
            >
              <Ionicons
                name={
                  (activeService?.icon as any) || "shield-checkmark-outline"
                }
                size={32}
                color={isDark ? "#2DD4BF" : "#087f9c"}
              />
            </View>
            <Text
              style={[
                modalStyles.modalTitle,
                isDark && modalStyles.modalTitleDark,
              ]}
            >
              {activeService?.title}
            </Text>
            <Text
              style={[
                modalStyles.modalDesc,
                isDark && modalStyles.modalDescDark,
              ]}
            >
              {activeService?.desc}
            </Text>
            <TouchableOpacity
              style={[modalStyles.closeBtn, isDark && modalStyles.closeBtnDark]}
              onPress={() => setActiveService(null)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  modalStyles.closeBtnText,
                  isDark && modalStyles.closeBtnTextDark,
                ]}
              >
                {t("assistant_close", "Đóng")}
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    borderWidth: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(8, 127, 156, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconContainerDark: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
    textAlign: "center",
  },
  modalTitleDark: {
    color: "#F1F5F9",
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  modalDescDark: {
    color: "#94A3B8",
  },
  closeBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#087f9c",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnDark: {
    backgroundColor: "#2DD4BF",
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  closeBtnTextDark: {
    color: "#0F172A",
  },
});
