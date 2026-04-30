import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, Image, SafeAreaView, Platform, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// --- MOCK DATA (Đã ép kiểu any[] để tránh lỗi TypeScript) ---
const CATEGORIES: any[] = [
  { id: 1, name: 'Tour trọn gói', icon: 'bus-outline', color: '#005AAB' },
  { id: 2, name: 'Khách sạn', icon: 'business-outline', color: '#FF2D55' },
  { id: 3, name: 'Vé máy bay', icon: 'airplane-outline', color: '#00C4B5' },
  { id: 4, name: 'Combo', icon: 'cube-outline', color: '#FF9800' },
  { id: 5, name: 'Vé vui chơi', icon: 'ticket-outline', color: '#9C27B0' },
  { id: 6, name: 'Khuyến mãi', icon: 'gift-outline', color: '#E91E63' },
  { id: 7, name: 'Cẩm nang', icon: 'book-outline', color: '#4CAF50' },
  { id: 8, name: 'Khác', icon: 'grid-outline', color: '#607D8B' },
];

const LAST_MINUTE_TOURS: any[] = [
  { id: 1, title: 'Hà Giang - Lũng Cú - Đồng Văn', price: '3,990,000 đ', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop', time: '4 ngày 15:00' },
  { id: 2, title: 'Đà Lạt - Săn mây Đồi Chè', price: '2,490,000 đ', image: 'https://samtenhills.vn/wp-content/uploads/2025/01/kinh-nghiem-di-che-cau-dat-da-lat.jpg', time: '2 ngày 10:30' },
  { id: 3, title: 'Phú Quốc - Ngắm hoàng hôn', price: '5,990,000 đ', image: 'https://rootytrip.com/wp-content/uploads/2020/05/hoang-hon-tu-quan-ocsen-beach-bar-club.jpg', time: '5 ngày 08:00' },
];

const FAVORITE_DESTINATIONS: any[] = [
  { id: 1, name: 'Sapa', image: 'https://cdn.baolaocai.vn/images/2c77a1fcf62764f842a62d823ed57061a8cec174a200849bfc759cfde097ca87/sapa-2.jpg' },
  { id: 2, name: 'Hạ Long', image: 'https://daknong.1cdn.vn/2025/10/31/img_063d6703.jpg' },
  { id: 3, name: 'Huế', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 1. HEADER & THANH TÌM KIẾM */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTop}>
            
            {/* Đã thêm 'as any' để ép kiểu đường dẫn */}
            <TouchableOpacity 
              style={styles.searchContainer} 
              activeOpacity={0.9} 
              onPress={() => router.push('/search' as any)}
            >
              <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Trứ muốn đi đâu hôm nay?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bellIcon} onPress={() => router.push('/notifications' as any)}>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. MENU DỊCH VỤ (OVERLAPPING GRID) */}
        <View style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
                <View style={[styles.iconCircle, { backgroundColor: cat.color + '15' }]}>
                  {/* Không cần 'as any' ở đây nữa vì đã ép kiểu mảng ở trên */}
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={styles.categoryText} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. BANNER QUẢNG CÁO */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.bannerContainer}
          snapToInterval={width - 40}
          decelerationRate="fast"
        >
          <Image source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop' }} style={styles.bannerImage} />
          <Image source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop' }} style={styles.bannerImage} />
        </ScrollView>

        {/* 4. ƯU ĐÃI GIỜ CHÓT */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ưu đãi giờ chót 🔥</Text>
            <TouchableOpacity onPress={() => router.push('/tour' as any)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {LAST_MINUTE_TOURS.map((tour) => (
              <TouchableOpacity 
                key={tour.id} 
                style={styles.tourCard} 
                activeOpacity={0.9}
                onPress={() => router.push(`/tour/${tour.id}` as any)}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: tour.image }} style={styles.tourImage} />
                  <View style={styles.timerBadge}>
                    <Ionicons name="time-outline" size={14} color="#fff" />
                    <Text style={styles.timerText}>{tour.time}</Text>
                  </View>
                </View>
                <View style={styles.tourInfo}>
                  <Text style={styles.tourTitle} numberOfLines={2}>{tour.title}</Text>
                  <Text style={styles.tourPrice}>{tour.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. ĐIỂM ĐẾN YÊU THÍCH */}
        <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
          <Text style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 15 }]}>Điểm đến yêu thích</Text>
          <View style={styles.destGrid}>
             {FAVORITE_DESTINATIONS.map((dest) => (
               <TouchableOpacity key={dest.id} style={styles.destItem} activeOpacity={0.8}>
                  <Image source={{ uri: dest.image }} style={styles.destImg} />
                  <Text style={styles.destName}>{dest.name}</Text>
               </TouchableOpacity>
             ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBackground: { backgroundColor: '#005AAB', paddingTop: Platform.OS === 'android' ? 45 : 20, paddingBottom: 80, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', height: 45, borderRadius: 12, alignItems: 'center', paddingHorizontal: 15, marginRight: 15, elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchPlaceholder: { color: '#888', fontSize: 14 },
  bellIcon: { position: 'relative' },
  badge: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, backgroundColor: '#FF2D55', borderRadius: 4, borderWidth: 1.5, borderColor: '#005AAB' },
  menuWrapper: { paddingHorizontal: 20, marginTop: -50, zIndex: 10 },
  menuContainer: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
  categoryItem: { width: '25%', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 11, fontWeight: '600', color: '#444', textAlign: 'center', paddingHorizontal: 2 },
  bannerContainer: { marginTop: 20, paddingLeft: 20 },
  bannerImage: { width: width - 60, height: 160, borderRadius: 16, marginRight: 15 },
  sectionContainer: { marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  seeAllText: { fontSize: 14, color: '#005AAB', fontWeight: 'bold' },
  tourCard: { width: 260, backgroundColor: '#fff', borderRadius: 20, marginRight: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 10 },
  imageContainer: { position: 'relative' },
  tourImage: { width: '100%', height: 150 },
  timerBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timerText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  tourInfo: { padding: 15 },
  tourTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10, lineHeight: 22 },
  tourPrice: { fontSize: 17, fontWeight: '900', color: '#FF2D55' },
  destGrid: { flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' },
  destItem: { width: (width - 60) / 3, alignItems: 'center' },
  destImg: { width: '100%', height: 100, borderRadius: 15, marginBottom: 8 },
  destName: { fontSize: 13, fontWeight: 'bold', color: '#444' }
});