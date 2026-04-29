import React, { useState } from 'react';
import { View, FlatList, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Đảm bảo file style này nằm cùng thư mục (tabs)
import { styles } from '../styles/_index.styles'; 
// Đường dẫn lùi 2 cấp ra khỏi (tabs) và app để vào constants
import { TOURS_DATA } from '../../constants/Tours';

const CATEGORIES = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Biển đảo'];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả'); 
  const router = useRouter();

  // FIX: Đổi TOURS thành TOURS_DATA để khớp với lệnh import
  const filteredTours = TOURS_DATA.filter(tour => {
    const matchCategory = selectedCategory === 'Tất cả' || tour.category === selectedCategory;
    const matchSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào, Trứ! 👋</Text>
        <Text style={styles.subtitle}>Bạn muốn đi đâu hôm nay?</Text>
        <Searchbar
          placeholder="Tìm kiếm tour..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#E91E63"
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <Chip 
                style={[styles.chip, isActive && { backgroundColor: '#FF2D55' }]} 
                textStyle={[styles.chipText, isActive && { color: '#fff' }]} 
                onPress={() => setSelectedCategory(item)}
              >
                {item}
              </Chip>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredTours}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tourList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            // Điều hướng đến màn hình chi tiết tour
            onPress={() => router.push(`/tour/${item.id}`)}
          >
            <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 20 }}>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
                <View style={styles.weatherBadge}>
                  <Ionicons name="partly-sunny" size={16} color="#000" />
                  <Text style={styles.weatherText}>{item.weather}</Text>
                </View>
                <View style={styles.tourInfo}>
                  <Text style={styles.tourTitle}>{item.title}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#ddd" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Text style={styles.bookText}>Đặt ngay</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}