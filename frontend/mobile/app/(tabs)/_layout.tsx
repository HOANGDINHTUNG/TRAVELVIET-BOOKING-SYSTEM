import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
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
          title: 'Tours',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="ticket-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="destinations"
        options={{
          title: 'Destinations',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="map-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Preferences',
          tabBarIcon: ({ color }) => <Ionicons size={25} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
