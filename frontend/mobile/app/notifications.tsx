import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'promo' | 'booking' | 'system' | 'points';

interface NotificationItem {
  id: string;
  type: NotifType;
  titleVi: string;
  titleEn: string;
  shortDescVi: string;
  shortDescEn: string;
  fullDescVi: string;
  fullDescEn: string;
  timeVi: string;
  timeEn: string;
  dateVi: string;
  dateEn: string;
  read: boolean;
  // Type-specific extras
  promoCode?: string;
  promoDiscount?: string;
  bookingId?: string;
  bookingTour?: string;
  points?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'promo',
    titleVi: 'Mã giảm giá HOT sắp hết hạn!',
    titleEn: 'HOT promo code expiring soon!',
    shortDescVi: 'Mã TOUR2026 giảm 15% tất cả tour miền Trung chỉ còn hiệu lực hôm nay.',
    shortDescEn: 'Code TOUR2026 for 15% off Central Vietnam tours is valid today only.',
    fullDescVi:
      'Chào mừng mùa hè rực rỡ! TravelViet ưu đãi đặc biệt cho tất cả các tour khám phá miền Trung Việt Nam.\n\nSử dụng mã TOUR2026 để được giảm ngay 15% trên tổng giá trị đơn hàng. Áp dụng cho:\n• Tour Đà Nẵng – Hội An – Huế 4N3Đ\n• Tour Phong Nha – Kẻ Bàng khám phá hang động\n• Tour Đà Lạt Mộng Mơ 3N2Đ\n\nƯu đãi chỉ dành cho đặt hôm nay. Đừng bỏ lỡ cơ hội hiếm có này!',
    fullDescEn:
      "Welcome to a vibrant summer! TravelViet offers an exclusive deal on all Central Vietnam tour packages.\n\nUse code TOUR2026 to get 15% off your total order. Applicable for:\n• Da Nang – Hoi An – Hue 4D3N tour\n• Phong Nha – Ke Bang cave exploration\n• Dreamy Da Lat 3D2N tour\n\nOffer valid for today's bookings only. Don't miss this rare opportunity!",
    timeVi: '10 phút trước',
    timeEn: '10 mins ago',
    dateVi: '11/06/2026 • 22:00',
    dateEn: '11/06/2026 • 22:00',
    read: false,
    promoCode: 'TOUR2026',
    promoDiscount: '15%',
  },
  {
    id: 'n2',
    type: 'booking',
    titleVi: 'Thanh toán thành công',
    titleEn: 'Payment Successful',
    shortDescVi: 'Đơn "Kỳ quan Vịnh Hạ Long" đã được xác nhận. Hướng dẫn viên sẽ liên hệ sớm.',
    shortDescEn: 'Booking "Halong Bay Wonder" confirmed. Our guide will contact you soon.',
    fullDescVi:
      'Chúc mừng! Đơn đặt tour của bạn đã được xác nhận và thanh toán thành công.\n\nThông tin chuyến đi:\n• Tour: Kỳ quan Vịnh Hạ Long 3N2Đ\n• Ngày khởi hành: 15/07/2026\n• Số hành khách: 2 người lớn\n• Tổng thanh toán: 9.680.000đ\n\nHướng dẫn viên TravelViet sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận điểm đón và các thông tin cần thiết cho chuyến đi.',
    fullDescEn:
      'Congratulations! Your tour booking has been confirmed and payment received successfully.\n\nTrip details:\n• Tour: Halong Bay Wonder 3D2N\n• Departure: July 15, 2026\n• Passengers: 2 adults\n• Total paid: 9,680,000đ\n\nA TravelViet guide will contact you within 24 hours to confirm your pickup point and other trip details.',
    timeVi: '2 giờ trước',
    timeEn: '2 hours ago',
    dateVi: '11/06/2026 • 20:15',
    dateEn: '11/06/2026 • 20:15',
    read: false,
    bookingId: 'BK-7392',
    bookingTour: 'Kỳ quan Vịnh Hạ Long 3N2Đ',
  },
  {
    id: 'n3',
    type: 'points',
    titleVi: 'Nhận 500 điểm TravelPassport!',
    titleEn: 'You earned 500 TravelPassport Points!',
    shortDescVi: 'Chúc mừng! Bạn tích 500 điểm từ chuyến đi Phú Quốc vừa hoàn thành.',
    shortDescEn: 'Congrats! You earned 500 loyalty points from your completed Phu Quoc trip.',
    fullDescVi:
      'Tuyệt vời! Bạn vừa hoàn thành chuyến đi Phú Quốc và nhận được:\n\n🏆 +500 điểm TravelPassport\n\nSố dư điểm hiện tại: 1.250 điểm\n\nBạn còn cách hạng GOLD chỉ 750 điểm nữa! Đặt thêm tour để lên hạng và nhận ưu đãi độc quyền:\n• Hạng GOLD: Giảm thêm 5% mọi đơn\n• Hạng PLATINUM: Ưu tiên đặt chỗ & hỗ trợ VIP 24/7',
    fullDescEn:
      'Amazing! You just completed your Phu Quoc trip and earned:\n\n🏆 +500 TravelPassport Points\n\nCurrent balance: 1,250 points\n\nYou are just 750 points away from GOLD status! Book more tours to level up and unlock exclusive perks:\n• GOLD status: Extra 5% off all orders\n• PLATINUM: Priority booking & 24/7 VIP support',
    timeVi: '1 ngày trước',
    timeEn: '1 day ago',
    dateVi: '10/06/2026 • 18:30',
    dateEn: '10/06/2026 • 18:30',
    read: true,
    points: 500,
  },
  {
    id: 'n4',
    type: 'system',
    titleVi: 'Cập nhật tài khoản thành công',
    titleEn: 'Profile Updated Successfully',
    shortDescVi: 'TravelViet tặng bạn code WELCOME50 giảm 50.000đ cho đơn hàng tiếp theo.',
    shortDescEn: 'TravelViet rewards you with code WELCOME50 for 50,000đ off your next booking.',
    fullDescVi:
      'Cảm ơn bạn đã hoàn thiện thông tin cá nhân trên TravelViet! Hồ sơ đầy đủ giúp chúng tôi phục vụ bạn tốt hơn và tùy chỉnh những gợi ý hành trình phù hợp nhất.\n\nQuà tặng dành cho bạn:\n🎁 Mã giảm giá WELCOME50 — giảm 50.000đ\nÁp dụng cho đơn hàng tiếp theo, không giới hạn giá trị đơn.\n\nHạn sử dụng: 30/06/2026.',
    fullDescEn:
      'Thank you for completing your TravelViet profile! A complete profile helps us serve you better and personalize your journey recommendations.\n\nYour gift:\n🎁 Coupon code WELCOME50 — 50,000đ off\nApplicable to your next order, no minimum spend required.\n\nExpiry: June 30, 2026.',
    timeVi: '3 ngày trước',
    timeEn: '3 days ago',
    dateVi: '08/06/2026 • 09:00',
    dateEn: '08/06/2026 • 09:00',
    read: true,
    promoCode: 'WELCOME50',
  },
  {
    id: 'n5',
    type: 'promo',
    titleVi: 'Flash Sale: Combo du lịch Nha Trang',
    titleEn: 'Flash Sale: Nha Trang Holiday Combo',
    shortDescVi: 'Tiết kiệm tới 30% với combo khách sạn + tour lặn biển Nha Trang cuối tuần này.',
    shortDescEn: 'Save up to 30% with hotel + snorkeling combo in Nha Trang this weekend.',
    fullDescVi:
      'Flash Sale cuối tuần! Chỉ còn 48 giờ để chốt deal hấp dẫn nhất mùa hè 2026.\n\nCombo Nha Trang 3N2Đ bao gồm:\n🏨 Khách sạn 4★ view biển\n🤿 Tour lặn biển khám phá san hô\n🚌 Đưa đón sân bay\n🍽️ Bữa sáng buffet hằng ngày\n\nGiá chỉ từ 2.990.000đ/người (giảm 30% so với giá thông thường).\nMã ưu đãi: FLASH30 — áp dụng khi đặt qua app.',
    fullDescEn:
      'Weekend Flash Sale! Only 48 hours left to grab the best summer 2026 deal.\n\nNha Trang 3D2N combo includes:\n🏨 4-star beachfront hotel\n🤿 Coral reef snorkeling tour\n🚌 Airport shuttle service\n🍽️ Daily breakfast buffet\n\nFrom only 2,990,000đ/person (30% off regular price).\nPromo code: FLASH30 — apply when booking via app.',
    timeVi: '5 ngày trước',
    timeEn: '5 days ago',
    dateVi: '06/06/2026 • 12:00',
    dateEn: '06/06/2026 • 12:00',
    read: true,
    promoCode: 'FLASH30',
    promoDiscount: '30%',
  },
];

