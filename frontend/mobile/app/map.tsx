import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import * as Location from 'expo-location';

interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: string;
  toursCount: string;
  image: string;
  desc: string;
  price: string;
  attractions: string[];
  activities: string[];
  ticketPrices: string;
  services: string[];
  icon: string;
}

const MAP_PINS: MapPin[] = [
  {
    id: 'pin1',
    name: 'Sa Pa',
    latitude: 22.3364,
    longitude: 103.8438,
    rating: '4.9',
    toursCount: '19 Tours',
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400',
    desc: 'Thiên đường sương mù với dãy Hoàng Liên Sơn hùng vĩ, ruộng bậc thang tuyệt mỹ và văn hóa bản địa độc đáo.',
    price: '1.250.000đ',
    attractions: ['Đỉnh Fansipan', 'Bản Cát Cát', 'Thung Lũng Mường Hoa'],
    activities: ['Đi xe cáp treo', 'Tắm lá Dao đỏ', 'Ăn đồ nướng'],
    ticketPrices: 'Cáp treo Fansipan: 800.000đ. Vé Bản Cát Cát: 150.000đ.',
    services: ['Đưa đón KS', 'HDV bản địa', 'Nước suối'],
    icon: '🏔️',
  },
  {
    id: 'pin2',
    name: 'Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    rating: '4.8',
    toursCount: '15 Tours',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
    desc: 'Thủ đô ngàn năm văn hiến cổ kính, Hồ Gươm tĩnh lặng và ẩm thực đường phố trứ danh thế giới.',
    price: '950.000đ',
    attractions: ['Hồ Hoàn Kiếm', 'Lăng Bác', 'Văn Miếu'],
    activities: ['Xích lô Phố Cổ', 'Ăn phở Hà Nội', 'Uống cafe trứng'],
    ticketPrices: 'Văn Miếu: 30.000đ. Lăng Bác: Miễn phí.',
    services: ['Xe điện phố cổ', 'HDV thuyết minh', 'Nước uống'],
    icon: '🏛️',
  },
  {
    id: 'pin3',
    name: 'Hạ Long',
    latitude: 20.9756,
    longitude: 107.0438,
    rating: '4.9',
    toursCount: '28 Tours',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400',
    desc: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ và dịch vụ du thuyền nghỉ đêm đẳng cấp.',
    price: '2.500.000đ',
    attractions: ['Vịnh Hạ Long', 'Đảo Ti Tốp', 'Hang Sửng Sốt'],
    activities: ['Chèo thuyền kayak', 'Tắm biển Ti Tốp', 'Ăn buffet hải sản'],
    ticketPrices: 'Vé Vịnh: 290.000đ. Cano/kayak: 50.000đ.',
    services: ['Du thuyền 5 sao', 'Ăn trưa buffet', 'Bảo hiểm'],
    icon: '⛵',
  },
  {
    id: 'pin4',
    name: 'Huế',
    latitude: 16.4637,
    longitude: 107.5909,
    rating: '4.7',
    toursCount: '12 Tours',
    image: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=400',
    desc: 'Cố đô thanh bình, thơ mộng mang dấu ấn lịch sử triều Nguyễn với Đại Nội lộng lẫy và lăng tẩm uy nghiêm.',
    price: '1.100.000đ',
    attractions: ['Đại Nội Huế', 'Chùa Thiên Mụ', 'Lăng Khải Định'],
    activities: ['Ca Huế sông Hương', 'Chụp ảnh cổ phục', 'Ăn bún bò Huế'],
    ticketPrices: 'Vé Đại Nội: 200.000đ. Vé lăng tẩm: 150.000đ.',
    services: ['Audio guide', 'Xe điện Đại Nội', 'Nón lá tặng'],
    icon: '🏯',
  },
  {
    id: 'pin5',
    name: 'Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    rating: '4.9',
    toursCount: '22 Tours',
    image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400',
    desc: 'Thành phố biển năng động sở hữu Cầu Vàng lừng danh thế giới trên đỉnh Bà Nà và bãi biển Mỹ Khê cát mịn.',
    price: '1.350.000đ',
    attractions: ['Cầu Vàng Bà Nà', 'Biển Mỹ Khê', 'Bán đảo Sơn Trà'],
    activities: ['Cáp treo Bà Nà', 'Ngắm Cầu Rồng', 'Leo Ngũ Hành Sơn'],
    ticketPrices: 'Vé Bà Nà Hills: 900.000đ. Ngũ Hành Sơn: 40.000đ.',
    services: ['Đưa đón trung tâm', 'Buffet trưa', 'HDV suốt tuyến'],
    icon: '🌉',
  },
  {
    id: 'pin6',
    name: 'Nha Trang',
    latitude: 12.2388,
    longitude: 109.1967,
    rating: '4.8',
    toursCount: '18 Tours',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400',
    desc: 'Vịnh biển xanh cát trắng như kem, những hòn đảo san hô rực rỡ và công viên VinWonders sôi động.',
    price: '1.500.000đ',
    attractions: ['Đảo Hòn Tre', 'Tháp Bà Po Nagar', 'Hòn Mun'],
    activities: ['Lặn ngắm san hô', 'Tắm bùn khoáng', 'Vui chơi vịnh phao'],
    ticketPrices: 'VinWonders: 800.000đ. Tắm bùn: 250.000đ.',
    services: ['Cano cao tốc', 'HDV lặn biển', 'Phao & kính lặn'],
    icon: '🏖️',
  },
  {
    id: 'pin7',
    name: 'Đà Lạt',
    latitude: 11.9404,
    longitude: 108.4583,
    rating: '4.8',
    toursCount: '20 Tours',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
    desc: 'Thành phố ngàn hoa thơ mộng ôn đới quanh năm, các quán cafe săn mây và lẩu gà lá é thơm ngon.',
    price: '1.050.000đ',
    attractions: ['Hồ Xuân Hương', 'Đỉnh Langbiang', 'Đồi Chè Cầu Đất'],
    activities: ['Xe Jeep Langbiang', 'Săn mây sớm', 'Ăn lẩu gà lá é'],
    ticketPrices: 'Vé Langbiang: 50.000đ. Xe Jeep khứ hồi: 120.000đ.',
    services: ['Xe Jeep di chuyển', 'Nước uống', 'Vé vào cổng'],
    icon: '🌲',
  },
  {
    id: 'pin8',
    name: 'Sài Gòn',
    latitude: 10.7769,
    longitude: 106.7009,
    rating: '4.8',
    toursCount: '16 Tours',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600',
    desc: 'Trung tâm kinh tế sầm uất với các tòa nhà chọc trời, ẩm thực phong phú và nhịp sống đêm sôi động.',
    price: '850.000đ',
    attractions: ['Dinh Độc Lập', 'Chợ Bến Thành', 'Bưu điện TP'],
    activities: ['Bus 2 tầng Phố', 'Ăn cơm tấm đêm', 'Dạo phố đi bộ'],
    ticketPrices: 'Dinh Độc Lập: 65.000đ. Bus 2 tầng: 150.000đ.',
    services: ['Vé xe buýt 2 tầng', 'HDV thuyết minh', 'Bản đồ du lịch'],
    icon: '🏙️',
  },
  {
    id: 'pin9',
    name: 'Phú Quốc',
    latitude: 10.2198,
    longitude: 103.9628,
    rating: '4.9',
    toursCount: '25 Tours',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
    desc: 'Đảo Ngọc hoang sơ tuyệt mỹ quyến rũ với Bãi Sao cát trắng mịn, hoàng hôn nhuộm tím biển khơi.',
    price: '2.200.000đ',
    attractions: ['Bãi Sao', 'Grand World', 'Hòn Thơm'],
    activities: ['Cáp treo Hòn Thơm', 'Show Tinh Hoa VN', 'Đi bộ dưới biển'],
    ticketPrices: 'Cáp treo: 600.000đ. Show diễn: 300.000đ.',
    services: ['Bus điện Grand World', 'Cano ra đảo', 'Kính lặn ống thở'],
    icon: '🌴',
  },
  {
    id: 'pin10',
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    rating: '4.9',
    toursCount: '32 Tours',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400',
    desc: 'Siêu đô thị hiện đại giao thoa giữa những tòa nhà chọc trời phát sáng và đền thờ cổ kính thanh bình.',
    price: '18.900.000đ',
    attractions: ['Đền Senso-ji', 'Tháp Tokyo Skytree', 'Ngã tư Shibuya'],
    activities: ['Check-in Shibuya', 'Mua sắm Akihabara', 'Thưởng thức Sushi'],
    ticketPrices: 'Skytree: 3000 JPY. Đền thờ: Miễn phí.',
    services: ['Thẻ tàu điện ngầm', 'HDV tiếng Việt', 'Wifi di động'],
    icon: '🗼',
  },
  {
    id: 'pin11',
    name: 'Seoul',
    latitude: 37.5665,
    longitude: 126.9780,
    rating: '4.8',
    toursCount: '24 Tours',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400',
    desc: 'Thủ đô Hàn Quốc sôi động giao hòa giữa làng cổ Hanok bình yên, cung điện xưa và âm nhạc K-Pop hiện đại.',
    price: '15.500.000đ',
    attractions: ['Cung Gyeongbokgung', 'Tháp N Seoul', 'Làng Bukchon Hanok'],
    activities: ['Mặc áo Hanbok', 'Ăn gà hầm sâm', 'Dạo chợ Myeongdong'],
    ticketPrices: 'Cung điện: 3000 KRW. Vé cáp treo: 15.000 KRW.',
    services: ['Thuê Hanbok free', 'Sim du lịch 4G', 'Bảo hiểm quốc tế'],
    icon: '🍁',
  },
  {
    id: 'pin12',
    name: 'Bangkok',
    latitude: 13.7563,
    longitude: 100.5018,
    rating: '4.8',
    toursCount: '20 Tours',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400',
    desc: 'Đất nước Chùa Vàng xinh đẹp nổi tiếng với các đền chùa cổ kính lộng lẫy và ẩm thực đường phố phong phú.',
    price: '6.800.000đ',
    attractions: ['Chùa Phật Ngọc', 'Wat Arun', 'Chợ nổi Saduak'],
    activities: ['Đi thuyền Chao Phraya', 'Massage Thái cổ truyền', 'Ăn Tom Yum'],
    ticketPrices: 'Vé Hoàng Cung: 500 THB. Vé đền Wat Arun: 100 THB.',
    services: ['Thuyền gỗ chợ nổi', 'HDV thuyết minh', 'Nước uống đóng chai'],
    icon: '🛕',
  },
];

