import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, justifyContent: 'center', paddingBottom: 40, paddingTop: 40 },
  
  // Phần Logo & Slogan
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 38, fontWeight: '900', color: '#005AAB', letterSpacing: 1 },
  logoHighlight: { color: '#FF2D55' },
  slogan: { fontSize: 14, color: '#666', marginTop: 8 },

  // Form
  formContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 2 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#E8E8E8', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 20, 
    backgroundColor: '#FAFAFA',
    height: 55
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 15, color: '#333' },
  eyeIcon: { padding: 5 },

  // Quên mật khẩu
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotPasswordText: { color: '#005AAB', fontSize: 14, fontWeight: '600' },

  // Nút Đăng nhập
  loginButton: { 
    backgroundColor: '#005AAB', 
    borderRadius: 25, 
    height: 55, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#005AAB', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 5 
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Đường kẻ "Hoặc"
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  divider: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 15, color: '#888', fontSize: 14, fontWeight: '500' },

  // Mạng xã hội
  socialContainer: { gap: 15, marginBottom: 35 },
  socialButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 55, 
    borderRadius: 25, 
    gap: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  googleButton: { backgroundColor: '#fff' },
  googleText: { color: '#333', fontSize: 15, fontWeight: '600' },
  appleButton: { backgroundColor: '#000', borderColor: '#000' },
  appleText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  // Đăng ký
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 15, color: '#666' },
  registerLink: { fontSize: 15, fontWeight: 'bold', color: '#FF2D55' }
});