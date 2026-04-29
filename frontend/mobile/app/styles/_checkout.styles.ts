import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backText: { fontSize: 16, color: '#333' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#444', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  tourName: { fontSize: 17, fontWeight: '700', color: '#FF2D55', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, color: '#666', fontSize: 15 },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  totalLabel: { fontSize: 16, color: '#333' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#4CAF50' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 12, padding: 15, fontSize: 16 },
  payButton: { backgroundColor: '#FF2D55', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }
});