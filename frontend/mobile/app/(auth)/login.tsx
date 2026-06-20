import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/login.styles";
import { getApiBaseUrl } from "@/config/apiBaseUrl";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { loginCopy } from "@/constants/loginCopy";
import { loginWithEmail } from "@/services/authApi";
import { setAiChatAccessTokenProvider } from "@/services/aiChatApi";
import { establishSessionAfterLogin } from "@/services/authSession";
import { clearAuthSession, applyAccessContext } from "@/services/authStorage";
import { commerceDesk } from "@/theme/commerceDesk";
import { ApiError } from "@/types/api";
import { AppRoutes, asHref } from "@/lib/navigation";

export default function LoginScreen() {
  const router = useRouter();
  const { reloadProfile } = useAppSettings();
  const { email: registeredEmail } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, [registeredEmail]);

  const handleMockLogin = () => {
    try {
      const mockAuth = {
        user: {
          id: "mock-user-123",
          email: email.trim() || "user@travelviet.vn",
          fullName: "Trần Rio",
          displayName: "Rio",
          role: "USER",
          roles: ["USER"],
        },
        accessToken: "mock-access-token-xyz",
        refreshToken: "mock-refresh-token-xyz",
        tokenType: "Bearer",
        expiresIn: 3600,
      };

      setAiChatAccessTokenProvider(() => mockAuth.accessToken);

      const mockCtx = {
        user: mockAuth.user,
        roles: ["USER"],
        permissions: ["voucher.view", "promotion.campaign.view"],
        managementRoles: [],
        hasManagementAccess: false,
        isSuperAdmin: false,
      };

      applyAccessContext(mockCtx, {
        accessToken: mockAuth.accessToken,
        refreshToken: mockAuth.refreshToken,
      });

      router.replace(asHref(AppRoutes.tabs));
    } catch {
      Alert.alert("Lỗi", "Không thể khởi tạo phiên đăng nhập ngoại tuyến.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const auth = await loginWithEmail(email, password);
      setAiChatAccessTokenProvider(() => auth.accessToken);
      await establishSessionAfterLogin(auth);
      await reloadProfile();
      router.replace(asHref(AppRoutes.tabs));
    } catch (err) {
      await clearAuthSession();
      setAiChatAccessTokenProvider(null);
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        Alert.alert("Đăng nhập thất bại", err.message);
      } else {
        const message =
          err instanceof ApiError
            ? err.message
            : "Không thể kết nối máy chủ. Kiểm tra backend đang chạy.";

        Alert.alert(
          "Đăng nhập thất bại",
          `${message}\n\nBạn có muốn đăng nhập bằng Chế độ Thử nghiệm (Offline) không?`,
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Đăng nhập Offline",
              onPress: handleMockLogin,
            },
          ],
        );
      }
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
          <Ionicons
            name="mail-outline"
            size={20}
            color={commerceDesk.textMuted}
            style={styles.icon}
          />
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
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={commerceDesk.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => void handleLogin()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>{loginCopy.login}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: "center" }}
          onPress={handleMockLogin}
        >
          <Text style={{ color: "#FF702A", fontWeight: "700", fontSize: 14 }}>
            Đăng nhập Chế độ Thử nghiệm (Offline)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push(asHref(AppRoutes.register))}
        >
          <Text style={styles.registerText}>
            Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.adminHint}>{loginCopy.adminHint}</Text>
      </View>
    </SafeAreaView>
  );
}
