import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchPublicFlights, FlightResponse } from "@/services/flightsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogoColor: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  date: string;
  dateISO: string;
  priceNum: number;
  priceOrigNum: number;
  seatClass: "economy" | "business" | "first";
  seatsLeft: number;
  isDirectFlight: boolean;
  baggage: string;
  badge?: "GIÁ TỐT" | "SALE" | "NHANH";
  aircraft: string;
};

// ─── Mock Data Helpers (for missing API properties like logo colors) ────────────────────────────────

const getAirlineColor = (code: string) => {
  if (code.includes("VN") || code.includes("Vietnam")) return "#003087";
  if (code.includes("VJ") || code.includes("VietJet")) return "#E30613";
  if (code.includes("QH") || code.includes("Bamboo")) return "#00A651";
  return "#475569";
};

const getAirlineCode = (name: string, fallback: string) => {
  if (name.includes("Vietnam Airlines")) return "VN";
  if (name.includes("VietJet Air")) return "VJ";
  if (name.includes("Bamboo Airways")) return "QH";
  return fallback || "FL";
};

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "f1",
    airline: "Vietnam Airlines",
    airlineCode: "VN",
    airlineLogoColor: "#003087",
    from: "Hà Nội",
    fromCode: "HAN",
    to: "TP. Hồ Chí Minh",
    toCode: "SGN",
    departTime: "06:00",
    arriveTime: "08:05",
    duration: "2h 05m",
    date: "14/07/2026",
    dateISO: "2026-07-14",
    priceNum: 1250000,
    priceOrigNum: 1850000,
    seatClass: "economy",
    seatsLeft: 14,
    isDirectFlight: true,
    baggage: "23kg",
    badge: "GIÁ TỐT",
    aircraft: "Airbus A321",
  },
  {
    id: "f2",
    airline: "VietJet Air",
    airlineCode: "VJ",
    airlineLogoColor: "#E30613",
    from: "Hà Nội",
    fromCode: "HAN",
    to: "TP. Hồ Chí Minh",
    toCode: "SGN",
    departTime: "08:30",
    arriveTime: "10:40",
    duration: "2h 10m",
    date: "14/07/2026",
    dateISO: "2026-07-14",
    priceNum: 890000,
    priceOrigNum: 1200000,
    seatClass: "economy",
    seatsLeft: 6,
    isDirectFlight: true,
    baggage: "7kg",
    badge: "SALE",
    aircraft: "Airbus A320",
  },
  {
    id: "f3",
    airline: "Bamboo Airways",
    airlineCode: "QH",
    airlineLogoColor: "#00A651",
    from: "Hà Nội",
    fromCode: "HAN",
    to: "Đà Nẵng",
    toCode: "DAD",
    departTime: "07:15",
    arriveTime: "08:30",
    duration: "1h 15m",
    date: "14/07/2026",
    dateISO: "2026-07-14",
    priceNum: 680000,
    priceOrigNum: 980000,
    seatClass: "economy",
    seatsLeft: 21,
    isDirectFlight: true,
    baggage: "20kg",
    badge: "NHANH",
    aircraft: "Airbus A319",
  },
  {
    id: "f4",
    airline: "Vietnam Airlines",
    airlineCode: "VN",
    airlineLogoColor: "#003087",
    from: "TP. Hồ Chí Minh",
    fromCode: "SGN",
    to: "Phú Quốc",
    toCode: "PQC",
    departTime: "10:50",
    arriveTime: "11:55",
    duration: "1h 05m",
    date: "15/07/2026",
    dateISO: "2026-07-15",
    priceNum: 950000,
    priceOrigNum: 1350000,
    seatClass: "economy",
    seatsLeft: 9,
    isDirectFlight: true,
    baggage: "23kg",
    badge: "GIÁ TỐT",
    aircraft: "Airbus A321",
  },
  {
    id: "f5",
    airline: "VietJet Air",
    airlineCode: "VJ",
    airlineLogoColor: "#E30613",
    from: "TP. Hồ Chí Minh",
    fromCode: "SGN",
    to: "Hà Nội",
    toCode: "HAN",
    departTime: "14:20",
    arriveTime: "16:30",
    duration: "2h 10m",
    date: "15/07/2026",
    dateISO: "2026-07-15",
    priceNum: 760000,
    priceOrigNum: 1100000,
    seatClass: "economy",
    seatsLeft: 18,
    isDirectFlight: true,
    baggage: "7kg",
    badge: "SALE",
    aircraft: "Airbus A320",
  },
  {
    id: "f6",
    airline: "Vietnam Airlines",
    airlineCode: "VN",
    airlineLogoColor: "#003087",
    from: "Hà Nội",
    fromCode: "HAN",
    to: "TP. Hồ Chí Minh",
    toCode: "SGN",
    departTime: "20:00",
    arriveTime: "22:05",
    duration: "2h 05m",
    date: "16/07/2026",
    dateISO: "2026-07-16",
    priceNum: 3200000,
    priceOrigNum: 4500000,
    seatClass: "business",
    seatsLeft: 4,
    isDirectFlight: true,
    baggage: "32kg",
    aircraft: "Boeing 787",
  },
  {
    id: "f7",
    airline: "Bamboo Airways",
    airlineCode: "QH",
    airlineLogoColor: "#00A651",
    from: "TP. Hồ Chí Minh",
    fromCode: "SGN",
    to: "Đà Nẵng",
    toCode: "DAD",
    departTime: "16:00",
    arriveTime: "17:20",
    duration: "1h 20m",
    date: "18/07/2026",
    dateISO: "2026-07-18",
    priceNum: 720000,
    priceOrigNum: 920000,
    seatClass: "economy",
    seatsLeft: 25,
    isDirectFlight: true,
    baggage: "20kg",
    badge: "NHANH",
    aircraft: "Airbus A320",
  },
  {
    id: "f8",
    airline: "VietJet Air",
    airlineCode: "VJ",
    airlineLogoColor: "#E30613",
    from: "Hà Nội",
    fromCode: "HAN",
    to: "Phú Quốc",
    toCode: "PQC",
    departTime: "09:00",
    arriveTime: "11:15",
    duration: "2h 15m",
    date: "20/07/2026",
    dateISO: "2026-07-20",
    priceNum: 1100000,
    priceOrigNum: 1600000,
    seatClass: "economy",
    seatsLeft: 12,
    isDirectFlight: true,
    baggage: "7kg",
    badge: "SALE",
    aircraft: "Airbus A321",
  },
];