// ─── Translation ───────────────────────────────────────────────────────────────

const T = {
  vi: {
    title: 'Thông báo',
    markAllRead: 'Đánh dấu đọc tất cả',
    clearAll: 'Xóa tất cả',
    empty: 'Không có thông báo nào',
    emptySub: 'Bạn sẽ nhận được cập nhật về hành trình, khuyến mãi tại đây.',
    back: 'Quay lại',
    filter_all: 'Tất cả',
    filter_promo: 'Khuyến mãi',
    filter_booking: 'Đơn đặt chỗ',
    filter_system: 'Hệ thống',
    filter_points: 'Điểm thưởng',
    type_promo: 'Khuyến mãi',
    type_booking: 'Đơn đặt chỗ',
    type_system: 'Hệ thống',
    type_points: 'Điểm thưởng',
    markedAllReadMsg: 'Đã đánh dấu đọc tất cả thông báo.',
    clearedAllMsg: 'Đã xóa toàn bộ thông báo.',
    deletedMsg: 'Đã xóa thông báo.',
    copiedMsg: 'Đã sao chép mã vào clipboard!',
    detail_sent: 'Thông báo lúc',
    detail_booking_id: 'Mã đơn hàng',
    detail_promo_code: 'Mã giảm giá',
    detail_points_earned: 'Điểm tích lũy',
    cta_promo: 'Đặt tour ngay',
    cta_booking: 'Xem đơn hàng',
    cta_points: 'Xem hành trình',
    cta_system: 'Đã hiểu',
    copy_code: 'Sao chép mã',
    close: 'Đóng',
    unread_badge: 'Chưa đọc',
    read_badge: 'Đã đọc',
  },
  en: {
    title: 'Notifications',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',
    empty: 'No notifications yet',
    emptySub: 'You will receive updates about your journeys and promotions here.',
    back: 'Back',
    filter_all: 'All',
    filter_promo: 'Promotions',
    filter_booking: 'Bookings',
    filter_system: 'System',
    filter_points: 'Points',
    type_promo: 'Promotion',
    type_booking: 'Booking',
    type_system: 'System',
    type_points: 'Points',
    markedAllReadMsg: 'Marked all notifications as read.',
    clearedAllMsg: 'Cleared all notifications.',
    deletedMsg: 'Notification deleted.',
    copiedMsg: 'Code copied to clipboard!',
    detail_sent: 'Sent on',
    detail_booking_id: 'Booking ID',
    detail_promo_code: 'Promo code',
    detail_points_earned: 'Points earned',
    cta_promo: 'Book a tour now',
    cta_booking: 'View my booking',
    cta_points: 'Explore trips',
    cta_system: 'Got it',
    copy_code: 'Copy code',
    close: 'Close',
    unread_badge: 'New',
    read_badge: 'Read',
  },
};

