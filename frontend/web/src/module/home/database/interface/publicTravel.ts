export type Tour = {
  id: number;
  translationKey?: string;
  title: string;
  location: string;
  category: string;
  days: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  highlights: string[];
  description?: string;
  destinationId?: number;
  currency?: string;
};

export type HeroSlide = {
  titleTop: string;
  titleMain: string;
  kicker: string;
  copy: string;
  image: string;
};

export type Destination = {
  translationKey?: string;
  uuid?: string;
  name: string;
  tours: string;
  image: string;
  province?: string;
  region?: string;
  shortDescription?: string;
};

export type BackendDestination = {
  uuid: string;
  name: string;
  slug?: string;
  countryCode?: string;
  province?: string;
  district?: string;
  region?: string;
  shortDescription?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured?: boolean;
  coverImageUrl?: string;
  activeTourCount?: number;
  translationKey?: string;
};

export type BackendTourMedia = {
  mediaType?: string;
  mediaUrl?: string;
  altText?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type BackendTag = {
  id: number;
  code: string;
  name: string;
  tagGroup?: string;
  description?: string;
};

export type BackendTourSeasonality = {
  id: number;
  seasonName: string;
  monthFrom: number;
  monthTo: number;
  recommendationScore?: number;
  notes?: string;
};

export type BackendChecklistItem = {
  id: number;
  itemName: string;
  itemGroup?: string;
  isRequired?: boolean;
};

export type BackendTourSchedulePickupPoint = {
  id: number;
  pointName?: string;
  pickupName?: string;
  address?: string;
  pickupAt?: string;
  sortOrder?: number;
  note?: string;
};

export type BackendTourScheduleGuide = {
  id: number;
  guideId?: number;
  guideCode?: string;
  guideFullName?: string;
  guidePhone?: string;
  guideEmail?: string;
  guideStatus?: string;
  isLocalGuide?: boolean;
  guideName?: string;
  guideRole?: string;
  role?: string;
  assignedAt?: string;
  note?: string;
};

export type BackendCancellationPolicyRule = {
  id: number;
  minHoursBefore?: number;
  maxHoursBefore?: number;
  refundPercent: number;
  voucherPercent?: number;
  feePercent?: number;
  allowReschedule?: boolean;
  notes?: string;
};

export type BackendCancellationPolicy = {
  id: number;
  name: string;
  description?: string;
  voucherBonusPercent?: number;
  isDefault?: boolean;
  isActive?: boolean;
  rules: BackendCancellationPolicyRule[];
};

export type BackendTour = {
  id: number;
  code?: string;
  name: string;
  slug?: string;
  destinationId?: number;
  basePrice?: number | string;
  currency?: string;
  durationDays?: number;
  durationNights?: number;
  shortDescription?: string;
  description?: string;
  transportType?: string;
  tripMode?: string;
  highlights?: string;
  inclusions?: string;
  exclusions?: string;
  notes?: string;
  isFeatured?: boolean;
  status?: string;
  averageRating?: number | string;
  totalReviews?: number;
  totalBookings?: number;
  translationKey?: string;
  media?: BackendTourMedia[];
  itineraryDays?: BackendItineraryDay[];
  tags?: BackendTag[];
  seasonality?: BackendTourSeasonality[];
  checklistItems?: BackendChecklistItem[];
  cancellationPolicy?: BackendCancellationPolicy;
};

export type BackendItineraryDay = {
  id: number;
  dayNumber: number;
  title: string;
  description?: string;
  items?: BackendItineraryItem[];
};

export type BackendItineraryItem = {
  id: number;
  sequenceNo: number;
  itemType: string;
  title: string;
  description?: string;
  locationName?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
};

export type BackendTourSchedule = {
  id: number;
  scheduleCode: string;
  tourId?: number;
  departureAt: string;
  returnAt: string;
  bookingOpenAt?: string;
  bookingCloseAt?: string;
  meetingAt?: string;
  meetingPointName?: string;
  meetingAddress?: string;
  capacityTotal?: number;
  bookedSeats?: number;
  adultPrice: number;
  childPrice?: number;
  infantPrice?: number;
  seniorPrice?: number;
  singleRoomSurcharge?: number;
  remainingSeats: number;
  minGuestsToOperate?: number;
  transportDetail?: string;
  note?: string;
  status: string;
  pickupPoints?: BackendTourSchedulePickupPoint[];
  guideAssignments?: BackendTourScheduleGuide[];
};

export type WeatherSeverity = "info" | "watch" | "warning" | "danger";

export type WeatherNoticeStatus = "draft" | "published" | "expired";

export type WeatherDisplayPolicy = {
  id?: number;
  destinationId: number;
  showForecastSummary?: boolean;
  showTemperature?: boolean;
  showRainProbability?: boolean;
  showWindSpeed?: boolean;
  showHumidity?: boolean;
  showAqi?: boolean;
  showHourlyForecast?: boolean;
  showAlerts?: boolean;
  showAlertDetail?: boolean;
  updatedAt?: string;
};

export type WeatherForecast = {
  id: number;
  destinationId: number;
  forecastDate: string;
  weatherCode?: string;
  summary?: string;
  tempMin?: number;
  tempMax?: number;
  humidityPercent?: number;
  windSpeed?: number;
  rainProbability?: number;
  sourceName?: string;
  rawPayload?: string;
  createdAt?: string;
};

export type WeatherAlert = {
  id: number;
  destinationId: number;
  scheduleId?: number;
  severity?: WeatherSeverity;
  alertType?: string;
  title?: string;
  message?: string;
  actionAdvice?: string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  createdAt?: string;
};

export type WeatherPublicNotice = {
  id: number;
  destinationId: number;
  sourceAlertId?: number;
  severity?: WeatherSeverity;
  title: string;
  summary: string;
  detail?: string;
  actionAdvice?: string;
  displayFrom?: string;
  displayTo?: string;
  status?: WeatherNoticeStatus;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WeatherNoticeCenter = {
  destinationId: number;
  displayPolicy?: WeatherDisplayPolicy;
  currentForecast?: WeatherForecast | null;
  notices: WeatherPublicNotice[];
  activeAlerts: WeatherAlert[];
};

export type CrowdPrediction = {
  id: number;
  destinationId: number;
  predictionDate: string;
  crowdLevel?: string;
  predictedVisitors?: number;
  confidenceScore?: number;
  reasonsJson?: string;
  createdAt?: string;
};
