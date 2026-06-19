import React, { useMemo, useState, useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { fetchMyBookings, cancelBookingApi } from "@/services/bookingApi";

const parsePrice = (priceStr: string): number => {
  const digits = priceStr.replace(/\D/g, "");
  return parseInt(digits, 10) || 0;
};

type Booking = {
  id: string;
  backendId?: number;
  tourName: string;
  tourImage: string;
  startDate: string;
  duration: string;
  price: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-8902",
    tourName: "Vịnh Hạ Long Luxury Cruise",
    tourImage:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600",
    startDate: "18 Tháng 6, 2026",
    duration: "3 Ngày 2 Đêm",
    price: "3.800.000đ",
    status: "Confirmed",
  },
  {
    id: "BK-5412",
    tourName: "Phú Quốc - Thiên Đường Nắng Vàng",
    tourImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
    startDate: "02 Tháng 7, 2026",
    duration: "3 Ngày 2 Đêm",
    price: "4.500.000đ",
    status: "Pending",
  },
  {
    id: "BK-3108",
    tourName: "Hành Trình Di Sản Miền Tây",
    tourImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600",
    startDate: "12 Tháng 5, 2026",
    duration: "3 Ngày 2 Đêm",
    price: "1.200.000đ",
    status: "Completed",
  },
];

const FILTER_OPTIONS = [
  { label: "Tất cả", value: "All" },
  { label: "Chờ xử lý", value: "Pending" },
  { label: "Đã thanh toán", value: "Confirmed" },
  { label: "Đã hủy", value: "Cancelled" },
  { label: "Hoàn thành", value: "Completed" },
] as const;

const MOCK_BOOKING_DETAILS: Record<
  string,
  {
    renterName: string;
    renterPhone: string;
    renterEmail: string;
    paymentMethod: string;
    priceBreakdown: {
      base: string;
      tax: string;
      total: string;
    };
    qrValue: string;
  }
> = {
  "BK-8902": {
    renterName: "Nguyễn Văn Rio",
    renterPhone: "0901 234 567",
    renterEmail: "rio@documents.vn",
    paymentMethod: "VNPAY (Ngân hàng)",
    priceBreakdown: {
      base: "3.518.518đ",
      tax: "281.482đ",
      total: "3.800.000đ",
    },
    qrValue: "TRAVELVIET_BK-8902_CONFIRMED",
  },
  "BK-5412": {
    renterName: "Nguyễn Văn Rio",
    renterPhone: "0901 234 567",
    renterEmail: "rio@documents.vn",
    paymentMethod: "Ví MoMo",
    priceBreakdown: {
      base: "4.166.667đ",
      tax: "333.333đ",
      total: "4.500.000đ",
    },
    qrValue: "TRAVELVIET_BK-5412_PENDING",
  },
  "BK-3108": {
    renterName: "Nguyễn Văn Rio",
    renterPhone: "0901 234 567",
    renterEmail: "rio@documents.vn",
    paymentMethod: "Chuyển khoản Ngân hàng",
    priceBreakdown: {
      base: "1.111.111đ",
      tax: "88.889đ",
      total: "1.200.000đ",
    },
    qrValue: "TRAVELVIET_BK-3108_COMPLETED",
  },
};

