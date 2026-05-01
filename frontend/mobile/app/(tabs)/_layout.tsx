import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn Header mặc định
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#005AAB', // Xanh chủ đạo TravelViet khi chọn
        tabBarInactiveTintColor: '#888',  // Xám nhạt tinh tế khi không chọn
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khuyến mãi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "gift" : "gift-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="video"
        options={{
          title: 'Video',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "play-circle" : "play-circle-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff', // Nền trắng tinh khiết
    height: Platform.OS === 'ios' ? 85 : 60, // Chiều cao chuẩn mực
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    paddingTop: 5,
    // Thiết kế phẳng: Bỏ hết đổ bóng (elevation/shadow), chỉ dùng 1 đường viền mỏng manh ở trên
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA', 
    elevation: 0, 
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  }
});