const PIN_TO_TOUR_MAP: Record<string, string> = {
  pin1: '6',    // Sa Pa
  pin2: 't11',  // Hà Nội
  pin3: '3',    // Hạ Long
  pin4: '5',    // Huế
  pin5: 't12',  // Đà Nẵng
  pin6: 't8',   // Nha Trang
  pin7: '2',    // Đà Lạt
  pin8: 't13',  // Sài Gòn
  pin9: '4',    // Phú Quốc
  pin10: 't10', // Tokyo
  pin11: 't14', // Seoul
  pin12: 't9',  // Bangkok
};

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language } = useAppSettings();
  const { showSnackbar } = useSnackbar();
  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';

  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const mapRef = useRef<MapView>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'terrain' | 'hybrid'>('standard');
  const [showMapTypes, setShowMapTypes] = useState(false);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // Briefly re-enable tracksViewChanges when selectedPin changes to allow render transitions, then freeze
  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [selectedPin]);

  const handleStreetView = (latitude: number, longitude: number) => {
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
    Linking.openURL(streetViewUrl).catch(() => {
      showSnackbar(
        lang === 'vi' 
          ? 'Không thể mở chế độ xem phố.' 
          : 'Could not open Street View.'
      );
    });
  };

  const handleLocateUser = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        showSnackbar(
          lang === 'vi'
            ? 'Vui lòng cấp quyền vị trí để sử dụng tính năng này.'
            : 'Please grant location permission to use this feature.'
        );
        return;
      }
      
      showSnackbar(
        lang === 'vi' ? 'Đang tìm vị trí của bạn...' : 'Locating you...'
      );
      
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
      
      setHasLocationPermission(true);
    } catch {
      showSnackbar(
        lang === 'vi'
          ? 'Không thể định vị được thiết bị của bạn. Vui lòng bật GPS.'
          : 'Could not detect device location. Please enable GPS.'
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasLocationPermission(true);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Animate map camera to center of Vietnam (Da Nang) on load
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: 16.0544,
        longitude: 108.2022,
        latitudeDelta: 12.0,
        longitudeDelta: 12.0,
      }, 1000);
    }, 400);
  }, []);

  const handleDestinationPress = (pinId: string, name: string) => {
    const tourId = PIN_TO_TOUR_MAP[pinId];
    if (tourId) {
      showSnackbar(lang === 'vi' ? `Đang mở chi tiết tour tại: ${name}...` : `Opening tour details in ${name}...`);
      router.push({ pathname: '/tour/[id]', params: { id: tourId } });
    } else {
      showSnackbar(lang === 'vi' ? `Đang tải danh sách các tour tại: ${name}...` : `Loading tours in ${name}...`);
      router.push({ pathname: '/(tabs)/tours', params: { searchQuery: name } });
    }
  };

  return (
    <View style={[styles.modalContainer, isDark && { backgroundColor: '#0F172A' }]}>
      {/* Floating Back Button */}
      <TouchableOpacity
        style={[styles.floatingBackBtn, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Map Type Selector */}
      <View style={[styles.mapTypeContainer, { top: insets.top + 72 }]}>
        <TouchableOpacity 
          style={[styles.mapTypeToggleBtn, showMapTypes && styles.mapTypeToggleBtnActive]}
          onPress={() => setShowMapTypes(!showMapTypes)}
          activeOpacity={0.85}
        >
          <Ionicons name="layers-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {showMapTypes && (
          <View style={[styles.mapTypesRow, isDark && styles.mapTypesRowDark]}>
            {[
              { type: 'standard', labelVi: 'Bản đồ', labelEn: 'Map', icon: 'map-outline' },
              { type: 'satellite', labelVi: 'Vệ tinh', labelEn: 'Satellite', icon: 'planet-outline' },
              { type: 'terrain', labelVi: 'Địa hình', labelEn: 'Terrain', icon: 'trending-up-outline' },
              { type: 'hybrid', labelVi: 'Hỗn hợp', labelEn: 'Hybrid', icon: 'grid-outline' },
            ].map((item) => {
              const active = mapType === item.type;
              return (
                <TouchableOpacity
                  key={item.type}
                  style={[styles.mapTypeOption, active && styles.mapTypeOptionActive]}
                  onPress={() => {
                    setMapType(item.type as any);
                    setShowMapTypes(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon as any} size={12} color={active ? '#FFFFFF' : (isDark ? '#94A3B8' : '#475569')} />
                  <Text style={[styles.mapTypeOptionText, active && styles.mapTypeOptionTextActive, isDark && !active && { color: '#94A3B8' }]}>
                    {lang === 'vi' ? item.labelVi : item.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Floating Header Panel */}
      <View style={[styles.floatingHeader, { top: insets.top + 12 }]}>
        <Text style={styles.floatingHeaderTitle}>
          {lang === 'vi' ? 'Bản Đồ Du Lịch Việt Nam & Quốc Tế' : 'Vietnam & International Travel Map'}
        </Text>
        <Text style={styles.floatingHeaderSub}>
          {lang === 'vi' ? 'Vuốt để di chuyển • Nhấp địa điểm để xem chi tiết' : 'Swipe to pan • Tap pin for details'}
        </Text>
      </View>

      {/* Map canvas - Native MapView */}
      <View style={styles.mapCanvasContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          userInterfaceStyle={isDark ? 'dark' : 'light'}
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={hasLocationPermission}
          mapType={mapType}
          initialRegion={{
            latitude: 16.0544,
            longitude: 108.2022,
            latitudeDelta: 12.0,
            longitudeDelta: 12.0,
          }}
          onPress={() => setSelectedPin(null)}
        >
          {/* Markers for Pins */}
          {MAP_PINS.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            return (
              <Marker
                key={pin.id}
                coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedPin(pin);
                }}
                tracksViewChanges={tracksViewChanges}
              >
                <View style={styles.customMarkerContainer}>
                  {/* Bubble containing image & emoji badge */}
                  <View style={[styles.customMarkerBubble, isSelected && styles.customMarkerBubbleActive]}>
                    <Image 
                      source={{ uri: pin.image }} 
                      style={styles.customMarkerImage} 
                      resizeMode="cover"
                    />
                    <View style={styles.customMarkerBadge}>
                      <Text style={styles.customMarkerBadgeText}>{pin.icon}</Text>
                    </View>
                  </View>
                  {/* Teardrop arrow pointing down */}
                  <View style={[styles.customMarkerArrow, isSelected && styles.customMarkerArrowActive]} />
                  
                  {/* Label under the pin */}
                  <View style={[styles.customMarkerLabel, isSelected && styles.customMarkerLabelActive]}>
                    <Text style={[styles.customMarkerLabelText, isSelected && styles.customMarkerLabelTextActive]}>
                      {pin.name}
                    </Text>
                  </View>
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>

      {/* Floating My Location Button */}
      <TouchableOpacity
        style={[
          styles.locateBtn,
          isDark && { backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.08)' },
          { bottom: selectedPin ? 385 : 40 }
        ]}
        onPress={handleLocateUser}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={24} color="#FF5B22" />
      </TouchableOpacity>

      {/* Selected Pin Bottom Sheet Details */}
      {selectedPin && (
        <View style={[styles.mapBottomSheet, isDark && styles.mapBottomSheetDark]}>
          {/* Handle Bar */}
          <View style={styles.sheetHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
          >
            {/* Header Row */}
            <View style={styles.bottomSheetHeader}>
              <Image source={{ uri: selectedPin.image }} style={styles.bottomSheetThumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.bottomSheetRow}>
                  <Text style={[styles.bottomSheetName, isDark && { color: '#FFFFFF' }]}>{selectedPin.name}</Text>
                  <View style={styles.bottomSheetRating}>
                    <Ionicons name="star" size={12} color="#FFB800" />
                    <Text style={[styles.bottomSheetRatingText, isDark && { color: '#E2E8F0' }]}>{selectedPin.rating}</Text>
                  </View>
                </View>
                <Text style={styles.bottomSheetTours}>{selectedPin.toursCount}</Text>
                <Text style={[styles.bottomSheetPrice, isDark && { color: '#94A3B8' }]}>
                  {lang === 'vi' ? 'Chỉ từ ' : 'From '}
                  <Text style={styles.bottomSheetPriceBold}>{selectedPin.price}</Text>
                </Text>
              </View>
            </View>
            
            <Text style={[styles.bottomSheetDesc, isDark && { color: '#CBD5E1' }]}>
              {selectedPin.desc}
            </Text>

            {/* 1. Attractions (Danh lam thắng cảnh) */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="compass-outline" size={14} color="#FF5B22" />
                <Text style={[styles.detailSectionTitle, isDark && { color: '#E2E8F0' }]}>
                  {lang === 'vi' ? 'Danh lam thắng cảnh nổi bật' : 'Key Attractions'}
                </Text>
              </View>
              <View style={styles.chipsRow}>
                {selectedPin.attractions.map((attr, idx) => (
                  <View key={idx} style={[styles.detailChip, isDark && styles.detailChipDark]}>
                    <Ionicons name="pin-outline" size={10} color="#FF5B22" />
                    <Text style={[styles.chipText, isDark && { color: '#E2E8F0' }]}>{attr}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 2. Activities & Dining (Vui chơi & Ăn uống) */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="restaurant-outline" size={14} color="#FF5B22" />
                <Text style={[styles.detailSectionTitle, isDark && { color: '#E2E8F0' }]}>
                  {lang === 'vi' ? 'Vui chơi & Ăn uống' : 'Activities & Dining'}
                </Text>
              </View>
              <View style={styles.chipsRow}>
                {selectedPin.activities.map((act, idx) => (
                  <View key={idx} style={[styles.detailChip, styles.activityChip, isDark && styles.activityChipDark]}>
                    <Ionicons name="cafe-outline" size={10} color="#FF5B22" />
                    <Text style={[styles.chipText, isDark && { color: '#E2E8F0' }]}>{act}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 3. Ticket Prices & Services */}
            <View style={[styles.row, { marginTop: 12, gap: 10 }]}>
              {/* Prices */}
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="ticket-outline" size={14} color="#FF5B22" />
                  <Text style={[styles.detailSectionTitle, isDark && { color: '#E2E8F0' }]}>
                    {lang === 'vi' ? 'Giá vé tham khảo' : 'Ticket Prices'}
                  </Text>
                </View>
                <View style={[styles.priceContainer, isDark && styles.priceContainerDark]}>
                  <Text style={[styles.priceInfoText, isDark && { color: '#A7F3D0' }]}>{selectedPin.ticketPrices}</Text>
                </View>
              </View>

              {/* Services */}
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="shield-checkmark-outline" size={14} color="#FF5B22" />
                  <Text style={[styles.detailSectionTitle, isDark && { color: '#E2E8F0' }]}>
                    {lang === 'vi' ? 'Dịch vụ đi kèm' : 'Services included'}
                  </Text>
                </View>
                <View style={styles.chipsRow}>
                  {selectedPin.services.map((srv, idx) => (
                    <View key={idx} style={[styles.srvChip, isDark && styles.srvChipDark]}>
                      <Ionicons name="checkmark-circle-outline" size={10} color="#10B981" />
                      <Text style={[styles.srvChipText, isDark && { color: '#A7F3D0' }]}>{srv}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={[styles.bottomSheetActions, { flexDirection: 'row', gap: 8 }]}>
            <TouchableOpacity
              style={[styles.bottomSheetViewBtn, { flex: 1, backgroundColor: '#9C6644' }]}
              onPress={() => {
                router.push({ pathname: '/destination-detail', params: { pinId: selectedPin.id } });
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="information-circle-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[styles.bottomSheetViewBtnText, { fontSize: 11 }]}>
                {lang === 'vi' ? 'Chi Tiết' : 'Details'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomSheetViewBtn, { flex: 1, backgroundColor: '#0284C7' }]}
              onPress={() => handleStreetView(selectedPin.latitude, selectedPin.longitude)}
              activeOpacity={0.85}
            >
              <Ionicons name="eye-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[styles.bottomSheetViewBtnText, { fontSize: 11 }]}>
                {lang === 'vi' ? 'Xem Phố' : 'Street View'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomSheetViewBtn, { flex: 1 }]}
              onPress={() => handleDestinationPress(selectedPin.id, selectedPin.name)}
              activeOpacity={0.85}
            >
              <Ionicons name="search-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[styles.bottomSheetViewBtnText, { fontSize: 11 }]}>
                {lang === 'vi' ? 'Tìm Tour' : 'Find Tours'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mapCanvasContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  mapPinDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.8,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  mapPinDotActive: {
    borderColor: '#FF5B22',
    borderWidth: 2.5,
  },
  mapPinImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  mapPinPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    opacity: 0.25,
    zIndex: 5,
  },
  mapPinPulseActive: {
    borderColor: '#FF5B22',
    width: 52,
    height: 52,
    borderRadius: 26,
    opacity: 0.45,
  },
  mapPinLabel: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    zIndex: 12,
  },
  mapPinLabelActive: {
    color: '#FFFFFF',
    backgroundColor: '#FF5B22',
    fontSize: 10,
  },
  mapBottomSheet: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    elevation: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
  },
  mapBottomSheetDark: {
    backgroundColor: '#1E293B',
    shadowColor: '#000000',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetThumb: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  bottomSheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSheetName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  bottomSheetRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bottomSheetRatingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomSheetTours: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  bottomSheetPrice: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
  },
  bottomSheetPriceBold: {
    color: '#FF5B22',
    fontWeight: '800',
  },
  bottomSheetDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  bottomSheetActions: {
    marginTop: 14,
  },
  bottomSheetViewBtn: {
    backgroundColor: '#FF5B22',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetViewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetScroll: {
    maxHeight: 280,
  },
  sheetScrollContent: {
    paddingBottom: 20,
  },
  detailSection: {
    marginTop: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  detailChipDark: {
    backgroundColor: '#1E293B',
  },
  activityChip: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
  },
  activityChipDark: {
    backgroundColor: 'rgba(254, 110, 34, 0.1)',
    borderColor: 'rgba(254, 110, 34, 0.2)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  priceContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 10,
    padding: 10,
    marginTop: 2,
  },
  priceContainerDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  priceInfoText: {
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
    fontWeight: '600',
  },
  srvChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  srvChipDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  srvChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  floatingBackBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingHeader: {
    position: 'absolute',
    left: 76,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 998,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  floatingHeaderSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  mapTypeContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    zIndex: 999,
  },
  mapTypeToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  mapTypeToggleBtnActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FFFFFF',
  },
  mapTypesRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapTypesRowDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  mapTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
  },
  mapTypeOptionActive: {
    backgroundColor: '#FF5B22',
  },
  mapTypeOptionText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  mapTypeOptionTextActive: {
    color: '#FFFFFF',
  },
  locateBtn: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 997,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  customMarkerBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#1E293B',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'visible',
  },
  customMarkerBubbleActive: {
    borderColor: '#FF5B22',
    transform: [{ scale: 1.15 }],
    borderWidth: 2.5,
  },
  customMarkerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  customMarkerBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
  },
  customMarkerBadgeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  customMarkerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    zIndex: 9,
  },
  customMarkerArrowActive: {
    borderTopColor: '#FF5B22',
    transform: [{ scale: 1.15 }],
  },
  customMarkerLabel: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 12,
  },
  customMarkerLabelActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  customMarkerLabelText: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: '800',
  },
  customMarkerLabelTextActive: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});
