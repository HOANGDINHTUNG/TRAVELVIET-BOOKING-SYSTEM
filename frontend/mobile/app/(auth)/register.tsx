import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/_register.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Validate cơ bản
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }
    
    // Giả lập Đăng ký thành công và quay về trang Đăng nhập
    Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
      { text: "OK", onPress: () => router.push('/(auth)/login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản TravelViet mới</Text>

        {/* Khung nhập Họ tên */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Họ và tên" 
            value={fullName} 
            onChangeText={setFullName} 
          />
        </View>

        {/* Khung nhập Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Khung Nhập lại Mật khẩu */}
        <View style={styles.inputContainer}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Nhập lại mật khẩu" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry={!showPassword} 
          />
        </View>

        {/* Nút Đăng ký */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Đăng Ký</Text>
        </TouchableOpacity>

        {/* Chuyển về Đăng nhập */}
        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginText}>Đã có tài khoản? <Text style={styles.loginTextBold}>Đăng nhập</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}