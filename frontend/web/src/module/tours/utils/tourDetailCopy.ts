export type TourDetailLocale = "vi" | "en";

export type TourDetailCopy = {
  backHome: string;
  loading: string;
  loadError: string;
  missingTour: string;
  detailErrorTitle: string;
  heroKicker: string;
  defaultShort: string;
  fromPrice: string;
  perGuest: string;
  durationFallback: string;
  flexibleTransport: string;
  routeStyle: string;
  overviewKicker: string;
  overviewTitle: string;
  noDescription: string;
  highlightsTitle: string;
  noHighlights: string;
  factsTitle: string;
  itineraryKicker: string;
  itineraryTitle: string;
  noItinerary: string;
  day: string;
  timeFallback: string;
  schedulesKicker: string;
  schedulesTitle: string;
  noSchedules: string;
  departure: string;
  returnDate: string;
  seats: string;
  meetingPoint: string;
  status: string;
  bookNow: string;
  viewSchedule: string;
  scheduleDetailTitle: string;
  pickupPoints: string;
  guides: string;
  capacity: string;
  bookedSeats: string;
  adultPrice: string;
  childPrice: string;
  infantPrice: string;
  seniorPrice: string;
  roomSurcharge: string;
  transportDetail: string;
  close: string;
  wishlistSaved: string;
  wishlistSave: string;
  wishlistLogin: string;
  wishlistSavedMessage: string;
  wishlistRemovedMessage: string;
  wishlistError: string;
  reviewsKicker: string;
  reviewsTitle: string;
  reviewsLoading: string;
  noReviews: string;
  reviewScore: string;
  reviewCount: string;
  wouldRecommend: string;
  mediaKicker: string;
  mediaTitle: string;
  noMedia: string;
  policyKicker: string;
  policyTitle: string;
  inclusions: string;
  exclusions: string;
  notes: string;
  cancellationPolicy: string;
  checklistTitle: string;
  noContent: string;
  ctaKicker: string;
  ctaTitle: (name: string) => string;
  ctaCopy: string;
  ctaAction: string;
  bookingKicker: string;
  bookingTitle: string;
  bookingCopy: string;
  selectSchedule: string;
  passengerCount: string;
  adults: string;
  children: string;
  infants: string;
  seniors: string;
  voucherCode: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  quoteAction: string;
  createBookingAction: string;
  bookingSuccess: (code: string) => string;
  quoteSuccess: string;
  bookingError: string;
  subtotal: string;
  discount: string;
  tax: string;
  finalAmount: string;
  appliedVoucher: string;
  requiredField: string;
  facts: Record<string, string>;
};

