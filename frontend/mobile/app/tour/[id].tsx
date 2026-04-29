import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// FIX: Lùi 2 cấp là đúng cấu trúc thư mục hiện tại của Trứ
import { TOURS_DATA } from '../../constants/Tours'; 
import { styles } from './tour-detail.styles';

export default function TourDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Tìm tour tương ứng dựa trên ID từ URL
  const tour = TOURS_DATA.find(t => t.id === id);

  if (!tour) return <Text>Không tìm thấy thông tin tour!</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: tour.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{tour.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color="#FF2D55" />
          <Text style={styles.locationText}>{tour.location}</Text>
        </View>

        <Text style={styles.description}>
          Chào mừng bạn đến với {tour.name}. Khám phá vẻ đẹp thiên nhiên và văn hóa đặc trưng 
          tại {tour.location} với giá ưu đãi nhất.
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Giá từ</Text>
            <Text style={styles.priceValue}>{tour.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => router.push({ pathname: '/checkout/[id]', params: { id: tour.id } })}
          >
            <Text style={styles.bookButtonText}>Đặt Tour Ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}