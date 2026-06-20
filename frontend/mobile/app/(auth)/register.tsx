import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/register.styles';
import { registerUser } from '@/services/authApi';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { setAiChatAccessTokenProvider } from '@/services/aiChatApi';
import { establishSessionAfterLogin } from '@/services/authSession';
import { applyAccessContext } from '@/services/authStorage';
import { commerceDesk } from '@/theme/commerceDesk';
import { ApiError } from '@/types/api';
import { AppRoutes, asHref } from '@/lib/navigation';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMockRegister = () => {
    Alert.alert(
      'Thành công (Thử nghiệm)',
      'Đăng ký tài khoản thử nghiệm thành công! Vui lòng đăng nhập.',
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            router.replace({
              pathname: AppRoutes.login,
              params: { email: email.trim() || phone.trim() },
            });
          },
        },
      ]
    );
  };

  const handleRegister = async () => {
    // Basic validations
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Họ và tên!');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email hoặc Số điện thoại để liên hệ!');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Lỗi', 'Email không hợp lệ!');
        return;
      }
    }

    if (phone.trim()) {
      const phoneRegex = /^[+]?[0-9]{8,20}$/;
      if (!phoneRegex.test(phone.trim())) {
        Alert.alert('Lỗi', 'Số điện thoại không hợp lệ! Chỉ nhập số từ 8-20 ký tự.');
        return;
      }
    }

    if (!password) {
      Alert.alert('Lỗi', 'Vui lòng nhập Mật khẩu!');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải dài tối thiểu 8 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và Xác nhận mật khẩu không khớp!');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        fullName: fullName.trim(),
        displayName: displayName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        passwordHash: password,
      });

      Alert.alert(
        'Thành công',
        'Đăng ký tài khoản thành công! Vui lòng đăng nhập bằng tài khoản mới của bạn.',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              router.replace({
                pathname: AppRoutes.login,
                params: { email: email.trim() || phone.trim() },
              });
            },
          },
        ]
      );
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        Alert.alert('Đăng ký thất bại', err.message);
      } else {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Không thể kết nối máy chủ để đăng ký. Kiểm tra backend đang chạy.';

        Alert.alert(
          'Đăng ký thất bại',
          `${message}\n\nBạn có muốn đăng ký bằng Chế độ Thử nghiệm (Offline) không?`,
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Đăng ký Offline',
              onPress: handleMockRegister,
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.kicker}>PROMOTION & COMMERCE</Text>
            <Text style={styles.title}>TravelViet</Text>
            <Text style={styles.subtitle}>Đăng ký tài khoản để khám phá các voucher, campaign, sản phẩm và combo.</Text>
            <Text style={styles.apiHint} selectable>
              API: {getApiBaseUrl()}
            </Text>

            {/* Full name input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên (bắt buộc)"
                placeholderTextColor={commerceDesk.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Display name input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="card-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Tên hiển thị (tùy chọn)"
                placeholderTextColor={commerceDesk.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Email input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ Email"
                placeholderTextColor={commerceDesk.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Phone input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                placeholderTextColor={commerceDesk.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                placeholderTextColor={commerceDesk.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="off"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={commerceDesk.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={commerceDesk.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor={commerceDesk.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete="off"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={commerceDesk.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => void handleRegister()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Đăng ký tài khoản</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace(asHref(AppRoutes.login))}
            >
              <Text style={styles.loginText}>
                Đã có tài khoản? <Text style={styles.loginTextBold}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
