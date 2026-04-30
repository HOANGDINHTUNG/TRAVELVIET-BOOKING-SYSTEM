export type BackendTourMediaMock = {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
};

export type BackendItineraryItemMock = {
  id: number;
  sequenceNo: number;
  itemType: string;
  title: string;
  description: string;
  locationName: string;
  startTime?: string;
  endTime?: string;
};

export type BackendItineraryDayMock = {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
  items: BackendItineraryItemMock[];
};

export type BackendTourMock = {
  id: number;
  code: string;
  name: string;
  slug: string;
  destinationId: number;
  basePrice: number;
  currency: 'VND';
  durationDays: number;
  durationNights: number;
  shortDescription: string;
  description: string;
  transportType: string;
  tripMode: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  notes: string;
  isFeatured: boolean;
  status: 'active' | 'draft' | 'inactive';
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  media: BackendTourMediaMock[];
  itineraryDays: BackendItineraryDayMock[];
};

export type BackendDestinationMock = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  countryCode: 'VN';
  province: string;
  region: string;
  shortDescription: string;
  bestTimeFromMonth: number;
  bestTimeToMonth: number;
  crowdLevelDefault: 'low' | 'medium' | 'high';
  isFeatured: boolean;
  coverImageUrl: string;
  activeTourCount: number;
};

export type BackendWeatherForecastMock = {
  id: number;
  destinationId: number;
  forecastDate: string;
  weatherCode: 'sunny' | 'cloudy' | 'rainy' | 'foggy';
  summary: string;
  tempMin: number;
  tempMax: number;
  humidityPercent: number;
  windSpeed: number;
  rainProbability: number;
  sourceName: string;
};

export type TourData = {
  id: string;
  title: string;
  destinationId: number;
  destinationUuid: string;
  destinationName: string;
  location: string;
  price: string;
  weather: string;
  category: string;
  image: string;
  days: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  itinerary: {
    day: string;
    title: string;
    description: string;
  }[];
};

export type DestinationData = {
  id: string;
  name: string;
  region: string;
  tours: string;
  image: string;
};

export const BACKEND_DESTINATION_MOCKS: BackendDestinationMock[] = [
  {
    id: 101,
    uuid: 'dest-ha-long-001',
    name: 'Ha Long',
    slug: 'ha-long',
    countryCode: 'VN',
    province: 'Quang Ninh',
    region: 'Mien Bac',
    shortDescription: 'Vinh bien voi nui da voi, hang dong va du thuyen nghi duong.',
    bestTimeFromMonth: 10,
    bestTimeToMonth: 4,
    crowdLevelDefault: 'medium',
    isFeatured: true,
    coverImageUrl:
      'https://nangluongsachvietnam.vn/userfile/User/thanhtam/images/2020/7/6/vinh-Ha-long-2-20200706112849136.jpeg',
    activeTourCount: 18,
  },
  {
    id: 102,
    uuid: 'dest-da-lat-001',
    name: 'Da Lat',
    slug: 'da-lat',
    countryCode: 'VN',
    province: 'Lam Dong',
    region: 'Cao nguyen',
    shortDescription: 'Thanh pho cao nguyen voi ho, doi thong va khong khi mat.',
    bestTimeFromMonth: 11,
    bestTimeToMonth: 3,
    crowdLevelDefault: 'high',
    isFeatured: true,
    coverImageUrl: 'https://phetravel.com/uploads/unnamed-2025-03-12t090845827.png.webp',
    activeTourCount: 24,
  },
  {
    id: 103,
    uuid: 'dest-phu-quoc-001',
    name: 'Phu Quoc',
    slug: 'phu-quoc',
    countryCode: 'VN',
    province: 'Kien Giang',
    region: 'Bien dao',
    shortDescription: 'Dao bien voi bai cat trang, hoang hon va resort ven bien.',
    bestTimeFromMonth: 11,
    bestTimeToMonth: 5,
    crowdLevelDefault: 'medium',
    isFeatured: true,
    coverImageUrl: 'https://phuquocxanh.com/vi/wp-content/uploads/2017/02/bien-dao-Phu-Quoc-1.jpg',
    activeTourCount: 22,
  },
  {
    id: 104,
    uuid: 'dest-hue-001',
    name: 'Hue',
    slug: 'hue',
    countryCode: 'VN',
    province: 'Thua Thien Hue',
    region: 'Di san',
    shortDescription: 'Co do voi Dai Noi, song Huong, lang tam va am thuc Hue.',
    bestTimeFromMonth: 1,
    bestTimeToMonth: 4,
    crowdLevelDefault: 'low',
    isFeatured: true,
    coverImageUrl:
      'https://mia.vn/media/uploads/blog-du-lich/kinh-thanh-hue-chiem-nguong-kien-truc-vang-son-cua-13-vi-vua-trieu-dai-nha-nguyen-08-1638156842.jpg',
    activeTourCount: 14,
  },
  {
    id: 105,
    uuid: 'dest-mekong-001',
    name: 'Mien Tay',
    slug: 'mien-tay',
    countryCode: 'VN',
    province: 'An Giang',
    region: 'Mien Nam',
    shortDescription: 'Song nuoc, cho noi, rung tram va lang nghe dia phuong.',
    bestTimeFromMonth: 9,
    bestTimeToMonth: 3,
    crowdLevelDefault: 'medium',
    isFeatured: true,
    coverImageUrl:
      'https://vietnamtouristvn.com/thumbs/1000x800x2/upload/product/thiet-ke-chua-co-ten-2-6106.png',
    activeTourCount: 11,
  },
  {
    id: 106,
    uuid: 'dest-sa-pa-001',
    name: 'Sa Pa',
    slug: 'sa-pa',
    countryCode: 'VN',
    province: 'Lao Cai',
    region: 'Mien Bac',
    shortDescription: 'Nui rung Tay Bac, ruong bac thang, ban lang va san may.',
    bestTimeFromMonth: 9,
    bestTimeToMonth: 11,
    crowdLevelDefault: 'high',
    isFeatured: true,
    coverImageUrl:
      'https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1741942656.jpg&w=3840&q=75',
    activeTourCount: 19,
  },
];

