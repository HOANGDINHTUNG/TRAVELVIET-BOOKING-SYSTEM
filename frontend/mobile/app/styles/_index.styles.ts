import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10, backgroundColor: '#fff' },
  greeting: { fontSize: 16, color: '#666' },
  subtitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginTop: 5, marginBottom: 20 },
  searchBar: { backgroundColor: '#F0F0F0', borderRadius: 15, elevation: 0 },
  categoriesContainer: { paddingLeft: 20, paddingVertical: 15, backgroundColor: '#F8F9FA' },
  chip: { marginRight: 10, backgroundColor: '#fff', elevation: 2 },
  chipText: { color: '#333', fontWeight: '600' },
  tourList: { paddingHorizontal: 20, paddingBottom: 30 },
  cardImage: { width: '100%', height: 200, marginBottom: 25, justifyContent: 'flex-end' },
  gradient: { flex: 1, justifyContent: 'space-between', borderRadius: 20, padding: 15 },
  weatherBadge: { alignSelf: 'flex-end', flexDirection: 'row', backgroundColor: 'rgba(255, 215, 0, 0.9)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  weatherText: { fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  tourInfo: { gap: 5 },
  tourTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { color: '#ddd', fontSize: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  priceText: { color: '#4CAF50', fontSize: 20, fontWeight: '900' },
  bookText: { color: '#fff', backgroundColor: '#E91E63', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, fontWeight: 'bold', overflow: 'hidden' }
});