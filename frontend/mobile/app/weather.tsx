import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { StatusBar } from 'expo-status-bar';

// ─── Weather Structures ──────────────────────────────────────────────────────
interface DestinationWeather {
  name: string;
  distance: number; // in km from Da Nang
  preference: 'Biển đảo' | 'Núi non' | 'Văn hóa/Lịch sử' | 'Nghỉ dưỡng';
  budget: number; // in VND
  rating: string;
  priceStr: string;
  weatherTemp: string;
  weatherIcon: string;
  weatherDescVi: string;
  weatherDescEn: string;
  image: string;
  tag?: string;
}

const RECOMMENDATIONS_DB: DestinationWeather[] = [
  {
    name: 'Hội An',
    distance: 30,
    preference: 'Văn hóa/Lịch sử',
    budget: 890000,
    rating: '4.8',
    priceStr: '890.000đ',
    weatherTemp: '27°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Trời nắng ráo, lộng gió',
    weatherDescEn: 'Sunny and breezy',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
    tag: 'Phố cổ',
  },
  {
    name: 'Huế',
    distance: 100,
    preference: 'Văn hóa/Lịch sử',
    budget: 950000,
    rating: '4.8',
    priceStr: '950.000đ',
    weatherTemp: '26°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Trời trong xanh, mát mẻ',
    weatherDescEn: 'Clear blue sky, cool',
    image: 'https://images.unsplash.com/photo-1590564311439-909ac7f933b2?q=80&w=400',
    tag: 'Cố đô',
  },
  {
    name: 'Nha Trang',
    distance: 500,
    preference: 'Biển đảo',
    budget: 1500000,
    rating: '4.7',
    priceStr: '1.500.000đ',
    weatherTemp: '29°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Nắng đẹp biển lặng',
    weatherDescEn: 'Beautiful sun, calm sea',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400',
    tag: 'Biển xanh',
  },
  {
    name: 'Sa Pa',
    distance: 900,
    preference: 'Núi non',
    budget: 1250000,
    rating: '4.9',
    priceStr: '1.250.000đ',
    weatherTemp: '19°C',
    weatherIcon: 'cloudy',
    weatherDescVi: 'Nhiều sương mù, se lạnh',
    weatherDescEn: 'Foggy and chilly',
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400',
    tag: 'Bán chạy',
  },
  {
    name: 'Phú Quốc',
    distance: 1100,
    preference: 'Biển đảo',
    budget: 2200000,
    rating: '4.9',
    priceStr: '2.200.000đ',
    weatherTemp: '30°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Nắng vàng cát mịn',
    weatherDescEn: 'Golden sun, fine sand',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
    tag: 'Thiên đường',
  },
  {
    name: 'Phong Nha',
    distance: 300,
    preference: 'Núi non',
    budget: 1690000,
    rating: '4.7',
    priceStr: '1.690.000đ',
    weatherTemp: '24°C',
    weatherIcon: 'partly-sunny',
    weatherDescVi: 'Mát mẻ dễ chịu',
    weatherDescEn: 'Cool and pleasant',
    image: 'https://images.unsplash.com/photo-1609137144813-7d7211bf7ec8?q=80&w=400',
  },
  {
    name: 'Hà Giang',
    distance: 950,
    preference: 'Núi non',
    budget: 1490000,
    rating: '4.9',
    priceStr: '1.490.000đ',
    weatherTemp: '22°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Nắng ráo gió nhẹ',
    weatherDescEn: 'Dry and gentle breeze',
    image: 'https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=400',
    tag: 'Đứng đầu',
  },
  {
    name: 'Ninh Bình',
    distance: 700,
    preference: 'Núi non',
    budget: 990000,
    rating: '4.8',
    priceStr: '990.000đ',
    weatherTemp: '25°C',
    weatherIcon: 'partly-sunny',
    weatherDescVi: 'Trời hửng nắng nhẹ',
    weatherDescEn: 'Mild sunshine',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400',
    tag: 'Thiên nhiên',
  },
  {
    name: 'Tokyo',
    distance: 3800,
    preference: 'Nghỉ dưỡng',
    budget: 18900000,
    rating: '4.9',
    priceStr: '18.900.000đ',
    weatherTemp: '20°C',
    weatherIcon: 'sunny',
    weatherDescVi: 'Thời tiết mát mẻ trong lành',
    weatherDescEn: 'Cool and fresh weather',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400',
    tag: 'Nổi bật',
  },
  {
    name: 'Seoul',
    distance: 3100,
    preference: 'Nghỉ dưỡng',
    budget: 14500000,
    rating: '4.9',
    priceStr: '14.500.000đ',
    weatherTemp: '21°C',
    weatherIcon: 'cloudy',
    weatherDescVi: 'Nhiều mây trời dịu mát',
    weatherDescEn: 'Cloudy and pleasant',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400',
    tag: 'Hot Deal',
  }
];

