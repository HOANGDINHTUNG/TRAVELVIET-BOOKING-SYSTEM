import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TOURS_DATA } from '../../constants/Tours';
import { styles } from '../styles/_checkout.styles';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tour = TOURS_DATA.find((item) => item.id === id);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    participants: '1',
  });

  if (!tour) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin tour...</Text>
      </View>
    );
  }

  const handleConfirmBooking = () => {
    if (!form.fullName || !form.phone) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ họ tên và số điện thoại để tư vấn viên liên lạc.',
      );
      return;
    }

    Alert.alert(
      'Xác nhận thanh toán',
      `Tour: ${tour.title}\nTổng: ${tour.price}\nSố khách: ${form.participants}\nPhương thức: Chuyển khoản/Tiền mặt`,
      [
        { text: 'Để sau', style: 'cancel' },
        {
          text: 'Thanh toán ngay',
          onPress: () => {
            Alert.alert(
              'Thành công!',
              'Yêu cầu đặt tour đã được gửi. Nhân viên sẽ gọi lại trong 5 phút.',
            );
            router.replace('/(tabs)');
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}> Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Xác nhận đặt tour</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tóm tắt hành trình</Text>
          <Text style={styles.tourName}>{tour.title}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{tour.location}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{tour.days}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>{tour.price}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>

          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Nguyễn Văn Trứ"
            value={form.fullName}
            onChangeText={(text) => setForm({ ...form, fullName: text })}
          />

          <Text style={styles.label}>Số điện thoại liên lạc *</Text>
          <TextInput
            style={styles.input}
            placeholder="09xx xxx xxx"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />

          <Text style={styles.label}>Email nhận vé điện tử</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@gmail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <Text style={styles.label}>Số khách</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={form.participants}
            onChangeText={(text) => setForm({ ...form, participants: text })}
          />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handleConfirmBooking}>
          <Text style={styles.payButtonText}>XÁC NHẬN THANH TOÁN</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
