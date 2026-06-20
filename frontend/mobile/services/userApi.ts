import { apiRequest } from '@/services/apiClient';
import type { UserAccessContext } from '@/types/auth';

export interface UserPreferences {
  id: number;
  userId: string;
  budgetLevel?: 'low' | 'medium' | 'high' | 'luxury';
  preferredTripMode?: 'group' | 'private' | 'shared';
  travelStyle?: 'relax' | 'adventure' | 'checkin' | 'family' | 'culture' | 'food' | 'spiritual' | 'mixed';
  preferredDepartureCity?: string;
  favoriteRegions?: string[];
  favoriteTags?: string[];
  favoriteDestinations?: string[];
  prefersLowMobility: boolean;
  prefersFamilyFriendly: boolean;
  prefersStudentBudget: boolean;
  prefersWeatherAlert: boolean;
  prefersPromotionAlert: boolean;
}

export interface UpsertUserPreferencesRequest {
  budgetLevel?: 'low' | 'medium' | 'high' | 'luxury';
  preferredTripMode?: 'group' | 'private' | 'shared';
  travelStyle?: 'relax' | 'adventure' | 'checkin' | 'family' | 'culture' | 'food' | 'spiritual' | 'mixed';
  preferredDepartureCity?: string;
  favoriteRegions?: string[];
  favoriteTags?: string[];
  favoriteDestinations?: string[];
  prefersLowMobility?: boolean;
  prefersFamilyFriendly?: boolean;
  prefersStudentBudget?: boolean;
  prefersWeatherAlert?: boolean;
  prefersPromotionAlert?: boolean;
}

export interface UserDevice {
  id: number;
  userId: string;
  platform: string;
  deviceName?: string;
  pushToken?: string;
  appVersion?: string;
  lastSeenAt: string;
  isActive: boolean;
}

export interface RegisterDeviceRequest {
  platform: string;
  deviceName?: string;
  pushToken?: string;
  appVersion?: string;
}

export interface RecommendationRequest {
  requestedTag?: string;
  requestedBudget?: 'low' | 'medium' | 'high' | 'luxury';
  requestedTripMode?: 'group' | 'private' | 'shared';
  requestedPeopleCount?: number;
  requestedDepartureAt?: string;
  size?: number;
}

export interface RecommendationLog {
  id: number;
  userId: string;
  requestedTag?: string;
  requestedBudget?: string;
  requestedTripMode?: string;
  requestedPeopleCount?: number;
  requestedDepartureAt?: string;
  generatedResult?: string; // JSON string representing the recommended tour list snapshot
  createdAt: string;
}

export async function fetchMyAccessContext() {
  return apiRequest<UserAccessContext>('/users/me/access-context');
}

// User Preferences
export async function fetchMyPreferences() {
  return apiRequest<UserPreferences>('/users/me/preferences');
}

export async function updateMyPreferences(request: UpsertUserPreferencesRequest) {
  return apiRequest<UserPreferences>('/users/me/preferences', {
    method: 'PUT',
    body: request,
  });
}

// User Devices
export async function fetchMyDevices() {
  return apiRequest<UserDevice[]>('/users/me/devices');
}

export async function registerDevice(request: RegisterDeviceRequest) {
  return apiRequest<UserDevice>('/users/me/devices', {
    method: 'POST',
    body: request,
  });
}

export async function deleteDevice(id: number) {
  return apiRequest<{ success: boolean; message: string }>(`/users/me/devices/${id}`, {
    method: 'DELETE',
  });
}

// Recommendations
export async function generateTourRecommendations(request: RecommendationRequest) {
  return apiRequest<any[]>('/users/me/recommendations/tours', {
    method: 'POST',
    body: request,
  });
}

export async function fetchMyRecommendationLogs() {
  return apiRequest<RecommendationLog[]>('/users/me/recommendations/logs');
}
