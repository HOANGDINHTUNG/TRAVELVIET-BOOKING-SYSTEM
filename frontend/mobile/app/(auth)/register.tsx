import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Nhập style từ file bạn đã tách thành công lúc nãy
import { styles } from '../styles/_register.styles';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 1. Logic kiểm tra Email (Đúng định dạng @gmail.com hoặc email chuẩn)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email) && email.length > 0;

  // 2. Logic kiểm tra Mật khẩu mạnh (>= 6 ký tự, có chữ hoa, chữ thường, và số)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  const isPasswordStrong = passwordRegex.test(password);

  // 3. Logic xác nhận mật khẩu
  const isConfirmMatch = confirmPassword.length > 0 && confirmPassword === password && isPasswordStrong;

  const handleRegister = () => {
    if (!fullName) {
      Alert.alert('Lỗi', 'Vui lòng nhập Họ và tên!');
      return;
    }
    if (!isEmailValid) {
      Alert.alert('Lỗi', 'Vui lòng nhập đúng định dạng Email!');
      return;
    }
    if (!isPasswordStrong) {
      Alert.alert('Lỗi', 'Mật khẩu chưa đủ mạnh! Cần ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.');
      return;
    }
    if (!isConfirmMatch) {
      Alert.alert('Lỗi', 'Xác nhận mật khẩu không trùng khớp!');
      return;
    }

    // Nếu qua hết các bài kiểm tra, cho phép đăng ký
    Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
      { text: 'OK', onPress: () => router.replace('/login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Đăng ký tài khoản</Text>
              <Text style={styles.subtitle}>Gia nhập cộng đồng TravelViet ngay hôm nay</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {/* HỌ VÀ TÊN */}
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={fullName.length > 2 ? "#4CAF50" : "#888"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="VD: Nguyễn Công Trứ"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, email.length > 0 && !isEmailValid ? { borderColor: '#FF3B30' } : {}]}>
              <Ionicons name="mail-outline" size={20} color={isEmailValid ? "#4CAF50" : "#888"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {email.length > 0 && !isEmailValid && (
              <Text style={styles.hintText}>Email không hợp lệ (VD: example@gmail.com)</Text>
            )}

            {/* MẬT KHẨU */}
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={[styles.inputContainer, password.length > 0 && !isPasswordStrong ? { borderColor: '#FF3B30' } : {}]}>
              <Ionicons name="lock-closed-outline" size={20} color={isPasswordStrong ? "#4CAF50" : "#888"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ít nhất 6 ký tự, có Hoa, thường & số"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {password.length > 0 && !isPasswordStrong && (
              <Text style={styles.hintText}>Mật khẩu cần ≥ 6 ký tự, có chữ Hoa, chữ thường và số</Text>
            )}

            {/* XÁC NHẬN MẬT KHẨU */}
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputContainer}>
              {/* Icon Check Done bên trái sẽ đổi màu Xanh nếu khớp và mật khẩu mạnh */}
              <Ionicons 
                name={isConfirmMatch ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={20} 
                color={isConfirmMatch ? "#4CAF50" : "#888"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.registerButtonText}>Đăng ký ngay</Text>
            </TouchableOpacity>
            
            <Text style={styles.termsText}>
              Bằng việc đăng ký, bạn đồng ý với{' '}
              {/* Điều hướng đến các trang pháp lý */}
              <Text style={styles.linkText} onPress={() => router.push('/terms')}>Điều khoản dịch vụ</Text> và{' '}
              <Text style={styles.linkText} onPress={() => router.push('/privacy')}>Chính sách bảo mật</Text> của chúng tôi.
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}