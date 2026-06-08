import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { getAccessToken } from '@/services/authStorage';
import { commerceDesk } from '@/theme/commerceDesk';
import { AppRoutes, asHref } from '@/lib/navigation';

export default function TabLayout() {
  if (!getAccessToken()) {
    return <Redirect href={asHref(AppRoutes.login)} />;
  }

  return (
    <Tabs
      initialRouteName="products"
      screenOptions={{
        tabBarActiveTintColor: commerceDesk.accent,
        tabBarInactiveTintColor: commerceDesk.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor: commerceDesk.border,
          backgroundColor: commerceDesk.surface,
        },
      }}>
      <Tabs.Screen
        name="products"
        options={{
          title: 'Commerce',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="pricetags-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tours"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
