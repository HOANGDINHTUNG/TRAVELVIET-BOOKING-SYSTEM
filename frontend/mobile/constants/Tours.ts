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

function getDestination(destinationId: number) {
  return BACKEND_DESTINATION_MOCKS.find((item) => item.id === destinationId);
}

function getWeather(destinationId: number) {
  return BACKEND_WEATHER_MOCKS.find((item) => item.destinationId === destinationId);
}

const EXTRA_MOCK_TOURS: TourData[] = [
  {
    id: 't1',
    title: 'Hải Phòng 1N – Khám phá Đảo Cát Bà',
    location: 'Cát Bà - Hải Phòng',
    price: '900.000 đ',
    weather: '28°C - Nắng nhẹ',
    category: 'Miền Bắc',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600',
    days: '1 ngày 0 đêm',
    rating: 4.8,
    reviewCount: 24,
    description: 'Chương trình khám phá đảo ngọc Cát Bà trong ngày, đi tàu cao tốc ngắm vịnh Lan Hạ, tắm biển tại bãi Cát Cò và leo núi ngắm toàn cảnh pháo đài thần công.',
    highlights: ['Vịnh Lan Hạ', 'Bãi tắm Cát Cò', 'Pháo đài thần công', 'Hải sản Cát Bà'],
    itinerary: [
      { day: 'Ngày 1', title: 'Hải Phòng - Đảo Cát Bà', description: 'Đón khách tại Hải Phòng, đi tàu cao tốc sang Cát Bà. Tham quan Vịnh Lan Hạ, ăn trưa hải sản trên bè nổi. Chiều tự do tắm biển Cát Cò và khởi hành về lại Hải Phòng.' }
    ]
  },
  {
    id: 't2',
    title: 'Hải Phòng 2N – Khám phá Vịnh Lan Hạ',
    location: 'Lan Hạ - Hải Phòng',
    price: '1.800.000 đ',
    weather: '27°C - Có mây',
    category: 'Miền Bắc',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    days: '2 ngày 1 đêm',
    rating: 4.9,
    reviewCount: 30,
    description: 'Trải nghiệm ngủ đêm trên du thuyền Vịnh Lan Hạ hoang sơ, chèo thuyền kayak qua hang sáng tối và thưởng thức bữa tiệc hoàng hôn lãng mạn giữa biển khơi.',
    highlights: ['Du thuyền ngủ đêm', 'Hang Sáng Tối', 'Chèo Kayak', 'Sunset Party'],
    itinerary: [
      { day: 'Ngày 1', title: 'Bến Gót - Vịnh Lan Hạ', description: 'Lên du thuyền nhận phòng, thưởng thức bữa trưa. Chiều chèo thuyền kayak khám phá vịnh và tắm biển.' },
      { day: 'Ngày 2', title: 'Hang Luồn - Trở về', description: 'Tập dưỡng sinh trên boong tàu đón bình minh. Tham quan hang Luồn và thưởng thức brunch trước khi cập bến.' }
    ]
  },
  {
    id: 't3',
    title: 'Quảng Ninh 1N – Khám phá Vịnh Hạ Long',
    location: 'Hạ Long - Quảng Ninh',
    price: '900.000 đ',
    weather: '29°C - Nắng đẹp',
    category: 'Miền Bắc',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600',
    days: '1 ngày 0 đêm',
    rating: 4.7,
    reviewCount: 18,
    description: 'Khám phá di sản thiên nhiên thế giới Vịnh Hạ Long với hành trình tuyến 2 qua các hang động kỳ vĩ nhất như Hang Sửng Sốt, Động Mê Cung và đảo Titop.',
    highlights: ['Hang Sửng Sốt', 'Đảo Titop', 'Động Mê Cung', 'Chèo đò nan'],
    itinerary: [
      { day: 'Ngày 1', title: 'Hạ Long - Tham quan vịnh', description: 'Lên tàu thăm vịnh. Tham quan Hang Sửng Sốt, chèo thuyền kayak tại Hang Luồn. Chiều leo đỉnh Titop ngắm cảnh vịnh và tắm biển trước khi về bến.' }
    ]
  },
  {
    id: 't4',
    title: 'Quảng Ngãi 2N – Khám phá Biển Mỹ Khê Quảng Ngãi',
    location: 'Mỹ Khê - Quảng Ngãi',
    price: '1.800.000 đ',
    weather: '31°C - Nắng',
    category: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600',
    days: '2 ngày 1 đêm',
    rating: 4.6,
    reviewCount: 15,
    description: 'Kỳ nghỉ hoang sơ tại bãi biển Mỹ Khê - Quảng Ngãi, tham quan khu chứng tích Sơn Mỹ và thưởng thức các món ăn đặc sản xứ Quảng như cá bống sông Trà, don nóng.',
    highlights: ['Bãi biển Mỹ Khê', 'Chứng tích Sơn Mỹ', 'Cá bống sông Trà', 'Nghỉ dưỡng yên bình'],
    itinerary: [
      { day: 'Ngày 1', title: 'Quảng Ngãi - Biển Mỹ Khê', description: 'Đón khách về resort nhận phòng nghỉ ngơi. Chiều tắm biển Mỹ Khê và thưởng thức don Quảng Ngãi.' },
      { day: 'Ngày 2', title: 'Chứng tích Sơn Mỹ - Tiễn khách', description: 'Tham quan khu chứng tích Sơn Mỹ lịch sử. Mua đặc sản kẹo gương, mạch nha và tiễn khách kết thúc tour.' }
    ]
  },
  {
    id: 't5',
    title: 'Khánh Hòa 1N – Khám phá Nha Trang',
    location: 'Nha Trang - Khánh Hòa',
    price: '200.000 đ',
    weather: '30°C - Nắng ấm',
    category: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    days: '1 ngày 0 đêm',
    rating: 4.5,
    reviewCount: 12,
    description: 'City tour Nha Trang giá siêu tiết kiệm, tham quan Tháp Bà Ponagar cổ kính, Chùa Long Sơn, Nhà thờ Đá và trải nghiệm tắm bùn khoáng nóng thư giãn.',
    highlights: ['Tháp Bà Ponagar', 'Chùa Long Sơn', 'Nhà thờ Núi', 'Tắm bùn khoáng'],
    itinerary: [
      { day: 'Ngày 1', title: 'Khám phá Nha Trang City', description: 'Xe đón tham quan Chùa Long Sơn, Tháp Bà Ponagar. Thưởng thức bún sứa Nha Trang. Chiều tự do tắm biển hoặc tắm bùn trước khi kết thúc tour.' }
    ]
  },
  {
    id: 't6',
    title: 'Nghỉ dưỡng Phú Quốc 3N2Đ',
    location: 'Phú Quốc - Kiên Giang',
    price: '3.750.000 đ',
    weather: '32°C - Nắng rực rỡ',
    category: 'Miền Nam',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
    days: '3 ngày 2 đêm',
    rating: 4.9,
    reviewCount: 45,
    description: 'Trọn gói nghỉ dưỡng tại resort 4 sao Phú Quốc, đi cáp treo hòn Thơm vượt biển dài nhất thế giới, khám phá Grand World thành phố không ngủ.',
    highlights: ['Cáp treo Hòn Thơm', 'Resort 4 sao biển', 'Grand World', 'Sunset Sanato'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón bay - Grand World', description: 'Xe đón sân bay Phú Quốc đưa về resort. Tối tham quan Grand World sầm uất với show diễn Sắc Màu Venice.' },
      { day: 'Ngày 2', title: 'Cano 4 Đảo - Cáp treo', description: 'Trải nghiệm tour cano 4 đảo ngắm san ho, ăn trưa trên đảo hoang. Trở về bằng cáp treo Hòn Thơm ngắm hoàng hôn.' },
      { day: 'Ngày 3', title: 'Chợ Dương Đông - Tiễn bay', description: 'Mua sắm đặc sản ngọc trai, nước mắm, tiêu Phú Quốc. Tiễn khách ra sân bay kết thúc hành trình.' }
    ]
  },
  {
    id: 't7',
    title: 'Nghỉ dưỡng Côn Đảo 3N2Đ',
    location: 'Côn Đảo - Bà Rịa Vũng Tàu',
    price: '3.700.000 đ',
    weather: '29°C - Gió mát',
    category: 'Miền Nam',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600',
    days: '3 ngày 2 đêm',
    rating: 4.8,
    reviewCount: 22,
    description: 'Chương trình du lịch tâm linh kết hợp nghỉ dưỡng biển hoang sơ tại Côn Đảo. Viếng mộ cô Sáu, nghĩa trang Hàng Dương và khám phá nhà tù Côn Đảo.',
    highlights: ['Viếng mộ cô Sáu', 'Nhà tù Côn Đảo', 'Bãi Đầm Trầu', 'Nghĩa trang Hàng Dương'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón bay Côn Đảo - Trại Phú Hải', description: 'Xe đưa về khách sạn. Chiều viếng trại giam Phú Hải, Chuồng Cọp Pháp Mỹ. Tối đi viếng mộ cô Sáu linh thiêng.' },
      { day: 'Ngày 2', title: 'Bãi Đầm Trầu - Miếu Bà', description: 'Tham quan bãi Đầm Trầu ngắm máy bay hạ cánh sát bãi tắm. Viếng miếu bà Phi Yến và tắm biển tự do.' },
      { day: 'Ngày 3', title: 'Chợ Côn Đảo - Tiễn bay', description: 'Viếng chùa Núi Một ngắm hồ sen An Hải. Mua mứt hạt bàng đặc sản và tiễn bay về lại đất liền.' }
    ]
  },
  {
    id: 't8',
    title: 'Nghỉ dưỡng Nha Trang 3N2Đ',
    location: 'Nha Trang - Khánh Hòa',
    price: '3.700.000 đ',
    weather: '30°C - Nắng đẹp',
    category: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600',
    days: '3 ngày 2 đêm',
    rating: 4.7,
    reviewCount: 19,
    description: 'Kỳ nghỉ 3 ngày 2 đêm thư thái tại vịnh biển Nha Trang, khám phá đảo hoa lan đảo khỉ vinh Nha Phu, nghỉ dưỡng resort có bãi biển riêng sang trọng.',
    highlights: ['Vịnh Nha Phu', 'Đảo Hoa Lan', 'Resort bãi biển riêng', 'Hải sản phong phú'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón ga/bay Nha Trang - Nhận phòng', description: 'Xe đón đưa về resort nghỉ ngơi. Chiều tắm biển tự do và ăn tối buffet hải sản vỉa hè Nha Trang.' },
      { day: 'Ngày 2', title: 'Khu du lịch Đảo Hoa Lan', description: 'Đi tàu qua vịnh Nha Phu thăm đảo Hoa Lan, cưỡi voi, xem xiếc thú và chèo kayak rừng ngập mặn.' },
      { day: 'Ngày 3', title: 'Chợ Đầm - Tiễn khách', description: 'Ghé chợ Đầm mua dừa xiêm, yến sào Nha Trang. Tiễn khách ra sân bay Cam Ranh/Ga Nha Trang.' }
    ]
  },
  {
    id: 't9',
    title: 'Thái Lan 5N4Đ: Bangkok - Pattaya',
    location: 'Bangkok - Thái Lan',
    price: '5.990.000 đ',
    weather: '32°C - Nắng nóng',
    category: 'Nước ngoài',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600',
    days: '5 ngày 4 đêm',
    rating: 4.8,
    reviewCount: 120,
    description: 'Khám phá xứ sở Chùa Vàng với tour trọn gói Bangkok - Pattaya bay khứ hồi cực hot. Thăm chùa Phật Vàng, chợ nổi bốn miền, và tắm biển đảo Coral san hồ tuyệt đẹp.',
    highlights: ['Tặng buffet nhà hàng 86 tầng', 'Đảo Coral Pattaya', 'Chùa Phật Vàng linh thiêng', 'Show diễn Alcazar'],
    itinerary: [
      { day: 'Ngày 1', title: 'TP.HCM - Bangkok - Pattaya', description: 'Bay đi Bangkok. Di chuyển đi Pattaya, nhận phòng và ăn tối hải sản vỉa hè.' },
      { day: 'Ngày 2', title: 'Đảo San Hô Coral - Trân Bảo Phật Sơn', description: 'Đi cano tắm biển đảo Coral. Chiều viếng núi Phật khắc vàng Khau Chee Chan, ăn tối buffet.' },
      { day: 'Ngày 3', title: 'Pattaya - Bangkok - Chợ Nổi', description: 'Khởi hành về lại Bangkok, ghé thăm chợ nổi bốn miền. Tối tự do mua sắm tại Big C.' },
      { day: 'Ngày 4', title: 'Chùa Phật Vàng - Dạo thuyền sông Chao Phraya', description: 'Viếng chùa Wat Traimit, dạo thuyền ngắm cá nổi sông Chao Phraya. Tối thưởng thức ẩm thực đường phố.' },
      { day: 'Ngày 5', title: 'Bangkok - TP.HCM', description: 'Tự do mua sắm và tiễn bay về lại Việt Nam.' }
    ]
  },
  {
    id: 't10',
    title: 'Nhật Bản 6N5Đ: Tokyo - Fuji - Kyoto - Osaka',
    location: 'Tokyo - Nhật Bản',
    price: '24.900.000 đ',
    weather: '18°C - Mát mẻ',
    category: 'Nước ngoài',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
    days: '6 ngày 5 đêm',
    rating: 4.9,
    reviewCount: 85,
    description: 'Hành trình vàng khám phá Nhật Bản mùa thu/mùa anh đào rực rỡ. Chiêm ngưỡng núi Phú Sĩ kỳ vĩ, viếng đền cổ Kyoto, trải nghiệm tàu siêu tốc Shinkansen và mua sắm thả ga tại Shinjuku.',
    highlights: ['Ngắm núi Phú Sĩ', 'Trải nghiệm tàu Shinkansen', 'Đền cổ Kinkakuji Kyoto', 'Lâu đài Osaka'],
    itinerary: [
      { day: 'Ngày 1', title: 'Hà Nội/TP.HCM - Tokyo', description: 'Bay đêm sang sân bay Narita Tokyo. Nhận phòng và tham quan đền Asakusa cổ kính.' },
      { day: 'Ngày 2', title: 'Tokyo City Tour - Núi Phú Sĩ', description: 'Check-in tháp truyền hình Skytree. Chiều di chuyển về khu vực Phú Sĩ ngủ đêm tắm Oonsen.' },
      { day: 'Ngày 3', title: 'Phú Sĩ - Trải nghiệm tàu Shinkansen', description: 'Tham quan làng cổ Oshino Hakkai. Trải nghiệm tàu siêu tốc Shinkansen đến Nagoya.' },
      { day: 'Ngày 4', title: 'Kyoto - Chùa Vàng Kinkakuji - Osaka', description: 'Viếng chùa Vàng nổi tiếng, rừng tre Arashiyama. Di chuyển đến Osaka mua sắm ở Shinsaibashi.' },
      { day: 'Ngày 5', title: 'Lâu đài Osaka - Universal Studios', description: 'Chụp ảnh lưu niệm tại lâu đài Osaka. Tự do vui chơi tại công viên giải trí Universal.' },
      { day: 'Ngày 6', title: 'Kansai - Việt Nam', description: 'Đến sân bay Kansai, làm thủ tục bay về Việt Nam.' }
    ]
  },
  {
    id: 't11',
    title: 'Hà Nội 3N2Đ: Khám phá Thủ Đô ngàn năm văn hiến',
    location: 'Hà Nội - Việt Nam',
    price: '2.450.000 đ',
    weather: '26°C - Trời mát',
    category: 'Miền Bắc',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600',
    days: '3 ngày 2 đêm',
    rating: 4.8,
    reviewCount: 92,
    description: 'Hành trình khám phá thủ đô cổ kính với các địa danh nổi tiếng: Hồ Gươm, Lăng Bác, Văn Miếu, Phố Cổ đường tàu và thưởng thức ẩm thực Hà Nội trứ danh.',
    highlights: ['Lăng Chủ Tịch', 'Hồ Hoàn Kiếm', 'Văn Miếu Quốc Tử Giám', 'Phố Cổ Đường Tàu'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón sân bay - Hồ Hoàn Kiếm', description: 'Xe đón quý khách từ sân bay Nội Bài về khách sạn nhận phòng. Chiều dạo quanh Hồ Hoàn Kiếm, Cầu Thê Húc, Đền Ngọc Sơn và dạo phố cổ bằng xe điện.' },
      { day: 'Ngày 2', title: 'Lăng Bác - Văn Miếu - Cà phê Trứng', description: 'Viếng Lăng Bác, Quảng trường Ba Đình, Chùa Một Cột. Chiều tham quan Văn Miếu Quốc Tử Giám. Tối thưởng thức cà phê trứng tại quán cà phê Giảng nổi tiếng.' },
      { day: 'Ngày 3', title: 'Cầu Long Biên - Tiễn bay', description: 'Chụp ảnh tại cầu Long Biên cổ kính, mua sắm đặc sản bánh cốm Hàng Than trước khi xe tiễn ra sân bay Nội Bài.' }
    ]
  },
  {
    id: 't12',
    title: 'Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ',
    location: 'Đà Nẵng - Việt Nam',
    price: '4.890.000 đ',
    weather: '29°C - Nắng ấm',
    category: 'Miền Trung',
    image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=600',
    days: '4 ngày 3 đêm',
    rating: 4.9,
    reviewCount: 145,
    description: 'Hành trình tuyệt đẹp đến thành phố đáng sống nhất Việt Nam: chiêm ngưỡng Cầu Vàng trên đỉnh Bà Nà Hills, dạo phố cổ Hội An lung linh đèn lồng và tắm biển Mỹ Khê cát mịn.',
    highlights: ['Cầu Vàng Bà Nà Hills', 'Phố cổ Hội An', 'Biển Mỹ Khê', 'Bán đảo Sơn Trà'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón sân bay - Sơn Trà - Ngũ Hành Sơn', description: 'Xe đón quý khách về khách sạn. Chiều viếng chùa Linh Ứng Sơn Trà và tham quan danh thắng Ngũ Hành Sơn. Tối dạo phố ngắm Cầu Rồng phun lửa.' },
      { day: 'Ngày 2', title: 'Bà Nà Hills - Cầu Vàng', description: 'Trải nghiệm cáp treo lên đỉnh Bà Nà. Check-in Cầu Vàng lơ lửng giữa mây, vui chơi tại Fantasy Park và tham quan hầm rượu cổ Debay.' },
      { day: 'Ngày 3', title: 'Tắm biển Mỹ Khê - Phố cổ Hội An', description: 'Sáng tự do tắm biển Mỹ Khê. Chiều khởi hành đi phố cổ Hội An, tham quan Chùa Cầu, nhà cổ Phùng Hưng và dạo thuyền thả hoa đăng.' },
      { day: 'Ngày 4', title: 'Chợ Hàn - Tiễn sân bay', description: 'Mua sắm đặc sản tại Chợ Hàn: mực rim, chả bò Đà Nẵng. Xe tiễn quý khách ra sân bay Đà Nẵng kết thúc tour.' }
    ]
  },
  {
    id: 't13',
    title: 'Sài Gòn sầm uất & Địa đạo Củ Chi 2N1Đ',
    location: 'Sài Gòn - Việt Nam',
    price: '2.150.000 đ',
    weather: '31°C - Nắng',
    category: 'Miền Nam',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600',
    days: '2 ngày 1 đêm',
    rating: 4.7,
    reviewCount: 68,
    description: 'Khám phá sự sầm uất hiện đại của TP.HCM kết hợp tour di tích lịch sử Địa đạo Củ Chi độc đáo, ngắm thành phố từ Landmark 81 và thưởng thức cơm tấm đêm.',
    highlights: ['Địa đạo Củ Chi', 'Dinh Độc Lập', 'Landmark 81 Skyview', 'Cơm tấm đêm Sài Gòn'],
    itinerary: [
      { day: 'Ngày 1', title: 'Đón khách - Khám phá Củ Chi', description: 'Khởi hành tham quan Địa đạo Củ Chi - hệ thống hầm ngầm kỳ vĩ thời kháng chiến. Chiều về lại trung tâm nhận phòng. Tối lên đài quan sát Landmark 81 Skyview ngắm toàn cảnh thành phố.' },
      { day: 'Ngày 2', title: 'Dinh Độc Lập - Nhà thờ Đức Bà - Chợ Bến Thành', description: 'Tham quan Dinh Độc Lập, Bưu điện TP và chụp ảnh Nhà thờ Đức Bà. Mua sắm lưu niệm tại Chợ Bến Thành trước khi kết thúc tour.' }
    ]
  },
  {
    id: 't14',
    title: 'Hàn Quốc 5N4Đ: Seoul - Đảo Nami - Everland',
    location: 'Seoul - Hàn Quốc',
    price: '14.990.000 đ',
    weather: '20°C - Mát mẻ',
    category: 'Nước ngoài',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600',
    days: '5 ngày 4 đêm',
    rating: 4.8,
    reviewCount: 110,
    description: 'Tour du lịch Hàn Quốc trọn gói đưa du khách check-in Cung điện Gyeongbokgung cổ kính, dạo bước trên đảo Nami lãng mạn, vui chơi tẹt ga tại công viên giải trí Everland.',
    highlights: ['Cung điện Gyeongbokgung', 'Đảo Nami lãng mạn', 'Công viên Everland', 'Mặc Hanbok truyền thống'],
    itinerary: [
      { day: 'Ngày 1', title: 'Việt Nam - Seoul', description: 'Đón khách tại sân bay quốc tế Nội Bài/Tân Sơn Nhất làm thủ tục đáp chuyến bay đêm sang Seoul - Hàn Quốc.' },
      { day: 'Ngày 2', title: 'Cung điện Gyeongbokgung - Bukchon Hanok', description: 'Đến sân bay Incheon. Tham quan Cung điện Hoàng Gia Gyeongbokgung, Làng cổ Bukchon Hanok. Trải nghiệm mặc Hanbok truyền thống chụp ảnh lưu niệm.' },
      { day: 'Ngày 3', title: 'Đảo Nami - Tháp Namsan', description: 'Khởi hành tham quan đảo Nami - bối cảnh bộ phim Bản Tình Ca Mùa Đông. Chiều về lại Seoul viếng tháp Namsan treo khóa tình yêu.' },
      { day: 'Ngày 4', title: 'Công viên Everland - Mua sắm', description: 'Vui chơi trọn ngày tại Everland - một trong 10 công viên giải trí lớn nhất thế giới. Chiều tối tự do mua sắm mỹ phẩm tại Myeongdong.' },
      { day: 'Ngày 5', title: 'Seoul - Việt Nam', description: 'Mua sắm sâm và quà lưu niệm tại trung tâm bách hóa. Xe tiễn sân bay Incheon đáp chuyến bay về lại Việt Nam.' }
    ]
  }
];

