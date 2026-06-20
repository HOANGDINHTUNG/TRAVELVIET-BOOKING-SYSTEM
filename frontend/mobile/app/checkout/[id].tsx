import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TOURS_DATA } from "../../constants/Tours";
import { MOCK_CRUISES } from "../cruises";
import { useSnackbar } from "../../providers/SnackbarProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { fetchTourDetails } from "@/services/toursApi";
import { fetchBookingQuote, createBooking } from "@/services/bookingApi";

// Cruise-specific constants at module level
const CABIN_TYPES = [
  {
    key: "standard" as const,
    labelVi: "Cabin Standard",
    labelEn: "Standard Cabin",
    multiplier: 1.0,
    descVi: "Phòng tiêu chuẩn, đầy đủ tiện nghi cơ bản, view vịnh biển",
    descEn: "Standard room with basic amenities and bay view",
  },
  {
    key: "deluxe" as const,
    labelVi: "Cabin Deluxe",
    labelEn: "Deluxe Cabin",
    multiplier: 1.35,
    descVi: "Phòng rộng hơn, ban công riêng, view panorama vịnh đẹp",
    descEn: "Larger room with private balcony and panoramic bay view",
  },
  {
    key: "suite" as const,
    labelVi: "Cabin Suite",
    labelEn: "Suite Cabin",
    multiplier: 1.75,
    descVi:
      "Phòng suite hạng sang, phòng khách riêng, Jacuzzi & dịch vụ butler",
    descEn: "Luxury suite with private living room, Jacuzzi & butler service",
  },
] as const;
type CabinTypeKey = "standard" | "deluxe" | "suite";

