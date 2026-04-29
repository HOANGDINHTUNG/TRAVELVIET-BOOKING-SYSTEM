/**
 * NAVIGATION SETUP EXAMPLE
 * 
 * Ví dụ hoàn chỉnh cách setup navigation stack cho tour flow
 */

// ============================================
// 1. Navigator Setup (app/(tabs)/_layout.tsx)
// ============================================

/*
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/Home';
import TourDetailScreen from '@/screens/TourDetail';
import CheckoutScreen from '@/screens/Checkout';
import PaymentScreen from '@/screens/Payment'; // To be created

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animationEnabled: false,
        }}
      />
      
      <Stack.Screen
        name="TourDetail"
        component={TourDetailScreen}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
        }}
      />
      
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
        }}
      />
      
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          animationEnabled: true,
          gestureEnabled: false, // Prevent back gesture on payment
        }}
      />
    </Stack.Navigator>
  );
}
*/

// ============================================
// 2. Navigation Type Definitions
// ============================================

/*
export type HomeStackParamList = {
  Home: undefined;
  TourDetail: {
    tour: Tour;
  };
  Checkout: {
    tour: Tour;
    selectedCount?: {
      adults: number;
      children: number;
    };
  };
  Payment: {
    tour: Tour;
    passengers: Passenger[];
    adultCount: number;
    childCount: number;
    totalPrice: number;
  };
};

// Use in component:
// const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
*/

// ============================================
// 3. NAVIGATION FLOW IN HOME SCREEN
// ============================================

/*
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  
  const handleTourPress = (tour: Tour) => {
    navigation.navigate('TourDetail', { tour });
  };
  
  return (
    <View>
      <TourCard
        tour={tour}
        onPress={() => handleTourPress(tour)}
      />
    </View>
  );
}
*/

// ============================================
// 4. TOUR DETAIL SCREEN - BOOKING FLOW
// ============================================

/*
// In TourDetailScreen handleBooking():
const handleBooking = () => {
  // Reset passenger count to defaults
  const selectedCount = {
    adults: 1,
    children: 0,
  };
  
  navigation.navigate('Checkout', {
    tour,
    selectedCount,
  });
};
*/

// ============================================
// 5. CHECKOUT SCREEN - PAYMENT FLOW
// ============================================

/*
// In CheckoutScreen handleContinue():
const handleContinue = () => {
  if (!validatePassengers()) {
    Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin hành khách');
    return;
  }

  const passengerData = passengers.slice(0, totalPassengers).map((p, index) => ({
    id: `passenger_${index}`,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,
    type: p.type,
  }));

  navigation.navigate('Payment', {
    tour,
    passengers: passengerData,
    adultCount,
    childCount,
    totalPrice: total,
  });
};
*/

// ============================================
// 6. BACK NAVIGATION
// ============================================

/*
// All screens have handleGoBack:
const handleGoBack = () => {
  navigation.goBack();
};

// This automatically goes to the previous screen
*/

// ============================================
// 7. COMPLETE EXAMPLE: APP.TSX
// ============================================

/*
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '@/screens/Home';
import TourDetailScreen from '@/screens/TourDetail';
import CheckoutScreen from '@/screens/Checkout';
import ExploreScreen from '@/screens/Explore';
import BookingsScreen from '@/screens/Bookings';
import PreferencesScreen from '@/screens/Preferences';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="TourDetail" component={TourDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExploreList" component={ExploreScreen} />
      <Stack.Screen name="TourDetail" component={TourDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            
            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ExploreTab') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'BookingsTab') {
              iconName = focused ? 'ticket-confirmation' : 'ticket-confirmation-outline';
            } else if (route.name === 'PreferencesTab') {
              iconName = focused ? 'account' : 'account-outline';
            }
            
            return (
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Trang chủ',
          }}
        />
        <Tab.Screen
          name="ExploreTab"
          component={ExploreStack}
          options={{
            tabBarLabel: 'Khám phá',
          }}
        />
        <Tab.Screen
          name="BookingsTab"
          component={BookingsScreen}
          options={{
            tabBarLabel: 'Đơn hàng',
          }}
        />
        <Tab.Screen
          name="PreferencesTab"
          component={PreferencesScreen}
          options={{
            tabBarLabel: 'Tài khoản',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
*/

export {};
