/**
 * Home Screen Integration Guide
 * 
 * Hướng dẫn sử dụng HomeScreen component
 */

/**
 * INTEGRATION STEPS:
 * 
 * 1. Import vào tab layout hoặc app router:
 * 
 *    import HomeScreen from '@/screens/Home';
 * 
 * 2. Sử dụng trong Stack Navigator:
 * 
 *    <Stack.Screen
 *      name="Home"
 *      component={HomeScreen}
 *      options={{
 *        headerShown: false,
 *        animationEnabled: false,
 *      }}
 *    />
 * 
 * 3. Hoặc dùng trong Tab Navigator:
 * 
 *    <Tab.Screen
 *      name="Home"
 *      component={HomeScreen}
 *      options={{
 *        headerShown: false,
 *        tabBarLabel: 'Trang chủ',
 *        tabBarIcon: ({ color, size }) => (
 *          <Ionicons name="home" size={size} color={color} />
 *        ),
 *      }}
 *    />
 * 
 */

/**
 * FEATURES:
 * 
 * ✅ Search Bar với:
 *    - Real-time search theo tên tour, địa điểm, mô tả
 *    - Clear button
 *    - Icon magnify
 * 
 * ✅ Category Filter Chips:
 *    - Tất cả
 *    - Miền Bắc / Trung / Nam
 *    - Biển Đảo
 *    - Hồ Núi
 * 
 * ✅ Featured Section (Horizontal):
 *    - Scrollable list với TourCard size="small"
 *    - Hiển thị thời tiết
 *    - 3 tours nổi bật đầu tiên
 * 
 * ✅ Promotion Banner:
 *    - Hiển thị ưu đãi đặc biệt
 * 
 * ✅ All Tours Section (Vertical):
 *    - Danh sách đầy đủ tours
 *    - TourCard size="medium"
 *    - Dễ scroll
 * 
 * ✅ Empty State:
 *    - Khi không tìm thấy tour
 *    - Button reset filters
 * 
 * ✅ Loading State:
 *    - Activity indicator
 *    - Loading text
 * 
 * ✅ Dark/Light Mode:
 *    - Tự động detect theme
 *    - Lấy colors từ theme.ts
 * 
 */

/**
 * API INTEGRATION GUIDE:
 * 
 * 1. Tạo useHomeData hook trong hooks/useHomeData.ts:
 * 
 *    import { useQuery } from '@tanstack/react-query';
 *    import { getTours } from '@/api/tours';
 * 
 *    export const useHomeData = () => {
 *      return useQuery({
 *        queryKey: ['tours'],
 *        queryFn: getTours,
 *      });
 *    };
 * 
 * 2. Sử dụng trong HomeScreen:
 * 
 *    const { data: tours, isLoading, error } = useHomeData();
 * 
 *    useEffect(() => {
 *      setIsLoading(isLoading);
 *    }, [isLoading]);
 * 
 *    if (error) {
 *      return <ErrorScreen error={error.message} />;
 *    }
 * 
 *    const toursData = tours || MOCK_TOURS;
 * 
 */

/**
 * CUSTOMIZATION:
 * 
 * 1. Thay đổi categories:
 *    - Sửa CATEGORIES array
 * 
 * 2. Thay đổi mock data:
 *    - Sửa MOCK_TOURS array
 *    - Hoặc tích hợp API thực
 * 
 * 3. Thay đổi số featured tours:
 *    - Sửa slice(0, 3) -> slice(0, 5)
 * 
 * 4. Thay đổi promotion banner:
 *    - Sửa bannerContainer content
 * 
 * 5. Thay đổi search placeholder:
 *    - Sửa TextInput placeholder prop
 * 
 */

/**
 * NAVIGATION SETUP:
 * 
 * Khi user bấm vào một tour, handleTourPress được gọi.
 * Hiện tại nó chỉ log. Để navigate, sửa như sau:
 * 
 *    const handleTourPress = useCallback(
 *      (tourId: string) => {
 *        navigation.navigate('TourDetail', { tourId });
 *      },
 *      [navigation]
 *    );
 * 
 * Và đảm bảo TourDetail screen đã được tạo.
 * 
 */

/**
 * PERFORMANCE NOTES:
 * 
 * - useMemo được dùng để cache filtered tours
 * - FlatList tối ưu rendering với horizontal scrolling
 * - ScrollView bao bọc tất cả để chiều dọc có thể scroll smooth
 * - TourCard memoization có thể thêm nếu cần
 * 
 */

export {};
