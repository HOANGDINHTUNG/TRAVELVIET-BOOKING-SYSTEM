import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  locationText: { fontSize: 16, color: '#666', marginLeft: 5 },
  description: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 30 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  priceLabel: { fontSize: 14, color: '#888' },
  priceValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  bookButton: { backgroundColor: '#FF2D55', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});