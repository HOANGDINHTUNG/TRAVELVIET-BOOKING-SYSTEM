import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
  Image,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useRouter } from 'expo-router';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const nameToPinId: Record<string, string> = {
  'Sa Pa': 'pin1',
  'Hà Nội': 'pin2',
  'Hạ Long': 'pin3',
  'Quảng Ninh': 'pin3',
  'Huế': 'pin4',
  'Đà Nẵng': 'pin5',
  'Nha Trang': 'pin6',
  'Đà Lạt': 'pin7',
  'Sài Gòn': 'pin8',
  'Hồ Chí Minh': 'pin8',
  'TP. Hồ Chí Minh': 'pin8',
  'Phú Quốc': 'pin9',
  'Tokyo': 'pin10',
  'Seoul': 'pin11',
  'Bangkok': 'pin12',
};

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleanStr = priceStr.replace(/\D/g, '');
  return parseInt(cleanStr, 10) || 0;
};

// ─── Destination Card Component ──────────────────────────────────────────────

interface DestinationCardProps {
  name: string;
  image: string;
  toursCount?: string;
  rating?: string;
  price?: string;
  tag?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  style?: StyleProp<ViewStyle>;
  height: number;
  onPress: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  image,
  toursCount = '12 Tours',
  rating = '4.8',
  price = '1.200.000đ',
  tag,
  isBookmarked = false,
  onBookmarkToggle,
  style,
  height,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.cardContainer, { height }, style]}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.cardBackgroundImage}
        resizeMode="cover"
      >
        {/* Top Floating Badges */}
        <View style={styles.cardHeaderRow}>
          {tag ? (
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{tag}</Text>
            </View>
          ) : <View />}
          
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={(e) => {
              e.stopPropagation();
              if (onBookmarkToggle) onBookmarkToggle();
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBookmarked ? 'heart' : 'heart-outline'}
              size={16}
              color={isBookmarked ? '#FF3B30' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Details Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.85)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardInfoRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFB800" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <Text style={styles.toursText}>{toursCount}</Text>
          </View>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardPrice}>Chỉ từ {price}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// ─── Destination Mock Data (with curated high-res Unsplash images) ──────────

const DESTINATIONS = [
  // North
  {
    name: 'Hà Giang',
    image: 'https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=600',
    region: 'north',
    toursCount: '15 Tours',
    rating: '4.9',
    price: '1.490.000đ',
    tag: 'Đứng đầu',
  },
  {
    name: 'Sa Pa',
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=600',
    region: 'north',
    toursCount: '19 Tours',
    rating: '4.9',
    price: '1.250.000đ',
    tag: 'Bán chạy',
  },
  {
    name: 'Ninh Bình',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600',
    region: 'north',
    toursCount: '16 Tours',
    rating: '4.8',
    price: '990.000đ',
    tag: 'Thiên nhiên',
  },
  {
    name: 'Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600',
    region: 'north',
    toursCount: '20 Tours',
    rating: '4.9',
    price: '1.800.000đ',
    tag: 'Di sản',
  },
  {
    name: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600',
    region: 'north',
    toursCount: '28 Tours',
    rating: '4.8',
    price: '790.000đ',
    tag: 'Văn hóa',
  },
  {
    name: 'Cát Bà',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
    region: 'north',
    toursCount: '8 Tours',
    rating: '4.7',
    price: '1.150.000đ',
  },
  {
    name: 'Hải Phòng',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600',
    region: 'north',
    toursCount: '13 Tours',
    rating: '4.5',
    price: '850.000đ',
  },
  {
    name: 'Cao Bằng',
    image: 'https://images.unsplash.com/photo-1582803824122-f25522edd1e0?q=80&w=600',
    region: 'north',
    toursCount: '10 Tours',
    rating: '4.8',
    price: '1.390.000đ',
    tag: 'Kỳ vĩ',
  },
  {
    name: 'Đà Lạt',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600',
    region: 'center', // Treat Dalat as Central Highlands/Center for regional tabs
    toursCount: '24 Tours',
    rating: '4.8',
    price: '1.290.000đ',
    tag: 'Lãng mạn',
  },
  // Center
  {
    name: 'Hội An',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
    region: 'center',
    toursCount: '14 Tours',
    rating: '4.8',
    price: '890.000đ',
    tag: 'Phố cổ',
  },
  {
    name: 'Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=600',
    region: 'center',
    toursCount: '22 Tours',
    rating: '4.9',
    price: '1.350.000đ',
    tag: 'Đáng sống',
  },
  {
    name: 'Nha Trang',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600',
    region: 'center',
    toursCount: '18 Tours',
    rating: '4.7',
    price: '1.500.000đ',
    tag: 'Biển xanh',
  },
  {
    name: 'Huế',
    image: 'https://images.unsplash.com/photo-1590564311439-909ac7f933b2?q=80&w=600',
    region: 'center',
    toursCount: '15 Tours',
    rating: '4.8',
    price: '950.000đ',
    tag: 'Cố đô',
  },
  {
    name: 'Phong Nha',
    image: 'https://images.unsplash.com/photo-1609137144813-7d7211bf7ec8?q=80&w=600',
    region: 'center',
    toursCount: '10 Tours',
    rating: '4.7',
    price: '1.690.000đ',
  },
  {
    name: 'Phú Yên',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600',
    region: 'center',
    toursCount: '11 Tours',
    rating: '4.6',
    price: '1.100.000đ',
  },
  {
    name: 'Quy Nhơn',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600',
    region: 'center',
    toursCount: '12 Tours',
    rating: '4.7',
    price: '1.200.000đ',
  },
  {
    name: 'Mũi Né',
    image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=600',
    region: 'center',
    toursCount: '12 Tours',
    rating: '4.6',
    price: '990.000đ',
  },
  // South
  {
    name: 'Phú Quốc',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
    region: 'south',
    toursCount: '25 Tours',
    rating: '4.9',
    price: '2.200.000đ',
    tag: 'Thiên đường',
  },
  {
    name: 'Côn Đảo',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600',
    region: 'south',
    toursCount: '9 Tours',
    rating: '4.8',
    price: '2.500.000đ',
    tag: 'Hoang sơ',
  },
  {
    name: 'Vũng Tàu',
    image: 'https://images.unsplash.com/photo-1509060464153-4466739f88c0?q=80&w=600',
    region: 'south',
    toursCount: '14 Tours',
    rating: '4.5',
    price: '690.000đ',
  },
  {
    name: 'Cần Thơ',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600',
    region: 'south',
    toursCount: '11 Tours',
    rating: '4.6',
    price: '890.000đ',
    tag: 'Sông nước',
  },
];

