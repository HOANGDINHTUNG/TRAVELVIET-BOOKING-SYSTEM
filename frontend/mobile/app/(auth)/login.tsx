import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/_login.styles';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { loginCopy } from '@/constants/loginCopy';
import { canViewCommerceDesk } from '@/features/auth/commercePermissions';
import { loginWithEmail } from '@/services/authApi';
import { setAiChatAccessTokenProvider } from '@/services/aiChatApi';
import { establishSessionAfterLogin } from '@/services/authSession';
import { clearAuthSession } from '@/services/authStorage';
import { commerceDesk } from '@/theme/commerceDesk';
import { ApiError } from '@/types/api';
import { AppRoutes, asHref } from '@/lib/navigation';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const auth = await loginWithEmail(email, password);
      setAiChatAccessTokenProvider(() => auth.accessToken);
      const ctx = await establishSessionAfterLogin(auth);
      if (!canViewCommerceDesk(ctx)) {
        await clearAuthSession();
        setAiChatAccessTokenProvider(null);
        Alert.alert(
          'Không có quyền',
          'Tài khoản không có quyền voucher.view hoặc promotion.campaign.view để mở Commerce Desk.'
        );
        return;
      }
      router.replace(asHref(AppRoutes.productTab));
    } catch (err) {
      await clearAuthSession();
      setAiChatAccessTokenProvider(null);
      const message =
        err instanceof ApiError
          ? err.message
          : 'Email hoặc mật khẩu không chính xác. Kiểm tra backend đang chạy.';
      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>{loginCopy.kicker}</Text>
        <Text style={styles.title}>{loginCopy.title}</Text>
        <Text style={styles.subtitle}>{loginCopy.subtitle}</Text>
        <Text style={styles.apiHint} selectable>
          API: {getApiBaseUrl()}
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={commerceDesk.textMuted} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={loginCopy.emailPlaceholder}
            placeholderTextColor={commerceDesk.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={commerceDesk.textMuted}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder={loginCopy.passwordPlaceholder}
            placeholderTextColor={commerceDesk.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={commerceDesk.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => void handleLogin()}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>{loginCopy.login}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.adminHint}>{loginCopy.adminHint}</Text>
      </View>
    </SafeAreaView>
  );
}
