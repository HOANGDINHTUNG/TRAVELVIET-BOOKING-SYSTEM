/**
 * TOUR DETAIL & CHECKOUT SCREENS - INTEGRATION GUIDE
 * 
 * Hướng dẫn setup navigation giữa TourDetail -> Checkout
 */

/**
 * 1. NAVIGATION SETUP (app/index.tsx hoặc app/(tabs)/_layout.tsx)
 * 
 * import TourDetailScreen from '@/screens/TourDetail';
 * import CheckoutScreen from '@/screens/Checkout';
 * 
 * const Stack = createNativeStackNavigator();
 * 
 * export function HomeStack() {
 *   return (
 *     <Stack.Navigator
 *       screenOptions={{
 *         headerShown: false,
 *         animationEnabled: true,
 *       }}
 *     >
 *       <Stack.Screen name="Home" component={HomeScreen} />
 *       <Stack.Screen name="TourDetail" component={TourDetailScreen} />
 *       <Stack.Screen name="Checkout" component={CheckoutScreen} />
 *       <Stack.Screen name="Payment" component={PaymentScreen} />
 *     </Stack.Navigator>
 *   );
 * }
 */

/**
 * 2. NAVIGATION FLOW
 * 
 * Home Screen
 *   ↓ (onClick TourCard)
 * TourDetail Screen
 *   ↓ (onClick "Đặt ngay" button)
 * Checkout Screen
 *   ↓ (onClick "Tiến tới thanh toán" button)
 * Payment Screen (chưa tạo)
 */

/**
 * 3. PASSING DATA BETWEEN SCREENS
 * 
 * Home → TourDetail:
 * navigation.navigate('TourDetail', { tour: tourObject })
 * 
 * TourDetail → Checkout:
 * navigation.navigate('Checkout', {
 *   tour: tourObject,
 *   selectedCount: { adults: 1, children: 0 }
 * })
 * 
 * Checkout → Payment:
 * navigation.navigate('Payment', {
 *   tour,
 *   passengers: passengerArray,
 *   adultCount,
 *   childCount,
 *   totalPrice: total
 * })
 */

/**
 * 4. TOUR DETAIL SCREEN FEATURES
 * 
 * ✅ Full tour information display
 * ✅ Image with pagination dots (ready for carousel)
 * ✅ Back button + favorite button in header
 * ✅ Price with discount calculation
 * ✅ Rating and reviews count
 * ✅ Duration, weather, available spots info
 * ✅ Highlights section
 * ✅ Full description
 * ✅ Day-by-day itinerary
 * ✅ Customer reviews
 * ✅ "Đặt ngay" button at bottom (fixed position)
 * ✅ Dark/Light mode support
 * ✅ Safe area insets for notch devices
 */

/**
 * 5. CHECKOUT SCREEN FEATURES
 * 
 * ✅ Tour summary card (image, name, price)
 * ✅ Passenger count selector (adults/children)
 * ✅ Price calculation per passenger type
 * ✅ Dynamic passenger form generation
 * ✅ Passenger info form with validation:
 *    - First name
 *    - Last name
 *    - Email (format validation)
 *    - Phone (format validation)
 * ✅ Error handling and display
 * ✅ Price summary card (breakdown + tax)
 * ✅ Total price calculation
 * ✅ Dark/Light mode support
 * ✅ Safe area insets
 * ✅ Continue button to Payment screen
 * ✅ Cancel button to go back
 */

/**
 * 6. PRICING STRUCTURE
 * 
 * Adult Price: 100% of base price
 * Child Price (3-12): 70% of base price
 * Tax: 10% of total
 * 
 * Example:
 * Tour price: 2,500,000 VND
 * 2 adults: 2,500,000 × 2 = 5,000,000
 * 1 child: 2,500,000 × 0.7 = 1,750,000
 * Subtotal: 6,750,000
 * Tax (10%): 675,000
 * Total: 7,425,000
 */

/**
 * 7. FORM VALIDATION RULES
 * 
 * First Name:
 * - Cannot be empty
 * 
 * Last Name:
 * - Cannot be empty
 * 
 * Email:
 * - Cannot be empty
 * - Must contain @
 * 
 * Phone:
 * - Cannot be empty
 * - Must be exactly 10 digits
 */

/**
 * 8. CUSTOMIZATION
 * 
 * 1. Change passenger types:
 *    - Modify ADULT_PRICE_RATIO
 *    - Modify CHILD_PRICE_RATIO
 *    - Add new passenger types as needed
 * 
 * 2. Change tax percentage:
 *    - Modify: const tax = Math.round(subtotal * 0.1);
 *    - Change 0.1 to desired ratio (e.g., 0.08 for 8%)
 * 
 * 3. Add more passenger fields:
 *    - Add to PassengerData interface
 *    - Add input field in checkout form
 *    - Update validation function
 * 
 * 4. Change currency:
 *    - Modify Intl.NumberFormat locale and currency
 *    - Current: 'vi-VN' currency 'VND'
 */

/**
 * 9. API INTEGRATION
 * 
 * When ready to connect to backend:
 * 
 * 1. Create API service:
 *    api/bookingApi.ts
 *    
 * 2. Add booking creation function:
 *    createBooking(bookingData) -> POST /api/bookings
 *    
 * 3. In Checkout screen handleContinue:
 *    const booking = await createBooking({
 *      tourId: tour.id,
 *      passengers,
 *      totalPrice: total,
 *      status: 'pending'
 *    });
 * 
 * 4. After successful booking:
 *    navigation.navigate('Payment', { bookingId: booking.id, ... })
 */

/**
 * 10. ERROR HANDLING
 * 
 * Current implementation:
 * - Form validation on client side
 * - Error display below each input field
 * - Alert dialog if validation fails
 * 
 * Improvements:
 * - Add try/catch for API calls
 * - Show loading state during submission
 * - Handle network errors
 * - Retry mechanism
 */

export {};
