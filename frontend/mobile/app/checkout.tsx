import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './_checkout.styles';

export default function CheckoutScreen() {
    const { tourId } = useLocalSearchParams(); // Lấy ID tour để sau này gửi cho Backend
    const router = useRouter();

    // State lưu thông tin khách hàng
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    
    // State tính toán số lượng và giá (Giả sử giá gốc là 1.200.000đ = 1200000)
    const [tickets, setTickets] = useState(1);
    const basePrice = 1200000; 
    const totalPrice = tickets * basePrice;

    // Hàm format tiền tệ VNĐ cho đẹp
    const formatCurrency = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    const handlePayment = () => {
        if (!name || !phone) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ Họ tên và Số điện thoại để tiến hành thanh toán!");
            return;
        }

        // Giả lập gọi cổng thanh toán VNPAY/MoMo thành công
        Alert.alert(
            "Thanh toán thành công! 🎉", 
            `Cảm ơn ${name} đã đặt vé. Hệ thống sẽ gửi thông tin chi tiết qua số điện thoại ${phone}.`,
            [
                { 
                    text: "Về trang chủ", 
                    onPress: () => router.replace('/(tabs)') // Đá về màn hình Home
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Xác nhận đặt Tour</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Tóm tắt Tour (Sau này lấy data thật từ API dựa vào tourId) */}
                <View style={styles.card}>
                    <Text style={styles.tourName}>Hành trình di sản Miền Tây</Text>
                    <Text style={styles.tourPrice}>Mã Tour: #{tourId || 'MOCK_123'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Họ và tên người đi" 
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Số điện thoại liên hệ" 
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <Text style={styles.sectionTitle}>Số lượng hành khách</Text>
                
                <View style={styles.counterRow}>
                    <Text style={styles.counterLabel}>Người lớn</Text>
                    <View style={styles.counterControl}>
                        <TouchableOpacity 
                            style={styles.counterButton} 
                            onPress={() => setTickets(Math.max(1, tickets - 1))}
                        >
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        
                        <Text style={styles.counterValue}>{tickets}</Text>
                        
                        <TouchableOpacity 
                            style={styles.counterButton} 
                            onPress={() => setTickets(tickets + 1)}
                        >
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Thanh toán */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
                </View>
                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payButtonText}>Thanh Toán Ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}