export const tourDetailCopyByLocale: Record<TourDetailLocale, TourDetailCopy> = {
  vi: {
    backHome: "Ve trang chu",
    loading: "Dang tai chi tiet tour...",
    loadError: "Khong the tai thong tin tour.",
    missingTour: "Tour khong ton tai.",
    detailErrorTitle: "Khong the tai tour",
    heroKicker: "Ho so tour",
    defaultShort: "Thong tin tour duoc lay truc tiep tu backend TravelViet.",
    fromPrice: "Gia tu",
    perGuest: "moi khach",
    durationFallback: "Lich trinh dang cap nhat",
    flexibleTransport: "Van chuyen linh hoat",
    routeStyle: "Kieu hanh trinh",
    overviewKicker: "Tong quan",
    overviewTitle: "Hanh trinh va trai nghiem chinh",
    noDescription: "Backend chua co mo ta chi tiet cho tour nay.",
    highlightsTitle: "Diem nhan noi bat",
    noHighlights: "Chua co diem nhan trong backend.",
    factsTitle: "Thong tin tour",
    itineraryKicker: "Lich trinh",
    itineraryTitle: "Cac ngay di chuyen",
    noItinerary: "Backend chua co lich trinh chi tiet cho tour nay.",
    day: "Ngay",
    timeFallback: "Dang cap nhat",
    schedulesKicker: "Khoi hanh",
    schedulesTitle: "Lich mo ban va gia",
    noSchedules: "Hien chua co lich khoi hanh moi. Vui long lien he de duoc ho tro.",
    departure: "Ngay di",
    returnDate: "Ngay ve",
    seats: "Cho trong",
    meetingPoint: "Diem hen",
    status: "Trang thai",
    bookNow: "Dat ngay",
    viewSchedule: "Xem lich",
    scheduleDetailTitle: "Chi tiet lich khoi hanh",
    pickupPoints: "Diem don",
    guides: "Huong dan vien",
    capacity: "Suc chua",
    bookedSeats: "Da dat",
    adultPrice: "Gia nguoi lon",
    childPrice: "Gia tre em",
    infantPrice: "Gia em be",
    seniorPrice: "Gia nguoi cao tuoi",
    roomSurcharge: "Phu thu phong don",
    transportDetail: "Phuong tien",
    close: "Dong",
    wishlistSaved: "Da luu",
    wishlistSave: "Luu tour",
    wishlistLogin: "Dang nhap de luu tour",
    wishlistSavedMessage: "Da them tour vao danh sach yeu thich.",
    wishlistRemovedMessage: "Da bo luu tour.",
    wishlistError: "Khong the cap nhat danh sach yeu thich.",
    reviewsKicker: "Danh gia",
    reviewsTitle: "Cam nhan tu khach da di",
    reviewsLoading: "Dang tai danh gia...",
    noReviews: "Tour nay chua co danh gia.",
    reviewScore: "Diem danh gia",
    reviewCount: "luot danh gia",
    wouldRecommend: "Khach san sang gioi thieu tour nay",
    mediaKicker: "Thu vien",
    mediaTitle: "Hinh anh va video cua tour",
    noMedia: "Backend chua co media cho tour nay.",
    policyKicker: "Dieu kien",
    policyTitle: "Bao gom, khong bao gom va luu y",
    inclusions: "Bao gom",
    exclusions: "Khong bao gom",
    notes: "Luu y quan trong",
    cancellationPolicy: "Chinh sach huy doi",
    checklistTitle: "Can chuan bi",
    noContent: "Lien he de biet them chi tiet.",
    ctaKicker: "TravelViet planner",
    ctaTitle: (name) => `San sang giu cho cho ${name}?`,
    ctaCopy:
      "Chon lich khoi hanh phu hop, de lai thong tin lien he va TravelViet se tu van chi tiet gia, dieu kien va cac yeu cau rieng.",
    ctaAction: "Tu van tour",
    bookingKicker: "Dat tour",
    bookingTitle: "Giu cho theo lich khoi hanh",
    bookingCopy:
      "Chon lich, so luong khach va ma uu dai de TravelViet tinh gia truoc khi tao booking.",
    selectSchedule: "Chon lich khoi hanh",
    passengerCount: "So khach",
    adults: "Nguoi lon",
    children: "Tre em",
    infants: "Em be",
    seniors: "Nguoi cao tuoi",
    voucherCode: "Ma uu dai",
    contactName: "Ho ten lien he",
    contactPhone: "So dien thoai",
    contactEmail: "Email",
    quoteAction: "Tinh gia",
    createBookingAction: "Tao booking",
    bookingSuccess: (code) => `Da tao booking ${code}.`,
    quoteSuccess: "Gia tam tinh da san sang.",
    bookingError: "Khong the xu ly booking. Vui long kiem tra thong tin.",
    subtotal: "Tam tinh",
    discount: "Giam gia",
    tax: "Thue",
    finalAmount: "Can thanh toan",
    appliedVoucher: "Voucher da ap dung",
    requiredField: "Vui long nhap day du thong tin bat buoc.",
    facts: {
      code: "Ma tour",
      slug: "Slug",
      destination: "Destination ID",
      duration: "Thoi luong",
      transport: "Phuong tien",
      tripMode: "Hinh thuc",
      season: "Mua phu hop",
      tags: "Nhom trai nghiem",
      featured: "Tour noi bat",
      yes: "Co",
      no: "Khong",
    },
  },
  en: {
    backHome: "Back to home",
    loading: "Loading tour details...",
    loadError: "Could not load tour information.",
    missingTour: "Tour does not exist.",
    detailErrorTitle: "Could not load tour",
    heroKicker: "Tour profile",
    defaultShort: "Tour information is loaded directly from TravelViet backend.",
    fromPrice: "From",
    perGuest: "per guest",
    durationFallback: "Itinerary is being updated",
    flexibleTransport: "Flexible transport",
    routeStyle: "Travel style",
    overviewKicker: "Overview",
    overviewTitle: "Journey and key experiences",
    noDescription: "The backend has no detailed description for this tour yet.",
    highlightsTitle: "Highlights",
    noHighlights: "No highlights exist in backend.",
    factsTitle: "Tour facts",
    itineraryKicker: "Itinerary",
    itineraryTitle: "Travel days",
    noItinerary: "The backend has no detailed itinerary for this tour yet.",
    day: "Day",
    timeFallback: "Updating",
    schedulesKicker: "Departures",
    schedulesTitle: "Open schedules and pricing",
    noSchedules: "No new departure schedule is available. Please contact us for support.",
    departure: "Departure",
    returnDate: "Return",
    seats: "Seats",
    meetingPoint: "Meeting point",
    status: "Status",
    bookNow: "Book now",
    viewSchedule: "View schedule",
    scheduleDetailTitle: "Departure details",
    pickupPoints: "Pickup points",
    guides: "Guides",
    capacity: "Capacity",
    bookedSeats: "Booked",
    adultPrice: "Adult price",
    childPrice: "Child price",
    infantPrice: "Infant price",
    seniorPrice: "Senior price",
    roomSurcharge: "Single room surcharge",
    transportDetail: "Transport",
    close: "Close",
    wishlistSaved: "Saved",
    wishlistSave: "Save tour",
    wishlistLogin: "Sign in to save",
    wishlistSavedMessage: "Tour saved to your wishlist.",
    wishlistRemovedMessage: "Tour removed from your wishlist.",
    wishlistError: "Could not update wishlist.",
    reviewsKicker: "Reviews",
    reviewsTitle: "What travelers say",
    reviewsLoading: "Loading reviews...",
    noReviews: "No review is available for this tour yet.",
    reviewScore: "Review score",
    reviewCount: "reviews",
    wouldRecommend: "Traveler recommends this tour",
    mediaKicker: "Gallery",
    mediaTitle: "Tour images and videos",
    noMedia: "No media is available for this tour yet.",
    policyKicker: "Terms",
    policyTitle: "Included, excluded, and notes",
    inclusions: "Included",
    exclusions: "Excluded",
    notes: "Important notes",
    cancellationPolicy: "Cancellation policy",
    checklistTitle: "Preparation checklist",
    noContent: "Contact us for more details.",
    ctaKicker: "TravelViet planner",
    ctaTitle: (name) => `Ready to reserve ${name}?`,
    ctaCopy:
      "Choose a suitable departure, leave your contact information, and TravelViet will advise pricing, conditions, and custom requirements.",
    ctaAction: "Request consultation",
    bookingKicker: "Booking",
    bookingTitle: "Reserve a departure",
    bookingCopy:
      "Choose a schedule, passenger count, and voucher code to preview pricing before creating a booking.",
    selectSchedule: "Select departure",
    passengerCount: "Passengers",
    adults: "Adults",
    children: "Children",
    infants: "Infants",
    seniors: "Seniors",
    voucherCode: "Voucher code",
    contactName: "Contact name",
    contactPhone: "Phone number",
    contactEmail: "Email",
    quoteAction: "Calculate quote",
    createBookingAction: "Create booking",
    bookingSuccess: (code) => `Booking ${code} has been created.`,
    quoteSuccess: "Quote is ready.",
    bookingError: "Could not process booking. Please check your information.",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax",
    finalAmount: "Amount due",
    appliedVoucher: "Applied voucher",
    requiredField: "Please fill in all required information.",
    facts: {
      code: "Tour code",
      slug: "Slug",
      destination: "Destination ID",
      duration: "Duration",
      transport: "Transport",
      tripMode: "Trip mode",
      season: "Season",
      tags: "Experience tags",
      featured: "Featured tour",
      yes: "Yes",
      no: "No",
    },
  },
};

export function getTourDetailLocale(language: string): TourDetailLocale {
  return language === "en" ? "en" : "vi";
}
