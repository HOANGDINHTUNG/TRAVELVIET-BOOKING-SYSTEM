/**
 * Tour Types & Interfaces
 */

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  windSpeed: number;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  location: Location;
  duration: number; // in days
  rating: number;
  reviewCount: number;
  weather?: WeatherInfo;
  startDate?: string; // ISO format
  endDate?: string; // ISO format
  maxParticipants: number;
  currentParticipants: number;
  highlights: string[];
  itinerary: ItineraryItem[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  locations: string[];
}

export interface TourCardProps {
  tour: Tour;
  onPress?: () => void;
  showWeather?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: string;
  preferences?: {
    favoriteDestinations: string[];
    travelStyle: 'budget' | 'comfort' | 'luxury';
    groupSize: 'solo' | 'couple' | 'family' | 'group';
  };
  loyaltyPoints: number;
}

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  startDate: string;
  endDate: string;
  passengers: Passenger[];
  totalPrice: number;
  discountCode?: string;
  discountAmount?: number;
  paymentMethod?: 'vnpay' | 'momo' | 'credit_card' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'adult' | 'child';
  dateOfBirth?: string;
}
