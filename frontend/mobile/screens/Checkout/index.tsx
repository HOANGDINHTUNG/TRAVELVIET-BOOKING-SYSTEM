import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createCheckoutStyles } from './styles';
import { Tour, Passenger } from '@/types/Tour';
import { Colors } from '@/constants/theme';

interface CheckoutProps {
  route: any;
  navigation: any;
}

interface PassengerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'adult' | 'child';
  error?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

const ADULT_PRICE_RATIO = 1;
const CHILD_PRICE_RATIO = 0.7;

export default function CheckoutScreen({ route, navigation }: CheckoutProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createCheckoutStyles(isDark);
  const themeColors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const { tour, selectedCount: initialCount } = route?.params || {
    tour: null,
    selectedCount: { adults: 1, children: 0 },
  };

  if (!tour) {
    return (
      <View style={styles.container}>
        <Text>Tour không tìm thấy</Text>
      </View>
    );
  }

  const [adultCount, setAdultCount] = useState(initialCount?.adults || 1);
  const [childCount, setChildCount] = useState(initialCount?.children || 0);
  const [passengers, setPassengers] = useState<PassengerData[]>([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'adult',
    },
  ]);

  // Calculate prices
  const totalPassengers = adultCount + childCount;
  const adultPrice = tour.price * ADULT_PRICE_RATIO;
  const childPrice = tour.price * CHILD_PRICE_RATIO;
  const subtotal = adultCount * adultPrice + childCount * childPrice;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Handle passenger count changes
  const handleAdultChange = (delta: number) => {
    const newCount = adultCount + delta;
    if (newCount >= 1) {
      setAdultCount(newCount);
      // Update passengers array
      const newPassengers = [...passengers];
      // Add or remove adult passengers as needed
      if (newCount > passengers.filter((p) => p.type === 'adult').length) {
        newPassengers.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          type: 'adult',
        });
      }
      setPassengers(newPassengers);
    }
  };

  const handleChildChange = (delta: number) => {
    const newCount = childCount + delta;
    if (newCount >= 0) {
      setChildCount(newCount);
      // Add or remove child passengers
      const newPassengers = [...passengers];
      if (newCount > passengers.filter((p) => p.type === 'child').length) {
        newPassengers.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          type: 'child',
        });
      }
      setPassengers(newPassengers);
    }
  };

  // Handle passenger data change
  const handlePassengerChange = (
    index: number,
    field: keyof Omit<PassengerData, 'type' | 'error'>,
    value: string
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value,
      error: {
        ...newPassengers[index].error,
        [field]: '', // Clear error when user types
      },
    };
    setPassengers(newPassengers);
  };

  // Validate passenger form
  const validatePassengers = (): boolean => {
    const newPassengers = [...passengers];
    let hasError = false;

    newPassengers.slice(0, totalPassengers).forEach((passenger, index) => {
      const errors: any = {};

      if (!passenger.firstName.trim()) {
        errors.firstName = 'Tên không được để trống';
        hasError = true;
      }
      if (!passenger.lastName.trim()) {
        errors.lastName = 'Họ không được để trống';
        hasError = true;
      }
      if (!passenger.email.trim()) {
        errors.email = 'Email không được để trống';
        hasError = true;
      } else if (!passenger.email.includes('@')) {
        errors.email = 'Email không hợp lệ';
        hasError = true;
      }
      if (!passenger.phone.trim()) {
        errors.phone = 'Số điện thoại không được để trống';
        hasError = true;
      } else if (!/^\d{10}$/.test(passenger.phone.replace(/\D/g, ''))) {
        errors.phone = 'Số điện thoại không hợp lệ';
        hasError = true;
      }

      if (Object.keys(errors).length > 0) {
        newPassengers[index] = {
          ...newPassengers[index],
          error: errors,
        };
      }
    });

    setPassengers(newPassengers);
    return !hasError;
  };

  // Handle continue
  const handleContinue = () => {
    if (!validatePassengers()) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin hành khách');
      return;
    }

    const passengerData: Passenger[] = passengers.slice(0, totalPassengers).map((p, index) => ({
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

  // Handle go back
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tour Summary */}
        <View style={styles.tourSummaryCard}>
          <Image source={{ uri: tour.imageUrl }} style={styles.tourSummaryImage} />
          <View style={styles.tourSummaryContent}>
            <View>
              <Text style={styles.tourSummaryName} numberOfLines={2}>
                {tour.name}
              </Text>
              <Text style={styles.tourSummaryLocation}>{tour.location.name}</Text>
            </View>
            <Text style={styles.tourSummaryPrice}>{formatPrice(tour.price)}/người</Text>
          </View>
        </View>

        {/* Passenger Count Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Chọn số lượng hành khách</Text>
          <View style={styles.countContainer}>
            {/* Adult Count */}
            <View style={styles.countItem}>
              <View>
                <Text style={styles.countLabel}>Người lớn</Text>
                <Text style={styles.countSubLabel}>
                  {formatPrice(adultPrice)}/người
                </Text>
              </View>
              <View style={styles.countControls}>
                <TouchableOpacity
                  style={[
                    styles.countButton,
                    adultCount <= 1 && styles.countButtonDisabled,
                  ]}
                  onPress={() => handleAdultChange(-1)}
                  disabled={adultCount <= 1}
                >
                  <Text style={styles.countButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.countValue}>{adultCount}</Text>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => handleAdultChange(1)}
                >
                  <Text style={styles.countButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Child Count */}
            <View style={styles.countItem}>
              <View>
                <Text style={styles.countLabel}>Trẻ em (3-12 tuổi)</Text>
                <Text style={styles.countSubLabel}>
                  {formatPrice(childPrice)}/người
                </Text>
              </View>
              <View style={styles.countControls}>
                <TouchableOpacity
                  style={[
                    styles.countButton,
                    childCount <= 0 && styles.countButtonDisabled,
                  ]}
                  onPress={() => handleChildChange(-1)}
                  disabled={childCount <= 0}
                >
                  <Text style={styles.countButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.countValue}>{childCount}</Text>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => handleChildChange(1)}
                >
                  <Text style={styles.countButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Passenger Information */}
        {totalPassengers > 0 && (
          <View style={styles.passengersSection}>
            <Text style={styles.sectionTitle}>📝 Thông tin hành khách</Text>

            {passengers.slice(0, totalPassengers).map((passenger, index) => (
              <View key={index} style={styles.passengerForm}>
                <Text style={styles.passengerHeader}>
                  {passenger.type === 'adult' ? 'Người lớn' : 'Trẻ em'} #{index + 1}
                </Text>

                {/* First Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tên</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passenger.error?.firstName && styles.inputError,
                    ]}
                    placeholder="Nhập tên"
                    placeholderTextColor={themeColors.icon}
                    value={passenger.firstName}
                    onChangeText={(value) =>
                      handlePassengerChange(index, 'firstName', value)
                    }
                  />
                  {passenger.error?.firstName && (
                    <Text style={styles.errorText}>{passenger.error.firstName}</Text>
                  )}
                </View>

                {/* Last Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Họ</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passenger.error?.lastName && styles.inputError,
                    ]}
                    placeholder="Nhập họ"
                    placeholderTextColor={themeColors.icon}
                    value={passenger.lastName}
                    onChangeText={(value) =>
                      handlePassengerChange(index, 'lastName', value)
                    }
                  />
                  {passenger.error?.lastName && (
                    <Text style={styles.errorText}>{passenger.error.lastName}</Text>
                  )}
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passenger.error?.email && styles.inputError,
                    ]}
                    placeholder="example@email.com"
                    placeholderTextColor={themeColors.icon}
                    keyboardType="email-address"
                    value={passenger.email}
                    onChangeText={(value) =>
                      handlePassengerChange(index, 'email', value)
                    }
                  />
                  {passenger.error?.email && (
                    <Text style={styles.errorText}>{passenger.error.email}</Text>
                  )}
                </View>

                {/* Phone */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Số điện thoại</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passenger.error?.phone && styles.inputError,
                    ]}
                    placeholder="0xxxxxxxxx"
                    placeholderTextColor={themeColors.icon}
                    keyboardType="phone-pad"
                    value={passenger.phone}
                    onChangeText={(value) =>
                      handlePassengerChange(index, 'phone', value)
                    }
                  />
                  {passenger.error?.phone && (
                    <Text style={styles.errorText}>{passenger.error.phone}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.priceSummaryCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {adultCount} người lớn × {formatPrice(adultPrice)}
            </Text>
            <Text style={styles.priceValue}>{formatPrice(adultCount * adultPrice)}</Text>
          </View>

          {childCount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {childCount} trẻ em × {formatPrice(childPrice)}
              </Text>
              <Text style={styles.priceValue}>{formatPrice(childCount * childPrice)}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Thuế (10%)</Text>
            <Text style={styles.priceValue}>{formatPrice(tax)}</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            💳 Tiến tới thanh toán ({formatPrice(total)})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
          <Text style={styles.cancelButtonText}>Huỷ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
