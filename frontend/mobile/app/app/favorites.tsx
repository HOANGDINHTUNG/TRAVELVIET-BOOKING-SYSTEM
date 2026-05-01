import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const INITIAL_FAVORITES = [
  { id: '1', title: 'Top 5 Resort sang chảnh nhất Phú Quốc', type: 'Bài viết', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400' },
  { id: '2', title: 'Tour Vịnh Hạ Long 2N1Đ trên Du thuyền', type: 'Tour', image: 'https://images.pexels.com/photos/2048056/pexels-photo-2048056.jpeg?w=400' },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const renderFavorite = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => {}}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.badge}><Text style={styles.badgeText}>{item.type}</Text></View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      </View>
      <TouchableOpacity style={styles.heartBtn} onPress={() => removeFavorite(item.id)}>
        <Ionicons name="heart" size={24} color="#FF2D55" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1A1A1A" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Đã lưu ({favorites.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderFavorite}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="heart-dislike-outline" size={60} color="#DDD" /><Text style={styles.emptyText}>Chưa có mục nào được lưu.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContainer: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E5F0FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  badgeText: { fontSize: 11, color: '#005AAB', fontWeight: 'bold' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  heartBtn: { padding: 15, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#888', marginTop: 15 }
});