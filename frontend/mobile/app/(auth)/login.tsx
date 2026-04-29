import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/_login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // 1. Kiểm tra dữ liệu rỗng
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }
    
    // 2. Giả lập kiểm tra tài khoản (Mock Authentication)
    // Tài khoản test: admin@gmail.com / 123456
    if (email.toLowerCase() === 'admin@gmail.com' && password === '123456') {
      // Nhập đúng -> Điều hướng thẳng vào màn hình Home
      router.replace('/(tabs)');
    } else {
      // Nhập sai -> Hiện cảnh báo từ chối
      Alert.alert(
        "Đăng nhập thất bại", 
        "Email hoặc mật khẩu không chính xác!\n(Gợi ý test: admin@gmail.com / 123456)"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TravelViet</Text>
        <Text style={styles.subtitle}>Đăng nhập để bắt đầu hành trình</Text>

        {/* Khung nhập Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Khung nhập Mật khẩu */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          {/* Nút ẩn/hiện mật khẩu */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Nút Đăng nhập */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* Nút chuyển sang Đăng ký */}
        <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký ngay</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}