type FilterKey = 'all' | NotifType;

// ─── Icon helpers ──────────────────────────────────────────────────────────────

function typeConfig(type: NotifType) {
  switch (type) {
    case 'promo':
      return { icon: 'pricetag' as const, bg: 'rgba(255, 112, 42, 0.15)', color: '#FF702A', gradStart: '#FF702A', gradEnd: '#F97316' };
    case 'booking':
      return { icon: 'receipt' as const, bg: 'rgba(37, 99, 235, 0.15)', color: '#2563EB', gradStart: '#2563EB', gradEnd: '#3B82F6' };
    case 'points':
      return { icon: 'star' as const, bg: 'rgba(234, 179, 8, 0.15)', color: '#D97706', gradStart: '#D97706', gradEnd: '#F59E0B' };
    case 'system':
    default:
      return { icon: 'sparkles' as const, bg: 'rgba(22, 163, 74, 0.15)', color: '#16A34A', gradStart: '#16A34A', gradEnd: '#22C55E' };
  }
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function NotificationDetailModal({
  item,
  visible,
  onClose,
  onMarkRead,
  onDelete,
  onCTA,
  isDark,
  lang,
}: {
  item: NotificationItem | null;
  visible: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onCTA: (item: NotificationItem) => void;
  isDark: boolean;
  lang: 'vi' | 'en';
}) {
  const tl = T[lang];
  if (!item) return null;
  const cfg = typeConfig(item.type);
  const title = lang === 'vi' ? item.titleVi : item.titleEn;
  const fullDesc = lang === 'vi' ? item.fullDescVi : item.fullDescEn;
  const date = lang === 'vi' ? item.dateVi : item.dateEn;
  const typeLabel = tl[`type_${item.type}` as keyof typeof tl];
  const ctaLabel = tl[`cta_${item.type}` as keyof typeof tl];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={detailStyles.backdrop} onPress={onClose}>
        <Pressable
          style={[detailStyles.sheet, isDark && detailStyles.sheetDark]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Pull handle */}
          <View style={detailStyles.handle} />

          {/* Gradient header */}
          <LinearGradient
            colors={[cfg.gradStart, cfg.gradEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={detailStyles.gradientHeader}
          >
            <View style={detailStyles.headerRow}>
              <View style={detailStyles.typeBadge}>
                <Ionicons name={cfg.icon} size={14} color="#FFFFFF" />
                <Text style={detailStyles.typeBadgeText}>{typeLabel as string}</Text>
              </View>
              {!item.read && (
                <View style={detailStyles.unreadBadge}>
                  <Text style={detailStyles.unreadBadgeText}>{tl.unread_badge}</Text>
                </View>
              )}
            </View>
            <Text style={detailStyles.headerTitle}>{title}</Text>
            <Text style={detailStyles.headerDate}>
              {tl.detail_sent}: {date}
            </Text>
          </LinearGradient>

          {/* Scrollable body */}
          <ScrollView
            style={detailStyles.body}
            contentContainerStyle={detailStyles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Extra metadata chips */}
            {(item.promoCode || item.bookingId || item.points) && (
              <View style={[detailStyles.metaChipRow]}>
                {item.promoCode && (
                  <View style={[detailStyles.metaChip, { backgroundColor: isDark ? '#2C1D16' : '#FFF2EB', borderColor: cfg.color + '44' }]}>
                    <Ionicons name="ticket-outline" size={14} color={cfg.color} />
                    <View>
                      <Text style={[detailStyles.metaChipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {tl.detail_promo_code as string}
                      </Text>
                      <Text style={[detailStyles.metaChipValue, { color: cfg.color }]}>{item.promoCode}</Text>
                    </View>
                  </View>
                )}
                {item.bookingId && (
                  <View style={[detailStyles.metaChip, { backgroundColor: isDark ? '#1A1F35' : '#EFF6FF', borderColor: cfg.color + '44' }]}>
                    <Ionicons name="receipt-outline" size={14} color={cfg.color} />
                    <View>
                      <Text style={[detailStyles.metaChipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {tl.detail_booking_id as string}
                      </Text>
                      <Text style={[detailStyles.metaChipValue, { color: cfg.color }]}>{item.bookingId}</Text>
                    </View>
                  </View>
                )}
                {item.points && (
                  <View style={[detailStyles.metaChip, { backgroundColor: isDark ? '#231A00' : '#FFFBEB', borderColor: cfg.color + '44' }]}>
                    <Ionicons name="star-outline" size={14} color={cfg.color} />
                    <View>
                      <Text style={[detailStyles.metaChipLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                        {tl.detail_points_earned as string}
                      </Text>
                      <Text style={[detailStyles.metaChipValue, { color: cfg.color }]}>+{item.points} pts</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Divider */}
            <View style={[detailStyles.divider, isDark && { backgroundColor: '#334155' }]} />

            {/* Full description */}
            <Text style={[detailStyles.fullDesc, isDark && { color: '#CBD5E1' }]}>{fullDesc}</Text>

            {/* Promo discount highlight */}
            {item.promoDiscount && (
              <View style={[detailStyles.discountBanner, { backgroundColor: isDark ? '#2C1D16' : '#FFF7F2', borderColor: cfg.color + '55' }]}>
                <Ionicons name="flash" size={18} color={cfg.color} />
                <Text style={[detailStyles.discountText, { color: cfg.color }]}>
                  {lang === 'vi' ? `Giảm ${item.promoDiscount}` : `${item.promoDiscount} OFF`}
                </Text>
                <Text style={[detailStyles.discountSubText, isDark && { color: '#94A3B8' }]}>
                  {lang === 'vi' ? 'cho tất cả tour trong chương trình' : 'on all eligible tours'}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Action buttons footer */}
          <View style={[detailStyles.footer, isDark && detailStyles.footerDark]}>
            {/* Mark read / delete row */}
            <View style={detailStyles.footerSecondary}>
              {!item.read && (
                <TouchableOpacity
                  style={[detailStyles.secondaryBtn, isDark && detailStyles.secondaryBtnDark]}
                  onPress={() => { onMarkRead(item.id); onClose(); }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text style={[detailStyles.secondaryBtnText, isDark && { color: '#94A3B8' }]}>
                    {lang === 'vi' ? 'Đánh dấu đọc' : 'Mark as read'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[detailStyles.secondaryBtn, isDark && detailStyles.secondaryBtnDark, { borderColor: '#EF444455' }]}
                onPress={() => { onDelete(item.id); onClose(); }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={[detailStyles.secondaryBtnText, { color: '#EF4444' }]}>
                  {lang === 'vi' ? 'Xóa' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Main CTA */}
            <TouchableOpacity
              style={[detailStyles.ctaBtn, { backgroundColor: cfg.gradStart }]}
              onPress={() => { onCTA(item); onClose(); }}
              activeOpacity={0.85}
            >
              <Text style={detailStyles.ctaBtnText}>{ctaLabel as string}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language } = useAppSettings();
  const { showSnackbar } = useSnackbar();

  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';
  const tl = T[lang];

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const handleOpen = (item: NotificationItem) => {
    setSelectedItem(item);
    setDetailVisible(true);
    // Auto-mark as read when opened
    if (!item.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
      );
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showSnackbar(tl.markedAllReadMsg);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showSnackbar(tl.deletedMsg);
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    setNotifications([]);
    showSnackbar(tl.clearedAllMsg);
  };

  const handleCTA = (item: NotificationItem) => {
    switch (item.type) {
      case 'promo':
        router.push('/(tabs)/tours');
        break;
      case 'booking':
        router.push('/(tabs)/bookings');
        break;
      case 'points':
        router.push('/travel-passport');
        break;
      case 'system':
      default:
        break;
    }
  };

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: tl.filter_all },
    { key: 'promo', label: tl.filter_promo },
    { key: 'booking', label: tl.filter_booking },
    { key: 'points', label: tl.filter_points },
    { key: 'system', label: tl.filter_system },
  ];

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const cfg = typeConfig(item.type);
    const title = lang === 'vi' ? item.titleVi : item.titleEn;
    const shortDesc = lang === 'vi' ? item.shortDescVi : item.shortDescEn;
    const time = lang === 'vi' ? item.timeVi : item.timeEn;

    return (
      <Pressable
        onPress={() => handleOpen(item)}
        style={({ pressed }) => [
          styles.card,
          isDark ? styles.cardDark : styles.cardLight,
          !item.read && (isDark ? styles.unreadCardDark : styles.unreadCardLight),
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        ]}
      >
        {/* Unread stripe */}
        {!item.read && <View style={[styles.unreadStripe, { backgroundColor: cfg.color }]} />}

        <View style={styles.cardContent}>
          {/* Icon */}
          <View style={[styles.iconBg, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          </View>

          {/* Text */}
          <View style={styles.cardTextContainer}>
            <View style={styles.cardHeaderRow}>
              <Text
                style={[
                  styles.cardTitle,
                  isDark && styles.cardTitleDark,
                  !item.read && styles.unreadTitle,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {!item.read && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}
            </View>
            <Text
              style={[styles.cardDesc, isDark && styles.cardDescDark]}
              numberOfLines={2}
            >
              {shortDesc}
            </Text>
            <View style={styles.cardFooterRow}>
              <Text style={[styles.cardTime, isDark && { color: '#475569' }]}>{time}</Text>
              {item.promoCode && (
                <View style={[styles.codeChip, { backgroundColor: isDark ? '#2C1D16' : '#FFF2EB' }]}>
                  <Text style={[styles.codeChipText, { color: cfg.color }]}>{item.promoCode}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Delete */}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle-outline" size={20} color={isDark ? '#475569' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        {/* Arrow hint */}
        <View style={styles.cardArrowHint}>
          <Text style={[styles.cardArrowText, isDark && { color: '#334155' }]}>
            {lang === 'vi' ? 'Xem chi tiết' : 'View detail'}
          </Text>
          <Ionicons name="chevron-forward" size={12} color={isDark ? '#334155' : '#CBD5E1'} />
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isDark && styles.containerDark,
        { paddingTop: insets.top || 12 },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          style={[styles.backBtn, isDark && styles.backBtnDark]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? '#F1F5F9' : '#0F172A'} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>{tl.title}</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
            <Text style={styles.clearAllText}>{tl.clearAll}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* Action bar + Filters */}
      {notifications.length > 0 && (
        <View style={[styles.actionSection, isDark && styles.actionSectionDark]}>
          {/* Mark all read */}
          <TouchableOpacity
            disabled={unreadCount === 0}
            onPress={handleMarkAllRead}
            style={[styles.markReadBtn, unreadCount === 0 && styles.disabledBtn]}
          >
            <Ionicons
              name="checkmark-done-circle-outline"
              size={16}
              color={unreadCount === 0 ? (isDark ? '#475569' : '#CBD5E1') : '#FF702A'}
            />
            <Text
              style={[
                styles.markReadText,
                unreadCount === 0 && { color: isDark ? '#475569' : '#CBD5E1' },
              ]}
            >
              {tl.markAllRead}
            </Text>
          </TouchableOpacity>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map((f) => {
              const isActive = f.key === activeFilter;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  style={[
                    styles.filterChip,
                    isDark && styles.filterChipDark,
                    isActive && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isDark && { color: '#94A3B8' },
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                  {f.key !== 'all' &&
                    notifications.filter((n) => n.type === f.key && !n.read).length > 0 && (
                      <View style={styles.filterDot} />
                    )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, isDark && styles.emptyIconCircleDark]}>
              <Ionicons name="notifications-off-outline" size={48} color="#FF702A" />
            </View>
            <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>{tl.empty}</Text>
            <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
              {tl.emptySub}
            </Text>
          </View>
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <NotificationDetailModal
        item={selectedItem}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onMarkRead={handleMarkAsRead}
        onDelete={handleDelete}
        onCTA={handleCTA}
        isDark={isDark}
        lang={lang}
      />
    </View>
  );
}

// ─── Detail Modal Styles ───────────────────────────────────────────────────────

const detailStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  sheetDark: {
    backgroundColor: '#1E293B',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  gradientHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unreadBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF702A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  headerDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  metaChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
  },
  metaChipLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaChipValue: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  fullDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    fontWeight: '500',
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  discountText: {
    fontSize: 18,
    fontWeight: '900',
  },
  discountSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  footerDark: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
  },
  footerSecondary: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flex: 1,
    justifyContent: 'center',
  },
  secondaryBtnDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

// ─── Main Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  backBtnDark: {
    backgroundColor: '#334155',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerTitleDark: {
    color: '#F1F5F9',
  },
  headerBadge: {
    backgroundColor: '#FF702A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF702A',
  },
  headerSpacer: {
    width: 60,
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 10,
  },
  actionSectionDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF702A',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  filterChipDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
  },
  filterChipActive: {
    backgroundColor: '#FF702A',
    borderColor: '#FF702A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  unreadCardLight: {
    backgroundColor: '#FFF7F2',
    borderColor: 'rgba(255, 112, 42, 0.25)',
  },
  unreadCardDark: {
    backgroundColor: '#2C221D',
    borderColor: 'rgba(255, 112, 42, 0.3)',
  },
  unreadStripe: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 14,
    paddingBottom: 10,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  cardTitleDark: {
    color: '#E2E8F0',
  },
  unreadTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
  },
  cardDescDark: {
    color: '#94A3B8',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cardTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  codeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeChipText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    padding: 2,
    flexShrink: 0,
  },
  cardArrowHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    paddingHorizontal: 14,
    paddingBottom: 9,
  },
  cardArrowText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF2EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircleDark: {
    backgroundColor: '#2A1F1B',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyTitleDark: {
    color: '#F1F5F9',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  emptySubtitleDark: {
    color: '#94A3B8',
  },
});
