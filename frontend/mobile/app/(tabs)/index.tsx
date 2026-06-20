import React, { useMemo, useState, useRef, useEffect } from "react";
import { useScrollToTop } from "@react-navigation/native";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

import { VoiceSearchModal } from "@/components/ui/VoiceSearchModal";
import { styles } from "@/styles/index.styles";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { AppDrawer } from "@/components/ui/AppDrawer";
import { TOURS_DATA } from "@/constants/Tours";
import { fetchPublicTours, TourResponse } from "@/services/toursApi";
import { fetchMyVouchers, claimVoucher } from "@/services/promotionApi";
import { getAuthSession } from "@/services/authStorage";

interface Voucher {
  id: string;
  code: string;
  discountVi: string;
  discountEn: string;
  titleVi: string;
  titleEn: string;
  expiryVi: string;
  expiryEn: string;
  type: "tour" | "flight" | "hotel";
}

const MOCK_HOT_VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "THDTOUR200",
    discountVi: "Giảm 200K",
    discountEn: "200K OFF",
    titleVi: "Cho Tour Sa Pa, Hạ Long",
    titleEn: "For Sapa, Halong Tours",
    expiryVi: "Hạn: 30/06/2026",
    expiryEn: "Exp: 30/06/2026",
    type: "tour",
  },
  {
    id: "v2",
    code: "THDFLIGHT15",
    discountVi: "Giảm 15%",
    discountEn: "15% OFF",
    titleVi: "Cho vé máy bay đi Phú Quốc",
    titleEn: "For Phu Quoc Flights",
    expiryVi: "Hạn: 15/07/2026",
    expiryEn: "Exp: 15/07/2026",
    type: "flight",
  },
  {
    id: "v3",
    code: "THDHOTEL500",
    discountVi: "Giảm 500K",
    discountEn: "500K OFF",
    titleVi: "Cho khách sạn 4-5 sao",
    titleEn: "For 4-5 Star Hotels",
    expiryVi: "Hạn: 31/07/2026",
    expiryEn: "Exp: 31/07/2026",
    type: "hotel",
  },
];

const POPULAR_SUGGESTIONS = [
  { name: "Sa Pa", pinId: "pin1", icon: "trail-sign-outline" },
  { name: "Hạ Long", pinId: "pin3", icon: "boat-outline" },
  { name: "Phú Quốc", pinId: "pin9", icon: "sunny-outline" },
  { name: "Đà Lạt", pinId: "pin7", icon: "flower-outline" },
  { name: "Tokyo", pinId: "pin10", icon: "subway-outline" },
];

const MOCK_POPULAR_DESTINATIONS = [
  {
    id: "3", // maps to Phu Quoc details or similar
    name: "Santorini",
    region: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600",
  },
  {
    id: "2", // maps to Da Lat details
    name: "Bali",
    region: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600",
  },
  {
    id: "1", // maps to Mien Tay
    name: "Dubai",
    region: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600",
  },
];

const LAST_MINUTE_DEALS = [
  {
    id: "1",
    title: "Maldives Getaway",
    duration: "4 Days / 3 Nights",
    price: "13.120.000đ",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600",
  },
  {
    id: "2",
    title: "Swiss Adventure",
    duration: "5 Days / 4 Nights",
    price: "18.380.000đ",
    discount: "30% OFF",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
  },
];

const TOP_EXPERIENCES = [
  {
    id: "e1",
    name: "Beach Vibes",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400",
  },
  {
    id: "e2",
    name: "Mountain Hiking",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400",
  },
  {
    id: "e3",
    name: "City Tours",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400",
  },
  {
    id: "e4",
    name: "Hot Air Balloon",
    image:
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=400",
  },
];