export const TOURS_DATA: TourData[] = [
  ...BACKEND_TOUR_MOCKS.map((tour) => {
    const destination = getDestination(tour.destinationId);
    const weather = getWeather(tour.destinationId);
    const image =
      tour.media
        .filter((item) => item.isActive && item.mediaType === 'image')
        .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.mediaUrl ?? '';

    return {
      id: String(tour.id),
      title: tour.name,
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
  }),
  ...EXTRA_MOCK_TOURS
];

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

export type ServiceItemType = {
  key: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  icon: string;
};

export const SERVICE_ITEMS_DATA: ServiceItemType[] = [
  {
    key: 'refund',
    titleVi: 'Hoàn tiền linh hoạt',
    titleEn: 'Flexible Refund',
    descVi: 'Chính sách hoàn hủy linh hoạt của TravelViet cho phép khách hàng hủy tour trước 48 giờ khởi hành và nhận lại tới 90% chi phí. Áp dụng cho các tour có nhãn linh hoạt.',
    descEn: 'TravelViet\'s flexible refund policy allows customers to cancel bookings up to 48 hours prior to departure and receive up to a 90% refund. Valid for tours with a flexible label.',
    icon: 'cash-outline',
  },
  {
    key: 'insurance',
    titleVi: 'Bảo hiểm du lịch',
    titleEn: 'Travel Insurance',
    descVi: 'Mỗi tour trọn gói của TravelViet đã bao gồm gói bảo hiểm du lịch quốc tế/nội địa với mức bồi thường tối đa lên tới 100.000.000 đ/vụ, đảm bảo an tâm tuyệt đối.',
    descEn: 'Every all-inclusive tour by TravelViet includes a comprehensive domestic/international travel insurance package with coverages up to 100,000,000 VND per incident, ensuring absolute peace of mind.',
    icon: 'shield-checkmark-outline',
  },
  {
    key: 'guide',
    titleVi: 'Cẩm nang điểm đến',
    titleEn: 'Destination Guide',
    descVi: 'Nhận ngay cẩm nang du lịch kỹ thuật số chi tiết (ẩm thực, mua sắm, văn hóa, danh lam thắng cảnh) được biên soạn độc quyền bởi các chuyên gia TravelViet ngay sau khi đặt tour.',
    descEn: 'Receive a digital travel guide containing handpicked advice on food, shopping, culture, and sightseeing compiled by TravelViet destination experts immediately after booking.',
    icon: 'book-outline',
  },
  {
    key: 'support',
    titleVi: 'Hỗ trợ 24/7',
    titleEn: '24/7 Support Desk',
    descVi: 'Đội ngũ tổng đài viên và trợ lý hỗ trợ khách hàng hoạt động liên tục 24 giờ mỗi ngày, sẵn sàng xử lý mọi tình huống phát sinh và giải đáp thắc mắc của bạn qua Hotline/Chat.',
    descEn: 'Our customer support assistants are available 24/7 via Hotline or Chat to handle any unexpected situations during your trip and answer any queries you might have.',
    icon: 'chatbubble-ellipses-outline',
  },
];
