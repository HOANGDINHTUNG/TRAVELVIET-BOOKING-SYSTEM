import { apiRequest } from '@/services/apiClient';

export interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  conditionJson?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UnlockedBadge {
  badgeId: number;
  badgeCode: string;
  badgeName: string;
  iconUrl?: string;
  unlockedAt: string;
}

export interface VisitedDestination {
  destinationUuid: string;
  destinationName: string;
  lastVisitedAt: string;
}

export interface TravelPassport {
  id: number;
  userId: string;
  memberLevel: string;
  loyaltyPoints: number;
  totalCheckins: number;
  totalDestinations: number;
  createdAt: string;
  unlockedBadges?: UnlockedBadge[];
  visitedDestinations?: VisitedDestination[];
}

export interface UserCheckin {
  id: number;
  userId: string;
  bookingId?: number;
  destinationUuid?: string;
  checkinLatitude?: number;
  checkinLongitude?: number;
  note?: string;
  createdAt: string;
}

export interface CreateBadgeRequest {
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  conditionJson?: string;
  isActive?: boolean;
}

export interface CreateManualCheckinRequest {
  bookingId?: number;
  destinationUuid?: string;
  checkinLatitude?: number;
  checkinLongitude?: number;
  note?: string;
}

export async function fetchMyPassport() {
  return apiRequest<TravelPassport>('/users/me/passport');
}

export async function fetchMyCheckins() {
  return apiRequest<UserCheckin[]>('/users/me/checkins');
}

// Admin / Backoffice Loyalty APIs
export async function fetchBadges() {
  return apiRequest<Badge[]>('/badges');
}

export async function fetchBadge(id: number) {
  return apiRequest<Badge>(`/badges/${id}`);
}

export async function createBadge(request: CreateBadgeRequest) {
  return apiRequest<Badge>('/badges', {
    method: 'POST',
    body: request,
  });
}

export async function updateBadge(id: number, request: CreateBadgeRequest) {
  return apiRequest<Badge>(`/badges/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function setBadgeStatus(id: number, isActive: boolean) {
  return apiRequest<Badge>(`/badges/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}

export async function grantBadgeToUser(badgeId: number, userId: string) {
  return apiRequest<any>(`/badges/${badgeId}/grant/users/${userId}`, {
    method: 'POST',
  });
}

export async function createManualCheckin(userId: string, request: CreateManualCheckinRequest) {
  return apiRequest<UserCheckin>(`/users/${userId}/checkins`, {
    method: 'POST',
    body: request,
  });
}