const CUSTOMER_REVIEWS = [
  {
    id: "r1",
    name: "Nguyễn Văn Nam",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Khách hàng tour Hàn Quốc",
    rating: 5,
    comment:
      "Dịch vụ của THD rất chuyên nghiệp! Hướng dẫn viên nhiệt tình, chu đáo, lịch trình hợp lý. Khách sạn và đồ ăn đều tuyệt vời. Sẽ tiếp tục ủng hộ THD!",
  },
  {
    id: "r2",
    name: "Trần Thị Mai",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    role: "Khách hàng tour Phú Quốc",
    rating: 5,
    comment:
      "Tôi vừa có chuyến đi Phú Quốc 3N2Đ cùng gia đình qua THD. Mọi thứ từ xe đưa đón, resort đến ăn uống đều được chuẩn bị rất kỹ càng. Rất hài lòng!",
  },
  {
    id: "r3",
    name: "Lê Minh Hoàng",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
    role: "Khách hàng tour Nhật Bản",
    rating: 5,
    comment:
      "Tour Nhật Bản của THD thật sự chất lượng. Trải nghiệm tàu Shinkansen và ngắm Phú Sĩ rất tuyệt vời. Hướng dẫn viên am hiểu sâu sắc về văn hóa địa phương.",
  },
  {
    id: "r4",
    name: "Phạm Thanh Thủy",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
    role: "Khách hàng tour Thái Lan",
    rating: 5,
    comment:
      "Chuyến đi Thái Lan rất vui và nhiều kỷ niệm. THD hỗ trợ làm thủ tục nhanh chóng, giá tour cực kỳ cạnh tranh so với các bên khác. Đánh giá 5 sao!",
  },
];

