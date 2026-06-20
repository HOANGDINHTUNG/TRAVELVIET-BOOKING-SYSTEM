import { apiRequest } from '@/services/apiClient';

export interface DestinationTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  description: string;
}

export interface UpsertDestinationTranslationRequest {
  name?: string;
  shortDescription?: string;
  description?: string;
}

export interface GuideTranslation {
  id: number;
  locale: string;
  fullName: string;
  bio: string;
}

export interface UpsertGuideTranslationRequest {
  fullName?: string;
  bio?: string;
}

export interface TourTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  description: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  notes: string;
  itinerarySummary: string;
}

export interface UpsertTourTranslationRequest {
  name?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string;
  inclusions?: string;
  exclusions?: string;
  notes?: string;
  itinerarySummary?: string;
}

export async function fetchDestinationTranslations(destinationUuid: string) {
  return apiRequest<DestinationTranslation[]>(`/admin/destinations/${destinationUuid}/translations`);
}

export async function upsertDestinationTranslation(
  destinationUuid: string,
  locale: string,
  request: UpsertDestinationTranslationRequest
) {
  return apiRequest<{ message: string }>(`/admin/destinations/${destinationUuid}/translations/${locale}`, {
    method: 'PUT',
    body: request,
  });
}

export async function fetchGuideTranslations(guideId: number) {
  return apiRequest<GuideTranslation[]>(`/admin/guides/${guideId}/translations`);
}

export async function upsertGuideTranslation(
  guideId: number,
  locale: string,
  request: UpsertGuideTranslationRequest
) {
  return apiRequest<{ message: string }>(`/admin/guides/${guideId}/translations/${locale}`, {
    method: 'PUT',
    body: request,
  });
}

export async function fetchTourTranslations(tourId: number) {
  return apiRequest<TourTranslation[]>(`/admin/tours/${tourId}/translations`);
}

export async function upsertTourTranslation(
  tourId: number,
  locale: string,
  request: UpsertTourTranslationRequest
) {
  return apiRequest<{ message: string }>(`/admin/tours/${tourId}/translations/${locale}`, {
    method: 'PUT',
    body: request,
  });
}

export async function deleteTourTranslation(tourId: number, locale: string) {
  return apiRequest<{ message: string }>(`/admin/tours/${tourId}/translations/${locale}`, {
    method: 'DELETE',
  });
}
