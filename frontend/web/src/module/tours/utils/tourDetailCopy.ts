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
