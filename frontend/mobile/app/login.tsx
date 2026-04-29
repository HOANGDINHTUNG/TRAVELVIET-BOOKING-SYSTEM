import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Tạm thời giả lập đăng nhập thành công và đẩy vào Trang chủ (tabs)
    // Dùng replace để người dùng không bấm back lại màn hình login được
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Phần Logo (Có thể thay bằng thẻ Image sau) */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Travel<Text style={styles.logoHighlight}>Viet</Text></Text>
          <Text style={styles.slogan}>Khám phá trọn vẹn dải đất hình chữ S</Text>
        </View>

        {/* Form nhập liệu */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tài khoản</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại hoặc Email"
              value={account}
              onChangeText={setAccount}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Nút Đăng nhập */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

        {/* Đường kẻ Hoặc */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.divider} />
        </View>

        {/* Nút Đăng nhập Mạng xã hội */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.socialButtonText}>Đăng nhập bằng Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Đăng ký */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerTitle}>Bạn chưa là thành viên?</Text>
          <Text style={styles.registerSub}>Đăng ký ngay để nhận được những ưu đãi đến từ TravelViet</Text>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#005AAB' },
  logoHighlight: { color: '#FF2D55' },
  slogan: { fontSize: 14, color: '#666', marginTop: 5 },
  formContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#FAFAFA' },
  input: { flex: 1, height: 50, fontSize: 15, color: '#333' },
  eyeIcon: { padding: 5 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' },
  loginButton: { backgroundColor: '#005AAB', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14 },
  socialContainer: { gap: 15, marginBottom: 30 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, gap: 10 },
  googleButton: { backgroundColor: '#EA4335' },
  appleButton: { backgroundColor: '#000' },
  socialButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  registerContainer: { alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
  registerTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  registerSub: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 15, paddingHorizontal: 20 },
  registerButton: { width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#FF2D55', justifyContent: 'center', alignItems: 'center' },
  registerButtonText: { color: '#FF2D55', fontSize: 16, fontWeight: 'bold' }
});