export const BACKEND_WEATHER_MOCKS: BackendWeatherForecastMock[] = [
  {
    id: 1,
    destinationId: 101,
    forecastDate: '2026-05-01',
    weatherCode: 'cloudy',
    summary: '24°C - May nhe',
    tempMin: 22,
    tempMax: 27,
    humidityPercent: 76,
    windSpeed: 12,
    rainProbability: 18,
    sourceName: 'TravelViet mock',
  },
  {
    id: 2,
    destinationId: 102,
    forecastDate: '2026-05-01',
    weatherCode: 'cloudy',
    summary: '18°C - Mat',
    tempMin: 16,
    tempMax: 22,
    humidityPercent: 82,
    windSpeed: 8,
    rainProbability: 30,
    sourceName: 'TravelViet mock',
  },
  {
    id: 3,
    destinationId: 103,
    forecastDate: '2026-05-01',
    weatherCode: 'sunny',
    summary: '30°C - Nang dep',
    tempMin: 27,
    tempMax: 32,
    humidityPercent: 70,
    windSpeed: 14,
    rainProbability: 8,
    sourceName: 'TravelViet mock',
  },
  {
    id: 4,
    destinationId: 104,
    forecastDate: '2026-05-01',
    weatherCode: 'rainy',
    summary: '26°C - Mua nhe',
    tempMin: 24,
    tempMax: 28,
    humidityPercent: 84,
    windSpeed: 10,
    rainProbability: 58,
    sourceName: 'TravelViet mock',
  },
  {
    id: 5,
    destinationId: 105,
    forecastDate: '2026-05-01',
    weatherCode: 'sunny',
    summary: '32°C - Nang',
    tempMin: 28,
    tempMax: 34,
    humidityPercent: 74,
    windSpeed: 9,
    rainProbability: 12,
    sourceName: 'TravelViet mock',
  },
  {
    id: 6,
    destinationId: 106,
    forecastDate: '2026-05-01',
    weatherCode: 'foggy',
    summary: '12°C - Suong mu',
    tempMin: 10,
    tempMax: 16,
    humidityPercent: 88,
    windSpeed: 7,
    rainProbability: 35,
    sourceName: 'TravelViet mock',
  },
];

