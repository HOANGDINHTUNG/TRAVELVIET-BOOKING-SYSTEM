import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useAppSettings } from '@/providers/AppSettingsProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────

interface Vehicle {
  id: string;
  name: string;
  category: 'car' | 'motorbike';
  image: string;
  type: string; // Automatic, Manual, Electric, etc.
  engine: string; // 125cc, 150cc, 7 seats, etc.
  pricePerDay: number;
  rating: string;
  reviews: number;
  inclusions: string[];
  requirements: string;
  deposit: string;
  owner: string;
}

const VEHICLES: Vehicle[] = [
  // Motorbikes
  {
    id: 'm1',
    name: 'Honda Vision 2024',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400', // Mock bike image
    type: 'Xe tay ga (Auto)',
    engine: '110cc',
    pricePerDay: 130000,
    rating: '4.8',
    reviews: 56,
    inclusions: ['2 Mũ bảo hiểm', '2 Áo mưa', 'Giá đỡ điện thoại'],
    requirements: 'Bằng lái xe A1 trở lên',
    deposit: 'Để lại CCCD/Hộ chiếu hoặc đặt cọc 1.000.000đ',
    owner: 'Thuê xe máy Phú Quốc 247',
  },
  {
    id: 'm2',
    name: 'Honda AirBlade 2024',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400',
    type: 'Xe tay ga (Auto)',
    engine: '125cc',
    pricePerDay: 160000,
    rating: '4.9',
    reviews: 78,
    inclusions: ['2 Mũ bảo hiểm', '2 Áo mưa', 'Đầy bình xăng'],
    requirements: 'Bằng lái xe A1 trở lên',
    deposit: 'Để lại CCCD/Hộ chiếu hoặc đặt cọc 2.000.000đ',
    owner: 'Motorbike Rental Đà Nẵng',
  },
  {
    id: 'm3',
    name: 'Honda Wave Alpha',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400',
    type: 'Xe số (Manual)',
    engine: '110cc',
    pricePerDay: 100000,
    rating: '4.7',
    reviews: 42,
    inclusions: ['2 Mũ bảo hiểm', '2 Áo mưa', 'Bản đồ du lịch địa phương'],
    requirements: 'Bằng lái xe A1 trở lên',
    deposit: 'Để lại CCCD/Hộ chiếu hoặc đặt cọc 1.000.000đ',
    owner: 'Thuê xe máy Sa Pa Adventure',
  },
  {
    id: 'm4',
    name: 'Yamaha Grande Hybrid',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=400',
    type: 'Xe tay ga (Auto)',
    engine: '125cc',
    pricePerDay: 180000,
    rating: '4.9',
    reviews: 35,
    inclusions: ['2 Mũ bảo hiểm', '2 Áo mưa', 'Giá đỡ điện thoại', 'Xăng ban đầu'],
    requirements: 'Bằng lái xe A1 trở lên',
    deposit: 'Để lại CCCD/Hộ chiếu hoặc đặt cọc 2.000.000đ',
    owner: 'EcoRent Đà Lạt',
  },

  // Cars
  {
    id: 'c1',
    name: 'Mitsubishi Xpander 2024',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400', // Mock car
    type: 'Số tự động (Auto)',
    engine: '7 Chỗ ngồi',
    pricePerDay: 800000,
    rating: '4.9',
    reviews: 120,
    inclusions: ['Bản đồ GPS', 'Cáp sạc USB', 'Bảo hiểm dân sự bắt buộc'],
    requirements: 'Bằng lái xe B1/B2 trở lên',
    deposit: 'Đặt cọc 5.000.000đ hoặc giữ xe máy+cavet chính chủ',
    owner: 'Nhà xe du lịch Đà Nẵng Group',
  },
  {
    id: 'c2',
    name: 'VinFast VF8 (Electric)',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=400',
    type: 'Xe điện (Electric)',
    engine: '5 Chỗ ngồi',
    pricePerDay: 1200000,
    rating: '4.9',
    reviews: 95,
    inclusions: ['Bản đồ GPS', 'Cáp sạc USB', 'Tích hợp bản đồ trạm sạc', 'CDW bảo hiểm thân vỏ'],
    requirements: 'Bằng lái xe B1/B2 trở lên',
    deposit: 'Đặt cọc 10.000.000đ hoặc để lại xe máy giá trị tương đương',
    owner: 'GreenCar Rental Phú Quốc',
  },
  {
    id: 'c3',
    name: 'Toyota Vios 2023',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400',
    type: 'Số tự động (Auto)',
    engine: '5 Chỗ ngồi',
    pricePerDay: 700000,
    rating: '4.7',
    reviews: 84,
    inclusions: ['Bản đồ GPS', 'Nước suối miễn phí', 'Khăn lạnh'],
    requirements: 'Bằng lái xe B1/B2 trở lên',
    deposit: 'Đặt cọc 5.000.000đ hoặc CMTND + cavet xe máy',
    owner: 'Thuê xe tự lái Nha Trang Hub',
  },
];

