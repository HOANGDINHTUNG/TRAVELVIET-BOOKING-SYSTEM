import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60; 
const FLOATING_BTN_SIZE = 50; 
const CURVE_WIDTH = 85;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Vẽ đường cong bao quanh nút đầu tiên (Khuyến mãi)
  const drawPath = `M0,0 L15,0 C25,0 30,25 57,25 C84,25 89,0 100,0 L${width},0 L${width},100 L0,100 Z`;

  const animateTab = () => {
    Animated.spring(animatedValue, { toValue: 1, useNativeDriver: true, friction: 5 }).start(() => animatedValue.setValue(0));
  };

  return (
    <View style={[styles.container, { height: TAB_BAR_HEIGHT + insets.bottom }]}>
      <View style={styles.svgContainer}>
        <Svg width={width} height={100} viewBox={`0 0 ${width} 100`}>
          <Path d={drawPath} fill="#005AAB" />
        </Svg>
      </View>

      {/* Nút Khuyến mãi nổi */}
      <TouchableOpacity 
        style={styles.floatingBtn} 
        onPress={() => { animateTab(); navigation.navigate('promotions'); }}
      >
        <Ionicons name="gift" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.tabItemsWrapper, { paddingBottom: insets.bottom }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          if (route.name === 'promotions') return <View key="p" style={{ width: 65 }} />; // Chừa chỗ cho nút nổi

          const icons: any = { explore: 'compass', index: 'home', video: 'play-circle', preferences: 'person' };
          const labels: any = { explore: 'Khám phá', index: 'Trang chủ', video: 'Video', preferences: 'Tài khoản' };

          return (
            <TouchableOpacity 
              key={route.key} 
              style={styles.tabItem} 
              onPress={() => { animateTab(); navigation.navigate(route.name); }}
            >
              <Animated.View style={{ transform: [{ scale: isFocused ? 1.2 : 1 }] }}>
                <Ionicons 
                  name={isFocused ? icons[route.name] : icons[route.name] + '-outline'} 
                  size={22} 
                  color={isFocused ? "#fff" : "rgba(255,255,255,0.6)"} 
                />
              </Animated.View>
              <Text style={[styles.label, { color: isFocused ? '#fff' : 'rgba(255,255,255,0.6)' }]}>{labels[route.name]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'transparent' },
  svgContainer: { position: 'absolute', top: 0, left: 0 },
  tabItemsWrapper: { flexDirection: 'row', height: TAB_BAR_HEIGHT, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  floatingBtn: { position: 'absolute', left: 33, top: -18, width: FLOATING_BTN_SIZE, height: FLOATING_BTN_SIZE, borderRadius: 25, backgroundColor: '#FF2D55', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.3, zIndex: 99 },
  label: { fontSize: 9, marginTop: 4, fontWeight: '500' }
});