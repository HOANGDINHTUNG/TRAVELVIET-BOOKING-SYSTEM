export type DestinationDetailLocale = 'vi' | 'en'

export type DestinationDetailCopy = {
  backHome: string
  loading: string
  missingUuid: string
  loadError: string
  missingDestination: string
  detailErrorTitle: string
  heroKicker: string
  defaultShort: string
  overviewKicker: string
  overviewTitle: (name: string) => string
  noDescription: string
  dossierTitle: string
  idealTime: string
  backendData: string
  crowdDefault: string
  defaultCrowdNote: string
  media: string
  mediaNote: (images: number, videos: number) => string
  contentBlocks: string
  contentBlocksNote: string
  intelligenceKicker: string
  intelligenceTitle: string
  forecast: string
  noForecast: string
  waitingBackend: string
  crowdPrediction: string
  useDefaultCrowd: string
  activeAlerts: string
  loadingWeather: string
  weatherApi: string
  galleryKicker: string
  galleryTitle: string
  noMedia: string
  videoLabel: string
  foodKicker: string
  foodTitle: string
  noFood: string
  featured: string
  noItemDescription: string
  specialtyKicker: string
  specialtyTitle: string
  noSpecialty: string
  activityKicker: string
  activityTitle: string
  noActivity: string
  noScore: string
  score: (value: string) => string
  tipKicker: string
  tipTitle: string
  noTip: string
  eventKicker: string
  eventTitle: string
  noEvent: string
  event: string
  updating: string
  active: string
  inactive: string
  plannerKicker: string
  plannerTitle: (name: string) => string
  plannerCopy: string
  plannerAction: string
  facts: Record<string, string>
  crowdLabels: Record<string, string>
  monthNames: string[]
}

export const destinationDetailCopyByLocale: Record<
  DestinationDetailLocale,
  DestinationDetailCopy
