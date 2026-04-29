import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#1A1A1A' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  
  // Khung thông tin Tour
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 2, marginBottom: 20 },
  tourName: { fontSize: 18, fontWeight: 'bold', color: '#FF2D55', marginBottom: 5 },
  tourPrice: { fontSize: 16, color: '#666' },

  // Form điền thông tin
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },

  // Bộ đếm số lượng
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  counterLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  counterControl: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  counterButton: { backgroundColor: '#F0F0F0', width: 35, height: 35, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  counterValue: { fontSize: 18, fontWeight: 'bold' },

  // Footer tổng tiền
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#666' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#FF2D55' },
  payButton: { backgroundColor: '#FF2D55', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});