const DEPARTURE_DATES = [
  "14/07/2026",
  "21/07/2026",
  "28/07/2026",
  "04/08/2026",
  "11/08/2026",
  "18/08/2026",
];

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();

  const { theme, formatPrice, t, language } = useAppSettings();
  const isDark = theme === "dark";

  const dynamicStyles = {
    mainWrap: [styles.mainWrap, isDark && { backgroundColor: "#0F172A" }],
    header: [
      styles.header,
      isDark && { backgroundColor: "#1E293B", borderBottomColor: "#334155" },
    ],
    headerTitle: [styles.headerTitle, isDark && { color: "#F1F5F9" }],
    summaryCard: [
      styles.summaryCard,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    tourTitleText: [styles.tourTitleText, isDark && { color: "#F1F5F9" }],
    tourInfoText: [styles.tourInfoText, isDark && { color: "#94A3B8" }],
    tourPriceRow: [
      styles.tourPriceRow,
      isDark && { borderTopColor: "#334155" },
    ],
    tourPriceLabel: [styles.tourPriceLabel, isDark && { color: "#94A3B8" }],
    sectionCard: [
      styles.sectionCard,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    sectionTitle: [styles.sectionTitle, isDark && { color: "#F1F5F9" }],
    counterLabel: [styles.counterLabel, isDark && { color: "#F1F5F9" }],
    counterSubLabel: [styles.counterSubLabel, isDark && { color: "#94A3B8" }],
    counterValue: [styles.counterValue, isDark && { color: "#F1F5F9" }],
    counterDivider: [
      styles.counterDivider,
      isDark && { backgroundColor: "#334155" },
    ],
    inputLabel: [styles.inputLabel, isDark && { color: "#F1F5F9" }],
    input: [
      styles.input,
      isDark && {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
        color: "#F1F5F9",
      },
    ],
    passengerFormBlock: [
      styles.passengerFormBlock,
      isDark && { borderTopColor: "#334155" },
    ],
    passengerFormHeader: [
      styles.passengerFormHeader,
      isDark && { color: "#F1F5F9" },
    ],
    paymentCard: [
      styles.paymentCard,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    paymentCardActive: [
      styles.paymentCardActive,
      isDark && { backgroundColor: "#2C1D16", borderColor: "#FF702A" },
    ],
    paymentTitle: [styles.paymentTitle, isDark && { color: "#F1F5F9" }],
    paymentDesc: [styles.paymentDesc, isDark && { color: "#94A3B8" }],
    billCard: [
      styles.billCard,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    billTitle: [styles.billTitle, isDark && { color: "#F1F5F9" }],
    billLabel: [styles.billLabel, isDark && { color: "#94A3B8" }],
    billValue: [styles.billValue, isDark && { color: "#F1F5F9" }],
    billLabelTotal: [styles.billLabelTotal, isDark && { color: "#F1F5F9" }],
    billValueTotal: [styles.billValueTotal, isDark && { color: "#F1F5F9" }],
    billDivider: [styles.billDivider, isDark && { backgroundColor: "#334155" }],
    bottomBar: [
      styles.bottomBar,
      isDark && { backgroundColor: "#1E293B", borderTopColor: "#334155" },
    ],
    bottomBarLabel: [styles.bottomBarLabel, isDark && { color: "#94A3B8" }],
    bottomBarValue: [styles.bottomBarValue, isDark && { color: "#F1F5F9" }],
    ticketContainer: [
      styles.ticketContainer,
      isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
    ],
    ticketTourTitle: [styles.ticketTourTitle, isDark && { color: "#F1F5F9" }],
    ticketValue: [styles.ticketValue, isDark && { color: "#F1F5F9" }],
    ticketValueSub: [styles.ticketValueSub, isDark && { color: "#94A3B8" }],
    ticketPassengerItem: [
      styles.ticketPassengerItem,
      isDark && { color: "#F1F5F9" },
    ],
    ticketTotalValueText: [
      styles.ticketTotalValueText,
      isDark && { color: "#F1F5F9" },
    ],
    ticketTotalValueBig: [
      styles.ticketTotalValueBig,
      isDark && { color: "#F1F5F9" },
    ],
    ticketDivider: [
      styles.ticketDivider,
      isDark && { backgroundColor: "#334155" },
    ],
    errorContainer: [
      styles.errorContainer,
      isDark && { backgroundColor: "#0F172A" },
    ],
    errorText: [styles.errorText, isDark && { color: "#F1F5F9" }],
  };

  const isCruise = id?.startsWith("c") ?? false;
  // Get backend params
  const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();

  const [tourDetails, setTourDetails] = useState<any>(null);

  React.useEffect(() => {
    if (!isCruise && id && !isNaN(Number(id))) {
      fetchTourDetails(Number(id))
        .then((res) => {
          if (res) setTourDetails(res);
        })
        .catch((err) => console.log("Tour fetch error", err));
    }
  }, [id, isCruise]);

  const tour = useMemo(() => {
    if (isCruise) {
      const cruise = MOCK_CRUISES.find((c) => c.id === id);
      return cruise
        ? {
            id: cruise.id,
            title: cruise.name,
            price: String(cruise.priceNum) + " đ",
            image: cruise.image,
            days: "2 ngày 1 đêm",
            location: cruise.route,
            category: "Du thuyền",
            priceNum: cruise.priceNum,
          }
        : null;
    }

    if (!tourDetails) return null;
    const item = tourDetails;
    return {
      id: item.id.toString(),
      title: item.name,
      price: item.basePrice?.toString() + " đ",
      image:
        item.media?.[0]?.url ||
        "https://images.unsplash.com/photo-1598928506311-c55dedbfc1f2?q=80&w=600",
      days: `${item.durationDays} ngày ${item.durationNights} đêm`,
      location:
        item.destinations?.map((d: any) => d.name).join(", ") || "Việt Nam",
      category: "Trong nước",
      priceNum: item.basePrice,
    };
  }, [id, isCruise, tourDetails]);

  const [selectedCabin, setSelectedCabin] = useState<CabinTypeKey>("standard");
  const [selectedDate, setSelectedDate] = useState(DEPARTURE_DATES[0]);

  // Parse numeric base price
  const basePriceNum = useMemo(() => {
    if (!tour) return 0;
    if (isCruise) {
      const cruiseData = MOCK_CRUISES.find((c) => c.id === id);
      const cabin = CABIN_TYPES.find((c) => c.key === selectedCabin);
      const multiplier = cabin?.multiplier ?? 1.0;
      return Math.round((cruiseData?.priceNum ?? 0) * multiplier);
    }
    const cleanStr = tour.price.replace(/[^0-9]/g, "");
    return parseInt(cleanStr, 10) || 0;
  }, [tour, isCruise, id, selectedCabin]);

  // States
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Passenger details list
  const [passengers, setPassengers] = useState<
    {
      name: string;
      birthYear: string;
      type: "adult" | "child";
    }[]
  >([{ name: "", birthYear: "", type: "adult" }]);

  // Coupon promo code states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<
    "vnpay" | "momo" | "bank" | "cash"
  >("vnpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState("");

  // Dynamic calculations
  const adultPrice = basePriceNum;
  const childPrice = Math.round(basePriceNum * 0.7);
  const subtotal = adultCount * adultPrice + childCount * childPrice;
  const tax = Math.round(subtotal * 0.1);
  const totalAmount = Math.max(0, subtotal + tax - discountAmount);

  // Form helpers
  const handleAdultChange = (newCount: number) => {
    if (newCount < 1) return;
    setAdultCount(newCount);
    updatePassengersList(newCount, childCount);
  };

  const handleChildChange = (newCount: number) => {
    if (newCount < 0) return;
    setChildCount(newCount);
    updatePassengersList(adultCount, newCount);
  };

  const updatePassengersList = (adults: number, children: number) => {
    const list = [...passengers];
    const total = adults + children;

    if (list.length < total) {
      for (let i = list.length; i < total; i++) {
        const type = i < adults ? "adult" : "child";
        list.push({ name: "", birthYear: "", type });
      }
    } else if (list.length > total) {
      list.splice(total);
    }

    for (let i = 0; i < list.length; i++) {
      list[i].type = i < adults ? "adult" : "child";
    }

    setPassengers(list);
  };

  const handlePassengerDataChange = (
    index: number,
    name: string,
    birthYear: string,
  ) => {
    const list = [...passengers];
    list[index] = {
      ...list[index],
      name,
      birthYear,
    };
    setPassengers(list);
  };

  // Coupon verify
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showSnackbar("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const res = await fetchBookingQuote({
        tourId: Number(id),
        scheduleId: Number(scheduleId),
        adults: adultCount,
        children: childCount,
        voucherCode: code,
      });

      if (res && res.voucherDiscountAmount !== undefined) {
        const discountVal = Number(res.voucherDiscountAmount);
        if (discountVal > 0) {
          setDiscountAmount(discountVal);
          setAppliedCoupon(code);
          showSnackbar(
            language === "vi"
              ? `Áp dụng voucher ${code} thành công!`
              : `Applied voucher ${code} successfully!`
          );
        } else {
          showSnackbar(
            language === "vi"
              ? "Voucher không đủ điều kiện áp dụng cho đơn hàng này."
              : "Voucher conditions not met for this booking."
          );
        }
      } else {
        showSnackbar("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "";
      showSnackbar(
        language === "vi"
          ? `Lỗi áp dụng voucher: ${errMsg}`
          : `Error applying voucher: ${errMsg}`
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    showSnackbar("Đã gỡ mã giảm giá");
  };

  // Format currency VNĐ
  const formatCurrency = (amount: number) => {
    return formatPrice(amount);
  };

  // Submit action
  const handleConfirmBooking = async () => {
    if (!contactName.trim()) {
      showSnackbar("Vui lòng nhập Họ tên liên hệ");
      return;
    }
    if (!contactPhone.trim()) {
      showSnackbar("Vui lòng nhập Số điện thoại liên hệ");
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      showSnackbar("Vui lòng nhập Email liên hệ hợp lệ");
      return;
    }

    // Check passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        showSnackbar(`Vui lòng nhập tên hành khách thứ ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);

    if (isCruise) {
      setTimeout(() => {
        setIsSubmitting(false);
        const randomId = "BK-" + Math.floor(1000 + Math.random() * 9000);
        setGeneratedBookingId(randomId);
        setIsBooked(true);
        showSnackbar("Đặt tour và thanh toán thành công!");
      }, 1500);
    } else {
      try {
        const res = await createBooking({
          tourId: Number(id),
          scheduleId: Number(scheduleId),
          contactName,
          contactPhone,
          contactEmail,
          adults: adultCount,
          children: childCount,
          bookingSource: "app",
          voucherCode: appliedCoupon || undefined,
          passengers: passengers.map((p) => ({
            fullName: p.name,
            type: p.type === "adult" ? "ADULT" : "CHILD",
          })),
        });

        setIsSubmitting(false);
        if (res?.bookingCode) {
          setGeneratedBookingId(res.bookingCode);
          setIsBooked(true);
          showSnackbar("Đặt tour thành công! Vui lòng chờ xử lý.");
        } else {
          showSnackbar("Có lỗi xảy ra khi tạo đơn.");
        }
      } catch (e: any) {
        setIsSubmitting(false);
        showSnackbar(
          `Lỗi đặt tour: ${e.response?.data?.message || "Không thành công"}`,
        );
      }
    }
  };

  if (!tour) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <Ionicons name="compass-outline" size={48} color="#FF702A" />
        <Text style={dynamicStyles.errorText}>
          {t(
            "bookings_no_trips",
            "Đang tải thông tin tour hoặc tour không tồn tại...",
          )}
        </Text>
        <TouchableOpacity style={styles.errorBtn} onPress={() => router.back()}>
          <Text style={styles.errorBtnText}>{t("logout", "Quay lại")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Success Ticket screen render
  if (isBooked) {
    return (
      <ScrollView
        style={[
          { flex: 1, backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successWrapper}>
          <View style={styles.successBadgeContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"]}
              style={styles.successIconCircle}
            >
              <Ionicons name="checkmark" size={38} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.successTitle, isDark && { color: "#F1F5F9" }]}>
              {isCruise
                ? language === "vi"
                  ? "Đặt Cabin Thành Công! 🚢"
                  : "Cabin Booked Successfully! 🚢"
                : t("checkout_success", "Đặt Tour Thành Công!")}
            </Text>
            <Text
              style={[styles.successSubtitle, isDark && { color: "#94A3B8" }]}
            >
              {t(
                "checkout_success_msg",
                "Giao dịch của bạn đã được thực hiện an toàn.",
              )}
            </Text>
          </View>

          {/* Ticket Receipt Container */}
          <View style={dynamicStyles.ticketContainer}>
            {/* Cutouts on the sides */}
            <View style={styles.ticketCutoutLeft} />
            <View style={styles.ticketCutoutRight} />

            <View style={styles.ticketHeader}>
              <Text style={[styles.ticketLogo, isDark && { color: "#F1F5F9" }]}>
                TRAVELVIET
              </Text>
              <View style={styles.ticketCodeBlock}>
                <Text style={styles.ticketCodeLabel}>
                  {t("bookings_detail_alert", "MÃ ĐƠN HÀNG")}
                </Text>
                <Text
                  style={[
                    styles.ticketCodeValue,
                    isDark && { color: "#F1F5F9" },
                  ]}
                >
                  {generatedBookingId}
                </Text>
              </View>
            </View>

            <View style={dynamicStyles.ticketDivider} />

            <View style={styles.ticketSection}>
              <Text style={styles.ticketLabel}>
                {isCruise
                  ? language === "vi"
                    ? "DU THUYỀN"
                    : "CRUISE"
                  : t("tour_details", "HÀNH TRÌNH")}
              </Text>
              <Text style={dynamicStyles.ticketTourTitle}>{tour.title}</Text>
              {isCruise && (
                <View style={[styles.ticketMetaRow, { marginTop: 4 }]}>
                  <Ionicons
                    name="bed-outline"
                    size={14}
                    color={isDark ? "#94A3B8" : "#64748B"}
                  />
                  <Text
                    style={
                      isDark
                        ? { color: "#94A3B8", fontSize: 12 }
                        : styles.ticketMetaText
                    }
                  >
                    {
                      CABIN_TYPES.find((c) => c.key === selectedCabin)?.[
                        language === "vi" ? "labelVi" : "labelEn"
                      ]
                    }
                  </Text>
                </View>
              )}
              <View style={styles.ticketMetaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
                <Text
                  style={
                    isDark
                      ? { color: "#94A3B8", fontSize: 12 }
                      : styles.ticketMetaText
                  }
                >
                  {tour.location}
                </Text>
                <View style={{ width: 16 }} />
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
                <Text
                  style={
                    isDark
                      ? { color: "#94A3B8", fontSize: 12 }
                      : styles.ticketMetaText
                  }
                >
                  {isCruise ? selectedDate : tour.days}
                </Text>
              </View>
            </View>

            <View style={dynamicStyles.ticketDivider} />

            <View style={styles.ticketSection}>
              <Text style={styles.ticketLabel}>
                {t("personal_info", "HÀNH KHÁCH ĐẠI DIỆN")}
              </Text>
              <Text style={dynamicStyles.ticketValue}>
                {contactName} ({contactPhone})
              </Text>
              <Text style={dynamicStyles.ticketValueSub}>{contactEmail}</Text>

              <View style={{ height: 8 }} />
              <Text style={styles.ticketLabel}>
                {t("checkout_passengers", "DANH SÁCH HÀNH KHÁCH")} (
                {passengers.length} {language === "vi" ? "người" : "people"})
              </Text>
              {passengers.map((p, idx) => (
                <Text key={idx} style={dynamicStyles.ticketPassengerItem}>
                  {idx + 1}. {p.name} -{" "}
                  {p.type === "adult"
                    ? t("checkout_adults", "Người lớn")
                    : t("checkout_children", "Trẻ em")}
                </Text>
              ))}
            </View>

            <View style={dynamicStyles.ticketDivider} />

            <View style={styles.ticketSection}>
              <View style={styles.ticketTotalRow}>
                <Text style={styles.ticketTotalLabel}>
                  {t("curr_label", "PHƯƠNG THỨC")}
                </Text>
                <Text style={dynamicStyles.ticketTotalValueText}>
                  {paymentMethod === "vnpay" && "VNPAY"}
                  {paymentMethod === "momo" && "Ví MoMo"}
                  {paymentMethod === "bank" && "Chuyển khoản"}
                  {paymentMethod === "cash" && "Tiền mặt"}
                </Text>
              </View>
              <View style={styles.ticketTotalRow}>
                <Text style={styles.ticketTotalLabel}>
                  {t("status_label", "TRẠNG THÁI")}
                </Text>
                <Text
                  style={[
                    dynamicStyles.ticketTotalValueText,
                    { color: "#2E7D32", fontWeight: "bold" },
                  ]}
                >
                  {t("status_confirmed", "Đã thanh toán")}
                </Text>
              </View>
              <View style={[styles.ticketTotalRow, { marginTop: 10 }]}>
                <Text style={styles.ticketTotalLabelBig}>
                  {t("checkout_total_price", "TỔNG TIỀN")}
                </Text>
                <Text style={dynamicStyles.ticketTotalValueBig}>
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.successActions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.replace("/(tabs)/bookings")}
            >
              <Text style={styles.primaryBtnText}>
                {t("bookings_title", "Xem đơn hàng của tôi")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.outlineBtnText}>
                {t("home", "Quay lại trang chủ")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[dynamicStyles.mainWrap, { paddingTop: insets.top }]}>
        {/* Header navigation bar */}
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#F1F5F9" : "#0F172A"}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>
            {t("checkout_title", "Xác nhận & Thanh toán")}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Order summary card */}
          <View style={dynamicStyles.summaryCard}>
            <Image source={{ uri: tour.image }} style={styles.tourImage} />
            <View style={styles.tourDetails}>
              <Text style={styles.tourCategory}>
                {language === "vi"
                  ? tour.category
                  : tour.category === "Trong nước"
                    ? "Domestic"
                    : tour.category === "Du thuyền"
                      ? "Cruises"
                      : "International"}
              </Text>
              <Text style={dynamicStyles.tourTitleText} numberOfLines={2}>
                {tour.title}
              </Text>
              {isCruise && (
                <View style={styles.tourInfoRow}>
                  <Ionicons
                    name="bed-outline"
                    size={14}
                    color={isDark ? "#94A3B8" : "#64748B"}
                  />
                  <Text style={dynamicStyles.tourInfoText} numberOfLines={1}>
                    {
                      CABIN_TYPES.find((c) => c.key === selectedCabin)?.[
                        language === "vi" ? "labelVi" : "labelEn"
                      ]
                    }{" "}
                    • {language === "vi" ? "Khởi hành" : "Departure"}:{" "}
                    {selectedDate}
                  </Text>
                </View>
              )}
              <View style={styles.tourInfoRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
                <Text style={dynamicStyles.tourInfoText} numberOfLines={1}>
                  {tour.location}
                </Text>
              </View>
              <View style={styles.tourInfoRow}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
                <Text style={dynamicStyles.tourInfoText}>{tour.days}</Text>
              </View>
              <View style={dynamicStyles.tourPriceRow}>
                <Text style={dynamicStyles.tourPriceLabel}>
                  {t("tour_price", "Giá từ")}:
                </Text>
                <Text style={styles.tourPriceText}>
                  {formatPrice(basePriceNum)}
                </Text>
              </View>
            </View>
          </View>

          {/* Cabin Type Selector - only for cruise */}
          {isCruise && (
            <View style={dynamicStyles.sectionCard}>
              <Text style={dynamicStyles.sectionTitle}>
                🛏️ {language === "vi" ? "Chọn loại cabin" : "Select Cabin Type"}
              </Text>
              {CABIN_TYPES.map((cabin) => {
                const isActive = selectedCabin === cabin.key;
                const cabinPrice = Math.round(
                  (MOCK_CRUISES.find((c) => c.id === id)?.priceNum ?? 0) *
                    cabin.multiplier,
                );
                return (
                  <TouchableOpacity
                    key={cabin.key}
                    activeOpacity={0.8}
                    style={[
                      styles.cabinCard,
                      isDark && styles.cabinCardDark,
                      isActive && styles.cabinCardActive,
                      isActive && isDark && styles.cabinCardActiveDark,
                    ]}
                    onPress={() => setSelectedCabin(cabin.key)}
                  >
                    <View style={styles.cabinLeft}>
                      <View
                        style={[
                          styles.cabinIconBox,
                          isActive && styles.cabinIconBoxActive,
                        ]}
                      >
                        <Ionicons
                          name={
                            cabin.key === "standard"
                              ? "bed-outline"
                              : cabin.key === "deluxe"
                                ? "star-outline"
                                : "diamond-outline"
                          }
                          size={20}
                          color={
                            isActive
                              ? "#FFFFFF"
                              : isDark
                                ? "#94A3B8"
                                : "#64748B"
                          }
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.cabinLabel,
                            isDark && { color: "#F1F5F9" },
                            isActive && { color: "#FF702A" },
                          ]}
                        >
                          {language === "vi" ? cabin.labelVi : cabin.labelEn}
                        </Text>
                        <Text
                          style={[
                            styles.cabinDesc,
                            isDark && { color: "#64748B" },
                          ]}
                          numberOfLines={2}
                        >
                          {language === "vi" ? cabin.descVi : cabin.descEn}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.cabinPrice}>
                        {formatCurrency(cabinPrice)}
                      </Text>
                      <Text
                        style={[
                          styles.cabinPricePer,
                          isDark && { color: "#64748B" },
                        ]}
                      >
                        /{language === "vi" ? "người" : "pax"}
                      </Text>
                    </View>
                    {isActive && (
                      <View style={styles.cabinCheckMark}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#FF702A"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Departure Date Selector - only for cruise */}
          {isCruise && (
            <View style={dynamicStyles.sectionCard}>
              <Text style={dynamicStyles.sectionTitle}>
                📅{" "}
                {language === "vi"
                  ? "Chọn ngày khởi hành"
                  : "Select Departure Date"}
              </Text>
              <View style={styles.datesGrid}>
                {DEPARTURE_DATES.map((date) => (
                  <TouchableOpacity
                    key={date}
                    activeOpacity={0.8}
                    style={[
                      styles.dateChip,
                      isDark && styles.dateChipDark,
                      selectedDate === date && styles.dateChipActive,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={
                        selectedDate === date
                          ? "#FFFFFF"
                          : isDark
                            ? "#94A3B8"
                            : "#64748B"
                      }
                    />
                    <Text
                      style={[
                        styles.dateChipText,
                        isDark && { color: "#94A3B8" },
                        selectedDate === date && styles.dateChipTextActive,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Passenger count selector */}
          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitle}>
              👥 {t("checkout_passengers", "Chọn số lượng hành khách")}
            </Text>
            <View style={styles.counterRow}>
              <View>
                <Text style={dynamicStyles.counterLabel}>
                  {t("checkout_adults", "Người lớn")}
                </Text>
                <Text style={dynamicStyles.counterSubLabel}>
                  {formatCurrency(adultPrice)}/
                  {language === "vi" ? "người" : "pax"}
                </Text>
              </View>
              <View style={styles.counterControl}>
                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    adultCount <= 1 && styles.counterBtnDisabled,
                  ]}
                  onPress={() => handleAdultChange(adultCount - 1)}
                  disabled={adultCount <= 1}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={dynamicStyles.counterValue}>{adultCount}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleAdultChange(adultCount + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={dynamicStyles.counterDivider} />

            <View style={styles.counterRow}>
              <View>
                <Text style={dynamicStyles.counterLabel}>
                  {t("checkout_children", "Trẻ em")} (3 - 12{" "}
                  {language === "vi" ? "tuổi" : "years old"})
                </Text>
                <Text style={dynamicStyles.counterSubLabel}>
                  {formatCurrency(childPrice)}/
                  {language === "vi" ? "người" : "pax"}
                </Text>
              </View>
              <View style={styles.counterControl}>
                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    childCount <= 0 && styles.counterBtnDisabled,
                  ]}
                  onPress={() => handleChildChange(childCount - 1)}
                  disabled={childCount <= 0}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={dynamicStyles.counterValue}>{childCount}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleChildChange(childCount + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Contact Details Form */}
          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitle}>
              📝 {t("checkout_contact_info", "Thông tin liên hệ nhận vé")}
            </Text>
            <View style={styles.inputWrap}>
              <Text style={dynamicStyles.inputLabel}>
                {t("checkout_fullname", "Họ và tên người đặt")} *
              </Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder={
                  language === "vi" ? "Ví dụ: Nguyễn Văn Trứ" : "E.g. John Doe"
                }
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                value={contactName}
                onChangeText={setContactName}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={dynamicStyles.inputLabel}>
                {t("checkout_phone", "Số điện thoại")} *
              </Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="09xx xxx xxx"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={dynamicStyles.inputLabel}>
                {t("checkout_email", "Email nhận vé điện tử")} *
              </Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="email@example.com"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                keyboardType="email-address"
                autoCapitalize="none"
                value={contactEmail}
                onChangeText={setContactEmail}
              />
            </View>
          </View>

          {/* Passengers Forms List */}
          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitle}>
              📋 {t("checkout_passengers", "Thông tin hành khách chi tiết")}
            </Text>
            {passengers.map((passenger, index) => (
              <View key={index} style={dynamicStyles.passengerFormBlock}>
                <Text style={dynamicStyles.passengerFormHeader}>
                  {t("checkout_passengers", "Hành khách")} #{index + 1} -{" "}
                  {passenger.type === "adult"
                    ? t("checkout_adults", "Người lớn")
                    : t("checkout_children", "Trẻ em")}
                </Text>
                <View style={styles.inputWrap}>
                  <Text style={dynamicStyles.inputLabel}>
                    {t("checkout_fullname", "Họ và tên hành khách")} *
                  </Text>
                  <TextInput
                    style={dynamicStyles.input}
                    placeholder={
                      language === "vi" ? "Nhập đầy đủ tên" : "Enter full name"
                    }
                    placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                    value={passenger.name}
                    onChangeText={(text) =>
                      handlePassengerDataChange(
                        index,
                        text,
                        passenger.birthYear,
                      )
                    }
                  />
                </View>
                {passenger.type === "child" && (
                  <View style={styles.inputWrap}>
                    <Text style={dynamicStyles.inputLabel}>
                      {language === "vi"
                        ? "Năm sinh trẻ em *"
                        : "Child birth year *"}
                    </Text>
                    <TextInput
                      style={dynamicStyles.input}
                      placeholder="Ví dụ: 2018"
                      placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                      keyboardType="number-pad"
                      value={passenger.birthYear}
                      onChangeText={(text) =>
                        handlePassengerDataChange(index, passenger.name, text)
                      }
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Coupon Code Section */}
          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitle}>
              🏷️ {t("checkout_discount", "Mã giảm giá / Voucher")}
            </Text>
            <View style={styles.couponRow}>
              <TextInput
                style={[
                  dynamicStyles.input,
                  { flex: 1, textTransform: "uppercase" },
                ]}
                placeholder={
                  language === "vi"
                    ? "Nhập mã (Ví dụ: DALAT15, CHUANBAY)"
                    : "Enter coupon (E.g. DALAT15)"
                }
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                value={couponCode}
                onChangeText={setCouponCode}
                editable={!appliedCoupon}
              />
              {appliedCoupon ? (
                <TouchableOpacity
                  style={styles.couponRemoveBtn}
                  onPress={handleRemoveCoupon}
                >
                  <Text style={styles.couponRemoveText}>
                    {language === "vi" ? "Gỡ bỏ" : "Remove"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.couponApplyBtn}
                  onPress={handleApplyCoupon}
                >
                  <Text style={styles.couponApplyText}>
                    {language === "vi" ? "Áp dụng" : "Apply"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {appliedCoupon && (
              <View style={styles.couponSuccessAlert}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.couponSuccessAlertText}>
                  {language === "vi" ? "Đã áp dụng mã" : "Applied coupon"}{" "}
                  {appliedCoupon} (-{formatCurrency(discountAmount)})
                </Text>
              </View>
            )}
          </View>

          {/* Payment Method Selector */}
          <View style={dynamicStyles.sectionCard}>
            <Text style={dynamicStyles.sectionTitle}>
              💳 {t("payment_method", "Chọn phương thức thanh toán")}
            </Text>

            {/* VNPAY */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                dynamicStyles.paymentCard,
                paymentMethod === "vnpay" && dynamicStyles.paymentCardActive,
              ]}
              onPress={() => setPaymentMethod("vnpay")}
            >
              <View style={styles.paymentLogoWrapper}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={24}
                  color="#FF702A"
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={dynamicStyles.paymentTitle}>
                  {language === "vi"
                    ? "Cổng thanh toán VNPAY-QR"
                    : "VNPAY-QR Payment Gateway"}
                </Text>
                <Text style={dynamicStyles.paymentDesc}>
                  {language === "vi"
                    ? "Thanh toán nhanh bằng QR Code qua Mobile Banking ngân hàng."
                    : "Fast payment using QR Code via Mobile Banking apps."}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMethod === "vnpay" && styles.radioCircleActive,
                ]}
              >
                {paymentMethod === "vnpay" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </TouchableOpacity>

            {/* MoMo */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                dynamicStyles.paymentCard,
                paymentMethod === "momo" && dynamicStyles.paymentCardActive,
              ]}
              onPress={() => setPaymentMethod("momo")}
            >
              <View
                style={[
                  styles.paymentLogoWrapper,
                  { backgroundColor: "#FFDCE5" },
                ]}
              >
                <Ionicons name="wallet-outline" size={24} color="#D81B60" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={dynamicStyles.paymentTitle}>
                  {language === "vi" ? "Ví điện tử MoMo" : "MoMo E-Wallet"}
                </Text>
                <Text style={dynamicStyles.paymentDesc}>
                  {language === "vi"
                    ? "Tự động mở ứng dụng Ví MoMo và liên kết thanh toán tức thì."
                    : "Automatically open MoMo app for instant linked payment."}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMethod === "momo" && styles.radioCircleActive,
                ]}
              >
                {paymentMethod === "momo" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </TouchableOpacity>

            {/* Bank Transfer */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                dynamicStyles.paymentCard,
                paymentMethod === "bank" && dynamicStyles.paymentCardActive,
              ]}
              onPress={() => setPaymentMethod("bank")}
            >
              <View
                style={[
                  styles.paymentLogoWrapper,
                  { backgroundColor: "#E0F2F1" },
                ]}
              >
                <MaterialCommunityIcons
                  name="bank-transfer"
                  size={26}
                  color="#00796B"
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={dynamicStyles.paymentTitle}>
                  {language === "vi"
                    ? "Chuyển khoản Ngân hàng (Auto)"
                    : "Bank Transfer (Auto)"}
                </Text>
                <Text style={dynamicStyles.paymentDesc}>
                  {language === "vi"
                    ? "Chuyển tiền nhanh 24/7 qua hệ thống số tài khoản ảo tự động nhận dạng."
                    : "Fast transfer 24/7 through virtual account system."}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMethod === "bank" && styles.radioCircleActive,
                ]}
              >
                {paymentMethod === "bank" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </TouchableOpacity>

            {/* Cash at Office */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                dynamicStyles.paymentCard,
                paymentMethod === "cash" && dynamicStyles.paymentCardActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <View
                style={[
                  styles.paymentLogoWrapper,
                  { backgroundColor: "#E2E8F0" },
                ]}
              >
                <Ionicons name="cash-outline" size={24} color="#475569" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={dynamicStyles.paymentTitle}>
                  {language === "vi"
                    ? "Thanh toán tại văn phòng (Tiền mặt)"
                    : "Pay at Office (Cash)"}
                </Text>
                <Text style={dynamicStyles.paymentDesc}>
                  {language === "vi"
                    ? "Nộp tiền mặt trực tiếp tại các chi nhánh TravelViet trên toàn quốc."
                    : "Pay cash directly at any TravelViet branch office."}
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  paymentMethod === "cash" && styles.radioCircleActive,
                ]}
              >
                {paymentMethod === "cash" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Pricing detail bill card */}
          <View style={dynamicStyles.billCard}>
            <Text style={dynamicStyles.billTitle}>
              {t("checkout_price_summary", "Chi tiết hóa đơn")}
            </Text>
            <View style={styles.billRow}>
              <Text style={dynamicStyles.billLabel}>
                {t("checkout_adults", "Người lớn")} ({adultCount}{" "}
                {language === "vi" ? "khách" : "pax"})
              </Text>
              <Text style={dynamicStyles.billValue}>
                {formatCurrency(adultCount * adultPrice)}
              </Text>
            </View>
            {childCount > 0 && (
              <View style={styles.billRow}>
                <Text style={dynamicStyles.billLabel}>
                  {t("checkout_children", "Trẻ em")} ({childCount}{" "}
                  {language === "vi" ? "khách" : "pax"})
                </Text>
                <Text style={dynamicStyles.billValue}>
                  {formatCurrency(childCount * childPrice)}
                </Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={dynamicStyles.billLabel}>
                {t("checkout_tax", "Thuế giá trị gia tăng (10%)")}
              </Text>
              <Text style={dynamicStyles.billValue}>{formatCurrency(tax)}</Text>
            </View>
            {appliedCoupon && (
              <View style={styles.billRow}>
                <Text style={[dynamicStyles.billLabel, { color: "#2E7D32" }]}>
                  {t("checkout_discount", "Mã giảm giá")} ({appliedCoupon})
                </Text>
                <Text style={[dynamicStyles.billValue, { color: "#2E7D32" }]}>
                  -{formatCurrency(discountAmount)}
                </Text>
              </View>
            )}
            <View style={dynamicStyles.billDivider} />
            <View style={[styles.billRow, { marginTop: 10 }]}>
              <Text style={dynamicStyles.billLabelTotal}>
                {t("checkout_final_total", "TỔNG CỘNG")}
              </Text>
              <Text style={dynamicStyles.billValueTotal}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </View>

          {/* Beach Footer at bottom */}
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
            }}
            style={styles.footerBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(100, 180, 180, 0.45)", "rgba(20, 80, 90, 0.95)"]}
              style={styles.footerGradient}
            >
              <Text style={styles.footerBigTitle}>
                Let{"'"}s design a tour that{"'"}s truly yours
              </Text>
              <View style={styles.footerBottom}>
                <Text style={styles.footerLogo}>TravelViet</Text>
                <Text style={styles.footerCopyright}>
                  Copyright © 2026 TravelViet. All rights reserved.
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer sticky purchase CTA */}
        <View style={dynamicStyles.bottomBar}>
          <View>
            <Text style={dynamicStyles.bottomBarLabel}>
              {t("checkout_total_price", "Tổng tiền")}
            </Text>
            <Text style={dynamicStyles.bottomBarValue}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.confirmBtnText}>
                  {t("checkout_pay_button", "Thanh Toán")}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  scrollContainer: {
    flex: 1,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  tourImage: {
    width: 110,
    height: "100%",
    minHeight: 120,
  },
  tourDetails: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  tourCategory: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF702A",
    textTransform: "uppercase",
  },
  tourTitleText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 18,
  },
  tourInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tourInfoText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    flex: 1,
  },
  tourPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tourPriceLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  tourPriceText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FF702A",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  counterSubLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },
  counterControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFEFE6",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.5,
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF702A",
  },
  counterValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    minWidth: 20,
    textAlign: "center",
  },
  counterDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  inputWrap: {
    gap: 6,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  passengerFormBlock: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FAFCFF",
    marginBottom: 10,
  },
  passengerFormHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF702A",
    marginBottom: 10,
  },
  couponRow: {
    flexDirection: "row",
    gap: 10,
  },
  couponApplyBtn: {
    height: 48,
    backgroundColor: "#FF702A",
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  couponApplyText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  couponRemoveBtn: {
    height: 48,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  couponRemoveText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  couponSuccessAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  couponSuccessAlertText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
    gap: 10,
  },
  paymentCardActive: {
    borderColor: "#FF702A",
    backgroundColor: "#FFF8F5",
  },
  paymentLogoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#FFEFE6",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: {
    flex: 1,
    gap: 2,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  paymentDesc: {
    fontSize: 10,
    color: "#64748B",
    lineHeight: 14,
    fontWeight: "500",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: "#FF702A",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF702A",
  },
  billCard: {
    backgroundColor: "#0F2C2C",
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "600",
  },
  billValue: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  billDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 4,
  },
  billLabelTotal: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  billValueTotal: {
    fontSize: 18,
    color: "#FFB800",
    fontWeight: "900",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  bottomBarLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  bottomBarValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF702A",
    marginTop: 2,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FF702A",
    borderRadius: 24,
    paddingHorizontal: 24,
    height: 48,
    justifyContent: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  // Cabin type selector
  cabinCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
    gap: 10,
    position: "relative",
  },
  cabinCardDark: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
  },
  cabinCardActive: {
    borderColor: "#FF702A",
    backgroundColor: "#FFF8F5",
  },
  cabinCardActiveDark: {
    borderColor: "#FF702A",
    backgroundColor: "#2C1D16",
  },
  cabinLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  cabinIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cabinIconBoxActive: {
    backgroundColor: "#FF702A",
  },
  cabinLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  cabinDesc: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 14,
    marginTop: 2,
  },
  cabinPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FF702A",
  },
  cabinPricePer: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  cabinCheckMark: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  // Departure dates
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  dateChipDark: {
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  dateChipActive: {
    backgroundColor: "#FF702A",
    borderColor: "#FF702A",
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  dateChipTextActive: {
    color: "#FFFFFF",
  },
  footerBackground: {
    width: "100%",
    marginTop: 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
  },
  footerBigTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 20,
    lineHeight: 32,
    maxWidth: "90%",
  },
  footerBottom: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 16,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  footerCopyright: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#F8FAFC",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  errorBtn: {
    backgroundColor: "#FF702A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  successWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
    alignItems: "center",
  },
  successBadgeContainer: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  ticketContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    overflow: "hidden",
  },
  ticketCutoutLeft: {
    position: "absolute",
    left: -12,
    top: "30%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 10,
  },
  ticketCutoutRight: {
    position: "absolute",
    right: -12,
    top: "30%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 10,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  ticketLogo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FF702A",
    letterSpacing: 0.5,
  },
  ticketCodeBlock: {
    alignItems: "flex-end",
  },
  ticketCodeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
  },
  ticketCodeValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  ticketDivider: {
    height: 1.5,
    borderStyle: "dashed",
    borderRadius: 1,
    borderColor: "#CBD5E1",
    marginVertical: 14,
    width: "100%",
  },
  ticketSection: {
    gap: 4,
  },
  ticketLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  ticketTourTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 20,
  },
  ticketMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ticketMetaText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginLeft: 4,
  },
  ticketValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  ticketValueSub: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  ticketPassengerItem: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
  ticketTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ticketTotalLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  ticketTotalValueText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  ticketTotalLabelBig: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  ticketTotalValueBig: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF702A",
  },
  successActions: {
    width: "100%",
    gap: 12,
    marginTop: 24,
  },
  primaryBtn: {
    backgroundColor: "#FF702A",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  outlineBtn: {
    backgroundColor: "#FFFFFF",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#FF702A",
  },
  outlineBtnText: {
    color: "#FF702A",
    fontWeight: "800",
    fontSize: 15,
  },
});