> = {
  vi: {
    backHome: 'Về trang chủ',
    loading: 'Đang tải chi tiết điểm đến...',
    missingUuid: 'Thiếu mã điểm đến.',
    loadError: 'Không thể tải thông tin điểm đến.',
    missingDestination: 'Điểm đến không tồn tại.',
    detailErrorTitle: 'Không thể tải điểm đến',
    heroKicker: 'Hồ sơ điểm đến',
    defaultShort:
      'Hồ sơ điểm đến được lấy trực tiếp từ backend TravelViet.',
    overviewKicker: 'Tổng quan',
    overviewTitle: (name) => `Thông tin chi tiết về ${name}`,
    noDescription:
      'Backend chưa có mô tả chi tiết cho điểm đến này.',
    dossierTitle: 'Thông tin đầy đủ',
    idealTime: 'Thời điểm lý tưởng',
    backendData: 'Dữ liệu từ backend destination',
    crowdDefault: 'Mức đông dự kiến',
    defaultCrowdNote: 'Giá trị mặc định của điểm đến',
    media: 'Thư viện media',
    mediaNote: (images, videos) => `${images} ảnh / ${videos} video`,
    contentBlocks: 'Nội dung du lịch',
    contentBlocksNote:
      'Món ăn, đặc sản, hoạt động, mẹo và sự kiện',
    intelligenceKicker: 'Dữ liệu hỗ trợ chuyến đi',
    intelligenceTitle: 'Thời tiết và mức độ đông',
    forecast: 'Dự báo gần nhất',
    noForecast: 'Chưa có dự báo',
    waitingBackend: 'Đang chờ backend cập nhật',
    crowdPrediction: 'Lượng khách dự kiến',
    useDefaultCrowd:
      'Dùng mức đông mặc định nếu chưa có prediction',
    activeAlerts: 'Cảnh báo đang hoạt động',
    loadingWeather: 'Đang tải...',
    weatherApi: 'Lấy từ weather API',
    galleryKicker: 'Thư viện hình ảnh',
    galleryTitle: 'Ảnh và video của điểm đến',
    noMedia: 'Backend chưa có media cho điểm đến này.',
    videoLabel: 'Xem video điểm đến',
    foodKicker: 'Ẩm thực',
    foodTitle: 'Món ăn nên thử',
    noFood: 'Chưa có món ăn trong backend.',
    featured: 'Nổi bật',
    noItemDescription: 'Chưa có mô tả.',
    specialtyKicker: 'Dấu ấn địa phương',
    specialtyTitle: 'Đặc sản và điểm riêng',
    noSpecialty: 'Chưa có đặc sản trong backend.',
    activityKicker: 'Trải nghiệm',
    activityTitle: 'Hoạt động nên đưa vào lịch trình',
    noActivity: 'Chưa có hoạt động trong backend.',
    noScore: 'Chưa chấm điểm',
    score: (value) => `${value}/10`,
    tipKicker: 'Mẹo du lịch',
    tipTitle: 'Gợi ý cho khách',
    noTip: 'Chưa có mẹo du lịch trong backend.',
    eventKicker: 'Sự kiện',
    eventTitle: 'Sự kiện liên quan',
    noEvent: 'Chưa có sự kiện trong backend.',
    event: 'Sự kiện',
    updating: 'Đang cập nhật',
    active: 'Đang hiển thị',
    inactive: 'Tạm dừng',
    plannerKicker: 'TravelViet planner',
    plannerTitle: (name) => `Muốn lên lịch trình tới ${name}?`,
    plannerCopy:
      'Dùng hồ sơ điểm đến, thời tiết, media và các gợi ý trải nghiệm để thiết kế tour phù hợp với từng nhóm khách.',
    plannerAction: 'Tư vấn lịch trình',
    facts: {
      uuid: 'UUID',
      slug: 'Slug',
      country: 'Quốc gia',
      province: 'Tỉnh / Thành phố',
      district: 'Quận / Huyện',
      region: 'Vùng miền',
      address: 'Địa chỉ',
      latitude: 'Vĩ độ',
      longitude: 'Kinh độ',
      bestTime: 'Mùa đẹp nhất',
      crowd: 'Mức đông mặc định',
      featured: 'Điểm đến nổi bật',
      yes: 'Có',
      no: 'Không',
      vietnam: 'Việt Nam',
    },
    crowdLabels: {
      LOW: 'Thấp',
      MEDIUM: 'Trung bình',
      HIGH: 'Cao',
      VERY_HIGH: 'Rất cao',
    },
    monthNames: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
  },
  en: {
    backHome: 'Back to home',
    loading: 'Loading destination details...',
    missingUuid: 'Missing destination id.',
    loadError: 'Could not load destination information.',
    missingDestination: 'Destination does not exist.',
    detailErrorTitle: 'Could not load destination',
    heroKicker: 'Destination profile',
    defaultShort:
      'Destination profile loaded directly from TravelViet backend.',
    overviewKicker: 'Overview',
    overviewTitle: (name) => `Detailed information about ${name}`,
    noDescription:
      'The backend has no detailed description for this destination.',
    dossierTitle: 'Full information',
    idealTime: 'Ideal travel time',
    backendData: 'Data from destination backend',
    crowdDefault: 'Expected crowd level',
    defaultCrowdNote: 'Default value of this destination',
    media: 'Media library',
    mediaNote: (images, videos) => `${images} images / ${videos} videos`,
    contentBlocks: 'Travel content',
    contentBlocksNote: 'Food, specialties, activities, tips, and events',
    intelligenceKicker: 'Travel intelligence',
    intelligenceTitle: 'Weather and crowd level',
    forecast: 'Latest forecast',
    noForecast: 'No forecast yet',
    waitingBackend: 'Waiting for backend updates',
    crowdPrediction: 'Expected visitors',
    useDefaultCrowd:
      'Using default crowd level if no prediction exists',
    activeAlerts: 'Active alerts',
    loadingWeather: 'Loading...',
    weatherApi: 'Loaded from weather API',
    galleryKicker: 'Gallery',
    galleryTitle: 'Destination images and videos',
    noMedia: 'No media is available for this destination yet.',
    videoLabel: 'View destination video',
    foodKicker: 'Cuisine',
    foodTitle: 'Food to try',
    noFood: 'No food data exists in backend.',
    featured: 'Featured',
    noItemDescription: 'No description yet.',
    specialtyKicker: 'Local signature',
    specialtyTitle: 'Specialties and identity',
    noSpecialty: 'No specialties exist in backend.',
    activityKicker: 'Experiences',
    activityTitle: 'Activities to add to the itinerary',
    noActivity: 'No activities exist in backend.',
    noScore: 'No score yet',
    score: (value) => `${value}/10`,
    tipKicker: 'Travel tips',
    tipTitle: 'Guest recommendations',
    noTip: 'No travel tips exist in backend.',
    eventKicker: 'Events',
    eventTitle: 'Related events',
    noEvent: 'No events exist in backend.',
    event: 'Event',
    updating: 'Updating',
    active: 'Visible',
    inactive: 'Paused',
    plannerKicker: 'TravelViet planner',
    plannerTitle: (name) => `Planning a trip to ${name}?`,
    plannerCopy:
      'Use destination profile, weather, media, and experience suggestions to design tours for each guest group.',
    plannerAction: 'Plan itinerary',
    facts: {
      uuid: 'UUID',
      slug: 'Slug',
      country: 'Country',
      province: 'Province / City',
      district: 'District',
      region: 'Region',
      address: 'Address',
      latitude: 'Latitude',
      longitude: 'Longitude',
      bestTime: 'Best season',
      crowd: 'Default crowd level',
      featured: 'Featured destination',
      yes: 'Yes',
      no: 'No',
      vietnam: 'Vietnam',
    },
    crowdLabels: {
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: 'High',
      VERY_HIGH: 'Very high',
    },
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
}

export function getDestinationDetailLocale(language: string): DestinationDetailLocale {
  return language === 'en' ? 'en' : 'vi'
}
