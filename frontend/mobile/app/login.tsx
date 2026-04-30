import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './styles/_login.styles';

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