export const BACKEND_TOUR_MOCKS: BackendTourMock[] = [
  {
    id: 1,
    code: 'TV-MT-003D',
    name: 'Hanh trinh di san Mien Tay',
    slug: 'hanh-trinh-di-san-mien-tay',
    destinationId: 105,
    basePrice: 1200000,
    currency: 'VND',
    durationDays: 3,
    durationNights: 2,
    shortDescription:
      'Song nuoc, cho noi, rung tram va nhung bua an dia phuong trong mot lich trinh gon gang.',
    description:
      'Tour phu hop cho gia dinh va nhom ban muon trai nghiem mien song nuoc voi lich trinh vua du, it di chuyen gap.',
    transportType: 'Xe du lich',
    tripMode: 'Mien Nam',
    highlights: 'Cho noi Cai Be\nRung tram Tra Su\nAm thuc mien song nuoc',
    inclusions: 'Xe dua don\nKhach san tieu chuan\nHuong dan vien\nBua an theo chuong trinh',
    exclusions: 'Chi phi ca nhan\nDo uong ngoai chuong trinh',
    notes: 'Mang giay de di bo va non chong nang.',
    isFeatured: true,
    status: 'active',
    averageRating: 4.8,
    totalReviews: 248,
    totalBookings: 610,
    media: [
      {
        mediaType: 'image',
        mediaUrl:
          'https://vietnamtouristvn.com/thumbs/1000x800x2/upload/product/thiet-ke-chua-co-ten-2-6106.png',
        altText: 'Mien Tay song nuoc',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 1001,
        dayNumber: 1,
        title: 'TP.HCM - Chau Doc',
        description: 'Khoi hanh buoi sang, nhan phong va tham quan cum diem tam linh ven nui.',
        items: [],
      },
      {
        id: 1002,
        dayNumber: 2,
        title: 'Rung tram - Lang noi',
        description: 'Di thuyen qua rung tram, an trua dia phuong va ghe lang nghe truyen thong.',
        items: [],
      },
      {
        id: 1003,
        dayNumber: 3,
        title: 'Cho dia phuong - Tro ve',
        description: 'Dao cho sang, mua dac san va tro ve theo lich trinh linh hoat.',
        items: [],
      },
    ],
  },
  {
    id: 2,
    code: 'TV-DL-002D',
    name: 'Thanh pho ngan hoa',
    slug: 'thanh-pho-ngan-hoa',
    destinationId: 102,
    basePrice: 2500000,
    currency: 'VND',
    durationDays: 2,
    durationNights: 1,
    shortDescription: 'Ky nghi nhip cham voi ho, doi thong, quan ca phe va khi hau mat lanh.',
    description: 'Lich trinh phu hop cap doi hoac nhom ban muon nghi nhe, chup anh va thuong thuc dac san.',
    transportType: 'Xe du lich',
    tripMode: 'Mien Trung',
    highlights: 'Ho Tuyen Lam\nDoi thong\nCho dem Da Lat',
    inclusions: 'Xe dua don\nKhach san\nVe tham quan',
    exclusions: 'Chi phi ca nhan',
    notes: 'Nen mang ao khoac mong cho buoi toi.',
    isFeatured: true,
    status: 'active',
    averageRating: 4.7,
    totalReviews: 312,
    totalBookings: 720,
    media: [
      {
        mediaType: 'image',
        mediaUrl: 'https://phetravel.com/uploads/unnamed-2025-03-12t090845827.png.webp',
        altText: 'Da Lat thanh pho ngan hoa',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 2001,
        dayNumber: 1,
        title: 'Check-in cao nguyen',
        description: 'Tham quan ho, vuon hoa va dung bua toi o khu trung tam.',
        items: [],
      },
      {
        id: 2002,
        dayNumber: 2,
        title: 'Ca phe sang - Tro ve',
        description: 'Thuong thuc ca phe view doi, mua dac san va ket thuc hanh trinh.',
        items: [],
      },
    ],
  },
  {
    id: 3,
    code: 'TV-HL-003D',
    name: 'Ky quan Vinh Ha Long',
    slug: 'ky-quan-vinh-ha-long',
    destinationId: 101,
    basePrice: 3800000,
    currency: 'VND',
    durationDays: 3,
    durationNights: 2,
    shortDescription: 'Du ngoan giua nui da voi, hang dong va mat nuoc xanh tren vinh.',
    description: 'Tour co huong dan, bua an hai san va thoi gian nghi tren vinh cho khach muon lich trinh gon ma du trai nghiem.',
    transportType: 'Xe + du thuyen',
    tripMode: 'Mien Bac',
    highlights: 'Du thuyen vinh\nHang dong\nDao Titop',
    inclusions: 'Xe dua don\nDu thuyen\nBua an\nVe tham quan',
    exclusions: 'Do uong va chi phi ca nhan',
    notes: 'Lich co the doi theo dieu kien thoi tiet tren vinh.',
    isFeatured: true,
    status: 'active',
    averageRating: 4.9,
    totalReviews: 421,
    totalBookings: 940,
    media: [
      {
        mediaType: 'image',
        mediaUrl:
          'https://nangluongsachvietnam.vn/userfile/User/thanhtam/images/2020/7/6/vinh-Ha-long-2-20200706112849136.jpeg',
        altText: 'Vinh Ha Long',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 3001,
        dayNumber: 1,
        title: 'Ha Noi - Ha Long',
        description: 'Di chuyen den ben tau, len du thuyen va an toi tren vinh.',
        items: [],
      },
      {
        id: 3002,
        dayNumber: 2,
        title: 'Hang dong - Dao Titop',
        description: 'Tham quan hang, cheo thuyen va ngam hoang hon tren boong.',
        items: [],
      },
      {
        id: 3003,
        dayNumber: 3,
        title: 'Brunch tren vinh',
        description: 'Thu gian buoi sang, tra phong va tro lai Ha Noi.',
        items: [],
      },
    ],
  },
  {
    id: 4,
    code: 'TV-PQ-003D',
    name: 'Phu Quoc - Thien duong nang vang',
    slug: 'phu-quoc-thien-duong-nang-vang',
    destinationId: 103,
    basePrice: 4500000,
    currency: 'VND',
    durationDays: 3,
    durationNights: 2,
    shortDescription: 'Nghi duong bien, hoang hon, hai san va trai nghiem dao trong mot goi tour nhe.',
    description: 'Tour bien dao de dat, phu hop cap doi, gia dinh va nhom ban muon nghi duong nhung van co hoat dong.',
    transportType: 'May bay + xe',
    tripMode: 'Bien dao',
    highlights: 'Bai Sao\nSunset Town\nLan ngam san ho',
    inclusions: 'Xe dua don\nKhach san\nTour dao\nBua an theo chuong trinh',
    exclusions: 'Ve may bay neu khach tu tuc',
    notes: 'Can mang do boi va kem chong nang.',
    isFeatured: true,
    status: 'active',
    averageRating: 4.8,
    totalReviews: 376,
    totalBookings: 830,
    media: [
      {
        mediaType: 'image',
        mediaUrl: 'https://phuquocxanh.com/vi/wp-content/uploads/2017/02/bien-dao-Phu-Quoc-1.jpg',
        altText: 'Bien dao Phu Quoc',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 4001,
        dayNumber: 1,
        title: 'Don san bay - Bien chieu',
        description: 'Nhan phong, nghi ngoi va an toi gan bien.',
        items: [],
      },
      {
        id: 4002,
        dayNumber: 2,
        title: 'Tour dao',
        description: 'Di cano, lan ngam san ho va ngam hoang hon.',
        items: [],
      },
      {
        id: 4003,
        dayNumber: 3,
        title: 'Tu do mua sam',
        description: 'Dao cho dia phuong truoc khi ra san bay.',
        items: [],
      },
    ],
  },
  {
    id: 5,
    code: 'TV-HUE-002D',
    name: 'Co do Hue co kinh',
    slug: 'co-do-hue-co-kinh',
    destinationId: 104,
    basePrice: 1900000,
    currency: 'VND',
    durationDays: 2,
    durationNights: 1,
    shortDescription: 'Dai Noi, lang tam, am thuc cung dinh va nhip song song Huong.',
    description: 'Hanh trinh van hoa co dong cho khach muon cam nhan Hue qua di san, am thuc va cau chuyen dia phuong.',
    transportType: 'Xe du lich',
    tripMode: 'Mien Trung',
    highlights: 'Dai Noi\nSong Huong\nAm thuc Hue',
    inclusions: 'Xe dua don\nHuong dan vien\nVe tham quan',
    exclusions: 'Chi phi ca nhan',
    notes: 'Nen mang du hoac ao mua mong vao mua mua.',
    isFeatured: false,
    status: 'active',
    averageRating: 4.6,
    totalReviews: 189,
    totalBookings: 460,
    media: [
      {
        mediaType: 'image',
        mediaUrl:
          'https://mia.vn/media/uploads/blog-du-lich/kinh-thanh-hue-chiem-nguong-kien-truc-vang-son-cua-13-vi-vua-trieu-dai-nha-nguyen-08-1638156842.jpg',
        altText: 'Kinh thanh Hue',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 5001,
        dayNumber: 1,
        title: 'Dai Noi - Chua Thien Mu',
        description: 'Tham quan di san trung tam va dung bua toi mon Hue.',
        items: [],
      },
      {
        id: 5002,
        dayNumber: 2,
        title: 'Lang tam - Tro ve',
        description: 'Ghe lang vua, mua dac san va ket thuc hanh trinh.',
        items: [],
      },
    ],
  },
  {
    id: 6,
    code: 'TV-SP-003D',
    name: 'Sapa - Cham tay vao may',
    slug: 'sapa-cham-tay-vao-may',
    destinationId: 106,
    basePrice: 2700000,
    currency: 'VND',
    durationDays: 3,
    durationNights: 2,
    shortDescription: 'Nui rung Tay Bac, ruong bac thang, ban lang va nhung cung duong san may.',
    description: 'Hanh trinh cho khach thich khong khi lanh, canh nui va van hoa ban dia voi lich trinh vua phai.',
    transportType: 'Xe giuong nam',
    tripMode: 'Mien Bac',
    highlights: 'Fansipan\nBan Cat Cat\nRuong bac thang',
    inclusions: 'Xe dua don\nKhach san\nVe tham quan\nHuong dan vien',
    exclusions: 'Chi phi ca nhan',
    notes: 'Nen mang ao am va giay de di bo.',
    isFeatured: false,
    status: 'active',
    averageRating: 4.7,
    totalReviews: 267,
    totalBookings: 590,
    media: [
      {
        mediaType: 'image',
        mediaUrl:
          'https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1741942656.jpg&w=3840&q=75',
        altText: 'Sapa nui rung',
        sortOrder: 1,
        isActive: true,
      },
    ],
    itineraryDays: [
      {
        id: 6001,
        dayNumber: 1,
        title: 'Lao Cai - Sapa',
        description: 'Nhan phong, dao thi tran va thuong thuc dac san vung cao.',
        items: [],
      },
      {
        id: 6002,
        dayNumber: 2,
        title: 'Fansipan - Ban lang',
        description: 'Chinh phuc noc nha Dong Duong va tham quan ban dia phuong.',
        items: [],
      },
      {
        id: 6003,
        dayNumber: 3,
        title: 'Cho Sapa - Tro ve',
        description: 'Mua dac san, chup anh va khoi hanh ve diem don.',
        items: [],
      },
    ],
  },
];

