import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 30, paddingTop: 20 },
  header: { marginBottom: 30 },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 10 },
  titleContainer: { alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#005AAB' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  formContainer: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, backgroundColor: '#FAFAFA' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 15, color: '#333' },
  eyeIcon: { padding: 5 },
  registerButton: { backgroundColor: '#FF2D55', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  termsText: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20, lineHeight: 18 },
  linkText: { color: '#005AAB', fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  loginText: { fontSize: 15, color: '#666' },
  loginLink: { fontSize: 15, fontWeight: 'bold', color: '#005AAB' }, // <--- Thêm dấu phẩy ở đây
  hintText: { fontSize: 12, color: '#FF3B30', marginTop: -15, marginBottom: 15, marginLeft: 5 },
});