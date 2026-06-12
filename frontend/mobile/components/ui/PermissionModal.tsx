import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const SECURE_STORE_KEY = 'travelviet.permissions_prompted';

const translations = {
  vi: {
    title: 'Cấp Quyền Truy Cập',
    sub: 'Để TravelViet mang lại trải nghiệm du lịch cá nhân hóa tốt nhất cho bạn, vui lòng cấp quyền truy cập các dịch vụ sau:',
    locationTitle: 'Vị trí của bạn',
    locationDesc: 'Giúp hiển thị thời tiết hiện tại và đề xuất các điểm đến, danh lam thắng cảnh, cũng như các tour du lịch gần bạn nhất.',
    notiTitle: 'Thông báo đẩy',
    notiDesc: 'Nhận thông báo về các ưu đãi đặc quyền, tin tức khuyến mãi mới nhất, dự báo thời tiết thời gian thực và cập nhật trạng thái đơn đặt tour.',
    allowBtn: 'Đồng ý và tiếp tục',
    skipBtn: 'Để sau',
  },
  en: {
    title: 'Permissions Required',
    sub: 'To provide the best personalized travel experience, TravelViet needs access to the following services:',
    locationTitle: 'Your Location',
    locationDesc: 'Helps show current weather and recommend popular destinations, attractions, and travel tours closest to your location.',
    notiTitle: 'Push Notifications',
    notiDesc: 'Get alerts on exclusive deals, latest promo news, real-time weather forecasts, and updates on your booked tours.',
    allowBtn: 'Agree and Continue',
    skipBtn: 'Maybe Later',
  }
};

export function PermissionModal() {
  const { theme, language } = useAppSettings();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';
  const isVi = language === 'vi';
  const t = isVi ? translations.vi : translations.en;

  useEffect(() => {
    let active = true;
    const checkPermissions = async () => {
      try {
        // 1. Check if both permissions are already granted natively
        const { status: locStatus } = await Location.getForegroundPermissionsAsync();
        const { status: notiStatus } = await Notifications.getPermissionsAsync();

        if (locStatus === 'granted' && notiStatus === 'granted') {
          if (active) setLoading(false);
          return; // Already granted, no need to show prompt
        }

        // 2. Check if we have already prompted the user in this install
        const prompted = await SecureStore.getItemAsync(SECURE_STORE_KEY);
        if (prompted === 'true') {
          if (active) setLoading(false);
          return; // Already prompted, respect user choice
        }

        // 3. Otherwise, show the modal prompt
        if (active) {
          setVisible(true);
          setLoading(false);
        }
      } catch {
        if (active) setLoading(false);
      }
    };

    void checkPermissions();
    return () => {
      active = false;
    };
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    try {
      // Prompt native location permission
      await Location.requestForegroundPermissionsAsync();

      // Prompt native notification permission
      await Notifications.requestPermissionsAsync();

      // Save to SecureStore so we don't ask again
      await SecureStore.setItemAsync(SECURE_STORE_KEY, 'true');
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Save to SecureStore so we don't annoy the user on every app launch
      await SecureStore.setItemAsync(SECURE_STORE_KEY, 'true');
    } catch {
      // Ignore
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  if (loading || !visible) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconShield, isDark && styles.iconShieldDark]}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#FF5B22" />
            </View>
            <Text style={[styles.title, isDark && styles.textDark]}>{t.title}</Text>
            <Text style={[styles.subtitle, isDark && styles.textSubDark]}>{t.sub}</Text>
          </View>

          {/* Permissions List */}
          <View style={styles.list}>
            {/* Location */}
            <View style={styles.item}>
              <View style={[styles.iconContainer, styles.locIconBg]}>
                <Ionicons name="location-outline" size={22} color="#FF5B22" />
              </View>
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, isDark && styles.textDark]}>{t.locationTitle}</Text>
                <Text style={[styles.itemDesc, isDark && styles.textSubDark]}>{t.locationDesc}</Text>
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.item}>
              <View style={[styles.iconContainer, styles.notiIconBg]}>
                <Ionicons name="notifications-outline" size={22} color="#0284C7" />
              </View>
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, isDark && styles.textDark]}>{t.notiTitle}</Text>
                <Text style={[styles.itemDesc, isDark && styles.textSubDark]}>{t.notiDesc}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {loading ? (
            <ActivityIndicator size="small" color="#FF5B22" style={{ marginVertical: 10 }} />
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.allowButton}
                onPress={handleAllow}
                activeOpacity={0.8}
              >
                <Text style={styles.allowButtonText}>{t.allowBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={[styles.skipButtonText, isDark && styles.textSubDark]}>{t.skipBtn}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconShield: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconShieldDark: {
    backgroundColor: 'rgba(255, 91, 34, 0.15)',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
    fontWeight: '500',
  },
  list: {
    gap: 16,
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  locIconBg: {
    backgroundColor: '#FFF0EA',
  },
  notiIconBg: {
    backgroundColor: '#E0F2FE',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
    fontWeight: '500',
  },
  actions: {
    gap: 10,
  },
  allowButton: {
    backgroundColor: '#FF5B22',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 1,
  },
  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textSubDark: {
    color: '#94A3B8',
  },
});
