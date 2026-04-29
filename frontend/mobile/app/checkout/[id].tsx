import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// FIX: Đường dẫn này khớp với vị trí file Tours.ts trong ảnh của bạn
import { TOURS_DATA } from '../../constants/Tours';
import { styles } from '../styles/_checkout.styles' // Nhớ thêm dấu gạch dưới nếu bạn đổi tên file style

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Lấy dữ liệu tour từ constants
  const tour = TOURS_DATA.find(t => t.id === id);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    participants: '1'
  });

  if (!tour) return <View style={styles.container}><Text>Đang tải thông tin tour...</Text></View>;

  const handleConfirmBooking = () => {
    if (!form.fullName || !form.phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Họ tên và Số điện thoại để nhà xe liên lạc!");
      return;
    }

    Alert.alert(
      "Xác nhận thanh toán",
      `Tour: ${tour.name}\nTổng: ${tour.price}\nPhương thức: Chuyển khoản/Tiền mặt`,
      [
        { text: "Để sau", style: "cancel" },
        { 
          text: "Thanh toán ngay", 
          onPress: () => {
            // Sau này Trứ sẽ gọi API backend của anh Hoàng ở đây
            Alert.alert("Thành công!", "Yêu cầu đặt tour của bạn đã được gửi đi. Nhân viên sẽ gọi lại trong 5 phút.");
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header quay lại */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}> Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Xác nhận đặt tour</Text>

        {/* Thẻ tóm tắt Tour */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tóm tắt hành trình</Text>
          <Text style={styles.tourName}>{tour.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{tour.location}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Khởi hành: Theo yêu cầu</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>{tour.price}</Text>
          </View>
        </View>

        {/* Form nhập thông tin */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          
          <Text style={styles.label}>Họ và tên *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ví dụ: Nguyễn Văn Trứ"
            value={form.fullName}
            onChangeText={(t) => setForm({...form, fullName: t})}
          />

          <Text style={styles.label}>Số điện thoại liên lạc *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="09xx xxx xxx"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(t) => setForm({...form, phone: t})}
          />

          <Text style={styles.label}>Email nhận vé điện tử</Text>
          <TextInput 
            style={styles.input} 
            placeholder="admin@gmail.com"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => setForm({...form, email: t})}
          />
        </View>

        {/* Nút thanh toán */}
        <TouchableOpacity style={styles.payButton} onPress={handleConfirmBooking}>
          <Text style={styles.payButtonText}>XÁC NHẬN THANH TOÁN</Text>
        </TouchableOpacity>
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}