/**
 * TourCard Component - Example Usage
 * 
 * Cách sử dụng TourCard component với các props khác nhau
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { TourCard } from '@/components/TourCard';
import { Tour } from '@/types/Tour';

// Mock data - Tour example
const mockTour: Tour = {
  id: '1',
  name: 'Hà Nội - Hạ Long Bay 3 Ngày 2 Đêm',
  description: 'Khám phá vẻ đẹp tuyệt vời của vịnh Hạ Long với những hang động kỳ bí',
  imageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  price: 2500000,
  originalPrice: 3500000,
  location: {
    id: 'loc_1',
    name: 'Hạ Long, Quảng Ninh',
    latitude: 20.8552,
    longitude: 107.1725,
  },
  duration: 3,
  rating: 4.5,
  reviewCount: 248,
  weather: {
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
  },
  startDate: '2024-06-01',
  endDate: '2024-06-03',
  maxParticipants: 30,
  currentParticipants: 18,
  highlights: [
    'Vịnh Hạ Long - Di sản thế giới UNESCO',
    'Hang động Sơn Đông',
    'Đảo Titop',
    'Cảm nhận đời sống ngư dân',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Hà Nội - Hạ Long',
      description: 'Khởi hành sáng, đến Hạ Long chiều',
      locations: ['Hà Nội', 'Hạ Long'],
    },
    {
      day: 2,
      title: 'Vịnh Hạ Long - Hang Sơn Đông',
      description: 'Tham quan các hang động nổi tiếng',
      locations: ['Hang Sơn Đông', 'Đảo Titop'],
    },
    {
      day: 3,
      title: 'Hạ Long - Hà Nội',
      description: 'Trở về Hà Nội',
      locations: ['Hạ Long', 'Hà Nội'],
    },
  ],
};

/**
 * EXAMPLE 1: Small Card (horizontal scroll list)
 * Sử dụng cho danh sách ngang, phù hợp với FlatList
 */
export const SmallCardExample = () => (
  <ScrollView horizontal>
    <TourCard
      tour={mockTour}
      size="small"
      onPress={() => console.log('Pressed tour:', mockTour.id)}
    />
    <TourCard
      tour={mockTour}
      size="small"
      showWeather={true}
      onPress={() => console.log('Pressed tour:', mockTour.id)}
    />
  </ScrollView>
);

/**
 * EXAMPLE 2: Medium Card (default, vertical list)
 * Sử dụng cho danh sách dọc, phù hợp với Home/Explore screen
 */
export const MediumCardExample = () => (
  <View>
    <TourCard
      tour={mockTour}
      size="medium"
      showWeather={true}
      onPress={() => console.log('Pressed tour:', mockTour.id)}
    />
  </View>
);

/**
 * EXAMPLE 3: Large Card (full detail)
 * Sử dùng cho highlighted/featured tour
 */
export const LargeCardExample = () => (
  <View>
    <TourCard
      tour={mockTour}
      size="large"
      showWeather={true}
      onPress={() => console.log('Pressed tour:', mockTour.id)}
    />
  </View>
);

/**
 * EXAMPLE 4: Multiple Cards
 * Cách sắp xếp nhiều card
 */
export const MultipleCardsExample = () => (
  <ScrollView>
    {/* Featured - Large */}
    <TourCard
      tour={mockTour}
      size="large"
      showWeather={true}
      onPress={() => {}}
    />

    {/* Recently Viewed - Medium */}
    <TourCard
      tour={mockTour}
      size="medium"
      showWeather={false}
      onPress={() => {}}
    />
    <TourCard
      tour={mockTour}
      size="medium"
      showWeather={false}
      onPress={() => {}}
    />
  </ScrollView>
);

/**
 * INTEGRATION GUIDE:
 * 
 * 1. Import trong component:
 *    import { TourCard } from '@/components/TourCard';
 *    import { Tour } from '@/types/Tour';
 * 
 * 2. Sử dụng trong FlatList (horizontal):
 *    <FlatList
 *      data={tours}
 *      renderItem={({ item }) => (
 *        <TourCard 
 *          tour={item} 
 *          size="small"
 *          showWeather={true}
 *          onPress={() => navigation.push('TourDetail', { tourId: item.id })}
 *        />
 *      )}
 *      horizontal
 *      keyExtractor={(item) => item.id}
 *    />
 * 
 * 3. Sử dụng trong FlatList (vertical):
 *    <FlatList
 *      data={tours}
 *      renderItem={({ item }) => (
 *        <TourCard 
 *          tour={item} 
 *          size="medium"
 *          showWeather={true}
 *          onPress={() => handleTourPress(item.id)}
 *        />
 *      )}
 *      keyExtractor={(item) => item.id}
 *    />
 * 
 * 4. Props:
 *    - tour: Tour (required) - dữ liệu tour
 *    - onPress?: () => void - callback khi nhấn card
 *    - showWeather?: boolean - hiển thị thông tin thời tiết (mặc định false)
 *    - size?: 'small' | 'medium' | 'large' (mặc định 'medium')
 * 
 * 5. Dark Mode:
 *    Component tự động detect và áp dụng theme phù hợp
 *    thông qua useColorScheme() hook
 */
