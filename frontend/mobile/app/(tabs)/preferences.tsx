import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SERVICE_ITEMS } from '../../constants/Tours';

type ThemeMode = 'light' | 'dark';
type LanguageMode = 'vi' | 'en';

const copy = {
  vi: {
    profileRole: 'Thanh vien Vang',
    services: 'Dich vu TravelViet',
    servicesCopy: 'Cac dich vu ho tro duoc dua ve Preferences de Home gon hon.',
    appearance: 'Giao dien',
    language: 'Ngon ngu',
    account: 'Tai khoan',
    light: 'Sang',
    dark: 'Toi',
    vietnamese: 'Tieng Viet',
    english: 'English',
    bookings: 'Lich su dat tour',
    favorite: 'Tour yeu thich',
    notifications: 'Cai dat thong bao',
    support: 'Trung tam tro giup',
    logout: 'Dang xuat',
    logoutTitle: 'Dang xuat',
    logoutMessage: 'Ban co chac chan muon dang xuat khoi TravelViet?',
    cancel: 'Huy',
  },
  en: {
    profileRole: 'Gold member',
    services: 'TravelViet Services',
    servicesCopy: 'Support services are grouped in Preferences so Home stays focused.',
    appearance: 'Appearance',
    language: 'Language',
    account: 'Account',
    light: 'Light',
    dark: 'Dark',
    vietnamese: 'Vietnamese',
    english: 'English',
    bookings: 'Booking history',
    favorite: 'Favorite tours',
    notifications: 'Notification settings',
    support: 'Help center',
    logout: 'Log out',
    logoutTitle: 'Log out',
    logoutMessage: 'Do you want to log out of TravelViet?',
    cancel: 'Cancel',
  },
};

export default function PreferencesScreen() {
  const router = useRouter();
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<LanguageMode>('vi');
  const isDark = themeMode === 'dark';
  const text = copy[language];
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const handleLogout = () => {
    Alert.alert(text.logoutTitle, text.logoutMessage, [
      { text: text.cancel, style: 'cancel' },
      {
        text: text.logout,
        style: 'destructive',
        onPress: () => router.replace('/(auth)/login'),
      },
    ]);
  };

  const MenuItem = ({
    icon,
    title,
    color,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    color?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={color ?? stylesToken(isDark).muted}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuTitle, color ? { color } : null]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={stylesToken(isDark).subtle} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Tru (Admin)</Text>
        <Text style={styles.userEmail}>admin@gmail.com</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{text.profileRole}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{text.appearance}</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentButton, themeMode === 'light' && styles.segmentActive]}
            onPress={() => setThemeMode('light')}
          >
            <Ionicons
              name="sunny-outline"
              size={17}
              color={themeMode === 'light' ? '#fff' : stylesToken(isDark).text}
            />
            <Text
              style={[
                styles.segmentText,
                themeMode === 'light' && styles.segmentTextActive,
              ]}
            >
              {text.light}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, themeMode === 'dark' && styles.segmentActive]}
            onPress={() => setThemeMode('dark')}
          >
            <Ionicons
              name="moon-outline"
              size={17}
              color={themeMode === 'dark' ? '#fff' : stylesToken(isDark).text}
            />
            <Text
              style={[
                styles.segmentText,
                themeMode === 'dark' && styles.segmentTextActive,
              ]}
            >
              {text.dark}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{text.language}</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentButton, language === 'vi' && styles.segmentActive]}
            onPress={() => setLanguage('vi')}
          >
            <Text style={[styles.segmentText, language === 'vi' && styles.segmentTextActive]}>
              {text.vietnamese}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, language === 'en' && styles.segmentActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.segmentText, language === 'en' && styles.segmentTextActive]}>
              {text.english}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{text.services}</Text>
        <Text style={styles.sectionCopy}>{text.servicesCopy}</Text>
        <View style={styles.serviceGrid}>
          {SERVICE_ITEMS.map((service) => (
            <View style={styles.serviceItem} key={service}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#087f9c" />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{text.account}</Text>
        <MenuItem icon="ticket-outline" title={text.bookings} />
        <MenuItem icon="heart-outline" title={text.favorite} />
        <MenuItem icon="notifications-outline" title={text.notifications} />
        <MenuItem icon="headset-outline" title={text.support} />
        <MenuItem
          icon="log-out-outline"
          title={text.logout}
          color="#FF3B30"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

function stylesToken(isDark: boolean) {
  return {
    page: isDark ? '#080b0b' : '#f6f3ea',
    surface: isDark ? '#15110f' : '#ffffff',
    soft: isDark ? '#231a16' : '#fffdf8',
    text: isDark ? '#eef6f2' : '#283618',
    muted: isDark ? 'rgba(238,246,242,0.72)' : '#606c38',
    subtle: isDark ? 'rgba(238,246,242,0.36)' : '#a6ad8b',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(96,108,56,0.18)',
  };
}

function createStyles(isDark: boolean) {
  const token = stylesToken(isDark);

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: token.page },
    profileHeader: {
      alignItems: 'center',
      paddingTop: 58,
      paddingBottom: 28,
      backgroundColor: token.surface,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      borderBottomWidth: 1,
      borderColor: token.border,
    },
    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      marginBottom: 14,
      borderWidth: 3,
      borderColor: '#087f9c',
    },
    userName: { color: token.text, fontSize: 24, fontWeight: '900' },
    userEmail: { color: token.muted, fontSize: 14, marginTop: 4, fontWeight: '700' },
    badge: {
      marginTop: 12,
      minHeight: 32,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(221,161,94,0.18)' : '#ffe08a',
    },
    badgeText: { color: isDark ? '#f7d7a7' : '#856404', fontWeight: '900' },
    section: {
      marginHorizontal: 16,
      marginTop: 16,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: token.border,
      backgroundColor: token.surface,
    },
    sectionKicker: {
      color: '#dda15e',
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    sectionCopy: {
      color: token.muted,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '600',
      marginBottom: 12,
    },
    segmentedControl: {
      flexDirection: 'row',
      gap: 8,
      padding: 4,
      borderRadius: 8,
      backgroundColor: token.soft,
      borderWidth: 1,
      borderColor: token.border,
    },
    segmentButton: {
      flex: 1,
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 6,
    },
    segmentActive: { backgroundColor: '#606c38' },
    segmentText: { color: token.text, fontSize: 13, fontWeight: '900' },
    segmentTextActive: { color: '#fff' },
    serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    serviceItem: {
      width: '48%',
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 10,
      borderRadius: 8,
      backgroundColor: isDark ? 'rgba(0,180,216,0.12)' : 'rgba(0,180,216,0.08)',
    },
    serviceText: { flex: 1, color: token.text, fontSize: 12, lineHeight: 16, fontWeight: '800' },
    menuItem: {
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: token.border,
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
    menuIcon: { marginRight: 12 },
    menuTitle: { color: token.text, fontSize: 15, fontWeight: '800' },
  });
}
