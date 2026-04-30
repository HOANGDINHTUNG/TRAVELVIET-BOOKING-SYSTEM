import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },
  
  /* Header Styles */
  headerBackground: { backgroundColor: '#005AAB', paddingBottom: 60, paddingTop: 50, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#E53935', fontSize: 30, fontWeight: 'bold' },
  greeting: { color: '#B3D4FF', fontSize: 13, marginBottom: 2 },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  manageAccountBtn: { flexDirection: 'row', alignItems: 'center' },
  manageAccountText: { color: '#FFD700', fontSize: 12, marginRight: 5 },
  settingsBtn: { padding: 5 },

  /* Floating Points Card */
  pointsCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 15, padding: 20, marginTop: -35, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  pointRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  pointLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  pointValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },

  /* Body Content */
  bodyContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  
  /* Grid Styles */
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  gridItem: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  gridIcon: { marginBottom: 10 },
  gridTitle: { fontSize: 12, color: '#555', textAlign: 'center', lineHeight: 18 },

  /* Logout Button */
  logoutButton: { marginTop: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }
});