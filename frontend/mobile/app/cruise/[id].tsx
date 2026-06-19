import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/tour-detail.styles";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { MOCK_CRUISES } from "../cruises";
import { SERVICE_ITEMS_DATA } from "../../constants/Tours";

const CRUISE_DETAILS: Record<
  string,
  {
    highlightsVi: string[];
    highlightsEn: string[];
    itineraryVi: { day: string; title: string; description: string }[];
    itineraryEn: { day: string; title: string; description: string }[];
    descriptionVi: string;
    descriptionEn: string;
    weather: string;
    daysVi: string;
    daysEn: string;
  }
> = {
  c1: {
    highlightsVi: [
      "Du thuyền 5★ sang trọng hàng đầu",
      "Bể bơi vô cực tràn viền ngoài trời",
      "Ban công riêng ngắm vịnh từ phòng ngủ",
      "Trải nghiệm chèo kayak & tắm biển miễn phí",
    ],
    highlightsEn: [
      "Top luxury 5-star cruise service",
      "Outdoor infinity swimming pool",
      "Private balcony with spectacular bay views",
      "Free kayaking & swimming sessions",
    ],
    itineraryVi: [
      {
        day: "Ngày 1",
        title: "Hà Nội - Vịnh Hạ Long",
        description:
          "Đón khách từ Hà Nội, làm thủ tục nhận phòng cabin hạng sang. Ăn trưa buffet hải sản và du ngoạn ngắm vịnh Hạ Long kỳ vĩ.",
      },
      {
        day: "Ngày 2",
        title: "Vịnh Lan Hạ - Hà Nội",
        description:
          "Tập dưỡng sinh Thái Cực Quyền đón bình minh. Chèo thuyền kayak khám phá Hang Sáng Tối trước khi làm thủ tục trả phòng và trở về.",
      },
    ],
    itineraryEn: [
      {
        day: "Day 1",
        title: "Hanoi - Halong Bay",
        description:
          "Depart from Hanoi, check into your luxury cabin. Enjoy a seafood buffet lunch while cruising past majestic limestone islands.",
      },
      {
        day: "Day 2",
        title: "Lan Ha Bay - Hanoi",
        description:
          "Start your day with a Tai Chi session at sunrise. Explore Dark & Bright Cave by kayak before checking out and returning.",
      },
    ],
    descriptionVi:
      "Du thuyền Signature Halong Cruise mang đến hành trình nghỉ dưỡng 5 sao hoàn hảo, kết hợp giữa sự sang trọng cổ điển và tiện ích hiện đại để khám phá vẻ đẹp hoang sơ của Vịnh Hạ Long và Vịnh Lan Hạ.",
    descriptionEn:
      "Signature Halong Cruise offers a perfect 5-star resort journey, combining classic luxury and modern amenities to explore the pristine beauty of Halong Bay and Lan Ha Bay.",
    weather: "28°C - Nắng nhẹ",
    daysVi: "2 ngày 1 đêm",
    daysEn: "2 days 1 night",
  },
  c2: {
    highlightsVi: [
      "Thiết kế kiến trúc Đông Dương hoài cổ",
      "Triển lãm tranh nghệ thuật đặc sắc",
      "Trà chiều ngắm hoàng hôn trên boong tàu",
      "Dịch vụ spa & massage thư giãn cao cấp",
    ],
    highlightsEn: [
      "Indochine style boutique heritage design",
      "Exclusive floating fine art gallery",
      "Sunset afternoon tea on the top deck",
      "Premium wellness spa & massage therapies",
    ],
    itineraryVi: [
      {
        day: "Ngày 1",
        title: "Bến Tuần Châu - Vịnh Lan Hạ",
        description:
          "Lên du thuyền Bình Chuẩn, thưởng thức trà chiều hoàng hôn và ngắm cảnh vịnh Lan Hạ hoang sơ.",
      },
      {
        day: "Ngày 2",
        title: "Cát Bà - Hà Nội",
        description:
          "Tham quan làng chài cổ Việt Hải bằng xe đạp hoặc xe điện. Thưởng thức bữa trưa ẩm thực truyền thống trước khi tàu cập bến.",
      },
    ],
    itineraryEn: [
      {
        day: "Day 1",
        title: "Tuan Chau Harbor - Lan Ha Bay",
        description:
          "Board Binh Chuan Cruise. Enjoy sunset afternoon tea while taking in the serene and untamed Lan Ha Bay.",
      },
      {
        day: "Day 2",
        title: "Cat Ba Island - Hanoi",
        description:
          "Visit Viet Hai ancient village by bicycle or electric car. Taste traditional Vietnamese cuisine before checking out.",
      },
    ],
    descriptionVi:
      "Lấy cảm hứng từ con tàu của vua tàu thủy Bạch Thái Bưởi, Heritage Bình Chuẩn mang phong cách nghệ thuật Đông Dương độc bản, là hành trình văn hóa đầy tinh tế giữa lòng vịnh biển Lan Hạ.",
    descriptionEn:
      "Inspired by the historic ship of King of Ships Bach Thai Buoi, Heritage Binh Chuan features unique Indochine artistic styles, delivering an elegant cultural cruise in Lan Ha Bay.",
    weather: "27°C - Nhiều mây",
    daysVi: "2 ngày 1 đêm",
    daysEn: "2 days 1 night",
  },
  c3: {
    highlightsVi: [
      "Sân tắm nắng ngoài trời siêu rộng",
      "Nhạc sống piano lãng mạn tại quầy bar",
      "Thực đơn tiệc nướng hải sản cao cấp tối",
      "Bể sục Jacuzzi thư giãn ngoài trời",
    ],
    highlightsEn: [
      "Spacious outdoor sundeck for panoramic views",
      "Melodic live piano performance at the bar",
      "Sumptuous seafood BBQ dinner on board",
      "Relaxing outdoor Jacuzzi pool access",
    ],
    itineraryVi: [
      {
        day: "Ngày 1",
        title: "Cảng Tuần Châu - Vịnh Hạ Long",
        description:
          "Khởi hành từ Tuần Châu, ăn trưa buffet cao cấp. Chiều chèo thuyền kayak tại khu vực Hang Luồn hoang sơ.",
      },
      {
        day: "Ngày 2",
        title: "Đảo Titop - Về bến",
        description:
          "Chinh phục đỉnh núi đảo Titop ngắm toàn cảnh vịnh tuyệt đẹp, tắm biển tại bãi cát trắng mịn trước khi dùng bữa sáng muộn và trả phòng.",
      },
    ],
    itineraryEn: [
      {
        day: "Day 1",
        title: "Tuan Chau Port - Halong Bay",
        description:
          "Depart from Tuan Chau, savor a premium buffet lunch. Afternoon kayak at the pristine Luon Cave area.",
      },
      {
        day: "Day 2",
        title: "Titop Island - Disembark",
        description:
          "Climb Titop island peak for panoramic bay views, swim on the sandy beach, then enjoy brunch before disembarking.",
      },
    ],
    descriptionVi:
      "Paradise Elegance Cruise là biểu tượng của sự tinh tế và tráng lệ trên Vịnh Hạ Long. Du thuyền sở hữu cấu trúc sắt vững chắc và thiết kế nội thất hiện đại mang đẳng cấp thế giới.",
    descriptionEn:
      "Paradise Elegance Cruise is the epitome of sophistication and splendor on Halong Bay. The ship features a sleek steel design and world-class modern interiors.",
    weather: "29°C - Nắng đẹp",
    daysVi: "2 ngày 1 đêm",
    daysEn: "2 days 1 night",
  },
  c4: {
    highlightsVi: [
      "Du thuyền sang trọng bậc nhất Hạ Long",
      "Cầu kính check-in độc đáo ven vách tàu",
      "Bể sục Jacuzzi khổng lồ trên boong",
      "Đại nhạc hội sống động mỗi buổi tối",
    ],
    highlightsEn: [
      "One of Halong's largest luxury vessels",
      "Unique glass bridge check-in platform",
      "Gigantic outdoor Jacuzzi on the top deck",
      "Fascinating live music performance every evening",
    ],
    itineraryVi: [
      {
        day: "Ngày 1",
        title: "Hạ Long - Hang Sửng Sốt",
        description:
          "Nhận phòng cabin hạng sang, tham quan hang Sửng Sốt - hang động đẹp và lớn nhất trên vịnh Hạ Long.",
      },
      {
        day: "Ngày 2",
        title: "Làng chài nổi Cửa Vạn - Về cảng",
        description:
          "Trải nghiệm đi đò nan tham quan làng chài nổi cổ kính, khám phá đời sống ngư dân địa phương trước khi làm thủ tục trả phòng.",
      },
    ],
    itineraryEn: [
      {
        day: "Day 1",
        title: "Halong Bay - Sung Sot Cave",
        description:
          "Check into your high-end cabin, then explore Sung Sot Cave - the largest and most spectacular cave in Halong Bay.",
      },
      {
        day: "Day 2",
        title: "Cua Van Floating Village - Disembark",
        description:
          "Experience a bamboo rowing boat through the ancient floating village, discovering local fisherman life before checkout.",
      },
    ],
    descriptionVi:
      "Ambassador Cruise tự hào là du thuyền nghỉ dưỡng 5 sao lớn nhất và hiện đại bậc nhất vịnh Hạ Long, đem lại hải trình giải trí sôi động và ẩm thực thượng hạng cho du khách.",
    descriptionEn:
      "Ambassador Cruise is proud to be the largest and most modern 5-star cruise in Halong Bay, offering dynamic entertainment programs and top-notch culinary experiences.",
    weather: "30°C - Nắng",
    daysVi: "2 ngày 1 đêm",
    daysEn: "2 days 1 night",
  },
};

