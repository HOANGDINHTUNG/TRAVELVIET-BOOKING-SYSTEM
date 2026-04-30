import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_DESTINATION_MOCKS } from '../../constants/Tours';

export default function DestinationsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.kicker}>Destinations</Text>
        <Text style={styles.title}>Diem den noi bat</Text>
        <Text style={styles.copy}>
          Du lieu mock theo response destination backend: uuid, province,
          region, crowdLevelDefault va activeTourCount.
        </Text>
      </View>

      <View style={styles.grid}>
        {BACKEND_DESTINATION_MOCKS.map((destination) => (
          <TouchableOpacity key={destination.uuid} activeOpacity={0.9} style={styles.card}>
            <ImageBackground
              source={{ uri: destination.coverImageUrl }}
              style={styles.image}
              imageStyle={styles.imageRadius}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.78)']}
                style={styles.overlay}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{destination.region}</Text>
                  <Text style={styles.badge}>{destination.crowdLevelDefault}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{destination.name}</Text>
                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={15} color="#fff" />
                    <Text style={styles.meta}>{destination.province}</Text>
                  </View>
                  <Text style={styles.tours}>{destination.activeTourCount} tour dang mo</Text>
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
  grid: { padding: 16, gap: 14 },
  card: { overflow: 'hidden', borderRadius: 8 },
  image: { height: 280 },
  imageRadius: { borderRadius: 8 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 14 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  badge: {
    overflow: 'hidden',
    minHeight: 30,
    paddingHorizontal: 10,
    paddingTop: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(8,11,11,0.58)',
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  name: { color: '#fff', fontSize: 28, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  meta: { color: '#e9f5ef', fontSize: 13, fontWeight: '800' },
  tours: { marginTop: 8, color: '#fff', fontSize: 14, fontWeight: '900' },
});
