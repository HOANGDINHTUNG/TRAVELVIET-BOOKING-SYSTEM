import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import type { Flight } from '@/types/flight';
import { MOCK_FLIGHTS } from '@/constants/flightsMock';

// ─── Translation ───────────────────────────────────────────────────────────────

const T = {
  vi: {
    back: 'Quay lại',
    flight_detail: 'Chi tiết chuyến bay',
    departs: 'Khởi hành',
    arrives: 'Hạ cánh',
    duration: 'Thời gian bay',
    direct: 'Bay thẳng',
    economy: 'Hạng phổ thông',
    business: 'Hạng thương gia',
    first: 'Hạng nhất',
    baggage: 'Hành lý xách tay',
    checked: 'Hành lý ký gửi',
    included: 'Đã bao gồm',
    aircraft: 'Máy bay',
    airline: 'Hãng hàng không',
    flight_num: 'Số hiệu chuyến bay',
    date: 'Ngày bay',
    seats_avail: 'Ghế trống',
    services: 'Dịch vụ trên chuyến bay',
    price_breakdown: 'Chi tiết giá vé',
    base_fare: 'Giá vé cơ bản',
    tax_fee: 'Thuế & phí sân bay',
    total: 'Tổng cộng',
    per_person: '/người',
    book_now: 'Đặt vé ngay',
    price_from: 'Giá từ',
    fav_added: 'Đã thêm vào yêu thích',
    fav_removed: 'Đã gỡ khỏi yêu thích',
    refund_title: 'Hoàn tiền linh hoạt',
    refund_desc: 'Huỷ vé trước 24 giờ bay được hoàn 80% giá trị vé. Áp dụng đơn giản qua ứng dụng.',
    insurance_title: 'Bảo hiểm du lịch',
    insurance_desc: 'Bảo vệ toàn diện: tai nạn, trễ chuyến, mất hành lý. Chỉ từ 50.000đ/người.',
    meal_title: 'Suất ăn trên chuyến bay',
    meal_desc: 'Đặt trước suất ăn tiêu chuẩn hoặc đặc biệt (ăn chay, halal) với giá ưu đãi.',
    seat_title: 'Chọn chỗ ngồi ưu tiên',
    seat_desc: 'Ghế cửa sổ, hàng đầu hoặc ghế rộng hơn. Đặt ngay để không bị hết!',
    transfer_title: 'Đưa đón sân bay',
    transfer_desc: 'Xe đưa đón từ nhà hoặc khách sạn đến sân bay, đúng giờ, thoải mái.',
    close: 'Đóng',
    outbound: 'Chuyến đi',
    return: 'Chuyến về',
    flight_info: 'Thông tin chuyến bay',
  },
  en: {
    back: 'Back',
    flight_detail: 'Flight Detail',
    departs: 'Departs',
    arrives: 'Arrives',
    duration: 'Flight duration',
    direct: 'Direct flight',
    economy: 'Economy Class',
    business: 'Business Class',
    first: 'First Class',
    baggage: 'Carry-on baggage',
    checked: 'Checked baggage',
    included: 'Included',
    aircraft: 'Aircraft',
    airline: 'Airline',
    flight_num: 'Flight number',
    date: 'Date',
    seats_avail: 'Seats available',
    services: 'In-flight services',
    price_breakdown: 'Price breakdown',
    base_fare: 'Base fare',
    tax_fee: 'Taxes & airport fees',
    total: 'Total',
    per_person: '/person',
    book_now: 'Book now',
    price_from: 'From',
    fav_added: 'Added to favourites',
    fav_removed: 'Removed from favourites',
    refund_title: 'Flexible Refund',
    refund_desc: 'Cancel 24h before departure for 80% refund. Simple process via the app.',
    insurance_title: 'Travel Insurance',
    insurance_desc: 'Full coverage: accident, flight delay, lost baggage. From 50,000đ/person.',
    meal_title: 'In-flight Meal',
    meal_desc: 'Pre-order standard or special meals (vegetarian, halal) at a great price.',
    seat_title: 'Priority Seat Selection',
    seat_desc: 'Window seat, front row, or extra legroom. Book early before they\'re gone!',
    transfer_title: 'Airport Transfer',
    transfer_desc: 'Door-to-airport pickup service, on time and comfortable.',
    close: 'Close',
    outbound: 'Outbound',
    return: 'Return',
    flight_info: 'Flight Information',
  },
};