export default function CruiseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeService, setActiveService] = useState<{
    title: string;
    desc: string;
    icon: string;
  } | null>(null);

  const cruise = MOCK_CRUISES.find((item) => item.id === id);
  const detail = id ? CRUISE_DETAILS[id] : null;

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

  if (!cruise || !detail) {
    return (
      <View style={dynamicStyles.emptyPage}>
        <Ionicons
          name="compass-outline"
          size={34}
          color={isDark ? "#2DD4BF" : "#606c38"}
        />
        <Text style={dynamicStyles.emptyTitle}>
          {t("bookings_no_trips", "Không tìm thấy thông tin du thuyền")}
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

  const highlights =
    language === "vi" ? detail.highlightsVi : detail.highlightsEn;
  const itinerary = language === "vi" ? detail.itineraryVi : detail.itineraryEn;
  const description =
    language === "vi" ? detail.descriptionVi : detail.descriptionEn;
  const days = language === "vi" ? detail.daysVi : detail.daysEn;

  return (
    <View style={dynamicStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={{ uri: cruise.image }}
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
                    {t("cruises_title", "Du thuyền")}
                  </Text>
                </View>
                <View style={styles.heroBadge}>
                  <Ionicons
                    name="partly-sunny-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.heroBadgeText}>{detail.weather}</Text>
                </View>
              </View>
              <Text style={styles.title}>{cruise.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#e9f5ef" />
                <Text style={styles.locationText}>{cruise.route}</Text>
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
                  {cruise.stars.toFixed(1)}
                </Text>
                <Text style={dynamicStyles.ratingLabel}>
                  {cruise.reviewCount} {t("cruises_rating", "đánh giá")}
                </Text>
              </View>
            </View>
            <View style={styles.priceBlock}>
              <Text style={dynamicStyles.priceLabel}>
                {t("cruises_price_from", "Giá từ")}
              </Text>
              <Text style={styles.priceValue}>
                {formatPrice(cruise.priceNum)}
              </Text>
            </View>
          </View>

          <View style={styles.factGrid}>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="calendar-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>
                {t("duration", "Thời gian")}
              </Text>
              <Text style={dynamicStyles.factValue}>{days}</Text>
            </View>
            <View style={dynamicStyles.factItem}>
              <Ionicons name="map-outline" size={18} color="#087f9c" />
              <Text style={dynamicStyles.factLabel}>
                {t("explore_region_prefix", "Khu vực")}
              </Text>
              <Text style={dynamicStyles.factValue}>
                {cruise.routeKey === "lanha" ? "Vịnh Lan Hạ" : "Vịnh Hạ Long"}
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
            <Text style={dynamicStyles.description}>{description}</Text>
          </View>

          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitleSmall}>
              {t("tour_details", "Điểm nhấn")}
            </Text>
            {highlights.map((highlight) => (
              <View style={styles.highlightItem} key={highlight}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#087f9c"
                />
                <Text style={dynamicStyles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionKicker}>
              {t("tour_program", "Lịch trình")}
            </Text>
            <Text style={dynamicStyles.sectionTitle}>
              {t("tour_itinerary", "Các chặng chính")}
            </Text>
            <View style={styles.itineraryList}>
              {itinerary.map((item) => (
                <View style={styles.itineraryItem} key={item.day}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{item.day}</Text>
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
            {formatPrice(cruise.priceNum)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: "/checkout/[id]",
              params: { id: cruise.id },
            })
          }
        >
          <Text style={styles.bookButtonText}>
            {t("cruises_book_now", "Đặt cabin")}
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
