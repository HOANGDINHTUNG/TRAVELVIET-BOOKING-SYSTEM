import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { getAccessToken } from '@/services/authStorage';
import { AppRoutes, asHref } from '@/lib/navigation';
import { useAppSettings } from '@/providers/AppSettingsProvider';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppSettings();
  const isDark = theme === 'dark';

  if (!getAccessToken()) {
    return <Redirect href={asHref(AppRoutes.login)} />;
  }

  const renderTabBarIcon = (focused: boolean, color: string, name: string, outlineName: string) => {
    return (
      <View style={[
        styles.iconContainer,
        focused && styles.iconContainerActive
      ]}>
        <Ionicons size={22} name={focused ? name as any : outlineName as any} color={color} />
      </View>
    );
  };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#FF5B22',
        tabBarInactiveTintColor: isDark ? '#64748B' : '#9CA3AF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 6,
        },
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 12),
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#334155' : '#F3F4F6',
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          overflow: 'visible',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused, color }) => renderTabBarIcon(focused, color, 'home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ focused, color }) => renderTabBarIcon(focused, color, 'search', 'search-outline'),
        }}
      />
      <Tabs.Screen
        name="tours"
        options={{
          title: 'Tours',
          tabBarIcon: ({ focused, color }) => renderTabBarIcon(focused, color, 'airplane', 'airplane-outline'),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ focused, color }) => renderTabBarIcon(focused, color, 'calendar', 'calendar-outline'),
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          href: null, // Hide flights tab from bottom tab bar
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ focused, color }) => renderTabBarIcon(focused, color, 'person', 'person-outline'),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          href: null, // Hide backoffice products management tab from main navigation
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
  iconContainerActive: {
    top: -5,
  },
});
