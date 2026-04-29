import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DESTINATIONS = [
  { id: '1', name: 'Sapa', tours: '15 Tours', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQwpADrYEWIS0tPPCXm3ZdGT2ShhPhK4QG0g&s' },
  { id: '2', name: 'Phú Quốc', tours: '24 Tours', image: 'https://www.vietnambooking.com/wp-content/uploads/2022/05/kinh-nghiem-du-lich-phu-quoc-cho-gia-dinh-1.jpg' },
  { id: '3', name: 'Đà Nẵng', tours: '30 Tours', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop' },
  { id: '4', name: 'Hạ Long', tours: '18 Tours', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop' },
  { id: '5', name: 'Hội An', tours: '22 Tours', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop' },
  { id: '6', name: 'Nha Trang', tours: '20 Tours', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop' }

];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Khám phá</Text>
        <Text style={styles.subtitle}>Điểm đến thịnh hành nhất</Text>
      </View>

      <FlatList
        data={DESTINATIONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <ImageBackground source={{ uri: item.image }} style={styles.image} imageStyle={{ borderRadius: 15 }}>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{item.tours}</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  list: { padding: 10 },
  row: { justifyContent: 'space-between', paddingHorizontal: 5 },
  card: { width: '48%', height: 220, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  image: { flex: 1, justifyContent: 'flex-end' },
  gradient: { padding: 15, borderRadius: 15, height: '50%', justifyContent: 'flex-end' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardSub: { color: '#ddd', fontSize: 14, marginTop: 2 }
});