const INTERNATIONAL_DESTINATIONS = [
  {
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600',
    toursCount: '32 Tours',
    rating: '4.9',
    price: '18.900.000đ',
    tag: 'Nổi bật',
  },
  {
    name: 'Seoul',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
    toursCount: '26 Tours',
    rating: '4.9',
    price: '14.500.000đ',
    tag: 'Hot Deal',
  },
  {
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600',
    toursCount: '18 Tours',
    rating: '4.8',
    price: '34.900.000đ',
  },
  {
    name: 'Venice',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600',
    toursCount: '21 Tours',
    rating: '4.8',
    price: '42.000.000đ',
  },
  {
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600',
    toursCount: '15 Tours',
    rating: '4.8',
    price: '28.500.000đ',
  },
];

const TRAVEL_GUIDES = [
  {
    id: 'g1',
    title: 'Bí kíp săn mây Sa Pa tự túc từ A - Z siêu chi tiết',
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400',
    readTime: '5 phút đọc',
    category: 'Cẩm nang',
  },
  {
    id: 'g2',
    title: 'Bản đồ ăn vặt Hội An chuẩn vị như người địa phương',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
    readTime: '3 phút đọc',
    category: 'Ẩm thực',
  },
  {
    id: 'g3',
    title: 'Lịch trình nghỉ dưỡng Phú Quốc 3 ngày 2 đêm thư thái',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
    readTime: '6 phút đọc',
    category: 'Lịch trình',
  },
];

type RegionFilter = 'all' | 'north' | 'center' | 'south' | 'international';

// ─── Map Pins Configuration ──────────────────────────────────────────────────

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
  },
];

