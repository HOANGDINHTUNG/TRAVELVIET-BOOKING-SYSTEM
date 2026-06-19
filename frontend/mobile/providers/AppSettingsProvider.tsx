import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { fetchMyProfile } from "@/services/profileApi";
import { getAccessToken } from "@/services/authStorage";

export type ThemeMode = "light" | "dark";
export type LanguageMode = "vi" | "en";
export type CurrencyMode = "VND" | "USD";

interface AppSettingsContextType {
  theme: ThemeMode;
  language: LanguageMode;
  currency: CurrencyMode;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: LanguageMode) => void;
  setCurrency: (curr: CurrencyMode) => void;
  formatPrice: (vndPriceNum: number) => string;
  t: (key: string, defaultValue?: string) => string;

  // User Profile
  userAvatar: string;
  setUserAvatar: (url: string) => void;
  userFullName: string;
  setUserFullName: (name: string) => void;
  userDisplayName: string;
  setUserDisplayName: (name: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userDob: string;
  setUserDob: (dob: string) => void;
  userGender: string;
  setUserGender: (gender: string) => void;
  userCoverImage: string;
  setUserCoverImage: (url: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

const THEME_KEY = "travelviet.settings.theme";
const LANG_KEY = "travelviet.settings.lang";
const CURR_KEY = "travelviet.settings.curr";

const TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  home: { vi: "Trang chủ", en: "Home" },
  tours: { vi: "Tour", en: "Tours" },
  explore: { vi: "Khám phá", en: "Explore" },
  bookings: { vi: "Đơn hàng", en: "Bookings" },
  profile: { vi: "Tài khoản", en: "Profile" },
  departure: { vi: "Điểm khởi hành", en: "Departure" },
  price_from: { vi: "Giá từ", en: "Price from" },
  duration: { vi: "Thời gian", en: "Duration" },
  slots_left: { vi: "chỗ trống", en: "slots left" },
  book_now: { vi: "Đặt ngay", en: "Book now" },
  reviews: { vi: "đánh giá", en: "reviews" },
  search_placeholder: {
    vi: "Bạn muốn đi đâu hôm nay?",
    en: "Where do you want to go today?",
  },
  hotels: { vi: "Khách sạn", en: "Hotels" },
  combos: { vi: "Combo", en: "Combos" },
  visa: { vi: "Dịch vụ visa", en: "Visa service" },
  car_rental: { vi: "Cho thuê xe", en: "Car rental" },
  flights: { vi: "Vé máy bay", en: "Flights" },
  support: { vi: "Hỗ trợ", en: "Support" },
  additional_services: { vi: "Dịch vụ bổ sung", en: "Additional Services" },
  settings: {
    vi: "Tùy chọn hiển thị & Cài đặt",
    en: "Display Options & Settings",
  },
  theme_label: { vi: "GIAO DIỆN", en: "THEME" },
  lang_label: { vi: "NGÔN NGỮ", en: "LANGUAGE" },
  curr_label: { vi: "TIỀN TỆ", en: "CURRENCY" },
  light_theme: { vi: "SÁNG", en: "LIGHT" },
  dark_theme: { vi: "TỐI", en: "DARK" },
  logout: { vi: "Đăng xuất", en: "Logout" },
  personal_info: { vi: "Thông tin cá nhân", en: "Personal Information" },
  travel_passport: { vi: "Passport du lịch", en: "Travel Passport" },
  acc_page: { vi: "Trang tài khoản", en: "Account Page" },
  logged_in: { vi: "ĐẦY ĐỦ QUYỀN TRUY CẬP", en: "LOGGED IN SUCCESSFULLY" },
  membership: { vi: "HẠNG THÀNH VIÊN", en: "MEMBERSHIP LEVEL" },
  points: { vi: "ĐIỂM TÍCH LŨY", en: "LOYALTY POINTS" },
  spent: { vi: "TIỀN ĐÃ TIÊU", en: "TOTAL SPENT" },
  support_sessions: { vi: "PHIÊN HỖ TRỢ", en: "SUPPORT TICKETS" },

  // Explore Screen
  explore_hero_title: {
    vi: "Khám phá các điểm đến hấp dẫn",
    en: "Explore Attractive Destinations",
  },
  explore_search_placeholder: {
    vi: "Tìm kiếm điểm danh lam thắng cảnh...",
    en: "Search for attractions and destinations...",
  },
  explore_region_prefix: { vi: "Khu vực", en: "Region" },
  explore_search_results: { vi: "Kết quả tìm kiếm", en: "Search Results" },
  explore_search_subtext: {
    vi: "Các điểm đến khớp với từ khóa của bạn",
    en: "Destinations matching your search",
  },
  explore_no_destinations: {
    vi: "Không tìm thấy điểm đến nào",
    en: "No destinations found",
  },
  explore_continent_title: {
    vi: "Khám phá theo châu lục",
    en: "Explore by Continent",
  },
  explore_continent_subtext: {
    vi: "Tìm hành trình khắp năm châu cùng TravelViet",
    en: "Find journeys across the five continents with TravelViet",
  },
  explore_vietnam: { vi: "Việt Nam", en: "Vietnam" },
  explore_asia: { vi: "Châu Á", en: "Asia" },
  explore_europe: { vi: "Châu Âu", en: "Europe" },
  explore_americas: { vi: "Châu Mỹ", en: "Americas" },
  explore_africa: { vi: "Châu Phi", en: "Africa" },
  explore_vn_desc: {
    vi: "Vẻ đẹp bất tận của thiên nhiên, văn hóa Việt",
    en: "Endless beauty of Vietnamese nature & culture",
  },
  explore_asia_desc: {
    vi: "Giao thoa giữa truyền thống & hiện đại",
    en: "Intersection of tradition & modernity",
  },
  explore_europe_desc: {
    vi: "Nền văn minh lâu đời rực rỡ",
    en: "Brilliant ancient civilization",
  },
  explore_americas_desc: {
    vi: "Tân thế giới cùng thiên nhiên hùng vĩ",
    en: "New world with majestic nature",
  },
  explore_africa_desc: {
    vi: "Cội nguồn hoang dã đầy kỳ thú",
    en: "Wild origins full of wonders",
  },
  explore_domestic_title: {
    vi: "Điểm đến của thời gian mới",
    en: "Trending Destinations",
  },
  explore_domestic_subtext: {
    vi: "Mùa này bạn đi đâu chơi?",
    en: "Where are you travelling this season?",
  },
  explore_intl_title: {
    vi: "Điểm đến quốc tế nổi bật",
    en: "Featured International Destinations",
  },
  explore_intl_subtext: {
    vi: "Khám phá thế giới rộng lớn bên ngoài",
    en: "Explore the vast world outside",
  },
  region_north: { vi: "Miền Bắc", en: "Northern" },
  region_center: { vi: "Miền Trung", en: "Central" },
  region_south: { vi: "Miền Nam", en: "Southern" },

  // Bookings Screen
  bookings_kicker: { vi: "TÀI KHOẢN CỦA TÔI", en: "MY ACCOUNT" },
  bookings_title: { vi: "Đơn của tôi", en: "My Bookings" },
  bookings_subtitle: {
    vi: "Quản lý các đơn tour bạn đã đặt — thanh toán, hủy hoặc xem lại chi tiết.",
    en: "Manage your booked tours — pay, cancel or view details.",
  },
  bookings_total_trips: { vi: "TỔNG CHUYẾN", en: "TOTAL TRIPS" },
  bookings_pending: { vi: "CHỜ XỬ LÝ", en: "PENDING" },
  bookings_completed: { vi: "HOÀN THÀNH", en: "COMPLETED" },
  bookings_cancelled: { vi: "ĐÃ HỦY", en: "CANCELLED" },
  bookings_results_count: { vi: "kết quả", en: "results" },
  bookings_no_trips: { vi: "Không có chuyến đi nào", en: "No trips found" },
  bookings_no_trips_sub: {
    vi: "Bạn chưa có đơn đặt tour nào.",
    en: "You have not booked any tours yet.",
  },
  bookings_detail: { vi: "Chi tiết", en: "Details" },
  bookings_detail_title: { vi: "Chi tiết đơn hàng", en: "Booking Details" },
  bookings_detail_alert: { vi: "Mã đơn", en: "Booking ID" },

  // General Booking / Tour / Hotels / Combos Statuses
  status_pending: { vi: "Chờ xử lý", en: "Pending" },
  status_confirmed: { vi: "Đã thanh toán", en: "Paid" },
  status_completed: { vi: "Hoàn thành", en: "Completed" },
  status_cancelled: { vi: "Đã hủy", en: "Cancelled" },
  filter_all: { vi: "Tất cả", en: "All" },

  // Hotels & Combos Screens
  hotels_title: { vi: "Khách sạn chất lượng cao", en: "Premium Hotels" },
  hotels_subtitle: {
    vi: "Tìm kiếm phòng nghỉ thoải mái, sang trọng cho chuyến đi của bạn",
    en: "Find comfortable and luxurious stays for your journey",
  },
  combos_title: {
    vi: "Combo Du lịch Tiết kiệm",
    en: "Super Saver Travel Combos",
  },
  combos_subtitle: {
    vi: "Trọn gói Vé máy bay + Khách sạn chất lượng tốt nhất",
    en: "All-in-one Flight + Hotel packages at the best rates",
  },
  tour_package: { vi: "Tour trọn gói", en: "All-inclusive Tour" },
  rating: { vi: "đánh giá", en: "reviews" },
  location: { vi: "Vị trí", en: "Location" },
  night: { vi: "đêm", en: "night" },

  // Tour Details Screen
  tour_details: { vi: "Chi tiết Tour", en: "Tour Details" },
  tour_info: { vi: "Thông tin Tour", en: "Tour Information" },
  tour_program: { vi: "Chương trình Tour", en: "Tour Schedule" },
  tour_price: { vi: "Giá từ", en: "Price from" },
  tour_start_date: { vi: "Ngày khởi hành", en: "Departure date" },
  tour_duration: { vi: "Thời gian", en: "Duration" },
  tour_departure: { vi: "Điểm khởi hành", en: "Departure from" },
  tour_slots: { vi: "Số chỗ còn lại", en: "Slots remaining" },
  tour_description: { vi: "Mô tả chuyến đi", en: "Description" },
  tour_itinerary: { vi: "Lịch trình chi tiết", en: "Detailed Itinerary" },
  tour_book_now: { vi: "Đặt tour ngay", en: "Book Tour Now" },

  // Checkout Screen
  checkout_title: { vi: "Thanh toán & Đặt chỗ", en: "Checkout & Booking" },
  checkout_subtitle: {
    vi: "Vui lòng hoàn thành các thông tin và thực hiện thanh toán để xác nhận chỗ của bạn",
    en: "Please complete details and make payment to confirm your booking",
  },
  checkout_contact_info: { vi: "Thông tin liên hệ", en: "Contact Information" },
  checkout_fullname: { vi: "Họ và tên", en: "Full Name" },
  checkout_email: { vi: "Địa chỉ Email", en: "Email Address" },
  checkout_phone: { vi: "Số điện thoại", en: "Phone Number" },
  checkout_passengers: {
    vi: "Số lượng hành khách",
    en: "Number of passengers",
  },
  checkout_adults: { vi: "Người lớn", en: "Adults" },
  checkout_children: { vi: "Trẻ em", en: "Children" },
  checkout_price_summary: { vi: "Chi tiết giá cả", en: "Price Summary" },
  checkout_price_per_adult: {
    vi: "Giá vé người lớn",
    en: "Adult ticket price",
  },
  checkout_price_per_child: { vi: "Giá vé trẻ em", en: "Child ticket price" },
  checkout_total_price: { vi: "Tổng tiền", en: "Subtotal" },
  checkout_tax: { vi: "Thuế & Phí", en: "Taxes & Fees" },
  checkout_discount: { vi: "Giảm giá", en: "Discount" },
  checkout_final_total: { vi: "Tổng cộng thanh toán", en: "Total Payment" },
  checkout_pay_button: { vi: "XÁC NHẬN THANH TOÁN", en: "CONFIRM PAYMENT" },
  checkout_success: { vi: "Đặt chỗ thành công", en: "Booking Successful" },
  checkout_success_msg: {
    vi: "Đơn đặt chỗ của bạn đã được tiếp nhận và xử lý!",
    en: "Your booking has been received and is being processed!",
  },

  // AI Assistant
  assistant_welcome: {
    vi: "Xin chào! Tôi hỗ trợ tra cứu nhanh tour, khuyến mãi và thông tin vận hành TravelViet khi bạn đang dùng Commerce Desk.",
    en: "Hello! I support quick search of tours, promotions and TravelViet operational info while you are using Commerce Desk.",
  },
  assistant_suggest_1: {
    vi: "Liệt kê campaign đang bật",
    en: "List active campaigns",
  },
  assistant_suggest_2: {
    vi: "Gợi ý kiểm tra voucher sắp hết hạn",
    en: "Check soon-to-expire vouchers",
  },
  assistant_suggest_3: {
    vi: "Tóm tắt quy trình bật/tắt sản phẩm trên desk",
    en: "Summary of product toggle flow on desk",
  },
  assistant_typing: {
    vi: "AI đang trả lời...",
    en: "AI is typing...",
  },
  assistant_error: {
    vi: "Xin lỗi, hệ thống AI đang gặp lỗi khi xử lý câu hỏi.",
    en: "Sorry, the AI system encountered an error processing your question.",
  },
  assistant_placeholder: {
    vi: "Nhập câu hỏi...",
    en: "Type a question...",
  },
  assistant_send: {
    vi: "Gửi câu hỏi",
    en: "Send question",
  },
  assistant_close: {
    vi: "Đóng chat",
    en: "Close chat",
  },

  // Notifications
  notifications_title: {
    vi: "Thông báo",
    en: "Notifications",
  },
  notifications_empty: {
    vi: "Không có thông báo nào",
    en: "No notifications",
  },
  notifications_empty_sub: {
    vi: "Bạn sẽ nhận được cập nhật về tour, khuyến mãi tại đây.",
    en: "You will receive updates about tours and promotions here.",
  },
  notifications_mark_all_read: {
    vi: "Đọc tất cả",
    en: "Mark all read",
  },
  notifications_clear_all: {
    vi: "Xóa tất cả",
    en: "Clear all",
  },
  notifications_promo: {
    vi: "Khuyến mãi",
    en: "Promotion",
  },
  notifications_booking: {
    vi: "Đơn hàng",
    en: "Booking",
  },
  notifications_system: {
    vi: "Hệ thống",
    en: "System",
  },

  // Drawer
  drawer_home: { vi: "Trang chủ", en: "Home" },
  drawer_tours: { vi: "Tour du lịch", en: "Tours" },
  drawer_hotels: { vi: "Khách sạn", en: "Hotels" },
  drawer_combos: { vi: "Combo Tiết kiệm", en: "Combos" },
  drawer_explore: { vi: "Khám phá điểm đến", en: "Explore" },
  drawer_bookings: { vi: "Đơn hàng của tôi", en: "My Bookings" },
  drawer_passport: { vi: "Passport du lịch", en: "Travel Passport" },
  drawer_help: { vi: "Trung tâm hỗ trợ", en: "Help Center" },
  drawer_settings: { vi: "Cài đặt hiển thị", en: "Display Settings" },
  drawer_hello: { vi: "Xin chào", en: "Hello" },

  // Cruises
  cruises_title: { vi: "Du thuyền hạng sang", en: "Premium Cruises" },
  cruises_subtitle: {
    vi: "Trải nghiệm hải trình đẳng cấp 5 sao trên những vịnh biển đẹp nhất Việt Nam.",
    en: "Experience 5-star luxury cruises on Vietnam's most beautiful bays.",
  },
  cruises_search_placeholder: {
    vi: "Tìm tên du thuyền, vịnh biển...",
    en: "Search cruise name, bay...",
  },
  cruises_empty: {
    vi: "Không tìm thấy du thuyền phù hợp",
    en: "No matching cruises found",
  },
  cruises_empty_sub: {
    vi: "Hãy thử thay đổi từ khóa tìm kiếm.",
    en: "Please try changing search keywords.",
  },
  cruises_book_now: { vi: "Đặt cabin", en: "Book Cabin" },
  cruises_price_from: { vi: "Giá từ", en: "Price from" },
  cruises_rating: { vi: "đánh giá", en: "reviews" },
};

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [language, setLanguageState] = useState<LanguageMode>("vi");
  const [currency, setCurrencyState] = useState<CurrencyMode>("VND");

  // Profile fields state
  const [userAvatar, setUserAvatar] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  );
  const [userFullName, setUserFullName] = useState("Công Trứ Nguyễn");
  const [userDisplayName, setUserDisplayName] = useState("Công Trứ Nguyễn");
  const [userPhone, setUserPhone] = useState("0987654321");
  const [userEmail, setUserEmail] = useState("congtru@gmail.com");
  const [userDob, setUserDob] = useState("15/10/1995");
  const [userGender, setUserGender] = useState("Nam");
  const [userCoverImage, setUserCoverImage] = useState("");

  useEffect(() => {
    // Load persisted settings
    const loadSettings = async () => {
      try {
        const storedTheme = await SecureStore.getItemAsync(THEME_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setThemeState(storedTheme);
        }
        const storedLang = await SecureStore.getItemAsync(LANG_KEY);
        if (storedLang === "vi" || storedLang === "en") {
          setLanguageState(storedLang);
        }
        const storedCurr = await SecureStore.getItemAsync(CURR_KEY);
        if (storedCurr === "VND" || storedCurr === "USD") {
          setCurrencyState(storedCurr);
        }

        if (getAccessToken()) {
          try {
            const res = await fetchMyProfile();
            if (res?.data) {
              const p = res.data;
              setUserFullName(p.fullName || "");
              setUserDisplayName(p.displayName || p.fullName || "");
              setUserPhone(p.phone || "");
              setUserEmail(p.email || "");
              setUserDob(p.dateOfBirth || "");

              // Handle Java Enum casing for Gender
              setUserGender(
                p.gender === "MALE"
                  ? "Nam"
                  : p.gender === "FEMALE"
                    ? "Nữ"
                    : "Khác",
              );

              if (p.avatarUrl) {
                setUserAvatar(p.avatarUrl);
              }
            }
          } catch (e) {
            console.log("Failed to load user profile on mount:", e);
          }
        }
      } catch {
        // secure store ignored
      }
    };
    loadSettings();
  }, []);

  const setTheme = async (next: ThemeMode) => {
    setThemeState(next);
    try {
      await SecureStore.setItemAsync(THEME_KEY, next);
    } catch {}
  };

  const setLanguage = async (next: LanguageMode) => {
    setLanguageState(next);
    try {
      await SecureStore.setItemAsync(LANG_KEY, next);
    } catch {}
  };

  const setCurrency = async (next: CurrencyMode) => {
    setCurrencyState(next);
    try {
      await SecureStore.setItemAsync(CURR_KEY, next);
    } catch {}
  };

  const formatPrice = (vndPriceNum: number) => {
    if (currency === "USD") {
      const usdAmount = vndPriceNum / 26300;
      return `$${usdAmount.toFixed(2)}`;
    } else {
      return `${vndPriceNum.toLocaleString("vi-VN")} đ`;
    }
  };

  const t = (key: string, defaultValue?: string) => {
    const val = TRANSLATIONS[key];
    if (!val) return defaultValue || key;
    return val[language];
  };

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        language,
        currency,
        setTheme,
        setLanguage,
        setCurrency,
        formatPrice,
        t,
        userAvatar,
        setUserAvatar,
        userFullName,
        setUserFullName,
        userDisplayName,
        setUserDisplayName,
        userPhone,
        setUserPhone,
        userEmail,
        setUserEmail,
        userDob,
        setUserDob,
        userGender,
        setUserGender,
        userCoverImage,
        setUserCoverImage,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
