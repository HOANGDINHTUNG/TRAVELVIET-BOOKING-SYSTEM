import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import type { Flight } from '@/types/flight';
import { MOCK_FLIGHTS } from '@/constants/flightsMock';

const { width } = Dimensions.get('window');

export default function FlightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, formatPrice, t } = useAppSettings();
  const { showSnackbar } = useSnackbar();
  const isDark = theme === 'dark';

  // Search and filter states
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [departureCity, setDepartureCity] = useState('Hà Nội');
  const [arrivalCity, setArrivalCity] = useState('TP. Hồ Chí Minh');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [showFilters, setShowFilters] = useState(false);

  // Filtered and sorted list
  const filteredFlights = useMemo(() => {
    let list = [...MOCK_FLIGHTS];

    // Filter by trip type
    list = list.filter((f) => f.tripType === tripType);

    // Filter by cities
    list = list.filter((f) => f.departureCity === departureCity && f.arrivalCity === arrivalCity);

    // Filter by price
    list = list.filter((f) => f.price <= maxPrice);

    // Sort
    if (sortBy === 'price') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => {
        const durA = parseInt(a.outbound.duration.split('h')[0]);
        const durB = parseInt(b.outbound.duration.split('h')[0]);
        return durA - durB;
      });
    } else if (sortBy === 'departure') {
      list.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
    }

    return list;
  }, [departureCity, arrivalCity, tripType, maxPrice, sortBy]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
  };

  const handleBookFlight = (flight: Flight) => {
    showSnackbar(`Đang mở chi tiết vé máy bay: ${flight.outbound.flightNumber}`);
    router.push({ pathname: '/flight/[id]', params: { id: flight.id } });
  };

  const handleSwapCities = () => {
    const temp = departureCity;
    setDepartureCity(arrivalCity);
    setArrivalCity(temp);
  };

  const renderFlightCard = ({ item }: { item: Flight }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleBookFlight(item)}
        style={[styles.flightCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
      >
        {/* Badge */}
        {item.badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}

        {/* Flight Details */}
        <View style={styles.flightContent}>
          {/* Outbound Flight */}
          <View>
            <View style={styles.airlineRow}>
              <Text style={[styles.airlineCode, isDark && { color: '#FFFFFF' }]}>
                {item.outbound.airline.code}
              </Text>
              <Text style={[styles.flightNumber, isDark && { color: '#94A3B8' }]} numberOfLines={1}>
                {item.outbound.flightNumber}
              </Text>
            </View>

            <View style={styles.timelineRow}>
              <View style={styles.timelineColumn}>
                <Text style={[styles.time, isDark && { color: '#FFFFFF' }]}>
                  {formatTime(item.outbound.departureTime)}
                </Text>
                <Text style={[styles.airport, isDark && { color: '#94A3B8' }]}>
                  {item.outbound.departureAirport}
                </Text>
              </View>

              <View style={styles.timelineRoute}>
                <View style={styles.routeLine} />
                <Text style={[styles.duration, isDark && { color: '#94A3B8' }]}>
                  {item.outbound.duration}
                </Text>
                {item.outbound.stops > 0 && (
                  <Text style={[styles.stops, isDark && { color: '#EF4444' }]}>
                    {item.outbound.stops} dừng
                  </Text>
                )}
              </View>

              <View style={[styles.timelineColumn, { alignItems: 'flex-end' }]}>
                <Text style={[styles.time, isDark && { color: '#FFFFFF' }]}>
                  {formatTime(item.outbound.arrivalTime)}
                </Text>
                <Text style={[styles.airport, isDark && { color: '#94A3B8' }]}>
                  {item.outbound.arrivalAirport}
                </Text>
              </View>
            </View>
          </View>

          {/* Return Flight (if roundTrip) */}
          {item.return && (
            <View style={styles.returnFlightDivider}>
              <Text style={[styles.returnLabel, isDark && { color: '#94A3B8' }]}>Chuyến về</Text>
            </View>
          )}

          {item.return && (
            <View style={styles.marginTop16}>
              <View style={styles.airlineRow}>
                <Text style={[styles.airlineCode, isDark && { color: '#FFFFFF' }]}>
                  {item.return.airline.code}
                </Text>
                <Text style={[styles.flightNumber, isDark && { color: '#94A3B8' }]} numberOfLines={1}>
                  {item.return.flightNumber}
                </Text>
              </View>

              <View style={styles.timelineRow}>
                <View style={styles.timelineColumn}>
                  <Text style={[styles.time, isDark && { color: '#FFFFFF' }]}>
                    {formatTime(item.return.departureTime)}
                  </Text>
                  <Text style={[styles.airport, isDark && { color: '#94A3B8' }]}>
                    {item.return.departureAirport}
                  </Text>
                </View>

                <View style={styles.timelineRoute}>
                  <View style={styles.routeLine} />
                  <Text style={[styles.duration, isDark && { color: '#94A3B8' }]}>
                    {item.return.duration}
                  </Text>
                  {item.return.stops > 0 && (
                    <Text style={[styles.stops, isDark && { color: '#EF4444' }]}>
                      {item.return.stops} dừng
                    </Text>
                  )}
                </View>

                <View style={[styles.timelineColumn, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.time, isDark && { color: '#FFFFFF' }]}>
                    {formatTime(item.return.arrivalTime)}
                  </Text>
                  <Text style={[styles.airport, isDark && { color: '#94A3B8' }]}>
                    {item.return.arrivalAirport}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Footer: Rating, Available Seats, Price & CTA */}
          <View style={[styles.cardFooter, isDark && { borderTopColor: '#334155' }]}>
            <View style={styles.footerLeft}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FF702A" />
                <Text style={[styles.rating, isDark && { color: '#FFFFFF' }]}>
                  {item.rating} ({item.reviewCount})
                </Text>
              </View>
              <Text style={[styles.seatsLeft, isDark && { color: '#94A3B8' }]}>
                Còn {item.availableSeats} chỗ
              </Text>
            </View>

            <View style={styles.footerRight}>
              <View style={styles.priceColumn}>
                {item.originalPrice && item.originalPrice > item.price && (
                  <Text style={[styles.originalPrice, isDark && { color: '#94A3B8' }]}>
                    {formatPrice(item.originalPrice)}
                  </Text>
                )}
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => handleBookFlight(item)}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        {/* Hero Banner */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1552421554-5fefe8c9ef14?q=80&w=1000' }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)']}
            style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
          >
            <Text style={styles.heroTitle}>VÉ MÁY BAY</Text>
            <Text style={styles.heroSubtitle}>Tìm vé máy bay giá tốt, bay an toàn</Text>
          </LinearGradient>
        </ImageBackground>

        {/* Search Panel */}
        <View style={[styles.searchCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          {/* Trip Type Selector */}
          <View style={styles.tripTypeSelector}>
            <TouchableOpacity
              style={[
                styles.tripTypeBtn,
                tripType === 'oneWay' && styles.tripTypeActive,
                isDark && tripType === 'oneWay' && { backgroundColor: '#0F172A' },
              ]}
              onPress={() => setTripType('oneWay')}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === 'oneWay' && { color: '#FF702A' },
                  isDark && { color: '#94A3B8' },
                ]}
              >
                Một chiều
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tripTypeBtn,
                tripType === 'roundTrip' && styles.tripTypeActive,
                isDark && tripType === 'roundTrip' && { backgroundColor: '#0F172A' },
              ]}
              onPress={() => setTripType('roundTrip')}
            >
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === 'roundTrip' && { color: '#FF702A' },
                  isDark && { color: '#94A3B8' },
                ]}
              >
                Khứ hồi
              </Text>
            </TouchableOpacity>
          </View>

          {/* City Selector */}
          <View style={styles.cityRow}>
            <TouchableOpacity
              style={[styles.cityBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
              onPress={() => {
                Alert.alert('Khởi hành từ', '', [
                  { text: 'Hà Nội', onPress: () => setDepartureCity('Hà Nội') },
                  { text: 'TP. Hồ Chí Minh', onPress: () => setDepartureCity('TP. Hồ Chí Minh') },
                  { text: 'Đà Nẵng', onPress: () => setDepartureCity('Đà Nẵng') },
                ])
              }}
            >
              <Ionicons name="arrow-back" size={16} color="#FF702A" />
              <Text style={[styles.cityBtnText, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>
                {departureCity}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.swapBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
              onPress={handleSwapCities}
            >
              <Ionicons name="swap-vertical" size={16} color="#FF702A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cityBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
              onPress={() => {
                Alert.alert('Đến', '', [
                  { text: 'Hà Nội', onPress: () => setArrivalCity('Hà Nội') },
                  { text: 'TP. Hồ Chí Minh', onPress: () => setArrivalCity('TP. Hồ Chí Minh') },
                  { text: 'Đà Nẵng', onPress: () => setArrivalCity('Đà Nẵng') },
                ])
              }}
            >
              <Ionicons name="arrow-forward" size={16} color="#FF702A" />
              <Text style={[styles.cityBtnText, isDark && { color: '#FFFFFF' }]} numberOfLines={1}>
                {arrivalCity}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sort & Filter Buttons */}
          <View style={styles.sortFilterRow}>
            <TouchableOpacity
              style={[styles.sortBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
              onPress={() => {
                Alert.alert('Sắp xếp theo', '', [
                  { text: 'Giá (Thấp → Cao)', onPress: () => setSortBy('price') },
                  { text: 'Thời gian bay', onPress: () => setSortBy('duration') },
                  { text: 'Giờ khởi hành', onPress: () => setSortBy('departure') },
                ])
              }}
            >
              <Ionicons name="funnel" size={14} color="#FF702A" />
              <Text style={[styles.sortBtnText, isDark && { color: '#FFFFFF' }]}>Sắp xếp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="options-outline" size={14} color="#FF702A" />
              <Text style={[styles.filterBtnText, isDark && { color: '#FFFFFF' }]}>Lọc</Text>
            </TouchableOpacity>
          </View>

          {/* Price Filter Slider (expanded) */}
          {showFilters && (
            <View style={[styles.filterPanel, isDark && { borderTopColor: '#334155' }]}>
              <Text style={[styles.filterLabel, isDark && { color: '#FFFFFF' }]}>
                Giá tối đa: {formatPrice(maxPrice)}
              </Text>
              <TouchableOpacity
                style={[styles.priceSlider, isDark && { backgroundColor: '#0F172A', borderColor: '#334155' }]}
                onPress={() => setMaxPrice(maxPrice + 200000)}
              >
                <View style={styles.priceSliderThumb} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Results Summary */}
        <View style={[styles.resultsSummary, isDark && { borderBottomColor: '#334155' }]}>
          <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
          <Text style={[styles.resultsSummaryText, isDark && { color: '#94A3B8' }]}>
            Tìm thấy <Text style={styles.resultCount}>{filteredFlights.length}</Text> chuyến bay
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
      <FlatList
        data={filteredFlights}
        keyExtractor={(item) => item.id}
        renderItem={renderFlightCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={64} color="#D1D5DB" />
            <Text style={[styles.emptyTitle, isDark && { color: '#FFFFFF' }]}>
              Không tìm thấy chuyến bay
            </Text>
            <Text style={[styles.emptyText, isDark && { color: '#94A3B8' }]}>
              Hãy thay đổi bộ lọc hoặc thành phố để tìm vé máy bay khác
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f3ea',
  },
  listContent: {
    paddingBottom: 24,
  },

  // Hero
  heroBackground: {
    height: 200,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#F3F4F6',
    fontWeight: '500',
  },

  // Search Card
  searchCard: {
    marginHorizontal: 12,
    marginTop: -40,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // Trip Type
  tripTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tripTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tripTypeActive: {
    borderColor: '#FF702A',
    backgroundColor: '#FEF2E8',
  },
  tripTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#6B7280',
  },

  // Cities
  cityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cityBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Sort & Filter
  sortFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  // Filter Panel
  filterPanel: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  priceSlider: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  priceSliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF702A',
    marginTop: -5,
    marginLeft: 20,
  },

  // Results Summary
  resultsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsSummaryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  resultCount: {
    fontWeight: '700',
    color: '#FF702A',
  },

  // Flight Card
  flightCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#FF702A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  flightContent: {
    padding: 14,
  },

  // Airline Row
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  airlineCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    minWidth: 35,
  },
  flightNumber: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timelineColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  airport: {
    marginTop: 2,
    fontSize: 10,
    color: '#6B7280',
  },
  timelineRoute: {
    flex: 1.2,
    alignItems: 'center',
    gap: 4,
  },
  routeLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 2,
  },
  duration: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  stops: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '600',
  },

  // Return flight divider
  returnFlightDivider: {
    paddingVertical: 8,
    marginVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  returnLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  marginTop16: {
    marginTop: 16,
  },

  // Card Footer
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerLeft: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  seatsLeft: {
    fontSize: 11,
    color: '#6B7280',
  },

  footerRight: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF702A',
  },
  bookBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FF702A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