// ─── Translation ───────────────────────────────────────────────────────────────

const T = {
  vi: {
    title: "Vé máy bay",
    subtitle: "Giá tốt nhất — Đặt ngay hôm nay",
    search: "Tìm chuyến bay...",
    filter_all: "Tất cả",
    filter_economy: "Phổ thông",
    filter_business: "Thương gia",
    filter_direct: "Bay thẳng",
    from: "Từ",
    to: "Đến",
    depart: "Khởi hành",
    arrive: "Hạ cánh",
    duration: "Thời gian",
    direct: "Bay thẳng",
    seat_economy: "Hạng phổ thông",
    seat_business: "Hạng thương gia",
    seat_first: "Hạng nhất",
    seats_left: "chỗ trống",
    baggage: "Hành lý",
    price_from: "Giá từ",
    book_now: "Đặt vé",
    empty: "Không tìm thấy chuyến bay",
    empty_sub: "Thử tìm kiếm tên thành phố hoặc sân bay khác.",
    back: "Quay lại",
    sort_price: "Giá thấp nhất",
    sort_time: "Bay sớm nhất",
    per_person: "/người",
  },
  en: {
    title: "Flights",
    subtitle: "Best prices — Book today",
    search: "Search flights...",
    filter_all: "All",
    filter_economy: "Economy",
    filter_business: "Business",
    filter_direct: "Direct",
    from: "From",
    to: "To",
    depart: "Departs",
    arrive: "Arrives",
    duration: "Duration",
    direct: "Direct",
    seat_economy: "Economy Class",
    seat_business: "Business Class",
    seat_first: "First Class",
    seats_left: "seats left",
    baggage: "Baggage",
    price_from: "From",
    book_now: "Book",
    empty: "No flights found",
    empty_sub: "Try searching for a different city or airport.",
    back: "Back",
    sort_price: "Lowest price",
    sort_time: "Earliest",
    per_person: "/person",
  },
};

type FilterClass = "all" | "economy" | "business" | "direct";
type SortMode = "price" | "time";

// ─── Airline Logo Component ────────────────────────────────────────────────────

function AirlineLogo({
  code,
  color,
  size = 36,
}: {
  code: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.3,
          fontWeight: "900",
          letterSpacing: 0.5,
        }}
      >
        {code}
      </Text>
    </View>
  );
}

// ─── Flight Card ────────────────────────────────────────────────────────────