const LOCATIONS = ['Phú Quốc', 'Đà Nẵng', 'Nha Trang', 'Đà Lạt', 'Sa Pa', 'Hà Nội', 'TP. Hồ Chí Minh'];

export default function TransportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const { theme, language, formatPrice } = useAppSettings();
  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';

  // State wizard
  // 'list' | 'detail' | 'checkout' | 'processing' | 'success'
  const [step, setStep] = useState<'list' | 'checkout' | 'processing' | 'success'>('list');

  // Filter States
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[1]); // Da Nang
  const [vehicleCategory, setVehicleCategory] = useState<'car' | 'motorbike'>('motorbike');
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDetailVisible, setVehicleDetailVisible] = useState(false);

  // Form States
  const [renterName, setRenterName] = useState('Nguyễn Văn Rio');
  const [renterPhone, setRenterPhone] = useState('0987654321');
  const [renterEmail, setRenterEmail] = useState('rio.traveler@gmail.com');
  const [renterLicense, setRenterLicense] = useState('079095012345'); // CCCD or Driver License
  const [deliveryAddress, setDeliveryAddress] = useState('Khách sạn Novotel Bạch Đằng, Đà Nẵng');
  const [pickupTime, setPickupTime] = useState('08:00');
  const [rentalDays, setRentalDays] = useState(2);

  // CDW Insurance selection
  const [cdwSelected, setCdwSelected] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'bank'>('vnpay');

  // Filter & Search Vehicles
  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchCategory = v.category === vehicleCategory;
      const matchQuery =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [vehicleCategory, searchQuery]);

  // Calculations
  const baseRentalFee = selectedVehicle ? selectedVehicle.pricePerDay * rentalDays : 0;
  const deliveryFee = vehicleCategory === 'car' ? 100000 : 30000;
  const cdwFee = cdwSelected ? (vehicleCategory === 'car' ? 100000 : 20000) * rentalDays : 0;
  const discountAmount = 50000; // Promo discount
  const finalTotal = baseRentalFee + deliveryFee + cdwFee - discountAmount;

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleDetailVisible(true);
  };

  const handleProceedToCheckout = () => {
    setVehicleDetailVisible(false);
    setStep('checkout');
  };

  const handlePaymentSubmit = () => {
    if (!renterName.trim() || !renterPhone.trim() || !renterEmail.trim() || !renterLicense.trim() || !deliveryAddress.trim()) {
      showSnackbar(lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin!' : 'Please fill all required details!');
      return;
    }
    setStep('processing');
    
    // Simulate gateway delay
    setTimeout(() => {
      setStep('success');
      showSnackbar(lang === 'vi' ? 'Thanh toán thành công!' : 'Payment authorized successfully!');
    }, 3000);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* ─── HEADER ───────────────────────────────────────────────────────────── */}
      {step !== 'success' && (
        <View style={[styles.header, { paddingTop: insets.top || 12 }, isDark && styles.headerDark]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step === 'checkout') setStep('list');
              else router.back();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, isDark && styles.textDark]}>
            {step === 'list' && (lang === 'vi' ? 'Thuê Xe Du Lịch' : 'Transport Rental')}
            {step === 'checkout' && (lang === 'vi' ? 'Xác Nhận Đặt Xe' : 'Checkout Rental')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      {/* ─── SCREEN FLOW ─────────────────────────────────────────────────────── */}

      {step === 'list' && (
        <View style={{ flex: 1 }}>
          {/* Quick Filters */}
          <View style={[styles.filterBar, isDark && styles.filterBarDark]}>
            {/* Location Selector */}
            <View style={styles.locationDropdown}>
              <Ionicons name="location" size={16} color="#FF5B22" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locScroll}>
                {LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    onPress={() => setSelectedLocation(loc)}
                    style={[styles.locChip, selectedLocation === loc && styles.locChipActive]}
                  >
                    <Text style={[styles.locChipText, selectedLocation === loc && styles.locChipTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryTabRow}>
              <TouchableOpacity
                onPress={() => setVehicleCategory('motorbike')}
                style={[styles.catTab, vehicleCategory === 'motorbike' && styles.catTabActive]}
              >
                <Ionicons name="bicycle" size={16} color={vehicleCategory === 'motorbike' ? '#FFFFFF' : '#FF5B22'} />
                <Text style={[styles.catTabText, vehicleCategory === 'motorbike' && styles.catTabTextActive]}>
                  {lang === 'vi' ? 'Xe máy' : 'Motorbike'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setVehicleCategory('car')}
                style={[styles.catTab, vehicleCategory === 'car' && styles.catTabActive]}
              >
                <Ionicons name="car" size={16} color={vehicleCategory === 'car' ? '#FFFFFF' : '#FF5B22'} />
                <Text style={[styles.catTabText, vehicleCategory === 'car' && styles.catTabTextActive]}>
                  {lang === 'vi' ? 'Ô tô tự lái' : 'Car Rental'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={[styles.searchBox, isDark && styles.searchBoxDark]}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                placeholder={lang === 'vi' ? 'Tìm tên xe, nhà xe...' : 'Search model, shop...'}
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, isDark && { color: '#FFFFFF' }]}
              />
            </View>
          </View>

          {/* Listings List */}
          <ScrollView contentContainerStyle={styles.listingScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.listingSectionHeader}>
              <Text style={[styles.listingSectionTitle, isDark && styles.textDark]}>
                Xe có sẵn tại {selectedLocation}
              </Text>
              <Text style={styles.listingCount}>({filteredVehicles.length} xe)</Text>
            </View>

            {filteredVehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                activeOpacity={0.9}
                style={[styles.vehicleCard, isDark && styles.vehicleCardDark]}
                onPress={() => handleVehicleSelect(vehicle)}
              >
                <Image source={{ uri: vehicle.image }} style={styles.vehicleImg} />
                
                <View style={styles.vehicleInfo}>
                  <View style={styles.vehicleHeaderRow}>
                    <Text style={[styles.vehicleName, isDark && styles.textDark]}>{vehicle.name}</Text>
                    <View style={styles.vehicleRatingRow}>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={[styles.vehicleRatingText, isDark && styles.textDark]}>{vehicle.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.vehicleOwner}>{vehicle.owner}</Text>

                  {/* Specs Chips */}
                  <View style={styles.specsRow}>
                    <View style={styles.specBadge}>
                      <Text style={styles.specBadgeText}>{vehicle.type}</Text>
                    </View>
                    <View style={styles.specBadge}>
                      <Text style={styles.specBadgeText}>{vehicle.engine}</Text>
                    </View>
                  </View>

                  {/* Pricing and Book Button */}
                  <View style={styles.vehicleFooter}>
                    <View>
                      <Text style={styles.priceLabel}>{lang === 'vi' ? 'Giá theo ngày' : 'Daily rate'}</Text>
                      <Text style={styles.priceValue}>{formatPrice(vehicle.pricePerDay)}/ngày</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.bookBtn}
                      activeOpacity={0.8}
                      onPress={() => handleVehicleSelect(vehicle)}
                    >
                      <Text style={styles.bookBtnText}>{lang === 'vi' ? 'Đặt ngay' : 'Select'}</Text>
                      <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {filteredVehicles.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="car-outline" size={48} color="#94A3B8" />
                <Text style={styles.emptyText}>
                  {lang === 'vi' ? 'Không có xe nào phù hợp bộ lọc.' : 'No vehicles match the filters.'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {step === 'checkout' && selectedVehicle && (
        <ScrollView contentContainerStyle={styles.checkoutScroll} showsVerticalScrollIndicator={false}>
          {/* Vehicle Booking Summary */}
          <View style={[styles.summaryCard, isDark && styles.cardDark]}>
            <Image source={{ uri: selectedVehicle.image }} style={styles.summaryThumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.summaryName, isDark && styles.textDark]}>{selectedVehicle.name}</Text>
              <Text style={styles.summaryOwner}>{selectedVehicle.owner}</Text>
              <View style={styles.summarySpecs}>
                <Text style={styles.summarySpecText}>{selectedVehicle.type} • {selectedVehicle.engine}</Text>
              </View>
              <Text style={styles.summaryPrice}>{formatPrice(selectedVehicle.pricePerDay)}/ngày</Text>
            </View>
          </View>

          {/* Renter Form */}
          <View style={[styles.formCard, isDark && styles.cardDark]}>
            <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
              Thông tin người thuê xe
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Họ và tên người thuê *</Text>
              <TextInput
                style={[styles.formInput, isDark && styles.formInputDark]}
                value={renterName}
                onChangeText={setRenterName}
                placeholder="Nhập họ và tên..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Số điện thoại *</Text>
                <TextInput
                  style={[styles.formInput, isDark && styles.formInputDark]}
                  value={renterPhone}
                  onChangeText={setRenterPhone}
                  keyboardType="phone-pad"
                  placeholder="Số điện thoại..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>CCCD / Hộ chiếu *</Text>
                <TextInput
                  style={[styles.formInput, isDark && styles.formInputDark]}
                  value={renterLicense}
                  onChangeText={setRenterLicense}
                  placeholder="Số định danh..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email nhận thông tin đặt xe *</Text>
              <TextInput
                style={[styles.formInput, isDark && styles.formInputDark]}
                value={renterEmail}
                onChangeText={setRenterEmail}
                keyboardType="email-address"
                placeholder="Email..."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Delivery & Time Form */}
          <View style={[styles.formCard, isDark && styles.cardDark]}>
            <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
              Địa điểm & Thời gian giao nhận xe
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Địa chỉ giao xe (Khách sạn/Sân bay/Cửa hàng) *</Text>
              <TextInput
                style={[styles.formInput, isDark && styles.formInputDark]}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Nhập địa chỉ giao xe tận nơi..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Giờ giao xe *</Text>
                <TextInput
                  style={[styles.formInput, isDark && styles.formInputDark]}
                  value={pickupTime}
                  onChangeText={setPickupTime}
                  placeholder="Ví dụ: 08:00..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Số ngày thuê xe *</Text>
                <View style={styles.daysCounter}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setRentalDays(Math.max(1, rentalDays - 1))}
                  >
                    <Ionicons name="remove" size={16} color="#0F172A" />
                  </TouchableOpacity>
                  <Text style={[styles.counterVal, isDark && styles.textDark]}>{rentalDays} ngày</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setRentalDays(rentalDays + 1)}
                  >
                    <Ionicons name="add" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Add-ons & Deposit Policy */}
          <View style={[styles.formCard, isDark && styles.cardDark]}>
            <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
              Dịch vụ tùy chọn & Chính sách cọc
            </Text>
            
            {/* CDW Insurance Option */}
            <TouchableOpacity
              style={[styles.addonRow, cdwSelected && styles.addonRowActive]}
              activeOpacity={0.8}
              onPress={() => setCdwSelected(!cdwSelected)}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.addonTitle, isDark && styles.textDark]}>
                  Bảo hiểm thân vỏ & tai nạn tự nguyện (CDW)
                </Text>
                <Text style={styles.addonSub}>
                  {selectedVehicle.category === 'car'
                    ? 'Hỗ trợ chi trả thiệt hại va quẹt lên tới 90% chi phí sửa chữa'
                    : 'Miễn trừ đền bù hư hỏng thân vỏ xe khi xảy ra va chạm'}
                </Text>
              </View>
              <View style={styles.addonRight}>
                <Text style={styles.addonPrice}>
                  +{selectedVehicle.category === 'car' ? '100.000đ' : '20.000đ'}/ngày
                </Text>
                <Ionicons
                  name={cdwSelected ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={cdwSelected ? '#FF5B22' : '#94A3B8'}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.policyNotice}>
              <Ionicons name="information-circle-outline" size={18} color="#FF702A" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.policyTitle}>Chính sách đặt cọc của nhà xe:</Text>
                <Text style={styles.policyContent}>{selectedVehicle.deposit}</Text>
              </View>
            </View>
          </View>

          {/* Cost breakdown */}
          <View style={[styles.formCard, isDark && styles.cardDark]}>
            <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
              Chi tiết giá thanh toán
            </Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Giá thuê xe ({rentalDays} ngày)</Text>
              <Text style={[styles.priceRowValue, isDark && styles.textDark]}>
                {formatPrice(baseRentalFee)}
              </Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Phí giao nhận xe tận nơi</Text>
              <Text style={[styles.priceRowValue, isDark && styles.textDark]}>
                {formatPrice(deliveryFee)}
              </Text>
            </View>
            
            {cdwSelected && (
              <View style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>Bảo hiểm CDW tự nguyện</Text>
                <Text style={[styles.priceRowValue, isDark && styles.textDark]}>
                  {formatPrice(cdwFee)}
                </Text>
              </View>
            )}

            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Khuyến mãi thành viên</Text>
              <Text style={[styles.priceRowValue, { color: '#34C759' }]}>
                -{formatPrice(discountAmount)}
              </Text>
            </View>

            <View style={styles.priceDivider} />
            
            <View style={styles.priceRowTotal}>
              <Text style={styles.priceTotalLabel}>Tổng số tiền thanh toán</Text>
              <Text style={styles.priceTotalValue}>{formatPrice(finalTotal)}</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <View style={[styles.formCard, isDark && styles.cardDark]}>
            <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
              Chọn phương thức thanh toán
            </Text>
            
            {/* VNPAY */}
            <TouchableOpacity
              style={[styles.paymentMethodOption, paymentMethod === 'vnpay' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('vnpay')}
            >
              <Ionicons name="card" size={20} color={paymentMethod === 'vnpay' ? '#FF5B22' : '#94A3B8'} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.paymentMethodTitle, isDark && styles.textDark]}>Cổng thanh toán VNPAY (Thẻ ATM/QR Code)</Text>
                <Text style={styles.paymentMethodSub}>Khuyên dùng - Xử lý ngay lập tức</Text>
              </View>
              <Ionicons name={paymentMethod === 'vnpay' ? 'radio-button-on' : 'radio-button-off'} size={20} color={paymentMethod === 'vnpay' ? '#FF5B22' : '#94A3B8'} />
            </TouchableOpacity>

            {/* MOMO */}
            <TouchableOpacity
              style={[styles.paymentMethodOption, paymentMethod === 'momo' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('momo')}
            >
              <Ionicons name="wallet" size={20} color={paymentMethod === 'momo' ? '#FF5B22' : '#94A3B8'} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.paymentMethodTitle, isDark && styles.textDark]}>Ví điện tử MoMo</Text>
                <Text style={styles.paymentMethodSub}>Tiện lợi, an toàn</Text>
              </View>
              <Ionicons name={paymentMethod === 'momo' ? 'radio-button-on' : 'radio-button-off'} size={20} color={paymentMethod === 'momo' ? '#FF5B22' : '#94A3B8'} />
            </TouchableOpacity>

            {/* Bank Transfer */}
            <TouchableOpacity
              style={[styles.paymentMethodOption, paymentMethod === 'bank' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('bank')}
            >
              <Ionicons name="business" size={20} color={paymentMethod === 'bank' ? '#FF5B22' : '#94A3B8'} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.paymentMethodTitle, isDark && styles.textDark]}>Chuyển khoản ngân hàng</Text>
                <Text style={styles.paymentMethodSub}>Thủ công - Cần đối soát giao dịch</Text>
              </View>
              <Ionicons name={paymentMethod === 'bank' ? 'radio-button-on' : 'radio-button-off'} size={20} color={paymentMethod === 'bank' ? '#FF5B22' : '#94A3B8'} />
            </TouchableOpacity>
          </View>

          {/* Action CTA */}
          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={handlePaymentSubmit}
            activeOpacity={0.88}
          >
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.payNowBtnText}>Xác nhận & Thanh toán ngay</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 'processing' && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FF5B22" />
          <Text style={styles.processingTitle}>Đang kết nối cổng thanh toán...</Text>
          <Text style={styles.processingSub}>Vui lòng không tắt ứng dụng hoặc chuyển hướng màn hình.</Text>
        </View>
      )}

      {step === 'success' && selectedVehicle && (
        <LinearGradient
          colors={['#FF5B22', '#E04A15']}
          style={[styles.successContainer, { paddingTop: insets.top || 16 }]}
        >
          {/* Custom Success Header Row */}
          <View style={styles.successHeaderRow}>
            <TouchableOpacity
              style={styles.successHeaderBtn}
              onPress={() => setStep('checkout')}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.successHeaderTitle}>
              {lang === 'vi' ? 'Thanh Toán Thành Công' : 'Payment Success'}
            </Text>
            
            <TouchableOpacity
              style={styles.successHeaderBtn}
              onPress={() => {
                showSnackbar(lang === 'vi' ? 'Đang chuẩn bị chia sẻ...' : 'Preparing to share...');
                Alert.alert(
                  lang === 'vi' ? 'Chia sẻ hóa đơn 📲' : 'Share Receipt 📲',
                  lang === 'vi' ? 'Hóa đơn đã được lưu vào thư viện ảnh của bạn. Chia sẻ ngay?' : 'Receipt saved to your camera roll. Share now?',
                  [
                    { text: lang === 'vi' ? 'Hủy' : 'Cancel', style: 'cancel' },
                    { text: lang === 'vi' ? 'Chia sẻ' : 'Share', onPress: () => showSnackbar(lang === 'vi' ? 'Đã chia sẻ thành công!' : 'Shared successfully!') }
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.successScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.ticketCard}>
              {/* Header Stamp */}
              <View style={styles.ticketHeader}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.ticketTitle}>Đặt Xe Thành Công!</Text>
                <Text style={styles.ticketKicker}>MÃ ĐẶT XE: TV-TRP-{Math.floor(Math.random() * 90000) + 10000}</Text>
              </View>

              {/* QR Mock */}
              <View style={styles.qrSection}>
                <View style={styles.qrBox}>
                  <Ionicons name="qr-code" size={140} color="#0F172A" />
                </View>
                <Text style={styles.qrNotice}>Đưa mã này cho nhân viên giao xe để đối soát</Text>
              </View>

              <View style={styles.ticketDivider}>
                <View style={styles.ticketLeftCut} />
                <View style={styles.ticketDashedLine} />
                <View style={styles.ticketRightCut} />
              </View>

              {/* Details details */}
              <View style={styles.ticketDetails}>
                <Text style={styles.ticketSectionTitle}>Thông tin đặt xe</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Loại xe:</Text>
                  <Text style={styles.detailValue}>{selectedVehicle.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nhà xe đối tác:</Text>
                  <Text style={styles.detailValue}>{selectedVehicle.owner}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thời gian thuê:</Text>
                  <Text style={styles.detailValue}>{rentalDays} ngày ({pickupTime} hôm nay)</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Địa điểm nhận xe:</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>{deliveryAddress}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Họ tên tài xế:</Text>
                  <Text style={styles.detailValue}>{renterName} ({renterPhone})</Text>
                </View>

                <View style={[styles.detailRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                  <Text style={[styles.detailLabel, { fontWeight: '800', color: '#0F172A' }]}>Tổng tiền đã trả:</Text>
                  <Text style={[styles.detailValue, { fontWeight: '900', color: '#FF5B22', fontSize: 16 }]}>
                    {formatPrice(finalTotal)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Pickup Guidelines */}
            <View style={[styles.formCard, isDark && styles.cardDark, { marginTop: 16 }]}>
              <Text style={[styles.cardSectionTitle, isDark && styles.textDark]}>
                Hướng dẫn nhận xe an toàn
              </Text>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumCircle}><Text style={styles.stepNum}>1</Text></View>
                <Text style={[styles.stepGuideText, isDark && styles.textDark]}>
                  Chụp ảnh/quay phim hiện trạng xe (đặc biệt các vết trầy xước có sẵn) khi bàn giao.
                </Text>
              </View>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumCircle}><Text style={styles.stepNum}>2</Text></View>
                <Text style={[styles.stepGuideText, isDark && styles.textDark]}>
                  Kiểm tra xăng, phanh, đèn chiếu sáng trước khi khởi hành du ngoạn.
                </Text>
              </View>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumCircle}><Text style={styles.stepNum}>3</Text></View>
                <Text style={[styles.stepGuideText, isDark && styles.textDark]}>
                  Lưu lại số hotline hỗ trợ để được cứu hộ kỹ thuật 24/7 khi cần: <Text style={{ color: '#FF5B22', fontWeight: '800' }}>0366242457</Text>.
                </Text>
              </View>
            </View>

            {/* Back to main */}
            <TouchableOpacity
              style={styles.successHomeBtn}
              onPress={() => setStep('list')}
              activeOpacity={0.88}
            >
              <Text style={styles.successHomeBtnText}>Quay lại trang chính</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      )}

      {/* ─── VEHICLE DETAIL MODAL/DRAWER ─────────────────────────────────────── */}
      <Modal
        visible={vehicleDetailVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVehicleDetailVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerDismissZone} onPress={() => setVehicleDetailVisible(false)} />
          
          {selectedVehicle && (
            <View style={[styles.drawerContent, isDark && styles.cardDark]}>
              <View style={styles.drawerHeader}>
                <Text style={[styles.drawerTitle, isDark && styles.textDark]}>Chi tiết phương tiện</Text>
                <TouchableOpacity onPress={() => setVehicleDetailVisible(false)}>
                  <Ionicons name="close-circle" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedVehicle.image }} style={styles.drawerImg} />
                
                <View style={styles.drawerInfoRow}>
                  <Text style={[styles.drawerName, isDark && styles.textDark]}>{selectedVehicle.name}</Text>
                  <Text style={styles.drawerPrice}>{formatPrice(selectedVehicle.pricePerDay)}/ngày</Text>
                </View>

                <Text style={styles.drawerOwner}>Cung cấp bởi: {selectedVehicle.owner}</Text>

                <View style={styles.drawerSpecsGrid}>
                  <View style={[styles.drawerSpecItem, isDark && styles.drawerSpecItemDark]}>
                    <Ionicons name="settings" size={16} color="#FF5B22" />
                    <Text style={[styles.drawerSpecItemVal, isDark && styles.textDark]}>{selectedVehicle.type}</Text>
                  </View>
                  <View style={[styles.drawerSpecItem, isDark && styles.drawerSpecItemDark]}>
                    <Ionicons name="speedometer" size={16} color="#FF5B22" />
                    <Text style={[styles.drawerSpecItemVal, isDark && styles.textDark]}>{selectedVehicle.engine}</Text>
                  </View>
                  <View style={[styles.drawerSpecItem, isDark && styles.drawerSpecItemDark]}>
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={[styles.drawerSpecItemVal, isDark && styles.textDark]}>{selectedVehicle.rating} ({selectedVehicle.reviews} đánh giá)</Text>
                  </View>
                </View>

                {/* Inclusions */}
                <View style={styles.drawerSection}>
                  <Text style={[styles.drawerSectionTitle, isDark && styles.textDark]}>Thiết bị đi kèm miễn phí:</Text>
                  <View style={styles.inclusionsWrap}>
                    {selectedVehicle.inclusions.map((inc, i) => (
                      <View key={i} style={styles.inclusionBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#34C759" style={{ marginRight: 4 }} />
                        <Text style={styles.inclusionText}>{inc}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Requirements & policies */}
                <View style={styles.drawerSection}>
                  <Text style={[styles.drawerSectionTitle, isDark && styles.textDark]}>Yêu cầu khi nhận xe:</Text>
                  <View style={styles.requirementItem}>
                    <Ionicons name="card" size={14} color="#FF5B22" style={{ marginRight: 6, marginTop: 2 }} />
                    <Text style={[styles.requirementText, isDark && styles.textDark]}>{selectedVehicle.requirements}</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons name="wallet" size={14} color="#FF5B22" style={{ marginRight: 6, marginTop: 2 }} />
                    <Text style={[styles.requirementText, isDark && styles.textDark]}>{selectedVehicle.deposit}</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.payNowBtn}
                onPress={handleProceedToCheckout}
                activeOpacity={0.85}
              >
                <Text style={styles.payNowBtnText}>Xác nhận & Đi đến đặt xe</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}
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
  containerDark: {
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 56,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  headerDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  textDark: {
    color: '#F1F5F9',
  },

  // Filters styling
  filterBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  filterBarDark: {
    backgroundColor: '#1E293B',
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locScroll: {
    gap: 8,
    paddingRight: 10,
  },
  locChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locChipActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  locChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  locChipTextActive: {
    color: '#FFFFFF',
  },
  categoryTabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  catTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFE0D3',
    gap: 6,
  },
  catTabActive: {
    backgroundColor: '#FF5B22',
    borderColor: '#FF5B22',
  },
  catTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF5B22',
  },
  catTabTextActive: {
    color: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchBoxDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },

  // Listings styling
  listingScroll: {
    paddingBottom: 24,
  },
  listingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 6,
  },
  listingSectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  listingCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  vehicleCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  vehicleImg: {
    width: 110,
    height: '100%',
    minHeight: 140,
    backgroundColor: '#F1F5F9',
  },
  vehicleInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  vehicleRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  vehicleRatingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  vehicleOwner: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  specBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  specBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF5B22',
    marginTop: 1,
  },
  bookBtn: {
    backgroundColor: '#FF5B22',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Checkout scroll
  checkoutScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#1E293B',
  },
  summaryThumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  summaryName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  summaryOwner: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  summarySpecs: {
    marginTop: 4,
  },
  summarySpecText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF5B22',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    backgroundColor: '#F8FAFC',
  },
  formInputDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    color: '#FFFFFF',
  },
  daysCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Addons
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  addonRowActive: {
    borderColor: '#FF5B22',
    backgroundColor: '#FFF0EA',
  },
  addonTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  addonSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 14,
  },
  addonRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  addonPrice: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5B22',
  },
  policyNotice: {
    flexDirection: 'row',
    backgroundColor: '#FFF6F2',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFD3BF',
    marginTop: 4,
  },
  policyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF5B22',
  },
  policyContent: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 14,
  },

  // Pricing
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceRowLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  priceRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  priceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTotalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  priceTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF5B22',
  },

  // Payment methods
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: '#FF5B22',
    backgroundColor: '#FFF0EA',
  },
  paymentMethodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentMethodSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#FF5B22',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#FF5B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Processing Container
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 14,
  },
  processingTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  processingSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Success screen
  successScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 24,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  ticketHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  ticketKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF5B22',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrBox: {
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
  },
  qrNotice: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 8,
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  ticketLeftCut: {
    width: 10,
    height: 20,
    backgroundColor: '#F8FAFC',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    left: 0,
  },
  ticketRightCut: {
    width: 10,
    height: 20,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    position: 'absolute',
    right: 0,
  },
  ticketDashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },
  ticketDetails: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  ticketSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '800',
    textAlign: 'right',
    maxWidth: '65%',
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  stepNumCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFD3BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNum: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FF5B22',
  },
  stepGuideText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // ─── DRAWER / MODAL STYLING ──────────────────────────────────────────────────
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  drawerDismissZone: {
    flex: 1,
  },
  drawerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '80%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  drawerScroll: {
    marginVertical: 14,
  },
  drawerImg: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  drawerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  drawerName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  drawerPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF5B22',
  },
  drawerOwner: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  drawerSpecsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  drawerSpecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    flex: 1,
    minWidth: '45%',
    gap: 6,
  },
  drawerSpecItemDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  drawerSpecItemVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  drawerSection: {
    marginTop: 16,
  },
  drawerSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  inclusionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inclusionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inclusionText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '700',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 16,
  },
  successContainer: {
    flex: 1,
  },
  successHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  successHeaderBtn: {
    padding: 6,
  },
  successHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  successHomeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successHomeBtnText: {
    color: '#FF5B22',
    fontSize: 13,
    fontWeight: '900',
  },
});
