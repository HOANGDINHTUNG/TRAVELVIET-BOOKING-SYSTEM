import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { MOCK_FLIGHTS } from '@/constants/flightsMock';

type PaymentMethod = 'vnpay' | 'momo' | 'bank_transfer';

export default function FlightCheckoutScreen() {
  const { flightId } = useLocalSearchParams<{ flightId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, language, formatPrice } = useAppSettings();
  const { showSnackbar } = useSnackbar();

  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';

  // Find the selected flight
  const flight = useMemo(() => {
    return MOCK_FLIGHTS.find((f) => f.id === flightId) || MOCK_FLIGHTS[0];
  }, [flightId]);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passport, setPassport] = useState('');

  // Ticket count & baggage
  const [tickets, setTickets] = useState(1);
  const [baggageOption, setBaggageOption] = useState<'none' | '15kg' | '23kg'>('none');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay');

  // Gateway Simulation State
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const baggagePrice = useMemo(() => {
    if (baggageOption === '15kg') return 250000;
    if (baggageOption === '23kg') return 400000;
    return 0;
  }, [baggageOption]);

  // Pricing calculations
  const basePrice = flight.price;
  const tax = Math.round(basePrice * 0.1);
  const fareTotal = (basePrice + tax) * tickets;
  const baggageTotal = baggagePrice * tickets;
  const grandTotal = fareTotal + baggageTotal;

  const handlePayment = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !passport.trim()) {
      Alert.alert(
        lang === 'vi' ? 'Thiếu thông tin' : 'Missing Information',
        lang === 'vi' 
          ? 'Vui lòng nhập đầy đủ Họ tên, Số điện thoại, Email và CCCD/Hộ chiếu để tiến hành thanh toán!' 
          : 'Please enter all details including name, phone, email, and passport/ID to check out!'
      );
      return;
    }

    if (paymentMethod === 'bank_transfer') {
      // Direct transfer completes with info alert
      Alert.alert(
        lang === 'vi' ? 'Yêu cầu đặt chỗ đã được tiếp nhận! 🔔' : 'Booking Request Received! 🔔',
        lang === 'vi'
          ? `Vui lòng chuyển khoản đúng số tiền ${formatPrice(grandTotal)} với nội dung chuyển khoản để hoàn tất xác thực đặt vé của bạn.`
          : `Please complete the transfer of ${formatPrice(grandTotal)} with the specified content to verify your flight booking.`,
        [
          {
            text: lang === 'vi' ? 'Tôi đã chuyển khoản' : 'I have transferred',
            onPress: () => {
              showSnackbar(lang === 'vi' ? 'Đang xác thực giao dịch chuyển khoản...' : 'Verifying bank transfer transaction...');
              router.replace('/(tabs)');
            }
          }
        ]
      );
      return;
    }

    // MoMo or VNPAY simulation
    setProcessingStatus(
      paymentMethod === 'momo' 
        ? (lang === 'vi' ? 'Đang mở liên kết ví MoMo...' : 'Connecting to MoMo wallet...')
        : (lang === 'vi' ? 'Đang chuyển hướng cổng VNPAY...' : 'Connecting to VNPAY gateway...')
    );
    setPaymentProcessing(true);

    setTimeout(() => {
      setProcessingStatus(lang === 'vi' ? 'Đang xử lý giao dịch thanh toán...' : 'Processing transaction...');
      
      setTimeout(() => {
        setProcessingStatus(lang === 'vi' ? 'Thanh toán thành công! 🎉' : 'Payment successful! 🎉');
        
        setTimeout(() => {
          setPaymentProcessing(false);
          Alert.alert(
            lang === 'vi' ? 'Đặt vé thành công! ✈️' : 'Booking Successful! ✈️',
            lang === 'vi'
              ? `Cảm ơn ${name} đã đặt vé. Mã vé điện tử sẽ được gửi qua email ${email} trong vài phút.`
              : `Thank you ${name} for booking. Your e-ticket details will be sent to ${email} shortly.`,
            [
              {
                text: lang === 'vi' ? 'Về trang chủ' : 'Back to Home',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        }, 1000);
      }, 1500);
    }, 1200);
  };

  const airlineColor = flight.outbound.airline.code === 'VN' ? '#C41E3A' : flight.outbound.airline.code === 'VJ' ? '#FDB913' : '#003087';

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#0F172A' }]}>
      {/* Header */}
      <View style={[styles.header, isDark && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#FFFFFF' }]}>
          {lang === 'vi' ? 'Xác nhận đặt vé' : 'Flight Checkout'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Flight summary card */}
        <View style={[styles.card, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.airlineLogo, { backgroundColor: airlineColor }]}>
                <Text style={styles.airlineLogoText}>{flight.outbound.airline.code}</Text>
              </View>
              <View>
                <Text style={[styles.airlineName, isDark && { color: '#FFFFFF' }]}>
                  {flight.outbound.airline.name}
                </Text>
                <Text style={[styles.flightNum, isDark && { color: '#94A3B8' }]}>
                  {flight.outbound.flightNumber} • {flight.outbound.aircraft}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: airlineColor + '15' }]}>
              <Text style={[styles.statusText, { color: airlineColor }]}>
                {lang === 'vi' ? 'Mới' : 'New'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Departure -> Arrival Row */}
          <View style={styles.routeRow}>
            <View style={styles.routeEndpoint}>
              <Text style={[styles.routeTime, isDark && { color: '#FFFFFF' }]}>
                {flight.outbound.departureTime.substring(11, 16)}
              </Text>
              <Text style={[styles.routeCode, { color: airlineColor }]}>{flight.outbound.departureAirport}</Text>
              <Text style={[styles.routeCity, isDark && { color: '#94A3B8' }]}>{flight.departureCity}</Text>
            </View>

            <View style={styles.routeCenter}>
              <Text style={[styles.routeDuration, isDark && { color: '#94A3B8' }]}>{flight.outbound.duration}</Text>
              <Ionicons name="airplane" size={16} color={isDark ? '#64748B' : '#94A3B8'} style={{ transform: [{ rotate: '90deg' }] }} />
              <Text style={[styles.stopsLabel, isDark && { color: '#94A3B8' }]}>
                {flight.outbound.stops === 0 ? (lang === 'vi' ? 'Bay thẳng' : 'Direct') : `${flight.outbound.stops} stops`}
              </Text>
            </View>

            <View style={[styles.routeEndpoint, { alignItems: 'flex-end' }]}>
              <Text style={[styles.routeTime, isDark && { color: '#FFFFFF' }]}>
                {flight.outbound.arrivalTime.substring(11, 16)}
              </Text>
              <Text style={[styles.routeCode, { color: airlineColor }]}>{flight.outbound.arrivalAirport}</Text>
              <Text style={[styles.routeCity, isDark && { color: '#94A3B8' }]}>{flight.arrivalCity}</Text>
            </View>
          </View>
        </View>

        {/* Contact Info Form */}
        <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
          {lang === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
        </Text>

        <View style={[styles.inputWrapper, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder={lang === 'vi' ? 'Họ và tên hành khách' : 'Passenger Full Name'}
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            style={[styles.inputField, isDark && { color: '#FFFFFF' }]}
          />
        </View>

        <View style={[styles.inputWrapper, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Ionicons name="call-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder={lang === 'vi' ? 'Số điện thoại liên lạc' : 'Phone Number'}
            placeholderTextColor="#94A3B8"
            value={phone}
            onChangeText={phoneText => setPhone(phoneText.replace(/\D/g, ''))}
            keyboardType="phone-pad"
            style={[styles.inputField, isDark && { color: '#FFFFFF' }]}
          />
        </View>

        <View style={[styles.inputWrapper, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.inputField, isDark && { color: '#FFFFFF' }]}
          />
        </View>

        <View style={[styles.inputWrapper, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Ionicons name="card-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            placeholder={lang === 'vi' ? 'Số CCCD / Hộ chiếu' : 'ID card / Passport Number'}
            placeholderTextColor="#94A3B8"
            value={passport}
            onChangeText={setPassport}
            style={[styles.inputField, isDark && { color: '#FFFFFF' }]}
          />
        </View>

        {/* Baggage selector */}
        <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
          {lang === 'vi' ? 'Hành lý ký gửi thêm' : 'Add-on Checked Baggage'}
        </Text>
        <View style={styles.baggageContainer}>
          {[
            { key: 'none', label: lang === 'vi' ? 'Không mua thêm' : 'None', price: 0 },
            { key: '15kg', label: '+ 15 kg', price: 250000 },
            { key: '23kg', label: '+ 23 kg', price: 400000 },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              onPress={() => setBaggageOption(item.key as any)}
              style={[
                styles.baggageChip,
                isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
                baggageOption === item.key && { borderColor: '#FF5B22', backgroundColor: '#FFF5F0' },
                isDark && baggageOption === item.key && { backgroundColor: '#3B2016' },
              ]}
            >
              <Text style={[styles.baggageLabel, isDark && { color: '#FFFFFF' }, baggageOption === item.key && { color: '#FF5B22' }]}>
                {item.label}
              </Text>
              <Text style={[styles.baggagePrice, isDark && { color: '#94A3B8' }, baggageOption === item.key && { color: '#FF5B22', fontWeight: '700' }]}>
                {item.price === 0 ? (lang === 'vi' ? 'Miễn phí' : 'Free') : `+ ${formatPrice(item.price)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tickets Selector */}
        <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
          {lang === 'vi' ? 'Số lượng hành khách' : 'Number of Passengers'}
        </Text>
        <View style={[styles.counterRow, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Text style={[styles.counterLabel, isDark && { color: '#FFFFFF' }]}>
            {lang === 'vi' ? 'Vé hành khách' : 'Passenger tickets'}
          </Text>
          <View style={styles.counterControl}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setTickets(Math.max(1, tickets - 1))}
            >
              <Ionicons name="remove" size={18} color="#0F172A" />
            </TouchableOpacity>
            <Text style={[styles.counterVal, isDark && { color: '#FFFFFF' }]}>{tickets}</Text>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setTickets(tickets + 1)}
            >
              <Ionicons name="add" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods Section */}
        <Text style={[styles.sectionTitle, isDark && { color: '#FFFFFF' }]}>
          {lang === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}
        </Text>
        <View style={styles.paymentContainer}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              paymentMethod === 'vnpay' && { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
              isDark && paymentMethod === 'vnpay' && { backgroundColor: '#172554' },
            ]}
            onPress={() => setPaymentMethod('vnpay')}
          >
            <Ionicons name="card-outline" size={22} color={paymentMethod === 'vnpay' ? '#2563EB' : '#64748B'} />
            <Text style={[styles.paymentText, isDark && { color: '#FFFFFF' }, paymentMethod === 'vnpay' && { color: '#2563EB', fontWeight: '700' }]}>
              {lang === 'vi' ? 'Cổng thanh toán VNPAY' : 'VNPAY Gateway'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              paymentMethod === 'momo' && { borderColor: '#D01770', backgroundColor: '#FDF2F8' },
              isDark && paymentMethod === 'momo' && { backgroundColor: '#50072B' },
            ]}
            onPress={() => setPaymentMethod('momo')}
          >
            <Ionicons name="wallet-outline" size={22} color={paymentMethod === 'momo' ? '#D01770' : '#64748B'} />
            <Text style={[styles.paymentText, isDark && { color: '#FFFFFF' }, paymentMethod === 'momo' && { color: '#D01770', fontWeight: '700' }]}>
              {lang === 'vi' ? 'Ví điện tử MoMo' : 'MoMo Wallet'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              isDark && { backgroundColor: '#1E293B', borderColor: '#334155' },
              paymentMethod === 'bank_transfer' && { borderColor: '#FF5B22', backgroundColor: '#FFF5F0' },
              isDark && paymentMethod === 'bank_transfer' && { backgroundColor: '#3B2016' },
            ]}
            onPress={() => setPaymentMethod('bank_transfer')}
          >
            <Ionicons name="business-outline" size={22} color={paymentMethod === 'bank_transfer' ? '#FF5B22' : '#64748B'} />
            <Text style={[styles.paymentText, isDark && { color: '#FFFFFF' }, paymentMethod === 'bank_transfer' && { color: '#FF5B22', fontWeight: '700' }]}>
              {lang === 'vi' ? 'Chuyển khoản ngân hàng' : 'Bank Transfer'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bank Transfer Details Box */}
        {paymentMethod === 'bank_transfer' && (
          <View style={[styles.bankDetailsCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Ionicons name="information-circle-outline" size={18} color="#FF5B22" />
              <Text style={styles.bankTitle}>
                {lang === 'vi' ? 'Thông tin chuyển khoản' : 'Transfer Details'}
              </Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={[styles.bankLabel, isDark && { color: '#94A3B8' }]}>{lang === 'vi' ? 'Ngân hàng:' : 'Bank:'}</Text>
              <Text style={[styles.bankVal, isDark && { color: '#FFFFFF' }]}>MB Bank (Ngân hàng Quân Đội)</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={[styles.bankLabel, isDark && { color: '#94A3B8' }]}>{lang === 'vi' ? 'Số tài khoản:' : 'Account No:'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.bankVal, { fontWeight: '900', color: '#FF5B22' }]}>12345678901</Text>
                <TouchableOpacity onPress={() => showSnackbar(lang === 'vi' ? 'Đã sao chép STK!' : 'Copied account no!')}>
                  <Ionicons name="copy-outline" size={14} color="#FF5B22" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bankRow}>
              <Text style={[styles.bankLabel, isDark && { color: '#94A3B8' }]}>{lang === 'vi' ? 'Chủ tài khoản:' : 'Holder Name:'}</Text>
              <Text style={[styles.bankVal, isDark && { color: '#FFFFFF' }]}>TRAVELVIET JOINT STOCK COMPANY</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={[styles.bankLabel, isDark && { color: '#94A3B8' }]}>{lang === 'vi' ? 'Nội dung CK:' : 'Message:'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.bankVal, { fontWeight: '700', color: '#10B981' }]}>
                  TVFLIGHT {flight.outbound.flightNumber} {phone || 'SĐT'}
                </Text>
                <TouchableOpacity onPress={() => showSnackbar(lang === 'vi' ? 'Đã sao chép nội dung!' : 'Copied content!')}>
                  <Ionicons name="copy-outline" size={14} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={[styles.breakdownCard, isDark && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
          <Text style={[styles.breakdownTitle, isDark && { color: '#FFFFFF' }]}>
            {lang === 'vi' ? 'Chi tiết giá cả' : 'Price Summary'}
          </Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{lang === 'vi' ? 'Giá vé' : 'Base ticket fare'} x{tickets}</Text>
            <Text style={[styles.breakdownVal, isDark && { color: '#FFFFFF' }]}>{formatPrice(basePrice * tickets)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{lang === 'vi' ? 'Thuế và Phí' : 'Taxes & Fees'} x{tickets}</Text>
            <Text style={[styles.breakdownVal, isDark && { color: '#FFFFFF' }]}>{formatPrice(tax * tickets)}</Text>
          </View>
          {baggagePrice > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{lang === 'vi' ? 'Hành lý thêm' : 'Add-on baggage'} x{tickets}</Text>
              <Text style={[styles.breakdownVal, isDark && { color: '#FFFFFF' }]}>{formatPrice(baggageTotal)}</Text>
            </View>
          )}
          <View style={[styles.divider, { marginVertical: 8 }]} />
          <View style={styles.breakdownRow}>
            <Text style={[styles.totalLabelText, isDark && { color: '#FFFFFF' }]}>
              {lang === 'vi' ? 'Tổng cộng thanh toán' : 'Grand Total'}
            </Text>
            <Text style={styles.totalPriceVal}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, isDark && { backgroundColor: '#1E293B', borderTopColor: '#334155' }, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          <Text style={[styles.bottomLabel, isDark && { color: '#94A3B8' }]}>
            {lang === 'vi' ? 'Tổng tiền' : 'Total Price'}
          </Text>
          <Text style={styles.bottomPrice}>{formatPrice(grandTotal)}</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.85}
          onPress={handlePayment}
        >
          <Text style={styles.payBtnText}>
            {lang === 'vi' ? 'Thanh Toán Ngay' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gateway Simulation Modal */}
      <Modal visible={paymentProcessing} transparent animationType="fade">
        <View style={styles.gatewayBackdrop}>
          <View style={[styles.gatewayCard, isDark && { backgroundColor: '#1E293B' }]}>
            <ActivityIndicator size="large" color="#FF5B22" style={{ marginBottom: 18 }} />
            <Text style={[styles.gatewayText, isDark && { color: '#FFFFFF' }]}>
              {processingStatus}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airlineLogoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  airlineName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  flightNum: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeEndpoint: {
    flex: 1,
    gap: 2,
  },
  routeTime: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  routeCode: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  routeCity: {
    fontSize: 11,
    color: '#64748B',
  },
  routeCenter: {
    flex: 1.2,
    alignItems: 'center',
    gap: 4,
  },
  routeDuration: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  stopsLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  baggageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  baggageChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  baggageLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  baggagePrice: {
    fontSize: 11,
    color: '#64748B',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  counterLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentContainer: {
    gap: 10,
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  bankDetailsCard: {
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#FFD8C9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5B22',
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  bankLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  bankVal: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  breakdownVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  totalLabelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalPriceVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF5B22',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  bottomLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF5B22',
    marginTop: 2,
  },
  payBtn: {
    backgroundColor: '#FF5B22',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gatewayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gatewayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  gatewayText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
});
