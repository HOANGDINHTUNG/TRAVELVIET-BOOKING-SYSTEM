import { getBackendData, postBackendData } from './serverApiClient'

export type PassportBadge = {
  passportBadgeId: number
  badgeId?: number
  badgeCode?: string
  badgeName?: string
  badgeDescription?: string
  iconUrl?: string
  conditionJson?: string
  isActive?: boolean
  unlockedAt?: string
}

export type PassportVisitedDestination = {
  visitedId: number
  destinationId?: number
  destinationUuid?: string
  destinationName?: string
  destinationSlug?: string
  firstBookingId?: number
  firstVisitedAt?: string
  lastVisitedAt?: string
}

export type TravelPassport = {
  passportId?: number
  userId?: string
  passportNo?: string
  totalTours?: number
  totalDestinations?: number
  totalCheckins?: number
  lastTripAt?: string
  createdAt?: string
  updatedAt?: string
  badges?: PassportBadge[]
  visitedDestinations?: PassportVisitedDestination[]
}

export type Mission = {
  id: number
  code?: string
  name?: string
  description?: string
  ruleJson?: string
  rewardType?: string
  rewardValue?: number | string
  rewardRefId?: number
  startAt?: string
  endAt?: string
  isActive?: boolean
  createdAt?: string
}

export type UserMission = {
  id: number
  mission?: Mission
  progress?: number | string
  goal?: number | string
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED' | 'EXPIRED' | string
  completedAt?: string
  claimedAt?: string
}

export type UserCheckin = {
  id: number
  userId?: string
  bookingId?: number
  bookingCode?: string
  destinationId?: number
  destinationUuid?: string
  destinationName?: string
  destinationSlug?: string
  checkinLatitude?: number | string
  checkinLongitude?: number | string
  note?: string
  createdAt?: string
}

export const loyaltyApi = {
  getMyPassport() {
    return getBackendData<TravelPassport>('users/me/passport')
  },

  getMyMissions() {
    return getBackendData<UserMission[]>('users/me/missions')
  },

  claimMission(id: number) {
    return postBackendData<UserMission>(`users/me/missions/${id}/claim`)
  },

  getMyCheckins() {
    return getBackendData<UserCheckin[]>('users/me/checkins')
  },
}