function FlightCard({
  item,
  onPress,
  isDark,
  lang,
  formatPrice,
}: {
  item: Flight;
  onPress: () => void;
  isDark: boolean;
  lang: "vi" | "en";
  formatPrice: (n: number) => string;
}) {
  const tl = T[lang];
  const discountPct = Math.round((1 - item.priceNum / item.priceOrigNum) * 100);

  const seatLabel =
    item.seatClass === "economy"
      ? tl.seat_economy
      : item.seatClass === "business"
        ? tl.seat_business
        : tl.seat_first;

  const badgeColor =
    item.badge === "GIÁ TỐT"
      ? "#16A34A"
      : item.badge === "SALE"
        ? "#E30613"
        : "#2563EB";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, isDark && styles.cardDark]}
    >
      {/* Top colored bar per airline */}
      <View
        style={[styles.cardTopBar, { backgroundColor: item.airlineLogoColor }]}
      />

      <View style={styles.cardBody}>
        {/* Airline row */}
        <View style={styles.airlineRow}>
          <AirlineLogo code={item.airlineCode} color={item.airlineLogoColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.airlineName, isDark && { color: "#F1F5F9" }]}>
              {item.airline}
            </Text>
            <Text style={[styles.aircraftText, isDark && { color: "#64748B" }]}>
              {item.aircraft}
            </Text>
          </View>
          {item.badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>

        {/* Route row */}
        <View style={styles.routeRow}>
          <View style={styles.routeEndpoint}>
            <Text style={[styles.timeText, isDark && { color: "#F1F5F9" }]}>
              {item.departTime}
            </Text>
            <Text style={[styles.codeText, { color: item.airlineLogoColor }]}>
              {item.fromCode}
            </Text>
            <Text
              style={[styles.cityText, isDark && { color: "#94A3B8" }]}
              numberOfLines={1}
            >
              {item.from}
            </Text>
          </View>

          <View style={styles.routeCenter}>
            <Text style={[styles.durationText, isDark && { color: "#94A3B8" }]}>
              {item.duration}
            </Text>
            <View style={styles.routeLine}>
              <View
                style={[
                  styles.routeDot,
                  { backgroundColor: item.airlineLogoColor },
                ]}
              />
              <View
                style={[
                  styles.routeLineBar,
                  isDark && { backgroundColor: "#334155" },
                ]}
              />
              <Ionicons
                name="airplane"
                size={16}
                color={item.airlineLogoColor}
                style={{ transform: [{ rotate: "90deg" }] }}
              />
              <View
                style={[
                  styles.routeLineBar,
                  isDark && { backgroundColor: "#334155" },
                ]}
              />
              <View
                style={[
                  styles.routeDot,
                  { backgroundColor: item.airlineLogoColor },
                ]}
              />
            </View>
            {item.isDirectFlight && (
              <View
                style={[
                  styles.directBadge,
                  isDark && { backgroundColor: "#134E4A" },
                ]}
              >
                <Text style={styles.directBadgeText}>{tl.direct}</Text>
              </View>
            )}
          </View>

          <View style={[styles.routeEndpoint, { alignItems: "flex-end" }]}>
            <Text style={[styles.timeText, isDark && { color: "#F1F5F9" }]}>
              {item.arriveTime}
            </Text>
            <Text style={[styles.codeText, { color: item.airlineLogoColor }]}>
              {item.toCode}
            </Text>
            <Text
              style={[styles.cityText, isDark && { color: "#94A3B8" }]}
              numberOfLines={1}
            >
              {item.to}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[styles.divider, isDark && { backgroundColor: "#334155" }]}
        />

        {/* Footer: meta + price */}
        <View style={styles.cardFooter}>
          <View style={styles.footerMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={isDark ? "#64748B" : "#94A3B8"}
              />
              <Text style={[styles.metaText, isDark && { color: "#64748B" }]}>
                {item.date}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="briefcase-outline"
                size={12}
                color={isDark ? "#64748B" : "#94A3B8"}
              />
              <Text style={[styles.metaText, isDark && { color: "#64748B" }]}>
                {item.baggage}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="person-outline"
                size={12}
                color={isDark ? "#64748B" : "#94A3B8"}
              />
              <Text style={[styles.metaText, isDark && { color: "#64748B" }]}>
                {item.seatsLeft} {tl.seats_left}
              </Text>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <Text style={[styles.origPrice, isDark && { color: "#475569" }]}>
              {formatPrice(item.priceOrigNum)}
            </Text>
            <Text style={styles.price}>{formatPrice(item.priceNum)}</Text>
            {discountPct > 0 && (
              <View style={styles.discountChip}>
                <Text style={styles.discountText}>-{discountPct}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Book button */}
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: item.airlineLogoColor }]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>{tl.book_now}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FlightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language, formatPrice } = useAppSettings();
  const isDark = theme === "dark";
  const lang = language as "vi" | "en";
  const tl = T[lang];

  const [flightsList, setFlightsList] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterClass>("all");
  const [sortMode, setSortMode] = useState<SortMode>("price");

  React.useEffect(() => {
    let active = true;
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const res = await fetchPublicFlights({ size: 50 });
        if (active && res?.content) {
          const mapped: Flight[] = res.content.map((f) => {
            const departTimeStr = new Date(
              f.departureTimeLocal,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const arriveTimeStr = new Date(
              f.arrivalTimeLocal,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const dateStr = new Date(f.departureTimeLocal).toLocaleDateString(
              "en-GB",
            ); // DD/MM/YYYY

            const hours = Math.floor(f.durationMinutes / 60);
            const mins = f.durationMinutes % 60;

            const isEco = f.recommendedCabinClass
              ?.toLowerCase()
              .includes("economy");
            const seatEnum = isEco ? "economy" : "business";

            return {
              id: f.id.toString(),
              airline: f.airlineName || "Unknown Airline",
              airlineCode: getAirlineCode(f.airlineName, f.airlineCode),
              airlineLogoColor: getAirlineColor(f.airlineCode || f.airlineName),
              from: f.originAirportName || "TBD",
              fromCode: f.originAirportCode || "N/A",
              to: f.destinationAirportName || "TBD",
              toCode: f.destinationAirportCode || "N/A",
              departTime: departTimeStr,
              arriveTime: arriveTimeStr,
              duration: `${hours}h ${mins}m`,
              date: dateStr,
              dateISO: f.departureTimeLocal,
              priceNum: f.minPrice,
              priceOrigNum: f.minPrice * 1.3, // Mock a discount
              seatClass: seatEnum,
              seatsLeft: f.availableSeats || 10,
              isDirectFlight: true, // Mock
              baggage: seatEnum === "economy" ? "7kg" : "32kg",
              aircraft: f.flightNo || "Airbus A320",
            };
          });
          setFlightsList(mapped);
        }
      } catch (err) {
        console.error("Flights fetch error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFlights();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...flightsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.from.toLowerCase().includes(q) ||
          f.to.toLowerCase().includes(q) ||
          f.fromCode.toLowerCase().includes(q) ||
          f.toCode.toLowerCase().includes(q) ||
          f.airline.toLowerCase().includes(q),
      );
    }

    if (activeFilter === "economy")
      list = list.filter((f) => f.seatClass === "economy");
    else if (activeFilter === "business")
      list = list.filter((f) => f.seatClass === "business");
    else if (activeFilter === "direct")
      list = list.filter((f) => f.isDirectFlight);

    if (sortMode === "price") list.sort((a, b) => a.priceNum - b.priceNum);
    else list.sort((a, b) => a.departTime.localeCompare(b.departTime));

    return list;
  }, [searchQuery, activeFilter, sortMode]);

  const FILTERS: { key: FilterClass; label: string; icon: string }[] = [
    { key: "all", label: tl.filter_all, icon: "grid-outline" },
    { key: "economy", label: tl.filter_economy, icon: "person-outline" },
    { key: "business", label: tl.filter_business, icon: "briefcase-outline" },
    { key: "direct", label: tl.filter_direct, icon: "trending-up-outline" },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Hero Header */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000",
        }}
        style={[
          styles.hero,
          {
            paddingTop:
              Platform.OS === "android" ? insets.top + 8 : insets.top + 8,
          },
        ]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(15,23,42,0.3)", "rgba(15,23,42,0.92)"]
              : ["rgba(0,48,135,0.35)", "rgba(0,48,135,0.88)"]
          }
          style={styles.heroGradient}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.heroTitle}>{tl.title}</Text>
          <Text style={styles.heroSubtitle}>{tl.subtitle}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              {
                icon: "airplane-outline",
                val: "3",
                label: lang === "vi" ? "Hãng bay" : "Airlines",
              },
              {
                icon: "flash-outline",
                val: `${filtered.length}`,
                label: lang === "vi" ? "Chuyến bay" : "Flights",
              },
              {
                icon: "pricetag-outline",
                val: lang === "vi" ? "Giá tốt" : "Best price",
                label: lang === "vi" ? "Cam kết" : "Guaranteed",
              },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Ionicons
                  name={s.icon as any}
                  size={18}
                  color="rgba(255,255,255,0.85)"
                />
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Search bar */}
      <View style={[styles.searchWrapper, isDark && styles.searchWrapperDark]}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            placeholder={tl.search}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark && { color: "#F1F5F9" }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter + Sort bar */}
      <View style={[styles.filterSection, isDark && styles.filterSectionDark]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = f.key === activeFilter;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[
                  styles.filterChip,
                  isDark && styles.filterChipDark,
                  active && styles.filterChipActive,
                ]}
              >
                <Ionicons
                  name={f.icon as any}
                  size={13}
                  color={active ? "#FFFFFF" : isDark ? "#94A3B8" : "#475569"}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isDark && { color: "#94A3B8" },
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View
            style={[
              styles.filterDivider,
              isDark && { backgroundColor: "#334155" },
            ]}
          />

          {/* Sort toggle */}
          <TouchableOpacity
            onPress={() => setSortMode(sortMode === "price" ? "time" : "price")}
            style={[styles.sortChip, isDark && styles.filterChipDark]}
          >
            <Ionicons
              name="swap-vertical-outline"
              size={13}
              color={isDark ? "#94A3B8" : "#475569"}
            />
            <Text
              style={[styles.filterChipText, isDark && { color: "#94A3B8" }]}
            >
              {sortMode === "price" ? tl.sort_price : tl.sort_time}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Flight List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <Text
                style={[
                  styles.emptyTitle,
                  isDark && { color: "#F1F5F9" },
                  { marginTop: 20 },
                ]}
              >
                Đang tải chuyến bay...
              </Text>
            ) : (
              <>
                <Ionicons
                  name="airplane-outline"
                  size={56}
                  color={isDark ? "#334155" : "#CBD5E1"}
                />
                <Text
                  style={[styles.emptyTitle, isDark && { color: "#F1F5F9" }]}
                >
                  {tl.empty}
                </Text>
                <Text
                  style={[styles.emptySubtitle, isDark && { color: "#64748B" }]}
                >
                  {tl.empty_sub}
                </Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <FlightCard
            item={item}
            onPress={() =>
              router.push({ pathname: "/flight/[id]", params: { id: item.id } })
            }
            isDark={isDark}
            lang={lang}
            formatPrice={formatPrice}
          />
        )}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  containerDark: { backgroundColor: "#0F172A" },

  // Hero
  hero: { width: "100%" },
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 12,
    paddingVertical: 10,
    gap: 3,
  },
  statVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textAlign: "center",
  },

  // Search
  searchWrapper: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchWrapperDark: {
    backgroundColor: "#1E293B",
    borderBottomColor: "#334155",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchBarDark: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },

  // Filters
  filterSection: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterSectionDark: {
    backgroundColor: "#1E293B",
    borderBottomColor: "#334155",
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  filterChipDark: {
    borderColor: "#334155",
    backgroundColor: "#0F172A",
  },
  filterChipActive: {
    backgroundColor: "#003087",
    borderColor: "#003087",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E2E8F0",
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },

  // List
  listContent: { padding: 16, gap: 14, paddingBottom: 32 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  cardTopBar: { height: 4, width: "100%" },
  cardBody: { padding: 14, gap: 12 },

  // Airline row
  airlineRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  airlineName: { fontSize: 14, fontWeight: "800", color: "#0F172A" },
  aircraftText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "900", color: "#FFFFFF" },

  // Route row
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  routeEndpoint: { flex: 1, gap: 3 },
  timeText: { fontSize: 22, fontWeight: "900", color: "#0F172A" },
  codeText: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
  cityText: { fontSize: 10, color: "#94A3B8", fontWeight: "500" },
  routeCenter: { flex: 1, alignItems: "center", gap: 4 },
  durationText: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 2,
  },
  routeDot: { width: 6, height: 6, borderRadius: 3 },
  routeLineBar: { flex: 1, height: 1.5, backgroundColor: "#E2E8F0" },
  directBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  directBadgeText: { fontSize: 10, fontWeight: "800", color: "#16A34A" },

  // Divider
  divider: { height: 1, backgroundColor: "#F1F5F9" },

  // Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerMeta: { gap: 5, flex: 1 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 11, color: "#94A3B8", fontWeight: "500" },
  priceBlock: { alignItems: "flex-end", gap: 2 },
  origPrice: {
    fontSize: 11,
    color: "#94A3B8",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  price: { fontSize: 20, fontWeight: "900", color: "#003087" },
  discountChip: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: { fontSize: 10, fontWeight: "800", color: "#DC2626" },

  // Book button
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 12,
    marginTop: 4,
  },
  bookBtnText: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },

  // Empty
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 18,
  },
});