// ─── Service Modal ─────────────────────────────────────────────────────────────

function ServiceModal({
  visible,
  title,
  desc,
  icon,
  onClose,
  isDark,
  lang,
}: {
  visible: boolean;
  title: string;
  desc: string;
  icon: string;
  onClose: () => void;
  isDark: boolean;
  lang: 'vi' | 'en';
}) {
  const tl = T[lang];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.backdrop} onPress={onClose}>
        <Pressable style={[modalStyles.card, isDark && modalStyles.cardDark]} onPress={(e) => e.stopPropagation()}>
          <View style={[modalStyles.iconCircle, isDark && modalStyles.iconCircleDark]}>
            <Ionicons name={icon as any} size={30} color={isDark ? '#93C5FD' : '#FF702A'} />
          </View>
          <Text style={[modalStyles.title, isDark && { color: '#F1F5F9' }]}>{title}</Text>
          <Text style={[modalStyles.desc, isDark && { color: '#94A3B8' }]}>{desc}</Text>
          <TouchableOpacity style={[modalStyles.btn, isDark && { backgroundColor: '#FF702A' }]} onPress={onClose} activeOpacity={0.85}>
            <Text style={modalStyles.btnText}>{tl.close}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FlightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language, formatPrice } = useAppSettings();
  const { showSnackbar } = useSnackbar();

  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';
  const tl = T[lang];

  const flight = MOCK_FLIGHTS.find((f: Flight) => f.id === id);
  const [isFav, setIsFav] = useState(false);
  const [activeService, setActiveService] = useState<{ title: string; desc: string; icon: string } | null>(null);

  if (!flight) {
    return (
      <View style={[styles.errorPage, isDark && { backgroundColor: '#0F172A' }]}>
        <Ionicons name="airplane-outline" size={48} color="#FF702A" />
        <Text style={[styles.errorText, isDark && { color: '#F1F5F9' }]}>
          {lang === 'vi' ? 'Không tìm thấy chuyến bay' : 'Flight not found'}
        </Text>
        <TouchableOpacity style={styles.errorBtn} onPress={() => router.back()}>
          <Text style={styles.errorBtnText}>{tl.back}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tax = Math.round(flight.price * 0.1);
  const total = flight.price + tax;
  const airlineColor = flight.outbound.airline.code === 'VN' ? '#C41E3A' : flight.outbound.airline.code === 'VJ' ? '#FDB913' : '#003087';

  const SERVICES = [
    { key: 'refund', icon: 'refresh-circle-outline', titleKey: 'refund_title' as const, descKey: 'refund_desc' as const },
    { key: 'insurance', icon: 'shield-checkmark-outline', titleKey: 'insurance_title' as const, descKey: 'insurance_desc' as const },
    { key: 'meal', icon: 'restaurant-outline', titleKey: 'meal_title' as const, descKey: 'meal_desc' as const },
    { key: 'seat', icon: 'grid-outline', titleKey: 'seat_title' as const, descKey: 'seat_desc' as const },
    { key: 'transfer', icon: 'car-outline', titleKey: 'transfer_title' as const, descKey: 'transfer_desc' as const },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000' }}
          style={[styles.hero, { paddingTop: insets.top + 8 }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[`${airlineColor}60`, `${airlineColor}EE`]}
            style={styles.heroGradient}
          >
            {/* Nav */}
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.navTitle}>{tl.flight_detail}</Text>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  setIsFav((v) => !v);
                  showSnackbar(isFav ? tl.fav_removed : tl.fav_added);
                }}
              >
                <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#FCA5A5' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>

            {/* Hero content */}
            <View style={styles.heroContent}>
              <View style={[styles.airlineLogo, { backgroundColor: airlineColor }]}>
                <Text style={styles.airlineLogoText}>{flight.outbound.airline.code}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroAirline}>{flight.outbound.airline.name}</Text>
                <Text style={styles.heroAircraft}>{flight.outbound.aircraft}</Text>
              </View>
              {flight.badge && (
                <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                  <Text style={styles.heroBadgeText}>{flight.badge}</Text>
                </View>
              )}
            </View>

            {/* Flight route strip */}
            <View style={styles.heroRouteCard}>
              <View style={styles.routeEndpoint}>
                <Text style={styles.routeTime}>{flight.outbound.departureTime.substring(11, 16)}</Text>
                <Text style={styles.routeCode}>{flight.outbound.departureAirport}</Text>
                <Text style={styles.routeCity}>{flight.departureCity}</Text>
              </View>

              <View style={styles.routeCenter}>
                <Text style={styles.routeDuration}>{flight.outbound.duration}</Text>
                <View style={styles.routeLineRow}>
                  <View style={styles.routeDot} />
                  <View style={styles.routeLine} />
                  <Ionicons name="airplane" size={18} color="#FFFFFF" style={{ transform: [{ rotate: '90deg' }] }} />
                  <View style={styles.routeLine} />
                  <View style={styles.routeDot} />
                </View>
                {flight.outbound.stops === 0 && (
                  <View style={styles.directPill}>
                    <Text style={styles.directPillText}>{tl.direct}</Text>
                  </View>
                )}
              </View>

              <View style={[styles.routeEndpoint, { alignItems: 'flex-end' }]}>
                <Text style={styles.routeTime}>{flight.outbound.arrivalTime.substring(11, 16)}</Text>
                <Text style={styles.routeCode}>{flight.outbound.arrivalAirport}</Text>
                <Text style={styles.routeCity}>{flight.arrivalCity}</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={[styles.contentBlock, isDark && styles.contentBlockDark]}>

          {/* Flight info grid */}
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <Text style={[styles.sectionTitle, isDark && { color: '#F1F5F9' }]}>{tl.flight_info}</Text>
            <View style={styles.infoGrid}>
              {[
                { icon: 'calendar-outline', label: tl.date, value: new Date(flight.departureDate).toLocaleDateString('vi-VN') },
                { icon: 'airplane-outline', label: tl.aircraft, value: flight.outbound.aircraft },
                { icon: 'pricetag-outline', label: tl.flight_num, value: flight.outbound.flightNumber },
                { icon: 'person-outline', label: tl.seats_avail, value: `${flight.availableSeats} ${lang === 'vi' ? 'ghế' : 'seats'}` },
                { icon: 'briefcase-outline', label: tl.baggage, value: '7kg' },
                { icon: 'cube-outline', label: tl.checked, value: '23kg' },
              ].map((item, idx) => (
                <View key={idx} style={[styles.infoItem, isDark && styles.infoItemDark]}>
                  <Ionicons name={item.icon as any} size={18} color={airlineColor} />
                  <Text style={[styles.infoLabel, isDark && { color: '#64748B' }]}>{item.label}</Text>
                  <Text style={[styles.infoValue, isDark && { color: '#F1F5F9' }]}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Return flight section (if roundTrip) */}
          {flight.return && (
            <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
              <Text style={[styles.sectionTitle, isDark && { color: '#F1F5F9' }]}>{tl.return}</Text>
              <View style={styles.returnFlightInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.returnFlightTime, isDark && { color: '#FFFFFF' }]}>
                    {flight.return.departureTime.substring(11, 16)} → {flight.return.arrivalTime.substring(11, 16)}
                  </Text>
                  <Text style={[styles.returnFlightRoute, isDark && { color: '#94A3B8' }]}>
                    {flight.return.departureAirport} ({flight.arrivalCity}) → {flight.return.arrivalAirport} ({flight.departureCity})
                  </Text>
                </View>
                <View style={styles.returnFlightDuration}>
                  <Text style={[styles.returnDurationLabel, isDark && { color: '#94A3B8' }]}>
                    {flight.return.duration}
                  </Text>
                  {flight.return.stops === 0 && (
                    <Text style={[styles.directLabel, isDark && { color: '#22C55E' }]}>Direct</Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Additional services */}
          <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
            <Text style={[styles.sectionTitle, isDark && { color: '#F1F5F9' }]}>{tl.services}</Text>
            <View style={styles.servicesGrid}>
              {SERVICES.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  activeOpacity={0.75}
                  style={[styles.serviceChip, isDark && styles.serviceChipDark]}
                  onPress={() =>
                    setActiveService({
                      title: tl[s.titleKey],
                      desc: tl[s.descKey],
                      icon: s.icon,
                    })
                  }
                >
                  <Ionicons name={s.icon as any} size={16} color={airlineColor} />
                  <Text style={[styles.serviceChipText, isDark && { color: '#CBD5E1' }]}>{tl[s.titleKey]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price breakdown */}
          <View style={[styles.priceCard, { borderColor: airlineColor + '44' }]}>
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>{tl.price_breakdown}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{tl.base_fare}</Text>
              <Text style={styles.priceValue}>{formatPrice(flight.price)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{tl.tax_fee}</Text>
              <Text style={styles.priceValue}>{formatPrice(tax)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceTotalLabel}>{tl.total}</Text>
              <Text style={styles.priceTotalValue}>{formatPrice(total)}</Text>
            </View>
            <Text style={styles.pricePerPerson}>{tl.per_person}</Text>
          </View>

          {/* Footer spacer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.bottomBar, isDark && styles.bottomBarDark, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          <Text style={[styles.bottomLabel, isDark && { color: '#94A3B8' }]}>{tl.price_from}</Text>
          <Text style={[styles.bottomPrice, { color: airlineColor }]}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: airlineColor }]}
          onPress={() => {
            router.push({
              pathname: '/flight/checkout',
              params: { flightId: flight.id },
            });
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="airplane" size={18} color="#FFFFFF" />
          <Text style={styles.ctaBtnText}>{tl.book_now}</Text>
        </TouchableOpacity>
      </View>

      {/* Service Modal */}
      <ServiceModal
        visible={activeService !== null}
        title={activeService?.title ?? ''}
        desc={activeService?.desc ?? ''}
        icon={activeService?.icon ?? 'information-circle-outline'}
        onClose={() => setActiveService(null)}
        isDark={isDark}
        lang={lang}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ea' },
  containerDark: { backgroundColor: '#0F172A' },
  scroll: { paddingBottom: 0 },

  errorPage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#f6f3ea' },
  errorText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  errorBtn: { backgroundColor: '#FF702A', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  errorBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // Hero
  hero: { width: '100%' },
  heroGradient: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  airlineLogo: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  airlineLogoText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  heroAirline: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  heroAircraft: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginTop: 2 },
  heroBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase' },

  // Hero route card
  heroRouteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  routeEndpoint: { flex: 1, gap: 3 },
  routeTime: { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  routeCode: { fontSize: 16, fontWeight: '900', color: 'rgba(255,255,255,0.9)', letterSpacing: 1.5 },
  routeCity: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  routeCenter: { flex: 1, alignItems: 'center', gap: 6 },
  routeDuration: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  routeLineRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 3 },
  routeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' },
  routeLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' },
  directPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
  },
  directPillText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },

  // Content
  contentBlock: { backgroundColor: '#f6f3ea', paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  contentBlockDark: { backgroundColor: '#0F172A' },

  // Section card
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 16, gap: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8,
  },
  sectionCardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937' },

  // Info grid
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoItem: {
    width: '47%', backgroundColor: '#F8FAFC',
    borderRadius: 12, padding: 12, gap: 5,
    borderWidth: 1, borderColor: '#E2E8F0',
    alignItems: 'flex-start',
  },
  infoItemDark: { backgroundColor: '#0F172A', borderColor: '#334155' },
  infoLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 13, fontWeight: '800', color: '#1F2937' },

  // Return flight
  returnFlightInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  returnFlightTime: {
    fontSize: 14, fontWeight: '700', color: '#1F2937',
  },
  returnFlightRoute: {
    fontSize: 11, color: '#6B7280', marginTop: 2,
  },
  returnFlightDuration: {
    alignItems: 'flex-end',
  },
  returnDurationLabel: {
    fontSize: 12, fontWeight: '600', color: '#6B7280',
  },
  directLabel: {
    fontSize: 10, fontWeight: '700', color: '#22C55E', marginTop: 2,
  },

  // Services
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  serviceChipDark: { borderColor: '#334155', backgroundColor: '#0F172A' },
  serviceChipText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  // Price card
  priceCard: {
    backgroundColor: '#1F2937', borderRadius: 16,
    padding: 16, gap: 10,
    borderWidth: 1,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  priceValue: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  priceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 },
  priceTotalLabel: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  priceTotalValue: { fontSize: 22, fontWeight: '900', color: '#FF702A' },
  pricePerPerson: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600', textAlign: 'right' },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  bottomBarDark: { backgroundColor: '#1E293B', borderTopColor: '#334155' },
  bottomLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  bottomPrice: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, height: 48, borderRadius: 14,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  cardDark: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,112,42,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconCircleDark: { backgroundColor: 'rgba(255,112,42,0.2)' },
  title: { fontSize: 19, fontWeight: '900', color: '#1F2937', marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 14, lineHeight: 22, color: '#6B7280', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  btn: { width: '100%', height: 48, borderRadius: 12, backgroundColor: '#FF702A', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});