type FilterType = (typeof FILTER_OPTIONS)[number]["value"];

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchMyBookings()
      .then((res) => {
        const mapped: Booking[] = res.map((b) => ({
          id: b.bookingCode,
          backendId: b.id,
          tourName: b.tourTitle,
          tourImage:
            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600",
          startDate: new Date(b.travelDate || b.createdAt).toLocaleDateString(
            "vi-VN",
          ),
          duration: "Theo lịch trình",
          price: b.totalPrice.toString(),
          status:
            b.status === "PENDING"
              ? "Pending"
              : b.status === "CONFIRMED"
                ? "Confirmed"
                : b.status === "CANCELLED"
                  ? "Cancelled"
                  : "Completed",
        }));
        setBookings(mapped);
      })
      .catch((err) => {
        console.log(err);
        // Fallback mock if fail
        setBookings(MOCK_BOOKINGS);
      })
      .finally(() => setLoading(false));
  }, []);

  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const { theme, formatPrice, t, language } = useAppSettings();
  const { showSnackbar } = useSnackbar();
  const isDark = theme === "dark";

  const filteredBookings = useMemo(() => {
    if (selectedFilter === "All") return bookings;
    return bookings.filter((b) => b.status === selectedFilter);
  }, [selectedFilter, bookings]);

  const getStatusDetails = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return {
          label: t("status_pending", "Chờ xử lý"),
          color: "#D97706",
          bgColor: isDark ? "#3D2A12" : "#FEF3C7",
        };
      case "Confirmed":
        return {
          label: t("status_confirmed", "Đã thanh toán"),
          color: "#059669",
          bgColor: isDark ? "#123D2A" : "#D1FAE5",
        };
      case "Completed":
        return {
          label: t("status_completed", "Hoàn thành"),
          color: "#2563EB",
          bgColor: isDark ? "#1E293B" : "#DBEAFE",
        };
      case "Cancelled":
        return {
          label: t("status_cancelled", "Đã hủy"),
          color: "#DC2626",
          bgColor: isDark ? "#3D1212" : "#FEE2E2",
        };
    }
  };

  const handleCancelBooking = (bookingId: string, backendId?: number) => {
    Alert.alert(
      language === "vi" ? "Hủy đặt tour" : "Cancel Booking",
      language === "vi"
        ? "Bạn có chắc chắn muốn hủy đặt tour này không? Suất chỗ của bạn sẽ được giải phóng."
        : "Are you sure you want to cancel this booking? Your slots will be released.",
      [
        { text: language === "vi" ? "Hủy" : "Cancel", style: "cancel" },
        {
          text: language === "vi" ? "Xác nhận hủy" : "Confirm Cancel",
          style: "destructive",
          onPress: async () => {
            if (backendId) {
              try {
                await cancelBookingApi(backendId);
              } catch (e: any) {
                showSnackbar(
                  language === "vi"
                    ? "Hủy không thành công"
                    : "Failed to cancel",
                );
                return;
              }
            }
            setBookings((prev) =>
              prev.map((b) =>
                b.id === bookingId ? { ...b, status: "Cancelled" as const } : b,
              ),
            );
            setSelectedBooking((prev) =>
              prev ? { ...prev, status: "Cancelled" as const } : null,
            );
            showSnackbar(
              language === "vi"
                ? "Đã hủy đặt tour thành công!"
                : "Booking cancelled successfully!",
            );
          },
        },
      ],
    );
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const statusDetails = getStatusDetails(item.status);

    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Image source={{ uri: item.tourImage }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.bookingId}>{item.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusDetails.bgColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusDetails.color }]}>
                {statusDetails.label}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.tourName, isDark && styles.tourNameDark]}
            numberOfLines={2}
          >
            {item.tourName}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={isDark ? "#94A3B8" : "#6B7280"}
            />
            <Text style={[styles.metaText, isDark && styles.metaTextDark]}>
              {item.startDate}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={13}
              color={isDark ? "#94A3B8" : "#6B7280"}
            />
            <Text style={[styles.metaText, isDark && styles.metaTextDark]}>
              {item.duration}
            </Text>
          </View>
          <View
            style={[styles.cardFooter, isDark && styles.cardFooterBorderDark]}
          >
            <Text style={styles.price}>
              {formatPrice(parsePrice(item.price))}
            </Text>
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => setSelectedBooking(item)}
            >
              <Text style={styles.detailBtnText}>
                {t("bookings_detail", "Chi tiết")}
              </Text>
              <Ionicons name="chevron-forward" size={13} color="#FF5B22" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const filterLabel = (val: string) => {
    switch (val) {
      case "All":
        return t("filter_all", "Tất cả");
      case "Pending":
        return t("status_pending", "Chờ xử lý");
      case "Confirmed":
        return t("status_confirmed", "Đã thanh toán");
      case "Cancelled":
        return t("status_cancelled", "Đã hủy");
      case "Completed":
        return t("status_completed", "Hoàn thành");
      default:
        return val;
    }
  };

  const renderHeader = () => {
    return (
      <View>
        <LinearGradient
          colors={isDark ? ["#3E2517", "#2A180E"] : ["#8E5A3C", "#5A3722"]}
          style={[styles.headerBanner, { paddingTop: insets.top + 16 }]}
        >
          <Text style={styles.headerTitle}>
            {t("bookings_title", "Đơn của tôi")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t(
              "bookings_subtitle",
              "Quản lý các đơn tour bạn đã đặt — thanh toán, hủy hoặc xem lại chi tiết.",
            )}
          </Text>

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="briefcase" size={16} color="#FFF" />
              <Text style={styles.statValue}>{bookings.length}</Text>
              <Text style={styles.statLabel}>
                {t("bookings_total_trips", "TỔNG CHUYẾN")}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="hourglass" size={16} color="#FFF" />
              <Text style={styles.statValue}>
                {bookings.filter((b) => b.status === "Pending").length}
              </Text>
              <Text style={styles.statLabel}>
                {t("bookings_pending", "CHỜ XỬ LÝ")}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" />
              <Text style={styles.statValue}>
                {bookings.filter((b) => b.status === "Completed").length}
              </Text>
              <Text style={styles.statLabel}>
                {t("bookings_completed", "HOÀN THÀNH")}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={16} color="#FFF" />
              <Text style={styles.statValue}>
                {bookings.filter((b) => b.status === "Cancelled").length}
              </Text>
              <Text style={styles.statLabel}>
                {t("bookings_cancelled", "ĐÃ HỦY")}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Filter Navigation Chips */}
        <View
          style={[styles.filterContainer, isDark && styles.filterContainerDark]}
        >
          <FlatList
            horizontal
            data={FILTER_OPTIONS}
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isDark && styles.filterChipDark,
                  selectedFilter === item.value && styles.filterChipActive,
                  selectedFilter === item.value &&
                    isDark &&
                    styles.filterChipActiveDark,
                ]}
                onPress={() => setSelectedFilter(item.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isDark && styles.filterChipTextDark,
                    selectedFilter === item.value &&
                      styles.filterChipTextActive,
                    selectedFilter === item.value &&
                      isDark &&
                      styles.filterChipTextActiveDark,
                  ]}
                >
                  {filterLabel(item.value)}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.resultsCount}>
            {filteredBookings.length} {t("bookings_results_count", "kết quả")}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View
        style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}
      >
        <View style={styles.emptyIconCircle}>
          <Ionicons
            name="file-tray-outline"
            size={44}
            color={isDark ? "#FF5B22" : "#9C6644"}
          />
        </View>
        <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
          {t("bookings_no_trips", "Không có chuyến đi nào")}
        </Text>
        <Text
          style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}
        >
          {t("bookings_no_trips_sub", "Bạn chưa có đơn đặt tour nào.")}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    return null;
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        ref={flatListRef}
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Booking Detail Modal */}
      <Modal
        visible={selectedBooking !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedBooking(null)}
      >
        <View
          style={[styles.modalContainer, isDark && styles.modalContainerDark]}
        >
          {/* Header Row */}
          <View
            style={[
              styles.modalHeaderRow,
              { paddingTop: insets.top + 12 },
              isDark && styles.modalHeaderRowDark,
            ]}
          >
            <TouchableOpacity
              style={[styles.closeModalBtn, isDark && styles.closeModalBtnDark]}
              onPress={() => setSelectedBooking(null)}
            >
              <Ionicons
                name="close-outline"
                size={24}
                color={isDark ? "#FFF" : "#0F172A"}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalHeaderTitle,
                isDark && styles.modalHeaderTitleDark,
              ]}
            >
              {selectedBooking?.id}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {selectedBooking && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Status Banner */}
              <View
                style={[
                  styles.statusBannerContainer,
                  {
                    backgroundColor: getStatusDetails(selectedBooking.status)
                      .bgColor,
                  },
                ]}
              >
                <Ionicons
                  name={
                    selectedBooking.status === "Confirmed"
                      ? "checkmark-circle-outline"
                      : selectedBooking.status === "Completed"
                        ? "shield-checkmark-outline"
                        : selectedBooking.status === "Cancelled"
                          ? "close-circle-outline"
                          : "hourglass-outline"
                  }
                  size={20}
                  color={getStatusDetails(selectedBooking.status).color}
                />
                <Text
                  style={[
                    styles.statusBannerText,
                    { color: getStatusDetails(selectedBooking.status).color },
                  ]}
                >
                  {getStatusDetails(selectedBooking.status).label}
                </Text>
              </View>

              {/* Tour Brief Card */}
              <View style={[styles.briefCard, isDark && styles.briefCardDark]}>
                <Image
                  source={{ uri: selectedBooking.tourImage }}
                  style={styles.briefImage}
                />
                <View style={styles.briefDetails}>
                  <Text
                    style={[styles.briefTitle, isDark && styles.briefTitleDark]}
                    numberOfLines={2}
                  >
                    {selectedBooking.tourName}
                  </Text>
                  <View style={styles.briefMeta}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color="#9CA3AF"
                    />
                    <Text
                      style={[
                        styles.briefMetaText,
                        isDark && styles.briefMetaTextDark,
                      ]}
                    >
                      {selectedBooking.startDate}
                    </Text>
                  </View>
                  <View style={styles.briefMeta}>
                    <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    <Text
                      style={[
                        styles.briefMetaText,
                        isDark && styles.briefMetaTextDark,
                      ]}
                    >
                      {selectedBooking.duration}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Customer Details */}
              <View
                style={[styles.infoSection, isDark && styles.infoSectionDark]}
              >
                <Text
                  style={[
                    styles.infoSectionTitle,
                    isDark && styles.infoSectionTitleDark,
                  ]}
                >
                  {language === "vi"
                    ? "Thông tin người đặt"
                    : "Billing Details"}
                </Text>

                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Họ & tên
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.renterName ||
                      "Nguyễn Văn Rio"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Số điện thoại
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.renterPhone ||
                      "0901 234 567"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Email liên hệ
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.renterEmail ||
                      "rio@documents.vn"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Thanh toán
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.paymentMethod ||
                      "VNPAY"}
                  </Text>
                </View>
              </View>

              {/* Price Breakdown */}
              <View
                style={[styles.infoSection, isDark && styles.infoSectionDark]}
              >
                <Text
                  style={[
                    styles.infoSectionTitle,
                    isDark && styles.infoSectionTitleDark,
                  ]}
                >
                  {language === "vi" ? "Chi tiết giá vé" : "Price Details"}
                </Text>

                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Giá gốc
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.priceBreakdown
                      .base || selectedBooking.price}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, isDark && styles.infoLabelDark]}
                  >
                    Thuế & Phí dịch vụ
                  </Text>
                  <Text
                    style={[styles.infoValue, isDark && styles.infoValueDark]}
                  >
                    {MOCK_BOOKING_DETAILS[selectedBooking.id]?.priceBreakdown
                      .tax || "0đ"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.infoRow,
                    {
                      borderTopWidth: 1,
                      borderTopColor: isDark ? "#334155" : "#E5E7EB",
                      paddingTop: 10,
                      marginTop: 4,
                    },
                  ]}
                >
                  <Text
                    style={[styles.totalLabel, isDark && styles.totalLabelDark]}
                  >
                    Tổng cộng
                  </Text>
                  <Text style={styles.totalPriceValue}>
                    {formatPrice(parsePrice(selectedBooking.price))}
                  </Text>
                </View>
              </View>

              {/* QR Code Section */}
              {selectedBooking.status !== "Cancelled" && (
                <View
                  style={[styles.qrSection, isDark && styles.qrSectionDark]}
                >
                  <View style={styles.qrCodeWrapper}>
                    <Ionicons
                      name="qr-code-outline"
                      size={120}
                      color={isDark ? "#F1F5F9" : "#0F172A"}
                    />
                  </View>
                  <Text style={[styles.qrTitle, isDark && styles.qrTitleDark]}>
                    {language === "vi" ? "Mã Vé Điện Tử" : "E-Ticket QR Code"}
                  </Text>
                  <Text
                    style={[styles.qrSubtitle, isDark && styles.qrSubtitleDark]}
                  >
                    {language === "vi"
                      ? "Quét mã này tại sân bay hoặc quầy hướng dẫn để nhận vé cứng."
                      : "Scan this code at the airport or kiosk to print your ticket."}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.supportButton,
                    isDark && styles.supportButtonDark,
                  ]}
                  onPress={() =>
                    Alert.alert(
                      language === "vi" ? "Hotline hỗ trợ" : "Customer Support",
                      "Hotline: 0366242457\nEmail: nguyencongtru2923@gmail.com",
                    )
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#FF5B22"
                  />
                  <Text style={styles.supportButtonText}>
                    {language === "vi" ? "Liên hệ hỗ trợ" : "Contact Support"}
                  </Text>
                </TouchableOpacity>

                {(selectedBooking.status === "Pending" ||
                  selectedBooking.status === "Confirmed") && (
                  <TouchableOpacity
                    style={styles.cancelBookingButton}
                    onPress={() => handleCancelBooking(selectedBooking.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.cancelBookingButtonText}>
                      {language === "vi" ? "Hủy đặt tour" : "Cancel Booking"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  listContent: {
    paddingBottom: 0,
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF5B22",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 6,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    padding: 8,
    alignItems: "flex-start",
    minHeight: 74,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "800",
    marginTop: 2,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: "#E6F4F4",
    borderColor: "#9C6644",
  },
  filterChipText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#9C6644",
    fontWeight: "800",
  },
  resultsCount: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    overflow: "hidden",
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardImage: {
    width: 105,
    height: "100%",
    minHeight: 130,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  tourName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  price: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FF5B22",
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF5B22",
  },
  // Empty State Styles
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F4F4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Footer styles
  footerBackground: {
    width: "100%",
    marginTop: 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  footerBigTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 30,
    lineHeight: 40,
    maxWidth: "90%",
  },
  newsletterSection: {
    marginBottom: 35,
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  newsletterInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    height: 48,
  },
  newsletterInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  newsletterButton: {
    backgroundColor: "#8E5A3C",
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  newsletterButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 30,
  },
  footerLinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 20,
  },
  footerColumn: {
    width: "45%",
    marginBottom: 10,
  },
  footerColumnTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerLinkText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.75)",
    marginBottom: 8,
    fontWeight: "600",
  },
  footerBottom: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 10,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  footerCopyright: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  containerDark: {
    backgroundColor: "#0F172A",
  },
  cardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  filterContainerDark: {
    backgroundColor: "#1E293B",
    borderBottomColor: "#334155",
  },
  filterChipDark: {
    backgroundColor: "#334155",
    borderColor: "#475569",
  },
  filterChipActiveDark: {
    backgroundColor: "#1F3A3A",
    borderColor: "#FF5B22",
  },
  filterChipTextDark: {
    color: "#94A3B8",
  },
  filterChipTextActiveDark: {
    color: "#FF5B22",
  },
  emptyContainerDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  emptyTitleDark: {
    color: "#F1F5F9",
  },
  emptySubtitleDark: {
    color: "#94A3B8",
  },
  tourNameDark: {
    color: "#F1F5F9",
  },
  metaTextDark: {
    color: "#94A3B8",
  },
  cardFooterBorderDark: {
    borderTopColor: "#334155",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalContainerDark: {
    backgroundColor: "#0F172A",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  modalHeaderRowDark: {
    borderBottomColor: "#1E293B",
    backgroundColor: "#0F172A",
  },
  closeModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeModalBtnDark: {
    backgroundColor: "#1E293B",
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalHeaderTitleDark: {
    color: "#F8FAFC",
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusBannerText: {
    fontSize: 14,
    fontWeight: "800",
  },
  briefCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  briefCardDark: {
    backgroundColor: "#1E293B",
  },
  briefImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  briefDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  briefTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  briefTitleDark: {
    color: "#F8FAFC",
  },
  briefMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  briefMetaText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  briefMetaTextDark: {
    color: "#94A3B8",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoSectionDark: {
    backgroundColor: "#1E293B",
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoSectionTitleDark: {
    color: "#F1F5F9",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoLabelDark: {
    color: "#94A3B8",
  },
  infoValue: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "700",
  },
  infoValueDark: {
    color: "#F1F5F9",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  totalLabelDark: {
    color: "#F1F5F9",
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF5B22",
  },
  qrSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  qrSectionDark: {
    backgroundColor: "#1E293B",
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  qrTitleDark: {
    color: "#F8FAFC",
  },
  qrSubtitle: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  qrSubtitleDark: {
    color: "#94A3B8",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  supportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF5B22",
    backgroundColor: "#FFFFFF",
  },
  supportButtonDark: {
    backgroundColor: "transparent",
    borderColor: "#FF5B22",
  },
  supportButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FF5B22",
  },
  cancelBookingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
  },
  cancelBookingButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#EF4444",
  },
});
