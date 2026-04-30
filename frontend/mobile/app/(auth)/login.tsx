import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/_login.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  
  // Thêm State để quản lý hiệu ứng xoay (Loading) cho các nút
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Xử lý đăng nhập thông thường
  const handleLogin = () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Email không đúng định dạng (VD: tru@gmail.com).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (email === 'admin@gmail.com' && password === 'Tru123') {
      Alert.alert("Thành công", "Chào mừng Trứ quay trở lại!", [
        { text: "OK", onPress: () => router.replace('/(tabs)') }
      ]);
    } else {
      setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng thử lại!');
    }
  };

  // Giả lập Đăng nhập Google
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true); // Bật vòng xoay loading
    // Dùng setTimeout để giả vờ đang chờ Google phản hồi mất 1.5 giây
    setTimeout(() => {
      setIsGoogleLoading(false); // Tắt vòng xoay
      Alert.alert("Google Sign-In", "Xác thực tài khoản Google thành công!", [
        { text: "Tiếp tục", onPress: () => router.replace('/(tabs)') }
      ]);
    }, 1500);
  };

  // Giả lập Đăng nhập Apple
  const handleAppleLogin = () => {
    setIsAppleLoading(true);
    setTimeout(() => {
      setIsAppleLoading(false);
      Alert.alert("Apple Sign-In", "Xác thực FaceID / Apple ID thành công!", [
        { text: "Tiếp tục", onPress: () => router.replace('/(tabs)') }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Travel<Text style={styles.logoHighlight}>Viet</Text></Text>
            <Text style={styles.slogan}>Đăng nhập để bắt đầu hành trình</Text>
          </View>

          <View style={styles.formContainer}>
            {errorMessage !== '' && (
              <View style={{ backgroundColor: '#FFEBEB', padding: 10, borderRadius: 8, marginBottom: 15 }}>
                <Text style={{ color: '#FF3B30', fontSize: 13, textAlign: 'center' }}>{errorMessage}</Text>
              </View>
            )}

            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, errorMessage.includes('Email') ? { borderColor: '#FF3B30' } : {}]}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="VD: admin@gmail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>Mật khẩu</Text>
            <View style={[styles.inputContainer, errorMessage.includes('mật khẩu') ? { borderColor: '#FF3B30' } : {}]}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu (Mẫu: Tru123)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            {/* NÚT GOOGLE */}
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]} 
              activeOpacity={0.7}
              onPress={handleGoogleLogin}
              disabled={isGoogleLoading || isAppleLoading} // Khóa nút khi đang load
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#EA4335" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.googleText}>Tiếp tục với Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* NÚT APPLE */}
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]} 
              activeOpacity={0.7}
              onPress={handleAppleLogin}
              disabled={isGoogleLoading || isAppleLoading}
            >
              {isAppleLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#fff" />
                  <Text style={styles.appleText}>Tiếp tục với Apple</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}