function formatMoney(value: number, currency: string) {
  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value)}${currency === 'VND' ? 'đ' : ` ${currency}`}`;
}

function formatDuration(days: number, nights: number) {
  return `${days} ngay ${nights} dem`;
}

function parseHighlights(value: string) {
  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getDestinationById(destinationId: number) {
  return BACKEND_DESTINATION_MOCKS.find((item) => item.id === destinationId);
}

export function getDestinationByUuid(destinationUuid: string) {
  return BACKEND_DESTINATION_MOCKS.find((item) => item.uuid === destinationUuid);
}

export function getWeatherByDestinationId(destinationId: number) {
  return BACKEND_WEATHER_MOCKS.find((item) => item.destinationId === destinationId);
}

export const TOURS_DATA: TourData[] = BACKEND_TOUR_MOCKS.map((tour) => {
  const destination = getDestinationById(tour.destinationId);
  const weather = getWeatherByDestinationId(tour.destinationId);
  const image =
    tour.media
      .filter((item) => item.isActive && item.mediaType === 'image')
      .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.mediaUrl ?? '';

  return {
    id: String(tour.id),
    title: tour.name,
    destinationId: tour.destinationId,
    destinationUuid: destination?.uuid ?? '',
    destinationName: destination?.name ?? tour.transportType,
    location: destination
      ? `${destination.name} - ${destination.province}`
      : tour.transportType,
    price: formatMoney(tour.basePrice, tour.currency),
    weather: weather?.summary ?? 'Dang cap nhat',
    category: tour.tripMode,
    image,
    days: formatDuration(tour.durationDays, tour.durationNights),
    rating: tour.averageRating,
    reviewCount: tour.totalReviews,
    description: tour.shortDescription || tour.description,
    highlights: parseHighlights(tour.highlights),
    itinerary: tour.itineraryDays.map((day) => ({
      day: `Ngay ${day.dayNumber}`,
      title: day.title,
      description: day.description,
    })),
  };
});

export const DESTINATIONS_DATA: DestinationData[] = BACKEND_DESTINATION_MOCKS.filter(
  (item) => item.isFeatured,
).map((destination) => ({
  id: destination.uuid,
  name: destination.name,
  region: destination.region,
  tours: `${destination.activeTourCount} tour`,
  image: destination.coverImageUrl,
}));

export const HOME_STATS = [
  { value: '120+', label: 'lich trinh' },
  { value: '4.8/5', label: 'danh gia' },
  { value: '24h', label: 'giu cho' },
  { value: '35', label: 'doi tac' },
];

export const SERVICE_ITEMS = [
  'Hoan tien linh hoat',
  'Bao hiem du lich',
  'Cam nang diem den',
  'Ho tro 24/7',
];