function parsePrice(val: string): number {
  if (!val) return 0;
  const digits = val.replace(/\D/g, "");
  return parseInt(digits, 10) || 0;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const insets = useSafeAreaInsets();

  const scrollViewRef = useRef<ScrollView>(null);
  useScrollToTop(scrollViewRef);

  const { theme, language, formatPrice, t } = useAppSettings();
  const isDark = theme === "dark";

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);

  useEffect(() => {
    const loadClaimed = async () => {
      const session = getAuthSession();
      if (!session) return;
      try {
        const claims = await fetchMyVouchers();
        if (claims && Array.isArray(claims)) {
          const codes = claims.map((c) => c.voucherCode);
          setClaimedVouchers(codes);
        }
      } catch {}
    };
    loadClaimed();
  }, []);

  const handleClaimVoucher = async (voucherId: string, code: string) => {
    const session = getAuthSession();
    if (!session) {
      showSnackbar(
        language === "vi"
          ? "Vui lòng đăng nhập để nhận voucher."
          : "Please log in to claim vouchers.",
      );
      return;
    }
    if (claimedVouchers.includes(code)) return;
    try {
      await claimVoucher(code);
      const next = [...claimedVouchers, code];
      setClaimedVouchers(next);
      showSnackbar(
        language === "vi"
          ? `Nhận thành công mã: ${code}!`
          : `Successfully claimed code: ${code}!`,
      );
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "";
      showSnackbar(
        language === "vi"
          ? `Lỗi nhận voucher: ${errMsg}`
          : `Error claiming voucher: ${errMsg}`,
      );
    }
  };

  const [hotTours, setHotTours] = useState<TourResponse[]>([]);
  const [domesticTours, setDomesticTours] = useState<TourResponse[]>([]);
  const [internationalTours, setInternationalTours] = useState<TourResponse[]>(
    [],
  );
  const [isLoadingTours, setIsLoadingTours] = useState(true);

  // Fetch real tour data on mount
  useEffect(() => {
    let active = true;
    const loadTours = async () => {
      try {
        setIsLoadingTours(true);
        // We can fetch up to 10 latest tours concurrently
        const [hotRes, domRes, intRes] = await Promise.all([
          fetchPublicTours({ size: 5, sortDir: "desc" }),
          fetchPublicTours({ domesticOnly: true, size: 5 }),
          fetchPublicTours({ internationalOnly: true, size: 5 }),
        ]);
        if (active) {
          if (hotRes?.content) {
            setHotTours(hotRes.content);
          }
          if (domRes?.content) {
            setDomesticTours(domRes.content);
          }
          if (intRes?.content) {
            setInternationalTours(intRes.content);
          }
        }
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      } finally {
        if (active) setIsLoadingTours(false);
      }
    };
    loadTours();
    return () => {
      active = false;
    };
  }, []);

  const saleTours = useMemo(() => {
    // Generate sale tours purely from hot tours data to keep UI alive
    return hotTours.slice(0, 4).map((tour, idx) => {
      const discounts = ["20% OFF", "50% OFF", "15% OFF", "25% OFF"];
      const discount = discounts[idx % discounts.length];
      return {
        ...tour,
        discount,
        originalPrice: formatPrice(tour.basePrice * 1.25),
      };
    });
  }, [hotTours]);

  const topPurchasedTours = useMemo(() => {
    return domesticTours.slice(0, 4).map((tour, idx) => {
      const bookings = ["1.450+ lượt mua", "1.200+ lượt mua", "1.100+ lượt mua", "920+ lượt mua"];
      return {
        ...tour,
        bookingsCount: bookings[idx % bookings.length],
      };
    });
  }, [domesticTours]);

  // Unified search functionality
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return TOURS_DATA.filter((tour) => {
      return (
        tour.title.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.category.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handleCategoryPress = (category: string) => {
    if (category === "Hotels" || category === "Khách sạn") {
      router.push("/hotels");
    } else if (category === "Flights" || category === "Vé máy bay") {
      router.push("/flights");
    } else if (category === "Activities" || category === "Trải nghiệm") {
      router.push("/tours");
    } else if (category === "Transport" || category === "Di chuyển") {
      showSnackbar(
        language === "vi"
          ? "Đang mở dịch vụ di chuyển..."
          : "Opening transport services...",
      );
      router.push("/transport");
    }
  };

  const handleTourPress = (tourId: string | number) => {
    let targetId = String(tourId);
    if (targetId === "1")
      targetId = "3"; // Ha Long
    else if (tourId === "2")
      targetId = "2"; // Da Lat
    else if (tourId === "3") targetId = "4"; // Phu Quoc

    showSnackbar(
      language === "vi" ? "Mở chi tiết hành trình" : "Opening tour details",
    );
    router.push({ pathname: "/tour/[id]", params: { id: targetId } });
  };

  const renderTourCard = (tour: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      key={tour.id}
      onPress={() => handleTourPress(tour.id)}
      style={[
        styles.tourCard,
        isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
      ]}
    >
      <Image source={{ uri: tour.image }} style={styles.tourImage} />
      <View style={styles.tourDetails}>
        <Text
          style={[styles.tourTitle, isDark && { color: "#F1F5F9" }]}
          numberOfLines={1}
        >
          {tour.title}
        </Text>
        <Text style={[styles.tourMeta, isDark && { color: "#94A3B8" }]}>
          {tour.duration || tour.days}
        </Text>
      </View>
      <View style={styles.tourRight}>
        <Text style={styles.tourPrice}>
          {formatPrice(parsePrice(tour.price))}
        </Text>
        <TouchableOpacity
          style={[styles.tourBookBtn, isDark && { backgroundColor: "#451A03" }]}
          onPress={() => handleTourPress(tour.id)}
        >
          <Text style={styles.tourBookBtnText}>
            {t("book_now", "Đặt ngay")}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#0F172A" }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Santorini Header Background */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800",
          }}
          style={styles.heroImageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(15, 23, 42, 0.45)", "rgba(15, 23, 42, 0.98)"]
                : ["rgba(0, 0, 0, 0.25)", "rgba(255, 255, 255, 0.95)"]
            }
            style={styles.heroGradient}
          >
            {/* Top Header Row */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={[
                  styles.transparentButton,
                  isDark && {
                    backgroundColor: "rgba(30, 41, 59, 0.75)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setDrawerVisible(true)}
              >
                <Ionicons
                  name="menu-outline"
                  size={28}
                  color={isDark ? "#FFFFFF" : "#1E293B"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.transparentButton,
                  styles.notificationContainer,
                  isDark && {
                    backgroundColor: "rgba(30, 41, 59, 0.75)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 1,
                  },
                ]}
                onPress={() => router.push("/notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color={isDark ? "#FFFFFF" : "#1E293B"}
                />
                <View
                  style={[styles.badge, isDark && { borderColor: "#1E293B" }]}
                />
              </TouchableOpacity>
            </View>

            {/* Header Text Info */}
            <View style={styles.welcomeSection}>
              <Text style={[styles.titleLine1, isDark && { color: "#FFFFFF" }]}>
                {language === "vi"
                  ? "Khám phá\nThế giới"
                  : "Explore\nthe World"}
              </Text>
              <Text style={[styles.subtitle, isDark && { color: "#E2E8F0" }]}>
                {language === "vi"
                  ? "Khám phá những điểm đến biểu tượng và trải nghiệm khó quên."
                  : "Discover iconic places and unforgettable experiences."}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Search Bar Dummy Trigger */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => setIsSearchFocused(true)}
            style={[
              styles.searchBarWrapper,
              isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                showSnackbar(
                  language === "vi" ? "Đang mở bản đồ..." : "Opening map...",
                );
                router.push("/map");
              }}
              style={{ paddingRight: 8 }}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color="#FF5B22"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.searchPlaceholderText,
                isDark && { color: "#94A3B8" },
              ]}
            >
              {searchQuery ||
                (language === "vi"
                  ? "Bạn muốn đi đâu hôm nay?"
                  : "Where do you want to go?")}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{ marginRight: 8 }}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
            <View style={styles.searchButton}>
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {searchQuery.trim().length > 0 ? (
          /* Search results section */
          <View style={styles.toursSection}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, isDark && { color: "#FFFFFF" }]}
              >
                {language === "vi" ? "Kết quả tìm kiếm" : "Search Results"}
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.viewAllText}>
                  {language === "vi" ? "Xóa bộ lọc" : "Clear filter"}
                </Text>
              </TouchableOpacity>
            </View>

            {searchResults.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  isDark && {
                    backgroundColor: "#1E293B",
                    borderColor: "#334155",
                  },
                ]}
              >
                <Ionicons name="search-outline" size={34} color="#FF5B22" />
                <Text
                  style={[styles.emptyTitle, isDark && { color: "#F1F5F9" }]}
                >
                  {language === "vi"
                    ? "Không tìm thấy tour phù hợp"
                    : "No matching tours found"}
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => setSearchQuery("")}
                >
                  <Text style={styles.resetButtonText}>
                    {language === "vi" ? "Xem tất cả" : "View all"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tourList}>
                {searchResults.map((item) => renderTourCard(item as any))}
              </View>
            )}
          </View>
        ) : (
          /* Normal Home feed */
          <>
            {/* 4 Categories Row */}
            <View style={styles.categoriesSection}>
              <View style={styles.categoriesContainer}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress("Flights")}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <Ionicons
                      name="airplane-outline"
                      size={24}
                      color="#FF5B22"
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && { color: "#E2E8F0" },
                    ]}
                  >
                    {language === "vi" ? "Vé máy bay" : "Flights"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress("Hotels")}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <Ionicons name="bed-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && { color: "#E2E8F0" },
                    ]}
                  >
                    {language === "vi" ? "Khách sạn" : "Hotels"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress("Activities")}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <Ionicons name="star-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && { color: "#E2E8F0" },
                    ]}
                  >
                    {language === "vi" ? "Trải nghiệm" : "Activities"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress("Transport")}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <Ionicons name="car-outline" size={24} color="#FF5B22" />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && { color: "#E2E8F0" },
                    ]}
                  >
                    {language === "vi" ? "Di chuyển" : "Transport"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Voucher HOT Section */}
            <View style={styles.voucherSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Voucher HOT Hôm Nay"
                      : "Hot Vouchers Today"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/vouchers")}>
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.voucherScroll}
              >
                {MOCK_HOT_VOUCHERS.map((voucher) => {
                  const isClaimed = claimedVouchers.includes(voucher.code);
                  return (
                    <View
                      key={voucher.id}
                      style={[
                        styles.voucherCard,
                        isDark && styles.voucherCardDark,
                      ]}
                    >
                      {/* Left side: Discount */}
                      <View
                        style={[
                          styles.voucherLeft,
                          isDark && { backgroundColor: "#3B1A10" },
                        ]}
                      >
                        <Text style={styles.voucherDiscount}>
                          {language === "vi"
                            ? voucher.discountVi
                            : voucher.discountEn}
                        </Text>
                      </View>

                      {/* Divider line */}
                      <View
                        style={[
                          styles.voucherDivider,
                          isDark && styles.voucherDividerDark,
                        ]}
                      />

                      {/* Right side: details and claim button */}
                      <View style={styles.voucherRight}>
                        <Text
                          style={[
                            styles.voucherTitle,
                            isDark && { color: "#F1F5F9" },
                          ]}
                          numberOfLines={1}
                        >
                          {language === "vi"
                            ? voucher.titleVi
                            : voucher.titleEn}
                        </Text>
                        <Text
                          style={[
                            styles.voucherExpiry,
                            isDark && { color: "#94A3B8" },
                          ]}
                        >
                          {language === "vi"
                            ? voucher.expiryVi
                            : voucher.expiryEn}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.voucherBtn,
                            isClaimed && styles.voucherBtnClaimed,
                          ]}
                          activeOpacity={0.8}
                          onPress={() =>
                            handleClaimVoucher(voucher.id, voucher.code)
                          }
                          disabled={isClaimed}
                        >
                          <Text style={styles.voucherBtnText}>
                            {isClaimed
                              ? language === "vi"
                                ? "Đã nhận"
                                : "Claimed"
                              : language === "vi"
                                ? "Nhận ngay"
                                : "Claim"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Popular Destinations */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Điểm Đến Ưa Thích"
                      : "Popular Destinations"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "popular-destinations" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {MOCK_POPULAR_DESTINATIONS.map((destination) => (
                  <TouchableOpacity
                    key={destination.id}
                    activeOpacity={0.9}
                    style={styles.destinationCard}
                    onPress={() => handleTourPress(destination.id)}
                  >
                    <Image
                      source={{ uri: destination.image }}
                      style={styles.destinationImage}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.destGradient}
                    >
                      <Text style={styles.destName}>{destination.name}</Text>
                      <Text style={styles.destCountry}>
                        {destination.region}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Best Deals (List of Row Cards) */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi" ? "Ưu Đãi Tốt Nhất" : "Best Deals"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "best-deals" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tourList, { paddingHorizontal: 20 }]}>
                {LAST_MINUTE_DEALS.map((deal) => (
                  <TouchableOpacity
                    key={deal.id}
                    activeOpacity={0.9}
                    style={[
                      styles.tourCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(deal.id)}
                  >
                    <Image
                      source={{ uri: deal.image }}
                      style={styles.tourImage}
                    />

                    <View style={styles.tourDetails}>
                      <Text
                        style={[
                          styles.tourTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={1}
                      >
                        {deal.title}
                      </Text>
                      <Text
                        style={[
                          styles.tourMeta,
                          isDark && { color: "#94A3B8" },
                        ]}
                      >
                        {deal.duration}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        <Text style={styles.tourPrice}>
                          {formatPrice(parsePrice(deal.price))}
                        </Text>
                        <View style={styles.dealBadge}>
                          <Text style={styles.dealBadgeText}>
                            {deal.discount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Top Experiences */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Trải Nghiệm Hàng Đầu"
                      : "Top Experiences"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "top-experiences" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {TOP_EXPERIENCES.map((exp) => (
                  <TouchableOpacity
                    key={exp.id}
                    activeOpacity={0.9}
                    style={styles.destinationCard}
                    onPress={() =>
                      showSnackbar(
                        language === "vi"
                          ? `Xem trải nghiệm: ${exp.name}`
                          : `Viewing experience: ${exp.name}`,
                      )
                    }
                  >
                    <Image
                      source={{ uri: exp.image }}
                      style={styles.destinationImage}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.85)"]}
                      style={styles.destGradient}
                    >
                      <Text
                        style={[
                          styles.destName,
                          { fontSize: 13, textAlign: "center" },
                        ]}
                      >
                        {exp.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* HOT Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Tour HOT Bậc Nhất"
                      : "Super HOT Tours"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "hot-tours" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {hotTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[
                      styles.hotCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image
                      source={{
                        uri:
                          tour.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400",
                      }}
                      style={styles.hotCardImage}
                    />
                    <View style={styles.hotBadge}>
                      <Ionicons name="flame" size={12} color="#FFF" />
                      <Text style={styles.hotBadgeText}>HOT</Text>
                    </View>
                    <View style={styles.hotCardDetails}>
                      <Text
                        style={[
                          styles.hotCardTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={2}
                      >
                        {tour.name}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>
                          {formatPrice(tour.basePrice)}
                        </Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#FFB800" />
                          <Text
                            style={[
                              styles.hotCardRatingText,
                              isDark && { color: "#94A3B8" },
                            ]}
                          >
                            {tour.averageRating?.toFixed(1) || "5.0"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* SALE Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Khuyến Mãi Siêu Khủng"
                      : "Mega Sales & Deals"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "mega-sales" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {saleTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[
                      styles.hotCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image
                      source={{
                        uri:
                          tour.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600",
                      }}
                      style={styles.hotCardImage}
                    />
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>{tour.discount}</Text>
                    </View>
                    <View style={styles.hotCardDetails}>
                      <Text
                        style={[
                          styles.hotCardTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={2}
                      >
                        {tour.name}
                      </Text>
                      <View style={{ marginTop: 6 }}>
                        <Text style={styles.originalPriceText}>
                          {tour.originalPrice}
                        </Text>
                        <View style={styles.hotCardBottom}>
                          <Text style={styles.hotCardPrice}>{formatPrice(tour.basePrice)}</Text>
                          <View style={styles.hotCardRating}>
                            <Ionicons name="star" size={12} color="#FFB800" />
                            <Text
                              style={[
                                styles.hotCardRatingText,
                                isDark && { color: "#94A3B8" },
                              ]}
                            >
                              {tour.averageRating?.toFixed(1) || "5.0"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Most Purchased Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Tour Mua Nhiều Nhất"
                      : "Most Purchased Tours"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "most-purchased" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tourList, { paddingHorizontal: 20 }]}>
                {topPurchasedTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[
                      styles.tourCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image
                      source={{
                        uri:
                          tour.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
                      }}
                      style={styles.tourImage}
                    />

                    <View style={styles.tourDetails}>
                      <Text
                        style={[
                          styles.tourTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={1}
                      >
                        {tour.name}
                      </Text>
                      <Text
                        style={[
                          styles.tourMeta,
                          isDark && { color: "#94A3B8" },
                        ]}
                      >
                        {tour.durationDays} days • {tour.destinations?.[0]?.destinationName || "Various"}
                      </Text>
                      <View
                        style={[
                          styles.purchasedBadge,
                          isDark && {
                            backgroundColor: "rgba(52, 211, 153, 0.12)",
                            borderColor: "#065F46",
                          },
                        ]}
                      >
                        <Ionicons
                          name="cart-outline"
                          size={11}
                          color={isDark ? "#34D399" : "#059669"}
                        />
                        <Text
                          style={[
                            styles.purchasedBadgeText,
                            isDark && { color: "#34D399" },
                          ]}
                        >
                          {tour.bookingsCount}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tourRight}>
                      <Text style={styles.tourPrice}>{formatPrice(tour.basePrice)}</Text>
                      <TouchableOpacity
                        style={[
                          styles.tourBookBtn,
                          isDark && { backgroundColor: "#451A03" },
                        ]}
                        onPress={() => handleTourPress(tour.id)}
                      >
                        <Text style={styles.tourBookBtnText}>
                          {t("book_now", "Đặt ngay")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Domestic Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi" ? "Tour Trong Nước" : "Domestic Tours"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "domestic-tours" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {domesticTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[
                      styles.hotCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image
                      source={{
                        uri:
                          tour.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1627885741006-253fcebbec9c?q=80&w=400",
                      }}
                      style={styles.hotCardImage}
                    />
                    <View style={styles.hotCardDetails}>
                      <Text
                        style={[
                          styles.hotCardTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={2}
                      >
                        {tour.name}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>
                          {formatPrice(tour.basePrice)}
                        </Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#FFB800" />
                          <Text
                            style={[
                              styles.hotCardRatingText,
                              isDark && { color: "#94A3B8" },
                            ]}
                          >
                            {tour.averageRating?.toFixed(1) || "5.0"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* International Tours */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Tour Nước Ngoài"
                      : "International Tours"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/view-all",
                      params: { type: "international-tours" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>
                    {t("view_all", "Xem tất cả")}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {internationalTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    activeOpacity={0.9}
                    style={[
                      styles.hotCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                    onPress={() => handleTourPress(tour.id)}
                  >
                    <Image
                      source={{
                        uri:
                          tour.thumbnailUrl ||
                          "https://images.unsplash.com/photo-1627885741006-253fcebbec9c?q=80&w=400",
                      }}
                      style={styles.hotCardImage}
                    />
                    <View style={styles.hotCardDetails}>
                      <Text
                        style={[
                          styles.hotCardTitle,
                          isDark && { color: "#FFFFFF" },
                        ]}
                        numberOfLines={2}
                      >
                        {tour.name}
                      </Text>
                      <View style={styles.hotCardBottom}>
                        <Text style={styles.hotCardPrice}>
                          {formatPrice(tour.basePrice)}
                        </Text>
                        <View style={styles.hotCardRating}>
                          <Ionicons name="star" size={12} color="#FFB800" />
                          <Text
                            style={[
                              styles.hotCardRatingText,
                              isDark && { color: "#94A3B8" },
                            ]}
                          >
                            {tour.averageRating?.toFixed(1) || "5.0"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Customer Testimonials */}
            <View style={{ marginBottom: 24 }}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWrap}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isDark && { color: "#FFFFFF" },
                    ]}
                  >
                    {language === "vi"
                      ? "Khách hàng nói gì về Lữ Hành Quốc Tế THD"
                      : "Customer Reviews on THD Travel"}
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.destinationsList}
              >
                {CUSTOMER_REVIEWS.map((review) => (
                  <View
                    key={review.id}
                    style={[
                      styles.testimonialCard,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <View style={styles.testimonialHeader}>
                      <Image
                        source={{ uri: review.avatar }}
                        style={styles.testimonialAvatar}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.testimonialName,
                            isDark && { color: "#FFFFFF" },
                          ]}
                        >
                          {review.name}
                        </Text>
                        <Text style={styles.testimonialRole}>
                          {review.role}
                        </Text>
                        <View style={styles.testimonialStars}>
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Ionicons
                              key={i}
                              name="star"
                              size={12}
                              color="#FFB800"
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.testimonialComment,
                        isDark && { color: "#94A3B8" },
                      ]}
                      numberOfLines={4}
                    >
                      &quot;{review.comment}&quot;
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
      <AppDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
      <VoiceSearchModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        onSearch={(text) => {
          setSearchQuery(text);
        }}
      />

      {/* Fullscreen Active Search Overlay */}
      {isSearchFocused && (
        <View
          style={[
            styles.activeSearchOverlay,
            isDark && { backgroundColor: "#0F172A" },
            { paddingTop: insets.top + 10 },
          ]}
        >
          {/* Active Search Bar Header */}
          <View
            style={[
              styles.activeSearchBarHeader,
              isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
            ]}
          >
            {/* Left: Back button */}
            <TouchableOpacity
              style={styles.activeSearchBackBtn}
              onPress={() => setIsSearchFocused(false)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back-outline"
                size={22}
                color={isDark ? "#F1F5F9" : "#0F172A"}
              />
            </TouchableOpacity>

            {/* Middle: TextInput */}
            <TextInput
              ref={inputRef}
              autoFocus
              placeholder={
                language === "vi"
                  ? "Bạn muốn đi đâu hôm nay?"
                  : "Where do you want to go?"
              }
              placeholderTextColor="#7D848D"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.activeSearchInput, isDark && { color: "#FFFFFF" }]}
            />

            {/* Right: Mic & Magnifying Glass */}
            <View style={styles.activeSearchRightActions}>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{ marginRight: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
              {/* Mic button */}
              <TouchableOpacity
                style={styles.activeSearchMicBtn}
                activeOpacity={0.7}
                onPress={() => setVoiceModalVisible(true)}
              >
                <Ionicons
                  name="mic-outline"
                  size={20}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              </TouchableOpacity>

              {/* Orange search glass button */}
              <TouchableOpacity
                style={styles.activeSearchGlassBtn}
                activeOpacity={0.8}
                onPress={() => {
                  if (searchQuery) {
                    showSnackbar(
                      language === "vi"
                        ? `Đang tìm kiếm: ${searchQuery}`
                        : `Searching: ${searchQuery}`,
                    );
                  } else {
                    showSnackbar(
                      language === "vi"
                        ? "Hãy nhập từ khóa để tìm kiếm!"
                        : "Please enter search query!",
                    );
                  }
                }}
              >
                <Ionicons name="search" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Search Body */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.activeSearchBodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {searchQuery.trim().length === 0 ? (
              /* Suggestions list when query is empty */
              <View style={styles.activeSuggestionContainer}>
                <Text
                  style={[
                    styles.activeSuggestionTitle,
                    isDark && { color: "#94A3B8" },
                  ]}
                >
                  {language === "vi"
                    ? "Gợi ý điểm đến phổ biến:"
                    : "Popular suggested places:"}
                </Text>
                <View style={styles.activeSuggestionRow}>
                  {POPULAR_SUGGESTIONS.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.suggestionChip,
                        isDark && styles.suggestionChipDark,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setIsSearchFocused(false);
                        showSnackbar(
                          language === "vi"
                            ? `Đang mở chi tiết: ${item.name}`
                            : `Opening details: ${item.name}`,
                        );
                        router.push({
                          pathname: "/destination-detail",
                          params: { pinId: item.pinId },
                        });
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={13}
                        color="#FF5B22"
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.suggestionChipText,
                          isDark && { color: "#E2E8F0" },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              /* Search Results when query is typed */
              <View style={styles.activeSearchResultsContainer}>
                <Text
                  style={[
                    styles.searchResultsTitle,
                    isDark && { color: "#94A3B8" },
                  ]}
                >
                  {language === "vi"
                    ? `Kết quả tìm kiếm (${searchResults.length})`
                    : `Search results (${searchResults.length})`}
                </Text>
                {searchResults.length === 0 ? (
                  <View
                    style={[
                      styles.emptyState,
                      isDark && {
                        backgroundColor: "#1E293B",
                        borderColor: "#334155",
                      },
                    ]}
                  >
                    <Ionicons name="search-outline" size={34} color="#FF5B22" />
                    <Text
                      style={[
                        styles.emptyTitle,
                        isDark && { color: "#F1F5F9" },
                      ]}
                    >
                      {language === "vi"
                        ? "Không tìm thấy tour phù hợp"
                        : "No matching tours found"}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.tourList}>
                    {searchResults.map((item) => renderTourCard(item))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
