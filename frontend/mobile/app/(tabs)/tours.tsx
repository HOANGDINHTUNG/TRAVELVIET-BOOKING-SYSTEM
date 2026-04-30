import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TOURS_DATA } from '../../constants/Tours';

const ALL_CATEGORY = 'Tat ca';
const CATEGORIES = [
  ALL_CATEGORY,
  'Mien Bac',
  'Mien Trung',
  'Mien Nam',
  'Bien dao',
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function ToursScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORY);

  const tours = useMemo(() => {
    const normalizedQuery = normalize(query);

    return TOURS_DATA.filter((tour) => {
      const categoryMatch = category === ALL_CATEGORY || tour.category === category;
      const searchMatch =
        normalizedQuery.length === 0 ||
        normalize(`${tour.title} ${tour.location} ${tour.description}`).includes(
          normalizedQuery,
        );

      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>Tour catalog</Text>
        <Text style={styles.title}>Lich trinh san sang de giu cho</Text>
        <Text style={styles.copy}>
          Danh sach tour mock theo shape backend: co gia, rating, media,
          itinerary va destinationId.
        </Text>
      </View>

      <View style={styles.searchPanel}>
        <Searchbar
          value={query}
          onChangeText={setQuery}
          placeholder="Tim tour, diem den..."
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#087f9c"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((item) => {
            const active = item === category;

            return (
              <Chip
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                textStyle={[styles.chipText, active && styles.chipTextActive]}
                onPress={() => setCategory(item)}
              >
                {item}
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      <Text style={styles.resultText}>{tours.length} tour phu hop</Text>

      <View style={styles.list}>
        {tours.map((tour) => (
          <TouchableOpacity
            key={tour.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: '/tour/[id]', params: { id: tour.id } })
            }
          >
            <ImageBackground
              source={{ uri: tour.image }}
              style={styles.cardImage}
              imageStyle={styles.cardImageRadius}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.82)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.badge}>{tour.category}</Text>
                  <Text style={styles.badge}>★ {tour.rating.toFixed(1)}</Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>{tour.title}</Text>
                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={15} color="#fff" />
                    <Text style={styles.cardMeta}>{tour.location}</Text>
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.price}>{tour.price}</Text>
                    <Text style={styles.cta}>Xem chi tiet</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ea' },
  content: { paddingBottom: 28 },
  header: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 18,
    backgroundColor: '#fffdf8',
  },
  kicker: {
    color: '#dda15e',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    color: '#283618',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  copy: {
    marginTop: 8,
    color: '#606c38',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  searchPanel: {
    gap: 12,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(96,108,56,0.18)',
  },
  searchBar: { height: 48, borderRadius: 6, elevation: 0, backgroundColor: '#f8f6ee' },
  searchInput: { minHeight: 0, fontSize: 13 },
  chip: {
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(96,108,56,0.18)',
  },
  chipActive: { backgroundColor: '#606c38', borderColor: '#606c38' },
  chipText: { color: '#283618', fontWeight: '800', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  resultText: {
    paddingHorizontal: 18,
    color: '#606c38',
    fontSize: 13,
    fontWeight: '900',
  },
  list: { gap: 14, padding: 16 },
  card: { overflow: 'hidden', borderRadius: 8, backgroundColor: '#fff' },
  cardImage: { height: 250 },
  cardImageRadius: { borderRadius: 8 },
  cardGradient: { flex: 1, justifyContent: 'space-between', padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  badge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingTop: 7,
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(8,11,11,0.58)',
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  cardTitle: { color: '#fff', fontSize: 24, lineHeight: 29, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  cardMeta: { flex: 1, color: '#e9f5ef', fontSize: 13, fontWeight: '700' },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { color: '#fff', fontSize: 21, fontWeight: '900' },
  cta: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 9,
    minHeight: 38,
    borderRadius: 6,
    backgroundColor: '#606c38',
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
});