export default function ExploreScreen() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const exploreScrollViewRef = useRef<ScrollView>(null);
  useScrollToTop(exploreScrollViewRef);

  const searchInputRef = useRef<TextInput>(null);

  // Animation for Map Pulse Ring
  const mapPulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(mapPulseAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, [mapPulseAnim]);

  const mapPulseScale = mapPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const mapPulseOpacity = mapPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [bookmarkedDests, setBookmarkedDests] = useState<string[]>(['Sa Pa', 'Đà Nẵng']);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Applied filter states
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [minTours, setMinTours] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('default');

  // Draft filter states
  const [draftTag, setDraftTag] = useState<string>('Tất cả');
  const [draftMinTours, setDraftMinTours] = useState<number>(0);
  const [draftMinRating, setDraftMinRating] = useState<number>(0);
  const [draftMaxPrice, setDraftMaxPrice] = useState<number>(0);
  const [draftSortBy, setDraftSortBy] = useState<string>('default');

  const { theme, language, t } = useAppSettings();
  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';

  const handleResetFilters = () => {
    setSelectedTag('Tất cả');
    setMinTours(0);
    setMinRating(0);
    setMaxPrice(0);
    setSortBy('default');
  };

  const handleOpenFilters = () => {
    setDraftTag(selectedTag);
    setDraftMinTours(minTours);
    setDraftMinRating(minRating);
    setDraftMaxPrice(maxPrice);
    setDraftSortBy(sortBy);
    setIsFilterVisible(true);
  };

  const handleApplyFilters = () => {
    setSelectedTag(draftTag);
    setMinTours(draftMinTours);
    setMinRating(draftMinRating);
    setMaxPrice(draftMaxPrice);
    setSortBy(draftSortBy);
    setIsFilterVisible(false);
  };

  const handleResetDraftFilters = () => {
    setDraftTag('Tất cả');
    setDraftMinTours(0);
    setDraftMinRating(0);
    setDraftMaxPrice(0);
    setDraftSortBy('default');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedTag && selectedTag !== 'Tất cả') count++;
    if (minTours > 0) count++;
    if (minRating > 0) count++;
    if (maxPrice > 0) count++;
    if (sortBy && sortBy !== 'default') count++;
    return count;
  }, [selectedTag, minTours, minRating, maxPrice, sortBy]);

  const handleDestinationPress = (name: string) => {
    const pinId = nameToPinId[name] || name;
    showSnackbar(lang === 'vi' ? `Đang mở điểm đến: ${name}...` : `Opening destination: ${name}...`);
    router.push({ pathname: '/destination-detail', params: { pinId } });
  };

  const handleContinentPress = (continentName: string) => {
    showSnackbar(lang === 'vi' ? `Đang mở khu vực: ${continentName}...` : `Opening region: ${continentName}...`);
    router.push({ pathname: '/continent-detail', params: { continent: continentName } });
  };

  const handleGuidePress = (guideId: string) => {
    showSnackbar(lang === 'vi' ? `Đang mở cẩm nang du lịch...` : `Opening travel guide...`);
    router.push({ pathname: '/guide-detail', params: { guideId } });
  };

  const handleBookmarkToggle = (name: string) => {
    if (bookmarkedDests.includes(name)) {
      setBookmarkedDests(bookmarkedDests.filter((d) => d !== name));
      showSnackbar(lang === 'vi' ? `Đã bỏ lưu điểm đến: ${name}` : `Removed bookmark for ${name}`);
    } else {
      setBookmarkedDests([...bookmarkedDests, name]);
      showSnackbar(lang === 'vi' ? `Đã lưu điểm đến: ${name} ❤️` : `Bookmarked ${name} ❤️`);
    }
  };

  const handleNewsletterSubmit = () => {
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      Alert.alert(
        lang === 'vi' ? 'Lỗi' : 'Error',
        lang === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.'
      );
      return;
    }
    setNewsletterSubmitted(true);
    showSnackbar(lang === 'vi' ? 'Đăng ký nhận tin tức thành công!' : 'Newsletter subscription successful!');
  };

  const filteredDomestic = useMemo(() => {
    let list = DESTINATIONS;

    if (activeRegion === 'north') {
      list = list.filter((d) => d.region === 'north');
    } else if (activeRegion === 'center') {
      list = list.filter((d) => d.region === 'center');
    } else if (activeRegion === 'south') {
      list = list.filter((d) => d.region === 'south');
    } else if (activeRegion === 'international') {
      return []; // Return empty for domestic list when filter is international
    }

    if (searchQuery.trim()) {
      list = list.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag && selectedTag !== 'Tất cả') {
      list = list.filter((d) => d.tag === selectedTag);
    }

    if (minTours > 0) {
      list = list.filter((d) => {
        const toursNum = parseInt(d.toursCount || '0');
        return !isNaN(toursNum) && toursNum >= minTours;
      });
    }

    if (minRating > 0) {
      list = list.filter((d) => {
        const ratingNum = parseFloat(d.rating || '0');
        return !isNaN(ratingNum) && ratingNum >= minRating;
      });
    }

    if (maxPrice > 0) {
      list = list.filter((d) => {
        const val = parsePrice(d.price);
        return val > 0 && val <= maxPrice;
      });
    }

    if (sortBy && sortBy !== 'default') {
      list = [...list];
      if (sortBy === 'rating_desc') {
        list.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
      } else if (sortBy === 'tours_desc') {
        list.sort((a, b) => parseInt(b.toursCount || '0') - parseInt(a.toursCount || '0'));
      } else if (sortBy === 'price_asc') {
        list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      }
    }

    return list;
  }, [searchQuery, activeRegion, selectedTag, minTours, minRating, maxPrice, sortBy]);

  const filteredInternational = useMemo(() => {
    if (activeRegion !== 'all' && activeRegion !== 'international') {
      return [];
    }
    let list = INTERNATIONAL_DESTINATIONS;

    if (searchQuery.trim()) {
      list = list.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag && selectedTag !== 'Tất cả') {
      list = list.filter((d) => d.tag === selectedTag);
    }

    if (minTours > 0) {
      list = list.filter((d) => {
        const toursNum = parseInt(d.toursCount || '0');
        return !isNaN(toursNum) && toursNum >= minTours;
      });
    }

    if (minRating > 0) {
      list = list.filter((d) => {
        const ratingNum = parseFloat(d.rating || '0');
        return !isNaN(ratingNum) && ratingNum >= minRating;
      });
    }

    if (maxPrice > 0) {
      list = list.filter((d) => {
        const val = parsePrice(d.price);
        return val > 0 && val <= maxPrice;
      });
    }

    if (sortBy && sortBy !== 'default') {
      list = [...list];
      if (sortBy === 'rating_desc') {
        list.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
      } else if (sortBy === 'tours_desc') {
        list.sort((a, b) => parseInt(b.toursCount || '0') - parseInt(a.toursCount || '0'));
      } else if (sortBy === 'price_asc') {
        list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      }
    }

    return list;
  }, [searchQuery, activeRegion, selectedTag, minTours, minRating, maxPrice, sortBy]);

  const draftMatchCount = useMemo(() => {
    let domList = DESTINATIONS;
    let intList = INTERNATIONAL_DESTINATIONS;

    if (activeRegion === 'north') {
      domList = domList.filter((d) => d.region === 'north');
      intList = [];
    } else if (activeRegion === 'center') {
      domList = domList.filter((d) => d.region === 'center');
      intList = [];
    } else if (activeRegion === 'south') {
      domList = domList.filter((d) => d.region === 'south');
      intList = [];
    } else if (activeRegion === 'international') {
      domList = [];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      domList = domList.filter((d) => d.name.toLowerCase().includes(q));
      intList = intList.filter((d) => d.name.toLowerCase().includes(q));
    }

    if (draftTag && draftTag !== 'Tất cả') {
      domList = domList.filter((d) => d.tag === draftTag);
      intList = intList.filter((d) => d.tag === draftTag);
    }

    if (draftMinTours > 0) {
      domList = domList.filter((d) => {
        const toursNum = parseInt(d.toursCount || '0');
        return !isNaN(toursNum) && toursNum >= draftMinTours;
      });
      intList = intList.filter((d) => {
        const toursNum = parseInt(d.toursCount || '0');
        return !isNaN(toursNum) && toursNum >= draftMinTours;
      });
    }

    if (draftMinRating > 0) {
      domList = domList.filter((d) => {
        const ratingNum = parseFloat(d.rating || '0');
        return !isNaN(ratingNum) && ratingNum >= draftMinRating;
      });
      intList = intList.filter((d) => {
        const ratingNum = parseFloat(d.rating || '0');
        return !isNaN(ratingNum) && ratingNum >= draftMinRating;
      });
    }

    if (draftMaxPrice > 0) {
      domList = domList.filter((d) => {
        const val = parsePrice(d.price);
        return val > 0 && val <= draftMaxPrice;
      });
      intList = intList.filter((d) => {
        const val = parsePrice(d.price);
        return val > 0 && val <= draftMaxPrice;
      });
    }

    return domList.length + intList.length;
  }, [searchQuery, activeRegion, draftTag, draftMinTours, draftMinRating, draftMaxPrice]);

  const REGION_TABS = [
    { key: 'all' as const, labelVi: 'Tất cả', labelEn: 'All', icon: 'grid-outline' },
    { key: 'north' as const, labelVi: 'Miền Bắc', labelEn: 'North', icon: 'snow-outline' },
    { key: 'center' as const, labelVi: 'Miền Trung', labelEn: 'Central', icon: 'leaf-outline' },
    { key: 'south' as const, labelVi: 'Miền Nam', labelEn: 'South', icon: 'sunny-outline' },
    { key: 'international' as const, labelVi: 'Quốc tế', labelEn: 'Quốc Tế', icon: 'globe-outline' },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        ref={exploreScrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Banner section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000' }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={isDark ? ['rgba(15, 23, 42, 0.45)', 'rgba(15, 23, 42, 0.98)'] : ['rgba(0,0,0,0.3)', 'rgba(248, 250, 252, 0.95)']}
            style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
          >
            {/* Personalized Glassmorphic Header */}
            <View style={styles.glassHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerWelcome}>
                  {lang === 'vi' ? 'Xin chào, Rio 👋' : 'Hello, Rio 👋'}
                </Text>
                <Text style={styles.headerKicker}>
                  {lang === 'vi' ? 'Hôm nay đi đâu chơi nhỉ?' : 'Where are we exploring today?'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.weatherBadge} 
                onPress={() => router.push('/weather')}
                activeOpacity={0.8}
              >
                <Ionicons name="sunny" size={14} color="#FFD60A" />
                <Text style={styles.weatherText}>Đà Nẵng 28°C</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.heroTitle, isDark && { color: '#FFFFFF' }]}>
              {lang === 'vi' ? 'Khám Phá Chân Trời Mới' : 'Discover New Horizons'}
            </Text>
          </LinearGradient>
        </ImageBackground>

        {/* Floating search input bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => searchInputRef.current?.focus()}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: '100%' }}
            >
              <Ionicons name="search-outline" size={20} color={isDark ? '#94A3B8' : '#7D848D'} style={{ marginRight: 8 }} />
              <TextInput
                ref={searchInputRef}
                placeholder={lang === 'vi' ? 'Tìm điểm đến, danh thắng...' : 'Search destinations, cities...'}
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, isDark && styles.searchInputDark]}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton} 
              activeOpacity={0.8}
              onPress={handleOpenFilters}
            >
              <Ionicons name="options-outline" size={20} color="#FF5B22" />
              {activeFilterCount > 0 && (
                <View style={[styles.filterBadge, isDark && styles.filterBadgeDark]}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Row */}
          {(selectedTag && selectedTag !== 'Tất cả') || minTours > 0 || minRating > 0 || maxPrice > 0 || (sortBy && sortBy !== 'default') ? (
            <View style={styles.activeFiltersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFiltersScroll}>
                {selectedTag && selectedTag !== 'Tất cả' && (
                  <TouchableOpacity style={styles.activeFilterChip} onPress={() => setSelectedTag('Tất cả')}>
                    <Text style={styles.activeFilterText}>Loại: {selectedTag}</Text>
                    <Ionicons name="close" size={14} color="#FF5B22" />
                  </TouchableOpacity>
                )}
                {minTours > 0 && (
                  <TouchableOpacity style={styles.activeFilterChip} onPress={() => setMinTours(0)}>
                    <Text style={styles.activeFilterText}>Số tour: &gt;={minTours}</Text>
                    <Ionicons name="close" size={14} color="#FF5B22" />
                  </TouchableOpacity>
                )}
                {minRating > 0 && (
                  <TouchableOpacity style={styles.activeFilterChip} onPress={() => setMinRating(0)}>
                    <Text style={styles.activeFilterText}>Đánh giá: &gt;={minRating}⭐</Text>
                    <Ionicons name="close" size={14} color="#FF5B22" />
                  </TouchableOpacity>
                )}
                {maxPrice > 0 && (
                  <TouchableOpacity style={styles.activeFilterChip} onPress={() => setMaxPrice(0)}>
                    <Text style={styles.activeFilterText}>
                      Giá: &lt;={maxPrice >= 10000000 ? `${maxPrice / 1000000}M` : `${(maxPrice / 1000000).toFixed(1)}M`}
                    </Text>
                    <Ionicons name="close" size={14} color="#FF5B22" />
                  </TouchableOpacity>
                )}
                {sortBy && sortBy !== 'default' && (
                  <TouchableOpacity style={styles.activeFilterChip} onPress={() => setSortBy('default')}>
                    <Text style={styles.activeFilterText}>
                      Sắp xếp: {
                        sortBy === 'rating_desc' ? 'Đánh giá' :
                        sortBy === 'tours_desc' ? 'Số tour' :
                        sortBy === 'price_asc' ? 'Giá tăng' : 'Giá giảm'
                      }
                    </Text>
                    <Ionicons name="close" size={14} color="#FF5B22" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.activeFilterChip, { backgroundColor: '#FFF0EA', borderColor: '#FF5B22' }]} onPress={handleResetFilters}>
                  <Text style={[styles.activeFilterText, { color: '#FF5B22' }]}>Xóa bộ lọc</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : null}

          {/* Dynamic Horizontal Filter Tabs with Icons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsScroll}
          >
            {REGION_TABS.map((tab) => {
              const active = tab.key === activeRegion;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => setActiveRegion(tab.key)}
                  style={[
                    styles.filterTabChip,
                    isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                    active && { backgroundColor: '#FF5B22', borderColor: '#FF5B22' },
                  ]}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={14}
                    color={active ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.filterTabLabel,
                      isDark && { color: '#94A3B8' },
                      active && { color: '#FFFFFF', fontWeight: '800' },
                    ]}
                  >
                    {lang === 'vi' ? tab.labelVi : tab.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Travel Map View Banner (Premium Styled Card) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.mapBanner, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}
          onPress={() => router.push('/map')}
        >
          {/* Mock Map Background Visual */}
          <LinearGradient
            colors={['rgba(255, 91, 34, 0.1)', 'rgba(255, 112, 42, 0.03)']}
            style={styles.mapBannerOverlay}
          />
          
          <View style={styles.mapIconCircle}>
            <Ionicons name="map" size={22} color="#FFFFFF" />
            <Animated.View
              style={[
                styles.mapPulseRing,
                {
                  transform: [{ scale: mapPulseScale }],
                  opacity: mapPulseOpacity,
                },
              ]}
            />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={[styles.mapTitle, isDark && { color: '#FFFFFF' }]}>
              {lang === 'vi' ? 'Bản Đồ Du Lịch Tương Tác' : 'Interactive Travel Map'}
            </Text>
            <Text style={[styles.mapSub, isDark && { color: '#94A3B8' }]}>
              {lang === 'vi' ? 'Khám phá các địa điểm nổi bật trực quan' : 'Find flights and tour packages visually'}
            </Text>
          </View>
          <View style={styles.mapExploreBadge}>
            <Text style={styles.mapExploreBadgeText}>{lang === 'vi' ? 'Mở' : 'Open'}</Text>
            <Ionicons name="chevron-forward" size={12} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>
        </TouchableOpacity>

        {searchQuery.trim().length > 0 || activeRegion !== 'all' || (selectedTag && selectedTag !== 'Tất cả') || minTours > 0 || minRating > 0 ? (
          // Search/Tab Filter result layout
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                {lang === 'vi' ? 'Danh sách điểm đến' : 'Destinations List'}
              </Text>
              <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                {lang === 'vi' ? 'Các địa danh phù hợp với bộ lọc' : 'Locations matching your preferences'}
              </Text>
            </View>

            <View style={styles.searchGrid}>
              {filteredDomestic.map((item, idx) => (
                <DestinationCard
                  key={`search-dom-${idx}`}
                  name={item.name}
                  image={item.image}
                  toursCount={item.toursCount}
                  rating={item.rating}
                  price={item.price}
                  tag={item.tag}
                  isBookmarked={bookmarkedDests.includes(item.name)}
                  onBookmarkToggle={() => handleBookmarkToggle(item.name)}
                  height={150}
                  style={styles.searchCard}
                  onPress={() => handleDestinationPress(item.name)}
                />
              ))}
              {filteredInternational.map((item, idx) => (
                <DestinationCard
                  key={`search-int-${idx}`}
                  name={item.name}
                  image={item.image}
                  toursCount={item.toursCount}
                  rating={item.rating}
                  price={item.price}
                  tag={item.tag}
                  isBookmarked={bookmarkedDests.includes(item.name)}
                  onBookmarkToggle={() => handleBookmarkToggle(item.name)}
                  height={150}
                  style={styles.searchCard}
                  onPress={() => handleDestinationPress(item.name)}
                />
              ))}
              {filteredDomestic.length === 0 && filteredInternational.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color={isDark ? '#4B5563' : '#9CA3AF'} />
                  <Text style={[styles.emptyText, isDark && styles.subtextDark]}>
                    {lang === 'vi' ? 'Không tìm thấy điểm đến nào' : 'No destinations found'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          // Main Asymmetric Grid Feed
          <>
            {/* Continent Explorer Section */}
            <View style={styles.continentSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  {lang === 'vi' ? 'Khám phá theo châu lục' : 'Explore by Continent'}
                </Text>
                <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                  {lang === 'vi' ? 'Tìm hành trình du lịch năm châu cùng TravelViet' : 'Find itineraries across the world'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.continentScroll}
              >
                {/* Vietnam */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.continentCard}
                  onPress={() => handleContinentPress('Việt Nam')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=300' }}
                    style={styles.continentImg}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.continentOverlay}
                  >
                    <Text style={styles.continentName}>{t('explore_vietnam', 'Việt Nam')}</Text>
                    <Text style={styles.continentDesc}>Vẻ đẹp bất tận của thiên nhiên & văn hóa Việt</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Asia */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.continentCard}
                  onPress={() => handleContinentPress('Châu Á')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=300' }}
                    style={styles.continentImg}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.continentOverlay}
                  >
                    <Text style={styles.continentName}>Châu Á</Text>
                    <Text style={styles.continentDesc}>Sự kết giao kỳ diệu giữa truyền thống và tương lai</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Europe */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.continentCard}
                  onPress={() => handleContinentPress('Châu Âu')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=300' }}
                    style={styles.continentImg}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.continentOverlay}
                  >
                    <Text style={styles.continentName}>Châu Âu</Text>
                    <Text style={styles.continentDesc}>Những thánh đường cổ kính và nền kiến trúc vĩ đại</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* America */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.continentCard}
                  onPress={() => handleContinentPress('Châu Mỹ')}
                >
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=300' }}
                    style={styles.continentImg}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.continentOverlay}
                  >
                    <Text style={styles.continentName}>Châu Mỹ</Text>
                    <Text style={styles.continentDesc}>Khám phá Tân thế giới rực rỡ và thiên nhiên hoang dại</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Travel Guides & Inspiration Section */}
            <View style={styles.guidesSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  {lang === 'vi' ? 'Cảm hứng hành trình' : 'Travel Guides & Inspiration'}
                </Text>
                <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                  {lang === 'vi' ? 'Bí kíp du lịch bỏ túi cực hay được đề xuất cho bạn' : 'Curated travel logs and guides'}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.guidesScroll}
              >
                {TRAVEL_GUIDES.map((guide) => (
                  <TouchableOpacity
                    key={guide.id}
                    activeOpacity={0.9}
                    style={styles.guideCard}
                    onPress={() => handleGuidePress(guide.id)}
                  >
                    <Image source={{ uri: guide.image }} style={styles.guideImg} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.85)']}
                      style={styles.guideOverlay}
                    >
                      <View style={styles.guideTag}>
                        <Text style={styles.guideTagText}>{guide.category}</Text>
                      </View>
                      <Text style={styles.guideTitle} numberOfLines={2}>{guide.title}</Text>
                      <View style={styles.guideMeta}>
                        <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.guideMetaText}>{guide.readTime}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Domestic Destinations Grid */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  {lang === 'vi' ? 'Điểm đến trong nước hot' : 'Trending Domestic Spots'}
                </Text>
                <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                  {lang === 'vi' ? 'Những chốn dừng chân tuyệt đẹp đang vẫy gọi' : 'Top beautiful places inside Vietnam'}
                </Text>
              </View>

              {/* Block 1 */}
              <View style={styles.row}>
                <DestinationCard
                  name="Hà Giang"
                  image="https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=600"
                  toursCount="15 Tours"
                  rating="4.9"
                  price="1.490.000đ"
                  tag="Đứng đầu"
                  isBookmarked={bookmarkedDests.includes('Hà Giang')}
                  onBookmarkToggle={() => handleBookmarkToggle('Hà Giang')}
                  height={150}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Hà Giang')}
                />
                <DestinationCard
                  name="Cát Bà"
                  image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600"
                  toursCount="8 Tours"
                  rating="4.7"
                  price="1.150.000đ"
                  isBookmarked={bookmarkedDests.includes('Cát Bà')}
                  onBookmarkToggle={() => handleBookmarkToggle('Cát Bà')}
                  height={150}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Cát Bà')}
                />
              </View>

              {/* Block 2 */}
              <View style={styles.row}>
                <DestinationCard
                  name="Đà Lạt"
                  image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"
                  toursCount="24 Tours"
                  rating="4.8"
                  price="1.290.000đ"
                  tag="Lãng mạn"
                  isBookmarked={bookmarkedDests.includes('Đà Lạt')}
                  onBookmarkToggle={() => handleBookmarkToggle('Đà Lạt')}
                  height={120}
                  style={{ flex: 1.2 }}
                  onPress={() => handleDestinationPress('Đà Lạt')}
                />
                <DestinationCard
                  name="Sa Pa"
                  image="https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=600"
                  toursCount="19 Tours"
                  rating="4.9"
                  price="1.250.000đ"
                  tag="Bán chạy"
                  isBookmarked={bookmarkedDests.includes('Sa Pa')}
                  onBookmarkToggle={() => handleBookmarkToggle('Sa Pa')}
                  height={120}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Sa Pa')}
                />
                <DestinationCard
                  name="Hội An"
                  image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600"
                  toursCount="14 Tours"
                  rating="4.8"
                  price="890.000đ"
                  tag="Phố cổ"
                  isBookmarked={bookmarkedDests.includes('Hội An')}
                  onBookmarkToggle={() => handleBookmarkToggle('Hội An')}
                  height={120}
                  style={{ flex: 1.1 }}
                  onPress={() => handleDestinationPress('Hội An')}
                />
              </View>

              {/* Block 3 */}
              <View style={styles.row}>
                <DestinationCard
                  name="Ninh Bình"
                  image="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600"
                  toursCount="16 Tours"
                  rating="4.8"
                  price="990.000đ"
                  tag="Thiên nhiên"
                  isBookmarked={bookmarkedDests.includes('Ninh Bình')}
                  onBookmarkToggle={() => handleBookmarkToggle('Ninh Bình')}
                  height={220}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Ninh Bình')}
                />
                <View style={{ flex: 1.5, gap: 10 }}>
                  <DestinationCard
                    name="Phong Nha"
                    image="https://images.unsplash.com/photo-1609137144813-7d7211bf7ec8?q=80&w=600"
                    toursCount="10 Tours"
                    rating="4.7"
                    price="1.690.000đ"
                    isBookmarked={bookmarkedDests.includes('Phong Nha')}
                    onBookmarkToggle={() => handleBookmarkToggle('Phong Nha')}
                    height={100}
                    onPress={() => handleDestinationPress('Phong Nha')}
                  />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <DestinationCard
                      name="Phú Yên"
                      image="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600"
                      toursCount="11 Tours"
                      rating="4.6"
                      price="1.100.000đ"
                      isBookmarked={bookmarkedDests.includes('Phú Yên')}
                      onBookmarkToggle={() => handleBookmarkToggle('Phú Yên')}
                      height={110}
                      style={{ flex: 1 }}
                      onPress={() => handleDestinationPress('Phú Yên')}
                    />
                    <DestinationCard
                      name="Phú Quốc"
                      image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600"
                      toursCount="25 Tours"
                      rating="4.9"
                      price="2.200.000đ"
                      tag="Thiên đường"
                      isBookmarked={bookmarkedDests.includes('Phú Quốc')}
                      onBookmarkToggle={() => handleBookmarkToggle('Phú Quốc')}
                      height={110}
                      style={{ flex: 1 }}
                      onPress={() => handleDestinationPress('Phú Quốc')}
                    />
                  </View>
                </View>
              </View>

              {/* Block 4 */}
              <View style={styles.row}>
                <DestinationCard
                  name="Đà Nẵng"
                  image="https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=600"
                  toursCount="22 Tours"
                  rating="4.9"
                  price="1.350.000đ"
                  tag="Đáng sống"
                  isBookmarked={bookmarkedDests.includes('Đà Nẵng')}
                  onBookmarkToggle={() => handleBookmarkToggle('Đà Nẵng')}
                  height={130}
                  style={{ flex: 1.6 }}
                  onPress={() => handleDestinationPress('Đà Nẵng')}
                />
                <DestinationCard
                  name="Nha Trang"
                  image="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600"
                  toursCount="18 Tours"
                  rating="4.7"
                  price="1.500.000đ"
                  tag="Biển xanh"
                  isBookmarked={bookmarkedDests.includes('Nha Trang')}
                  onBookmarkToggle={() => handleBookmarkToggle('Nha Trang')}
                  height={130}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Nha Trang')}
                />
              </View>
            </View>

            {/* International destinations */}
            <View style={[styles.section, { marginTop: 10 }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
                  {lang === 'vi' ? 'Điểm đến quốc tế nổi bật' : 'Key International Hubs'}
                </Text>
                <Text style={[styles.sectionSubtext, isDark && styles.subtextDark]}>
                  {lang === 'vi' ? 'Cùng bước chân du ngoạn thế giới rộng lớn' : 'Explore the spectacular wonders worldwide'}
                </Text>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1.5, gap: 10 }}>
                  <DestinationCard
                    name="Tokyo"
                    image="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600"
                    toursCount="32 Tours"
                    rating="4.9"
                    price="18.900.000đ"
                    tag="Nổi bật"
                    isBookmarked={bookmarkedDests.includes('Tokyo')}
                    onBookmarkToggle={() => handleBookmarkToggle('Tokyo')}
                    height={110}
                    onPress={() => handleDestinationPress('Tokyo')}
                  />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <DestinationCard
                      name="Barcelona"
                      image="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600"
                      toursCount="18 Tours"
                      rating="4.8"
                      price="34.900.000đ"
                      isBookmarked={bookmarkedDests.includes('Barcelona')}
                      onBookmarkToggle={() => handleBookmarkToggle('Barcelona')}
                      height={100}
                      style={{ flex: 1 }}
                      onPress={() => handleDestinationPress('Barcelona')}
                    />
                    <DestinationCard
                      name="Seoul"
                      image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600"
                      toursCount="26 Tours"
                      rating="4.9"
                      price="14.500.000đ"
                      tag="Hot Deal"
                      isBookmarked={bookmarkedDests.includes('Seoul')}
                      onBookmarkToggle={() => handleBookmarkToggle('Seoul')}
                      height={100}
                      style={{ flex: 1 }}
                      onPress={() => handleDestinationPress('Seoul')}
                    />
                  </View>
                  <DestinationCard
                    name="Venice"
                    image="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600"
                    toursCount="21 Tours"
                    rating="4.8"
                    price="42.000.000đ"
                    isBookmarked={bookmarkedDests.includes('Venice')}
                    onBookmarkToggle={() => handleBookmarkToggle('Venice')}
                    height={100}
                    onPress={() => handleDestinationPress('Venice')}
                  />
                </View>
                <DestinationCard
                  name="Sydney"
                  image="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600"
                  toursCount="15 Tours"
                  rating="4.8"
                  price="28.500.000đ"
                  isBookmarked={bookmarkedDests.includes('Sydney')}
                  onBookmarkToggle={() => handleBookmarkToggle('Sydney')}
                  height={330}
                  style={{ flex: 1 }}
                  onPress={() => handleDestinationPress('Sydney')}
                />
              </View>
            </View>
          </>
        )}

      </ScrollView>

      {/* Filter Modal Drawer */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.filterModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsFilterVisible(false)}
          />
          <View style={[styles.filterModalContent, isDark && { backgroundColor: '#1E293B' }]}>
            <View style={[styles.filterModalHeader, isDark && { borderBottomColor: '#334155' }]}>
              <Text style={[styles.filterModalTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Bộ lọc kết quả' : 'Filter Results'}
              </Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)} activeOpacity={0.8}>
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterModalScroll} showsVerticalScrollIndicator={false}>
              {/* Sort Section */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Sắp xếp theo' : 'Sort by'}
              </Text>
              <View style={styles.filterChipRow}>
                {[
                  { value: 'default', labelVi: 'Mặc định', labelEn: 'Default' },
                  { value: 'rating_desc', labelVi: 'Đánh giá cao', labelEn: 'High Rating' },
                  { value: 'tours_desc', labelVi: 'Nhiều tour nhất', labelEn: 'Most Tours' },
                  { value: 'price_asc', labelVi: 'Giá từ thấp đến cao', labelEn: 'Price Low to High' },
                  { value: 'price_desc', labelVi: 'Giá từ cao đến thấp', labelEn: 'Price High to Low' },
                ].map((item) => {
                  const isActive = draftSortBy === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.filterChip,
                        isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                        isActive && styles.filterChipActive
                      ]}
                      onPress={() => setDraftSortBy(item.value)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isDark && { color: '#94A3B8' },
                        isActive && styles.filterChipTextActive
                      ]}>
                        {lang === 'vi' ? item.labelVi : item.labelEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Category / Tag Filter */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Loại địa điểm' : 'Destination Type'}
              </Text>
              <View style={styles.filterChipRow}>
                {['Tất cả', 'Đứng đầu', 'Bán chạy', 'Nổi bật', 'Hot Deal', 'Thiên nhiên', 'Biển xanh', 'Lãng mạn', 'Văn hóa'].map((tag) => {
                  const isActive = draftTag === tag;
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.filterChip,
                        isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                        isActive && styles.filterChipActive
                      ]}
                      onPress={() => setDraftTag(tag)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isDark && { color: '#94A3B8' },
                        isActive && styles.filterChipTextActive
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Max Price Filter */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Giá tối đa' : 'Maximum Price'}
              </Text>
              <View style={styles.filterChipRow}>
                {[
                  { value: 0, labelVi: 'Tất cả', labelEn: 'All' },
                  { value: 1500000, labelVi: 'Dưới 1.5 Triệu', labelEn: 'Under 1.5M' },
                  { value: 3000000, labelVi: 'Dưới 3.0 Triệu', labelEn: 'Under 3M' },
                  { value: 15000000, labelVi: 'Dưới 15 Triệu', labelEn: 'Under 15M' },
                  { value: 30000000, labelVi: 'Dưới 30 Triệu', labelEn: 'Under 30M' },
                ].map((item) => {
                  const isActive = draftMaxPrice === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.filterChip,
                        isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                        isActive && styles.filterChipActive
                      ]}
                      onPress={() => setDraftMaxPrice(item.value)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isDark && { color: '#94A3B8' },
                        isActive && styles.filterChipTextActive
                      ]}>
                        {lang === 'vi' ? item.labelVi : item.labelEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Min Tours count */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Số lượng tour tối thiểu' : 'Minimum Tours'}
              </Text>
              <View style={styles.filterChipRow}>
                {[
                  { value: 0, label: lang === 'vi' ? 'Tất cả' : 'All' },
                  { value: 10, label: '>= 10 Tours' },
                  { value: 20, label: '>= 20 Tours' },
                ].map((item) => {
                  const isActive = draftMinTours === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.filterChip,
                        isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                        isActive && styles.filterChipActive
                      ]}
                      onPress={() => setDraftMinTours(item.value)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isDark && { color: '#94A3B8' },
                        isActive && styles.filterChipTextActive
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Rating Filter */}
              <Text style={[styles.filterSectionTitle, isDark && { color: '#FFFFFF' }]}>
                {lang === 'vi' ? 'Đánh giá tối thiểu' : 'Minimum Rating'}
              </Text>
              <View style={styles.filterChipRow}>
                {[
                  { value: 0, label: lang === 'vi' ? 'Tất cả' : 'All' },
                  { value: 4.5, label: '4.5⭐ +' },
                  { value: 4.7, label: '4.7⭐ +' },
                  { value: 4.8, label: '4.8⭐ +' },
                  { value: 4.9, label: '4.9⭐ +' },
                ].map((item) => {
                  const isActive = draftMinRating === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.filterChip,
                        isDark && { backgroundColor: '#0F172A', borderColor: '#334155' },
                        isActive && styles.filterChipActive
                      ]}
                      onPress={() => setDraftMinRating(item.value)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        isDark && { color: '#94A3B8' },
                        isActive && styles.filterChipTextActive
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={[styles.filterModalFooter, isDark && { borderTopColor: '#334155' }]}>
              <TouchableOpacity
                style={[styles.filterModalResetBtn, isDark && { borderColor: '#334155' }]}
                onPress={handleResetDraftFilters}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterModalResetBtnText, isDark && { color: '#94A3B8' }]}>
                  {lang === 'vi' ? 'Thiết lập lại' : 'Reset'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterModalApplyBtn}
                onPress={handleApplyFilters}
                activeOpacity={0.8}
              >
                <Text style={styles.filterModalApplyBtnText}>
                  {lang === 'vi' ? `Áp dụng (${draftMatchCount})` : `Apply (${draftMatchCount})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroBackground: {
    width: '100%',
    height: 250,
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginTop: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerWelcome: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  headerKicker: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    marginBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -28,
    marginBottom: 20,
    zIndex: 10,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 18,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  searchBarDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  searchInputDark: {
    color: '#F1F5F9',
  },
  filterButton: {
    padding: 6,
  },
  filterTabsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  filterTabLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  mapBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 4,
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  mapBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  mapIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF5B22',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FF5B22',
    opacity: 0.4,
    transform: [{ scale: 1.25 }],
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  mapSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  mapExploreBadge: {
    backgroundColor: '#FF5B22',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapExploreBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  cardContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardBackgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  tagBadge: {
    backgroundColor: '#FF5B22',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  bookmarkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardGradient: {
    width: '100%',
    padding: 12,
    paddingTop: 24,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  toursText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '600',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  cardPrice: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  searchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  searchCard: {
    width: '47%',
    marginBottom: 14,
    marginHorizontal: '1.5%',
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  textDark: {
    color: '#F1F5F9',
  },
  subtextDark: {
    color: '#94A3B8',
  },

  // Continent Section
  continentSection: {
    marginBottom: 24,
    marginTop: 6,
  },
  continentScroll: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 12,
  },
  continentCard: {
    width: 220,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  continentImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  continentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  continentName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  continentDesc: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 12,
  },

  // Travel Guides Section
  guidesSection: {
    marginBottom: 24,
  },
  guidesScroll: {
    paddingLeft: 20,
    paddingBottom: 4,
    gap: 12,
  },
  guideCard: {
    width: 240,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  guideImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  guideOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  guideTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  guideTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  guideTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  guideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  guideMetaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
  },

  // Footer styling
  footerBackground: {
    width: '100%',
    marginTop: 20,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  footerBigTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 24,
    lineHeight: 36,
    maxWidth: '90%',
  },
  newsletterSection: {
    marginBottom: 35,
  },
  newsletterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  newsletterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    height: 48,
  },
  newsletterInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  newsletterButton: {
    backgroundColor: '#FF5B22',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  newsletterSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)',
    gap: 8,
  },
  newsletterSuccessText: {
    color: '#34C759',
    fontSize: 13,
    fontWeight: '700',
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 30,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
  },
  footerColumn: {
    width: '45%',
    marginBottom: 10,
  },
  footerColumnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerLinkText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: '600',
  },
  footerBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  footerCopyright: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
  },

  // ─── MAP MODAL STYLING ──────────────────────────────────────────────────────
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  modalCloseBtn: {
    padding: 2,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  mapCanvasContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  mapGraphicBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  mapGridLineH: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  mapGridLineV: {
    width: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'center',
    height: '100%',
    position: 'absolute',
  },
  mapPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  mapPinDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mapPinDotActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF5B22',
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
    width: '100%',
  },
  bottomSheetViewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalHeaderDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  mapBottomSheetDark: {
    backgroundColor: '#1E293B',
    shadowColor: '#000000',
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
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterModalScroll: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#FFF0EA',
    borderColor: '#FF5B22',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FF5B22',
    fontWeight: '800',
  },
  filterModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  filterModalResetBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterModalResetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterModalApplyBtn: {
    flex: 2,
    backgroundColor: '#FF5B22',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterModalApplyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  activeFiltersScroll: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5B22',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterBadgeDark: {
    borderColor: '#1E293B',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
});