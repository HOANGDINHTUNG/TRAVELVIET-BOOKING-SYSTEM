import React, { useState, useEffect, useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ImageBackground,
  StyleProp,
  ViewStyle,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getApiBaseUrl } from "@/config/apiBaseUrl";
import { adminPreferencesCopy } from "@/constants/adminPreferencesCopy";
import { clearAuthSession, getAuthSession } from "@/services/authStorage";
import { setAiChatAccessTokenProvider } from "@/services/aiChatApi";
import { AppRoutes, asHref } from "@/lib/navigation";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { updateMyProfile } from "@/services/profileApi";

interface ProfileInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  style,
}) => {
  const { theme } = useAppSettings();
  const isDark = theme === "dark";
  return (
    <View style={[styles.inputGroup, style]}>
      <Text style={[styles.inputLabel, isDark && { color: "#94A3B8" }]}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          isDark && {
            borderColor: "#475569",
            backgroundColor: "#334155",
            color: "#FFFFFF",
          },
        ]}
      />
    </View>
  );
};

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  iconName?: string;
  initialOpen?: boolean;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subtitle,
  children,
  iconName,
  initialOpen = false,
}) => {
  const { theme } = useAppSettings();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <View
      style={[
        styles.card,
        isDark && { backgroundColor: "#1E293B", borderColor: "#334155" },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen((prev) => !prev)}
        style={[
          styles.cardHeader,
          isDark && { borderBottomColor: "#334155" },
          !isOpen && { borderBottomWidth: 0 },
        ]}
      >
        <View style={styles.cardHeaderLeft}>
          {iconName && (
            <Ionicons
              name={iconName as any}
              size={18}
              color={isDark ? "#FF5B22" : "#9C6644"}
              style={{ marginRight: 10 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, isDark && { color: "#F1F5F9" }]}>
              {title}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={isDark ? "#94A3B8" : "#64748B"}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.cardBody}>
          {subtitle && (
            <Text
              style={[
                styles.cardSubtitleInBody,
                isDark && { color: "#94A3B8" },
              ]}
            >
              {subtitle}
            </Text>
          )}
          {children}
        </View>
      )}
    </View>
  );
};

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const { edit } = useLocalSearchParams<{ edit?: string }>();

  const {
    theme,
    setTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    formatPrice,
    t,
    userAvatar,
    setUserAvatar,
    userFullName,
    setUserFullName,
    userDisplayName,
    setUserDisplayName,
    userPhone,
    setUserPhone,
    userEmail,
    setUserEmail,
    userDob,
    setUserDob,
    userGender,
    setUserGender,
    userCoverImage,
    setUserCoverImage,
  } = useAppSettings();

  const isDark = theme === "dark";

  const session = getAuthSession();
  const permissions = session?.permissions ?? [];

  const [showEditPen, setShowEditPen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  useScrollToTop(scrollViewRef);

  // Form states
  const [fullName, setFullName] = useState(userFullName);
  const [displayName, setDisplayName] = useState(userDisplayName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [dob, setDob] = useState(userDob);
  const [gender, setGender] = useState(userGender);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);
  const [tempCover, setTempCover] = useState(userCoverImage);

  // Address states
  const [country, setCountry] = useState("Việt Nam");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("Quận 1");
  const [ward, setWard] = useState("Phường Bến Nghé");
  const [specificAddress, setSpecificAddress] = useState("123 Nguyễn Huệ");
  const [zipcode, setZipcode] = useState("700000");

  // Voucher states
  const [voucherCode, setVoucherCode] = useState("");

  // Travel Preferences states
  const [favDest, setFavDest] = useState("Vịnh Hạ Long, Phú Quốc");
  const [tourType, setTourType] = useState("Tour trọn gói, Nghỉ dưỡng");
  const [transport, setTransport] = useState("Máy bay, Du thuyền");
  const [stayType, setStayType] = useState("Resort 5 sao");

  // Sync internal state when context values change
  useEffect(() => {
    setFullName(userFullName);
    setDisplayName(userDisplayName);
    setPhone(userPhone);
    setEmail(userEmail);
    setDob(userDob);
    setGender(userGender);
    setTempAvatar(userAvatar);
    setTempCover(userCoverImage);
  }, [
    userFullName,
    userDisplayName,
    userPhone,
    userEmail,
    userDob,
    userGender,
    userAvatar,
    userCoverImage,
  ]);

  // Sync edit parameter on mount or change
  useEffect(() => {
    if (edit === "true") {
      setShowEditPen(true);
      setIsEditModalOpen(true);
      router.replace("/preferences");
    }
  }, [edit]);

  const handleLogout = () => {
    Alert.alert(
      adminPreferencesCopy.logoutTitle,
      adminPreferencesCopy.logoutMessage,
      [
        { text: adminPreferencesCopy.cancel, style: "cancel" },
        {
          text: adminPreferencesCopy.logout,
          style: "destructive",
          onPress: async () => {
            await clearAuthSession();
            setAiChatAccessTokenProvider(null);
            router.replace(asHref(AppRoutes.login));
          },
        },
      ],
    );
  };

  const handleSaveProfile = async () => {
    try {
      const mappedGender =
        gender === "Nam" ? "MALE" : gender === "Nữ" ? "FEMALE" : "OTHER";
      await updateMyProfile({
        fullName,
        displayName,
        phone,
        gender: mappedGender,
      });
      setUserFullName(fullName);
      setUserDisplayName(displayName);
      setUserPhone(phone);
      setUserEmail(email);
      setUserDob(dob);
      setUserGender(gender);
      showSnackbar(
        language === "vi"
          ? "Đã lưu hồ sơ cá nhân thành công!"
          : "Saved profile successfully!",
      );
    } catch (e) {
      showSnackbar(
        language === "vi" ? "Không thể lưu hồ sơ" : "Could not save profile",
      );
    }
  };

  const handleSaveAddress = () => {
    showSnackbar(
      language === "vi"
        ? "Đã lưu địa chỉ thành công!"
        : "Saved address successfully!",
    );
  };

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      Alert.alert(
        language === "vi" ? "Thông báo" : "Notification",
        language === "vi"
          ? "Vui lòng nhập mã voucher."
          : "Please enter voucher code.",
      );
      return;
    }
    showSnackbar(
      language === "vi"
        ? `Áp dụng voucher ${voucherCode.trim()} thành công!`
        : `Applied voucher ${voucherCode.trim()} successfully!`,
    );
    setVoucherCode("");
  };

  const handleSavePreferences = () => {
    showSnackbar(
      language === "vi"
        ? "Đã lưu sở thích du lịch thành công!"
        : "Saved travel preferences successfully!",
    );
  };

  const handleModalSave = async () => {
    try {
      const mappedGender =
        gender === "Nam" ? "MALE" : gender === "Nữ" ? "FEMALE" : "OTHER";
      await updateMyProfile({
        fullName,
        displayName,
        phone,
        gender: mappedGender,
      });
      setUserFullName(fullName);
      setUserDisplayName(displayName);
      setUserPhone(phone);
      setUserEmail(email);
      setUserDob(dob);
      setUserGender(gender);
      setUserAvatar(tempAvatar);
      setUserCoverImage(tempCover);
      setIsEditModalOpen(false);
      setShowEditPen(false);
      showSnackbar(
        language === "vi"
          ? "Đã cập nhật thông tin cá nhân thành công!"
          : "Updated profile details successfully!",
      );
    } catch (e) {
      showSnackbar(
        language === "vi"
          ? "Không thể cập nhật hồ sơ"
          : "Could not update profile",
      );
    }
  };

  const handlePickImage = async (type: "avatar" | "cover") => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          language === "vi" ? "Quyền truy cập" : "Permission Required",
          language === "vi"
            ? "Chúng tôi cần quyền truy cập thư viện ảnh để thay đổi ảnh của bạn."
            : "We need camera roll permissions to change your image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: type === "avatar" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (type === "avatar") {
          setTempAvatar(selectedUri);
        } else {
          setTempCover(selectedUri);
        }
        showSnackbar(
          language === "vi"
            ? "Đã chọn ảnh thành công!"
            : "Image selected successfully!",
        );
      }
    } catch (error) {
      Alert.alert(
        language === "vi" ? "Lỗi" : "Error",
        language === "vi"
          ? "Không thể mở thư viện ảnh."
          : "Could not open image library.",
      );
    }
  };

  const handleTakePhoto = async (type: "avatar" | "cover") => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          language === "vi" ? "Quyền truy cập" : "Permission Required",
          language === "vi"
            ? "Chúng tôi cần quyền truy cập camera để chụp ảnh mới."
            : "We need camera permissions to take a new photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: type === "avatar" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (type === "avatar") {
          setTempAvatar(selectedUri);
        } else {
          setTempCover(selectedUri);
        }
        showSnackbar(
          language === "vi"
            ? "Đã chụp ảnh thành công!"
            : "Photo captured successfully!",
        );
      }
    } catch (error) {
      Alert.alert(
        language === "vi" ? "Lỗi" : "Error",
        language === "vi" ? "Không thể mở máy ảnh." : "Could not open camera.",
      );
    }
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#0F172A" }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Gradient Header Banner */}
        <LinearGradient
          colors={isDark ? ["#3E2517", "#2A180E"] : ["#8E5A3C", "#5A3722"]}
          style={[
            styles.headerBanner,
            { paddingTop: insets.top + 16, overflow: "hidden" },
          ]}
        >
          {/* Background image if user customized it */}
          {userCoverImage ? (
            <Image
              source={{ uri: userCoverImage }}
              style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
            />
          ) : null}

          {/* Background pressable to toggle edit pen on cover click */}
          <Pressable
            style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
            onPress={() => setShowEditPen(true)}
          />

          {/* Settings button in the top-right corner */}
          <TouchableOpacity
            onPress={() => setIsSettingsModalOpen(true)}
            style={[styles.settingsBtn, { top: insets.top + 8 }]}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Horizontal Row containing Avatar (left) and Text Info (right) */}
          <View style={styles.profileRow}>
            {/* Avatar Container Pressable */}
            <Pressable
              onPress={() => setShowEditPen(true)}
              style={[styles.avatarPressable, { zIndex: 10 }]}
            >
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: userAvatar }}
                  style={styles.avatarImage}
                />
                {showEditPen && (
                  <TouchableOpacity
                    style={styles.editPenOverlay}
                    onPress={(e) => {
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="pencil" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              {!showEditPen && (
                <View
                  style={[
                    styles.verifiedBadge,
                    isDark
                      ? styles.verifiedBadgeDark
                      : { borderColor: "#5A3722" },
                  ]}
                >
                  <Ionicons name="checkmark-sharp" size={10} color="#FFFFFF" />
                </View>
              )}
            </Pressable>

            {/* Text Info Pressable */}
            <Pressable
              onPress={() => setShowEditPen(true)}
              style={{ zIndex: 10, flex: 1 }}
            >
              <Text style={styles.headerTitle} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={2}>
                {email}
              </Text>

              {/* Member level badge */}
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>
                  {language === "vi" ? "HỘ CHIẾU VÀNG" : "GOLD EXPLORER"}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* stats mini card widgets inside banner */}
          <View style={[styles.statsRow, { zIndex: 20 }]}>
            <TouchableOpacity
              style={[
                styles.statCard,
                isDark && { backgroundColor: "rgba(255, 255, 255, 0.06)" },
              ]}
              onPress={() => router.push("/travel-passport")}
              activeOpacity={0.8}
            >
              <Ionicons name="ribbon-outline" size={16} color="#FFF" />
              <Text style={styles.statValue}>bronze</Text>
              <Text style={styles.statLabel}>
                {t("membership", "HẠNG THÀNH VIÊN")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statCard,
                isDark && { backgroundColor: "rgba(255, 255, 255, 0.06)" },
              ]}
              onPress={() => router.push("/travel-passport")}
              activeOpacity={0.8}
            >
              <Ionicons name="gift-outline" size={16} color="#FFF" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>
                {t("points", "ĐIỂM TÍCH LŨY")}
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.statCard,
                isDark && { backgroundColor: "rgba(255, 255, 255, 0.06)" },
              ]}
            >
              <Ionicons name="card-outline" size={16} color="#FFF" />
              <Text style={styles.statValue}>{formatPrice(0)}</Text>
              <Text style={styles.statLabel}>{t("spent", "TIỀN ĐÃ TIÊU")}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.statCard,
                isDark && { backgroundColor: "rgba(255, 255, 255, 0.06)" },
              ]}
              onPress={() => router.push("/help-center")}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#FFF" />
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>
                {t("support_sessions", "PHIÊN HỖ TRỢ")}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Mega Menu "Thêm" Category Card */}
        <SettingsCard
          title={language === "vi" ? "Khám phá danh mục" : "Explore Categories"}
          subtitle={
            language === "vi"
              ? "Khám phá nhanh các khu vực, dòng tour và cá nhân hóa."
              : "Quick links to destinations, categories, and account settings."
          }
          iconName="compass-outline"
        >
          <View style={styles.megaMenuGrid}>
            {/* Column 1: ĐIỂM ĐẾN */}
            <View style={styles.megaMenuCol}>
              <Text
                style={[
                  styles.megaMenuColTitle,
                  isDark && { color: "#94A3B8" },
                ]}
              >
                {language === "vi" ? "ĐIỂM ĐẾN" : "DESTINATION"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/explore")}
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Tất cả điểm đến" : "All Destinations"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/explore",
                    params: { region: "Mien Trung" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Miền Trung" : "Central Vietnam"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/explore",
                    params: { region: "Mien Bac" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Miền Bắc" : "Northern Vietnam"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/explore",
                    params: { region: "Mien Nam" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Miền Nam" : "Southern Vietnam"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/tours",
                    params: { keyword: "Đà Lạt" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  Tây Nguyên & Đà Lạt
                </Text>
              </TouchableOpacity>
            </View>

            {/* Column 2: KHÁM PHÁ */}
            <View style={styles.megaMenuCol}>
              <Text
                style={[
                  styles.megaMenuColTitle,
                  isDark && { color: "#94A3B8" },
                ]}
              >
                {language === "vi" ? "KHÁM PHÁ" : "EXPLORE"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/tours")}
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  Tour
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/tours",
                    params: { region: "Du lịch nước ngoài" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Tour nước ngoài" : "International"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/tours",
                    params: { tourLine: "Tour ESG & LỢI" },
                  })
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  Tour ESG & LỢI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/help-center")}
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {t("support", "Hỗ trợ")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Column 3: CÁ NHÂN */}
            <View style={styles.megaMenuCol}>
              <Text
                style={[
                  styles.megaMenuColTitle,
                  isDark && { color: "#94A3B8" },
                ]}
              >
                {language === "vi" ? "CÁ NHÂN" : "ACCOUNT"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/bookings")}
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Đơn đã đặt" : "My Bookings"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  showSnackbar(
                    language === "vi"
                      ? "Cuộn xuống thẻ Thông tin cá nhân bên dưới"
                      : "Scroll down to profile details",
                  )
                }
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Trang tài khoản" : "Account Page"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/travel-passport")}
                style={styles.megaMenuLink}
              >
                <Text
                  style={[
                    styles.megaMenuLinkText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  Passport
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SettingsCard>

        {/* 2. Lịch sử đặt tour (Tour history) Card */}
        <SettingsCard
          title={t("bookings", "Lịch sử đặt tour")}
          subtitle={
            language === "vi" ? "Đơn hàng của bạn." : "Your travel orders."
          }
          iconName="time-outline"
        >
          <View
            style={[
              styles.historyItem,
              isDark && { backgroundColor: "#334155", borderColor: "#475569" },
            ]}
          >
            <View style={styles.historyInfo}>
              <Text
                style={[styles.historyTitle, isDark && { color: "#F1F5F9" }]}
              >
                BK-3108 •{" "}
                {language === "vi"
                  ? "Hành Trình Di Sản Miền Tây"
                  : "Mekong Delta Heritage"}{" "}
                ({formatPrice(1200000)})
              </Text>
              <Text
                style={[styles.historyMeta, isDark && { color: "#94A3B8" }]}
              >
                {language === "vi"
                  ? "12 Tháng 5, 2026 • 3 Ngày 2 Đêm"
                  : "May 12, 2026 • 3 Days 2 Nights"}
              </Text>
            </View>
            <View style={styles.historyBadge}>
              <Text style={styles.historyBadgeText}>
                {language === "vi" ? "Hoàn thành" : "Completed"}
              </Text>
            </View>
          </View>
        </SettingsCard>

        {/* 3. Địa chỉ (Address) Card */}
        <SettingsCard
          title={language === "vi" ? "Địa chỉ" : "Address Book"}
          subtitle={
            language === "vi"
              ? "Sổ địa chỉ giao nhận của bạn."
              : "Your delivery address list."
          }
          iconName="location-outline"
        >
          <View style={styles.row}>
            <ProfileInput
              label={language === "vi" ? "QUỐC GIA" : "COUNTRY"}
              placeholder="Quốc gia"
              value={country}
              onChangeText={setCountry}
              style={{ flex: 1 }}
            />
            <ProfileInput
              label={language === "vi" ? "TỈNH THÀNH" : "CITY"}
              placeholder="Tỉnh thành"
              value={city}
              onChangeText={setCity}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.row}>
            <ProfileInput
              label={language === "vi" ? "QUẬN HUYỆN" : "DISTRICT"}
              placeholder="Quận huyện"
              value={district}
              onChangeText={setDistrict}
              style={{ flex: 1 }}
            />
            <ProfileInput
              label={language === "vi" ? "PHƯỜNG XÃ" : "WARD"}
              placeholder="Phường xã"
              value={ward}
              onChangeText={setWard}
              style={{ flex: 1 }}
            />
          </View>
          <ProfileInput
            label={language === "vi" ? "ĐỊA CHỈ CỤ THỂ" : "STREET ADDRESS"}
            placeholder="Số nhà, tên đường..."
            value={specificAddress}
            onChangeText={setSpecificAddress}
          />
          <ProfileInput
            label={language === "vi" ? "MÃ BƯU ĐIỆN" : "POSTAL CODE"}
            placeholder="Zipcode"
            value={zipcode}
            onChangeText={setZipcode}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isDark && { backgroundColor: "#FF5B22" },
            ]}
            onPress={handleSaveAddress}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add"
              size={18}
              color="#FFF"
              style={styles.btnIcon}
            />
            <Text style={styles.submitButtonText}>
              {language === "vi" ? "Thêm địa chỉ" : "Add address"}
            </Text>
          </TouchableOpacity>
        </SettingsCard>

        {/* 4. Voucher của tôi (My vouchers) Card */}
        <SettingsCard
          title={language === "vi" ? "Voucher của tôi" : "My Vouchers"}
          subtitle={
            language === "vi"
              ? "Áp dụng mã giảm giá ưu đãi."
              : "Apply discount promo codes."
          }
          iconName="pricetag-outline"
        >
          <View style={styles.voucherRow}>
            <TextInput
              placeholder={
                language === "vi" ? "Mã voucher..." : "Promo code..."
              }
              placeholderTextColor="#9CA3AF"
              value={voucherCode}
              onChangeText={setVoucherCode}
              style={[
                styles.input,
                { flex: 1 },
                isDark && {
                  borderColor: "#475569",
                  backgroundColor: "#334155",
                  color: "#FFFFFF",
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.voucherButton,
                isDark && { backgroundColor: "#FF5B22" },
              ]}
              onPress={handleApplyVoucher}
              activeOpacity={0.8}
            >
              <Text style={styles.voucherButtonText}>
                {language === "vi" ? "Nhận voucher" : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>
        </SettingsCard>

        {/* 5. Yêu thích (Wishlist) Card */}
        <SettingsCard
          title={language === "vi" ? "Yêu thích" : "Wishlist"}
          subtitle={
            language === "vi"
              ? "Các tour du lịch và khách sạn ưa thích của bạn."
              : "Your favorite tours and hotels."
          }
          iconName="heart-outline"
        >
          <Text style={[styles.emptyText, isDark && { color: "#64748B" }]}>
            {language === "vi"
              ? "Chưa có mục yêu thích nào."
              : "No wishlist items yet."}
          </Text>
        </SettingsCard>

        {/* 6. Đánh giá của tôi (My reviews) Card */}
        <SettingsCard
          title={language === "vi" ? "Đánh giá của tôi" : "My Reviews"}
          subtitle={
            language === "vi"
              ? "Ý kiến đóng góp và đánh giá của bạn về dịch vụ."
              : "Your review statistics and contributions."
          }
          iconName="star-outline"
        >
          <View style={styles.reviewsRow}>
            <View style={styles.reviewStat}>
              <Text
                style={[styles.reviewStatLabel, isDark && { color: "#94A3B8" }]}
              >
                {language === "vi" ? "Đã đánh giá" : "Reviewed"}
              </Text>
              <Text
                style={[styles.reviewStatValue, isDark && { color: "#FF5B22" }]}
              >
                1
              </Text>
            </View>
            <View style={styles.reviewStat}>
              <Text
                style={[styles.reviewStatLabel, isDark && { color: "#94A3B8" }]}
              >
                {language === "vi" ? "Đã đóng góp" : "Contributed"}
              </Text>
              <Text
                style={[styles.reviewStatValue, isDark && { color: "#FF5B22" }]}
              >
                0
              </Text>
            </View>
          </View>
        </SettingsCard>

        {/* 8. Sở thích du lịch (Travel preferences) Card */}
        <SettingsCard
          title={language === "vi" ? "Sở thích du lịch" : "Travel Preferences"}
          subtitle={
            language === "vi"
              ? "Cá nhân hóa trải nghiệm tìm kiếm và đề xuất tour của bạn."
              : "Personalize search results and recommendations."
          }
          iconName="airplane-outline"
        >
          <ProfileInput
            label={
              language === "vi" ? "ĐIỂM ĐẾN ƯA THÍCH" : "FAVORITE DESTINATIONS"
            }
            placeholder="Ví dụ: Sa Pa, Đà Nẵng, Vũng Tàu..."
            value={favDest}
            onChangeText={setFavDest}
          />
          <ProfileInput
            label={
              language === "vi"
                ? "LOẠI HÌNH TOUR YÊU THÍCH"
                : "FAVORITE TOUR TYPE"
            }
            placeholder="Ví dụ: Tour gia đình, Tour mạo hiểm..."
            value={tourType}
            onChangeText={setTourType}
          />
          <ProfileInput
            label={
              language === "vi" ? "PHƯƠNG TIỆN DI CHUYỂN" : "TRANSPORTATION"
            }
            placeholder="Ví dụ: Máy bay, ô tô, xe lửa..."
            value={transport}
            onChangeText={setTransport}
          />
          <ProfileInput
            label={language === "vi" ? "LOẠI HÌNH NƠI Ở" : "ACCOMMODATION TYPE"}
            placeholder="Ví dụ: Khách sạn 4 sao, Resort, Homestay..."
            value={stayType}
            onChangeText={setStayType}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isDark && { backgroundColor: "#FF5B22" },
            ]}
            onPress={handleSavePreferences}
            activeOpacity={0.85}
          >
            <Ionicons
              name="save-outline"
              size={15}
              color="#FFF"
              style={styles.btnIcon}
            />
            <Text style={styles.submitButtonText}>
              {language === "vi" ? "Lưu sở thích" : "Save preferences"}
            </Text>
          </TouchableOpacity>
        </SettingsCard>

        {/* 10. Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            isDark && { backgroundColor: "#450A0A", borderColor: "#991B1B" },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={isDark ? "#FCA5A5" : "#DC2626"}
          />
          <Text style={[styles.logoutText, isDark && { color: "#FCA5A5" }]}>
            {t("logout", adminPreferencesCopy.logout)}
          </Text>
        </TouchableOpacity>

        {/* Beach Footer replicating web experience */}
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          setShowEditPen(false);
        }}
      >
        <View
          style={[
            modalStyles.modalContainer,
            isDark && modalStyles.modalContainerDark,
          ]}
        >
          {/* Header */}
          <View
            style={[
              modalStyles.modalHeader,
              isDark && modalStyles.modalHeaderDark,
              { paddingTop: insets.top + 12 },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setIsEditModalOpen(false);
                setShowEditPen(false);
              }}
              style={modalStyles.closeButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#F1F5F9" : "#0F172A"}
              />
            </TouchableOpacity>
            <Text
              style={[
                modalStyles.modalHeaderTitle,
                isDark && { color: "#F1F5F9" },
              ]}
            >
              {language === "vi" ? "Chỉnh sửa tài khoản" : "Edit Profile"}
            </Text>
            <TouchableOpacity
              onPress={handleModalSave}
              style={modalStyles.saveButton}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.saveButtonText}>
                {language === "vi" ? "Lưu" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.modalScrollContent}
            style={[
              modalStyles.modalBody,
              isDark && { backgroundColor: "#0F172A" },
            ]}
          >
            {/* Section 1: Avatar Customization */}
            <Text
              style={[modalStyles.sectionTitle, isDark && { color: "#E2E8F0" }]}
            >
              {language === "vi" ? "Ảnh đại diện (Avatar)" : "Avatar Image"}
            </Text>

            {/* Selected Avatar Preview */}
            <View style={{ alignItems: "center", marginVertical: 12 }}>
              <Image
                source={{ uri: tempAvatar }}
                style={modalStyles.avatarPreview}
              />
            </View>

            {/* Quick Upload Action Buttons */}
            <View style={modalStyles.imageActionRow}>
              <TouchableOpacity
                style={[
                  modalStyles.imageActionBtn,
                  isDark && modalStyles.imageActionBtnDark,
                ]}
                onPress={() => handlePickImage("avatar")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="images-outline"
                  size={16}
                  color={isDark ? "#FF5B22" : "#9C6644"}
                />
                <Text
                  style={[
                    modalStyles.imageActionText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Thư viện ảnh" : "Gallery"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.imageActionBtn,
                  isDark && modalStyles.imageActionBtnDark,
                ]}
                onPress={() => handleTakePhoto("avatar")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={isDark ? "#FF5B22" : "#9C6644"}
                />
                <Text
                  style={[
                    modalStyles.imageActionText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Chụp ảnh" : "Take Photo"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Curated Avatars List */}
            <View style={modalStyles.presetGrid}>
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200",
              ].map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    modalStyles.presetItem,
                    tempAvatar === url && {
                      borderColor: "#FF5B22",
                      borderWidth: 2.5,
                    },
                  ]}
                  onPress={() => setTempAvatar(url)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: url }}
                    style={modalStyles.presetImage}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom URL Input for Avatar */}
            <TextInput
              placeholder={
                language === "vi"
                  ? "Hoặc nhập link ảnh đại diện tùy chỉnh..."
                  : "Or enter custom avatar URL..."
              }
              placeholderTextColor="#9CA3AF"
              value={tempAvatar}
              onChangeText={setTempAvatar}
              style={[
                modalStyles.urlInput,
                isDark && {
                  backgroundColor: "#334155",
                  color: "#FFF",
                  borderColor: "#475569",
                },
              ]}
            />

            <View style={modalStyles.divider} />

            {/* Section 2: Cover Background Customization */}
            <Text
              style={[modalStyles.sectionTitle, isDark && { color: "#E2E8F0" }]}
            >
              {language === "vi" ? "Hình nền cá nhân (Cover)" : "Cover Image"}
            </Text>

            {/* Selected Cover Preview */}
            <View
              style={{
                marginVertical: 12,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {tempCover ? (
                <Image
                  source={{ uri: tempCover }}
                  style={modalStyles.coverPreview}
                />
              ) : (
                <LinearGradient
                  colors={
                    isDark ? ["#3E2517", "#2A180E"] : ["#8E5A3C", "#5A3722"]
                  }
                  style={modalStyles.coverPreview}
                />
              )}
            </View>

            {/* Quick Upload Action Buttons */}
            <View style={modalStyles.imageActionRow}>
              <TouchableOpacity
                style={[
                  modalStyles.imageActionBtn,
                  isDark && modalStyles.imageActionBtnDark,
                ]}
                onPress={() => handlePickImage("cover")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="images-outline"
                  size={16}
                  color={isDark ? "#FF5B22" : "#9C6644"}
                />
                <Text
                  style={[
                    modalStyles.imageActionText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Thư viện ảnh" : "Gallery"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.imageActionBtn,
                  isDark && modalStyles.imageActionBtnDark,
                ]}
                onPress={() => handleTakePhoto("cover")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={isDark ? "#FF5B22" : "#9C6644"}
                />
                <Text
                  style={[
                    modalStyles.imageActionText,
                    isDark && { color: "#E2E8F0" },
                  ]}
                >
                  {language === "vi" ? "Chụp ảnh" : "Take Photo"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Curated Covers List */}
            <View style={modalStyles.presetGrid}>
              {[
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600",
                "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600",
              ].map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    modalStyles.presetItem,
                    tempCover === url && {
                      borderColor: "#FF5B22",
                      borderWidth: 2.5,
                    },
                  ]}
                  onPress={() => setTempCover(url)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: url }}
                    style={modalStyles.presetImage}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom URL Input for Cover */}
            <TextInput
              placeholder={
                language === "vi"
                  ? "Hoặc nhập link hình nền tùy chỉnh..."
                  : "Or enter custom cover URL..."
              }
              placeholderTextColor="#9CA3AF"
              value={tempCover}
              onChangeText={setTempCover}
              style={[
                modalStyles.urlInput,
                isDark && {
                  backgroundColor: "#334155",
                  color: "#FFF",
                  borderColor: "#475569",
                },
              ]}
            />

            <View style={modalStyles.divider} />

            {/* Section 3: Profile Details */}
            <Text
              style={[
                modalStyles.sectionTitle,
                isDark && { color: "#E2E8F0" },
                { marginBottom: 12 },
              ]}
            >
              {language === "vi" ? "Thông tin cơ bản" : "Basic Info"}
            </Text>

            <ProfileInput
              label={language === "vi" ? "HỌ TÊN" : "FULL NAME"}
              placeholder="Công Trứ Nguyễn"
              value={fullName}
              onChangeText={setFullName}
            />

            <ProfileInput
              label={language === "vi" ? "TÊN HIỂN THỊ" : "DISPLAY NAME"}
              placeholder="Công Trứ Nguyễn"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <View style={styles.row}>
              <ProfileInput
                label={language === "vi" ? "SỐ ĐIỆN THOẠI" : "PHONE NUMBER"}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                style={{ flex: 1 }}
              />
              <ProfileInput
                label={language === "vi" ? "GIỚI TÍNH" : "GENDER"}
                placeholder="Nam/Nữ"
                value={gender}
                onChangeText={setGender}
                style={{ flex: 1 }}
              />
            </View>

            <ProfileInput
              label="EMAIL"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <ProfileInput
              label={language === "vi" ? "NGÀY SINH" : "DATE OF BIRTH"}
              placeholder="DD/MM/YYYY"
              value={dob}
              onChangeText={setDob}
            />

            <TouchableOpacity
              style={[
                modalStyles.modalSaveButton,
                isDark && { backgroundColor: "#FF5B22" },
              ]}
              onPress={handleModalSave}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={modalStyles.modalSaveButtonText}>
                {language === "vi" ? "Hoàn tất chỉnh sửa" : "Save all changes"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Global Settings & Preferences Selector Modal */}
      <Modal
        visible={isSettingsModalOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsSettingsModalOpen(false)}
      >
        <View
          style={[
            modalStyles.modalContainer,
            isDark && modalStyles.modalContainerDark,
          ]}
        >
          {/* Header */}
          <View
            style={[
              modalStyles.modalHeader,
              isDark && modalStyles.modalHeaderDark,
              { paddingTop: insets.top + 12 },
            ]}
          >
            <TouchableOpacity
              onPress={() => setIsSettingsModalOpen(false)}
              style={modalStyles.closeButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#F1F5F9" : "#0F172A"}
              />
            </TouchableOpacity>
            <Text
              style={[
                modalStyles.modalHeaderTitle,
                isDark && { color: "#F1F5F9" },
              ]}
            >
              {t("settings", "Tùy chọn hiển thị & Cài đặt")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsSettingsModalOpen(false)}
              style={modalStyles.saveButton}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.saveButtonText}>
                {language === "vi" ? "Xong" : "Done"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.modalScrollContent}
            style={[
              modalStyles.modalBody,
              isDark && { backgroundColor: "#0F172A" },
            ]}
          >
            {/* GIAO DIỆN */}
            <Text
              style={[
                modalStyles.sectionTitle,
                { color: isDark ? "#FF5B22" : "#9C6644", marginBottom: 8 },
              ]}
            >
              {t("theme_label", "GIAO DIỆN")}
            </Text>
            <View
              style={[
                styles.segmentContainer,
                isDark && {
                  backgroundColor: "#334155",
                  borderColor: "#475569",
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  theme === "light" && styles.segmentBtnActive,
                  theme === "light" && isDark && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => setTheme("light")}
              >
                <Ionicons
                  name="sunny-outline"
                  size={15}
                  color={
                    theme === "light"
                      ? "#FFFFFF"
                      : isDark
                        ? "#94A3B8"
                        : "#4B5563"
                  }
                />
                <Text
                  style={[
                    styles.segmentBtnText,
                    theme === "light" && styles.segmentBtnTextActive,
                    theme !== "light" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  {t("light_theme", "SÁNG")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  theme === "dark" && styles.segmentBtnActive,
                  theme === "dark" && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => setTheme("dark")}
              >
                <Ionicons
                  name="moon-outline"
                  size={15}
                  color={
                    theme === "dark"
                      ? "#FFFFFF"
                      : isDark
                        ? "#94A3B8"
                        : "#4B5563"
                  }
                />
                <Text
                  style={[
                    styles.segmentBtnText,
                    theme === "dark" && styles.segmentBtnTextActive,
                    theme !== "dark" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  {t("dark_theme", "TỐI")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={modalStyles.divider} />

            {/* NGÔN NGỮ */}
            <Text
              style={[
                modalStyles.sectionTitle,
                { color: isDark ? "#FF5B22" : "#9C6644", marginBottom: 8 },
              ]}
            >
              {t("lang_label", "NGÔN NGỮ")}
            </Text>
            <View
              style={[
                styles.segmentContainer,
                isDark && {
                  backgroundColor: "#334155",
                  borderColor: "#475569",
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  language === "vi" && styles.segmentBtnActive,
                  language === "vi" && isDark && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => {
                  setLanguage("vi");
                  showSnackbar("Đã chuyển ngôn ngữ sang Tiếng Việt");
                }}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    language === "vi" && styles.segmentBtnTextActive,
                    language !== "vi" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  TIẾNG VIỆT (VI)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  language === "en" && styles.segmentBtnActive,
                  language === "en" && isDark && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => {
                  setLanguage("en");
                  showSnackbar("Switched language to English");
                }}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    language === "en" && styles.segmentBtnTextActive,
                    language !== "en" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  ENGLISH (EN)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={modalStyles.divider} />

            {/* TIỀN TỆ */}
            <Text
              style={[
                modalStyles.sectionTitle,
                { color: isDark ? "#FF5B22" : "#9C6644", marginBottom: 8 },
              ]}
            >
              {t("curr_label", "TIỀN TỆ")}
            </Text>
            <View
              style={[
                styles.segmentContainer,
                isDark && {
                  backgroundColor: "#334155",
                  borderColor: "#475569",
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  currency === "VND" && styles.segmentBtnActive,
                  currency === "VND" &&
                    isDark && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => {
                  setCurrency("VND");
                  showSnackbar("Đã chuyển đơn vị tiền tệ sang VND");
                }}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    currency === "VND" && styles.segmentBtnTextActive,
                    currency !== "VND" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  VND (đ)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.segmentBtn,
                  currency === "USD" && styles.segmentBtnActive,
                  currency === "USD" &&
                    isDark && { backgroundColor: "#FF5B22" },
                ]}
                onPress={() => {
                  setCurrency("USD");
                  showSnackbar("Switched currency to USD (1 USD = 26,300 VND)");
                }}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    currency === "USD" && styles.segmentBtnTextActive,
                    currency !== "USD" && isDark && { color: "#94A3B8" },
                  ]}
                >
                  USD ($)
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                modalStyles.modalSaveButton,
                isDark && { backgroundColor: "#FF5B22" },
              ]}
              onPress={() => setIsSettingsModalOpen(false)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={modalStyles.modalSaveButtonText}>
                {language === "vi"
                  ? "Hoàn tất cài đặt"
                  : "Save display settings"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
  scrollContent: {
    paddingBottom: 0,
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: "relative",
  },
  avatarContainer: {
    position: "absolute",
    right: 20,
    top: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FF5B22",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  verifiedBadgeDark: {
    borderColor: "#2A180E",
  },
  memberBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  memberBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
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
    maxWidth: "80%",
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
    fontSize: 14,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "500",
  },
  cardSubtitleInBody: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 15,
    fontWeight: "500",
  },
  cardBody: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#9C6644",
    borderRadius: 8,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  btnIcon: {
    marginRight: 6,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  historyMeta: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#D1FAE5",
  },
  historyBadgeText: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 12,
    fontWeight: "500",
  },
  voucherRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  voucherButton: {
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  voucherButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  reviewsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  reviewStat: {
    alignItems: "center",
  },
  reviewStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  reviewStatValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#9C6644",
    marginTop: 4,
  },
  apiUrl: {
    fontSize: 12,
    color: "#374151",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 6,
    fontWeight: "700",
    marginTop: 6,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 6,
  },
  permissionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  permissionChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  permissionText: {
    fontSize: 10,
    color: "#4B5563",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
    height: 44,
    gap: 6,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "800",
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
  megaMenuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  megaMenuCol: {
    flex: 1,
  },
  megaMenuColTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9CA3AF",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  megaMenuLink: {
    paddingVertical: 6,
  },
  megaMenuLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  settingsLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 3,
    marginBottom: 10,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: "#9C6644",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4B5563",
  },
  segmentBtnTextActive: {
    color: "#FFFFFF",
  },
  editPenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  settingsBtn: {
    position: "absolute",
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 10,
    marginTop: 12,
    marginBottom: 12,
    paddingRight: 40,
  },
  avatarPressable: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  modalContainerDark: {
    backgroundColor: "#0F172A",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  modalHeaderDark: {
    backgroundColor: "#1E293B",
    borderBottomColor: "#334155",
  },
  closeButton: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FF5B22",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#9C6644",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  coverPreview: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    resizeMode: "cover",
  },
  presetGrid: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 12,
    justifyContent: "space-between",
  },
  presetItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "transparent",
    backgroundColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  presetImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  urlInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
    opacity: 0.8,
  },
  modalSaveButton: {
    flexDirection: "row",
    backgroundColor: "#9C6644",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  modalSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  imageActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
    marginBottom: 6,
    justifyContent: "center",
  },
  imageActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  imageActionBtnDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  imageActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
});
