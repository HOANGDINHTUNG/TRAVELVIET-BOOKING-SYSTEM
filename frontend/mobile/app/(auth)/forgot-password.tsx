import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Tái sử dụng CSS của trang đăng ký cho lẹ & đồng bộ
import { styles } from '../styles/_register.styles'; 

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSendResetLink = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email của bạn.');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng!');
      return;
    }

    // Giả lập gọi API gửi email
    Alert.alert(
      'Thành công', 
      `Đường dẫn khôi phục mật khẩu đã được gửi tới: ${email}\nVui lòng kiểm tra hộp thư của bạn.`,
      [{ text: 'Về trang Đăng nhập', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, paddingHorizontal: 25, paddingTop: 30 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Quên mật khẩu?</Text>
            <Text style={styles.subtitle}>Đừng lo, hãy nhập email đã đăng ký để chúng tôi gửi link khôi phục cho bạn.</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email của bạn</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, { marginTop: 10 }]} 
            onPress={handleSendResetLink} 
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Gửi link khôi phục</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}