export default function WeatherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language } = useAppSettings();

  const isDark = theme === 'dark';
  const isVi = language === 'vi';

  // ─── States ────────────────────────────────────────────────────────────────
  const [selectedPreference, setSelectedPreference] = useState<string>('Tất cả');
  const [selectedBudget, setSelectedBudget] = useState<number>(99999999);
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);

  // ─── Weather Data Mocks ─────────────────────────────────────────────────────
  const localWeather = {
    location: 'Đà Nẵng',
    temp: '28°C',
    descVi: 'Trời nắng đẹp, gió biển mát mẻ',
    descEn: 'Sunny day with cool sea breeze',
    humidity: '62%',
    wind: '12 km/h',
    uv: '8/10 (Cao)',
    uvEn: '8/10 (High)',
    forecast: [
      { dayVi: 'Ngày mai', dayEn: 'Tomorrow', temp: '29°C', icon: 'sunny' },
      { dayVi: 'Ngày kia', dayEn: 'Day after', temp: '28°C', icon: 'partly-sunny' },
      { dayVi: 'Ngày kìa', dayEn: 'Next day', temp: '30°C', icon: 'sunny' },
    ]
  };

  const bookedToursWeather = [
    {
      name: 'Hạ Long',
      bookingId: 'BK-8902',
      statusVi: 'Đã thanh toán',
      statusEn: 'Confirmed',
      status: 'Confirmed',
      date: '18/06/2026',
      temp: '31°C',
      icon: 'cloudy',
      descVi: 'Nhiều mây, có mưa rào rải rác chiều tối',
      descEn: 'Cloudy with scattered evening showers',
    },
    {
      name: 'Phú Quốc',
      bookingId: 'BK-5412',
      statusVi: 'Chờ thanh toán',
      statusEn: 'Pending',
      status: 'Pending',
      date: '02/07/2026',
      temp: '29°C',
      icon: 'partly-sunny',
      descVi: 'Có mây rải rác, ngày nắng đẹp trời xanh',
      descEn: 'Scattered clouds, sunny day with blue sky',
    }
  ];

  // ─── Filter & Recommendations logic ─────────────────────────────────────────
  const recommendations = useMemo(() => {
    let list = RECOMMENDATIONS_DB;

    // 1. Filter by preference
    if (selectedPreference !== 'Tất cả') {
      list = list.filter((item) => item.preference === selectedPreference);
    }

    // 2. Filter by budget
    if (selectedBudget < 99999999) {
      list = list.filter((item) => item.budget <= selectedBudget);
    }

    // 3. Sort
    list = [...list];
    if (sortByDistance) {
      list.sort((a, b) => a.distance - b.distance);
    } else {
      list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return list;
  }, [selectedPreference, selectedBudget, sortByDistance]);

  // Fallback recommendations if list is empty
  const fallbackRecommendations = useMemo(() => {
    // Return closest destinations with sunny weather
    return [...RECOMMENDATIONS_DB]
      .filter((item) => item.weatherIcon === 'sunny' || item.weatherIcon === 'partly-sunny')
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, []);

  const handleDestinationPress = (name: string) => {
    router.push({ pathname: '/destination-detail', params: { pinId: name } });
  };

  const renderWeatherIcon = (iconName: string, size = 28, color = '#FF5B22') => {
    switch (iconName) {
      case 'sunny':
        return <Ionicons name="sunny" size={size} color="#FFB800" />;
      case 'partly-sunny':
        return <Ionicons name="partly-sunny" size={size} color="#FFD60A" />;
      case 'cloudy':
        return <Ionicons name="cloudy" size={size} color="#94A3B8" />;
      default:
        return <Ionicons name="rainy" size={size} color={color} />;
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E1B4B'] : ['#E0F2FE', '#F8FAFC']}
      style={styles.container}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} translucent />
      
      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>
          {isVi ? 'Thời Tiết & Gợi Ý' : 'Weather & Suggestions'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Section 1: Local Weather */}
        <View style={styles.section}>
          <LinearGradient
            colors={isDark ? ['rgba(30, 41, 59, 0.75)', 'rgba(15, 23, 42, 0.55)'] : ['rgba(255, 255, 255, 0.75)', 'rgba(255, 255, 255, 0.45)']}
            style={[styles.localWeatherCard, { borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)' }]}
          >
            <View style={styles.localHeader}>
              <View>
                <Text style={[styles.localSub, isDark && { color: '#FF702A' }]}>
                  {isVi ? 'VỊ TRÍ HIỆN TẠI CỦA BẠN' : 'YOUR CURRENT LOCATION'}
                </Text>
                <Text style={[styles.localCity, isDark && styles.textDark]}>{localWeather.location}</Text>
              </View>
              <View style={styles.localTempRow}>
                {renderWeatherIcon('sunny', 40)}
                <Text style={[styles.localTemp, isDark && styles.textDark]}>{localWeather.temp}</Text>
              </View>
            </View>

            <Text style={[styles.localDesc, isDark && { color: '#94A3B8' }]}>
              {isVi ? localWeather.descVi : localWeather.descEn}
            </Text>

            <View style={styles.localSpecsGrid}>
              <View style={styles.specItem}>
                <Ionicons name="water-outline" size={16} color="#0EA5E9" />
                <View>
                  <Text style={styles.specLabel}>{isVi ? 'Độ ẩm' : 'Humidity'}</Text>
                  <Text style={[styles.specVal, isDark && styles.textDark]}>{localWeather.humidity}</Text>
                </View>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="thunderstorm-outline" size={16} color="#FFB800" />
                <View>
                  <Text style={styles.specLabel}>{isVi ? 'Chỉ số UV' : 'UV Index'}</Text>
                  <Text style={[styles.specVal, isDark && styles.textDark]}>
                    {isVi ? localWeather.uv : localWeather.uvEn}
                  </Text>
                </View>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="speedometer-outline" size={16} color="#10B981" />
                <View>
                  <Text style={styles.specLabel}>{isVi ? 'Sức gió' : 'Wind'}</Text>
                  <Text style={[styles.specVal, isDark && styles.textDark]}>{localWeather.wind}</Text>
                </View>
              </View>
            </View>

            {/* 3 Days Forecast */}
            <View style={[styles.forecastDivider, isDark && { backgroundColor: '#334155' }]} />
            <Text style={[styles.forecastTitle, isDark && { color: '#E2E8F0' }]}>
              {isVi ? 'Dự báo những ngày tới' : 'Next Days Forecast'}
            </Text>
            <View style={styles.forecastRow}>
              {localWeather.forecast.map((f, i) => (
                <View key={i} style={[styles.forecastDayCard, isDark && styles.forecastDayCardDark]}>
                  <Text style={[styles.forecastDayText, isDark && { color: '#94A3B8' }]}>
                    {isVi ? f.dayVi : f.dayEn}
                  </Text>
                  {renderWeatherIcon(f.icon, 20)}
                  <Text style={[styles.forecastTempText, isDark && styles.textDark]}>{f.temp}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Section 2: Weather at Booked Tours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {isVi ? 'Thời tiết tại điểm đặt tour' : 'Weather at Your Booked Tours'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {isVi ? 'Theo dõi thời tiết để chuẩn bị hành lý tốt nhất' : 'Keep track of weather to prepare your luggage'}
          </Text>

          {bookedToursWeather.map((tour, idx) => (
            <View key={idx} style={[styles.bookedTourCard, isDark && styles.bookedTourCardDark]}>
              <View style={styles.bookedTourHeader}>
                <View>
                  <Text style={[styles.bookedTourName, isDark && styles.textDark]}>{tour.name}</Text>
                  <Text style={styles.bookedTourId}>{tour.bookingId} • {tour.date}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  tour.status === 'Confirmed' ? styles.statusBadgeConfirmed : styles.statusBadgePending
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {isVi ? tour.statusVi : tour.statusEn}
                  </Text>
                </View>
              </View>
              <View style={[styles.bookedDivider, isDark && { backgroundColor: '#334155' }]} />
              <View style={styles.bookedWeatherRow}>
                <View style={styles.bookedTempCol}>
                  {renderWeatherIcon(tour.icon, 32)}
                  <Text style={[styles.bookedTemp, isDark && styles.textDark]}>{tour.temp}</Text>
                </View>
                <Text style={[styles.bookedDesc, isDark && { color: '#94A3B8' }]} numberOfLines={2}>
                  {isVi ? tour.descVi : tour.descEn}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section 3: Smart Destination Recommendations */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {isVi ? 'Gợi ý điểm du lịch thời tiết đẹp' : 'Weather-Perfect Trip Ideas'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {isVi ? 'Đề xuất dựa trên sở thích, khoảng cách và ngân sách của bạn' : 'Smart recommendations matching your lifestyle, budget and distance'}
          </Text>

          {/* Filtering Console */}
          <View style={[styles.consoleCard, isDark && styles.consoleCardDark]}>
            {/* Preference Selector */}
            <Text style={[styles.consoleLabel, isDark && { color: '#E2E8F0' }]}>
              {isVi ? 'Bạn thích đi du lịch kiểu gì?' : 'What\'s your holiday vibe?'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.consoleChipsRow}>
              {['Tất cả', 'Biển đảo', 'Núi non', 'Văn hóa/Lịch sử', 'Nghỉ dưỡng'].map((pref) => {
                const isActive = selectedPreference === pref;
                return (
                  <TouchableOpacity
                    key={pref}
                    style={[styles.consoleChip, isActive && styles.consoleChipActive]}
                    onPress={() => setSelectedPreference(pref)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.consoleChipText, isActive && styles.consoleChipTextActive]}>
                      {pref}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Budget Selector */}
            <Text style={[styles.consoleLabel, { marginTop: 14 }, isDark && { color: '#E2E8F0' }]}>
              {isVi ? 'Chi phí dự kiến (Giá tour khởi điểm)' : 'Your budget limit (Starting price)'}
            </Text>
            <View style={styles.budgetButtonsRow}>
              {[
                { labelVi: 'Tất cả', labelEn: 'All', value: 99999999 },
                { labelVi: 'Dưới 1.5M', labelEn: 'Under 1.5M', value: 1500000 },
                { labelVi: 'Dưới 5M', labelEn: 'Under 5M', value: 5000000 },
                { labelVi: 'Dưới 20M', labelEn: 'Under 20M', value: 20000000 },
              ].map((b, i) => {
                const isActive = selectedBudget === b.value;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.budgetBtn, isActive && styles.budgetBtnActive]}
                    onPress={() => setSelectedBudget(b.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.budgetBtnText, isActive && styles.budgetBtnTextActive]}>
                      {isVi ? b.labelVi : b.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Sort/Distance Option */}
            <View style={styles.distanceRow}>
              <Text style={[styles.distanceLabel, isDark && { color: '#E2E8F0' }]}>
                {isVi ? 'Ưu tiên địa điểm gần bạn nhất (Đà Nẵng)' : 'Prioritize destinations closest to you (Da Nang)'}
              </Text>
              <TouchableOpacity
                style={[styles.toggleSwitch, sortByDistance && styles.toggleSwitchActive]}
                onPress={() => setSortByDistance(!sortByDistance)}
                activeOpacity={0.8}
              >
                <View style={[styles.toggleKnob, sortByDistance && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Results Lists */}
          {recommendations.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationsScroll}
            >
              {recommendations.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.recCard, isDark && styles.recCardDark]}
                  onPress={() => handleDestinationPress(item.name)}
                  activeOpacity={0.9}
                >
                  <ImageBackground source={{ uri: item.image }} style={styles.recImg}>
                    <View style={styles.recHeaderRow}>
                      <View style={styles.recDistanceBadge}>
                        <Ionicons name="location-outline" size={10} color="#FFFFFF" />
                        <Text style={styles.recDistanceText}>{item.distance} km</Text>
                      </View>
                      {item.tag && (
                        <View style={styles.recTagBadge}>
                          <Text style={styles.recTagText}>{item.tag}</Text>
                        </View>
                      )}
                    </View>

                    <LinearGradient
                      colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
                      style={styles.recGradient}
                    >
                      <View style={styles.recWeatherInfo}>
                        {renderWeatherIcon(item.weatherIcon, 14)}
                        <Text style={styles.recWeatherTemp}>{item.weatherTemp}</Text>
                        <Text style={styles.recWeatherDesc} numberOfLines={1}>
                          {isVi ? item.weatherDescVi : item.weatherDescEn}
                        </Text>
                      </View>

                      <Text style={styles.recName}>{item.name}</Text>
                      <View style={styles.recFooter}>
                        <Text style={styles.recPrice}>Chỉ từ {item.priceStr}</Text>
                        <View style={styles.recRating}>
                          <Ionicons name="star" size={10} color="#FFB800" />
                          <Text style={styles.recRatingText}>{item.rating}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            // Fallback screen when no exact match found
            <View style={[styles.emptyBox, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
              <Ionicons name="filter-outline" size={32} color="#FF5B22" style={{ marginBottom: 6 }} />
              <Text style={[styles.emptyBoxTitle, isDark && styles.textDark]}>
                {isVi ? 'Không tìm thấy điểm đến khớp hoàn toàn' : 'No exact match found'}
              </Text>
              <Text style={styles.emptyBoxSub}>
                {isVi 
                  ? 'Tuy nhiên, dưới đây là các điểm đến thời tiết đẹp & gần bạn nhất hiện tại:' 
                  : 'However, here are the sunniest & closest spots near you right now:'}
              </Text>

              {/* Display Fallback destinations */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.recommendationsScroll, { paddingLeft: 0, marginTop: 12 }]}
              >
                {fallbackRecommendations.map((item, index) => (
                  <TouchableOpacity
                    key={`fallback-${index}`}
                    style={[styles.recCard, isDark && styles.recCardDark]}
                    onPress={() => handleDestinationPress(item.name)}
                    activeOpacity={0.9}
                  >
                    <ImageBackground source={{ uri: item.image }} style={styles.recImg}>
                      <View style={styles.recHeaderRow}>
                        <View style={styles.recDistanceBadge}>
                          <Ionicons name="location-outline" size={10} color="#FFFFFF" />
                          <Text style={styles.recDistanceText}>{item.distance} km</Text>
                        </View>
                      </View>

                      <LinearGradient
                        colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
                        style={styles.recGradient}
                      >
                        <View style={styles.recWeatherInfo}>
                          {renderWeatherIcon(item.weatherIcon, 14)}
                          <Text style={styles.recWeatherTemp}>{item.weatherTemp}</Text>
                        </View>

                        <Text style={styles.recName}>{item.name}</Text>
                        <View style={styles.recFooter}>
                          <Text style={styles.recPrice}>Chỉ từ {item.priceStr}</Text>
                          <View style={styles.recRating}>
                            <Ionicons name="star" size={10} color="#FFB800" />
                            <Text style={styles.recRatingText}>{item.rating}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    zIndex: 10,
  },
  headerDark: {},
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
    fontWeight: '600',
  },
  localWeatherCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  localHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF5B22',
    letterSpacing: 1,
  },
  localCity: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  localTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  localTemp: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
  },
  localDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
    fontWeight: '600',
  },
  localSpecsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 14,
    padding: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specLabel: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '600',
  },
  specVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  forecastDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  forecastTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  forecastDayCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  forecastDayCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  forecastDayText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  forecastTempText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookedTourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  bookedTourCardDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  bookedTourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookedTourName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookedTourId: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeConfirmed: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  bookedDivider: {
    height: 0.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  bookedWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookedTempCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookedTemp: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookedDesc: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  consoleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
  },
  consoleCardDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  consoleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
  },
  consoleChipsRow: {
    gap: 8,
    paddingBottom: 2,
  },
  consoleChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  consoleChipActive: {
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FF5B22',
  },
  consoleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  consoleChipTextActive: {
    color: '#FF5B22',
    fontWeight: '800',
  },
  budgetButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  budgetBtn: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  budgetBtnActive: {
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FF5B22',
  },
  budgetBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  budgetBtnTextActive: {
    color: '#FF5B22',
    fontWeight: '800',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
    gap: 12,
  },
  distanceLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    lineHeight: 15,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#FF5B22',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  recommendationsScroll: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 12,
  },
  recCard: {
    width: 240,
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  recCardDark: {
    backgroundColor: '#1E293B',
  },
  recImg: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  recDistanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  recDistanceText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  recTagBadge: {
    backgroundColor: '#FF5B22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  recGradient: {
    padding: 10,
    paddingTop: 20,
  },
  recWeatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  recWeatherTemp: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  recWeatherDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 8,
    fontWeight: '600',
    flex: 1,
  },
  recName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  recPrice: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9,
    fontWeight: '600',
  },
  recRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  recRatingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFD9CC',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  emptyBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C',
    textAlign: 'center',
  },
  emptyBoxSub: {
    fontSize: 10,
    color: '#7C2D12',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
});
