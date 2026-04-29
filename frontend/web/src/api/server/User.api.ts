import type { AuthUser } from '../../module/auth/database/interface/users'
import {
  deleteBackendData,
  getBackendData,
  postBackendData,
  putBackendData,
  patchBackendData,
} from './serverApiClient'

export type UserProfile = AuthUser & {
  gender?: string
  dateOfBirth?: string
  avatarUrl?: string
  userCategory?: string
  memberLevel?: string
  loyaltyPoints?: number
  totalSpent?: number | string
  createdAt?: string
  updatedAt?: string
}

export type UpdateMyProfilePayload = Partial<{
  fullName: string
  displayName: string
  phone: string
  gender: string
  dateOfBirth: string
  avatarUrl: string
}>

export type UserAddress = {
  id: number
  contactName: string
  contactPhone: string
  province: string
  district: string
  ward?: string
  addressLine: string
  isDefault?: boolean
}

export type UserAddressPayload = Omit<UserAddress, 'id'>

export type UserPreference = {
  id?: number
  budgetLevel?: string
  preferredTripMode?: string
  travelStyle?: string
  preferredDepartureCity?: string
  favoriteRegions?: string[]
  favoriteTags?: string[]
}

export type UserDevice = {
  id: number
  platform?: string
  deviceName?: string
  pushToken?: string
  appVersion?: string
  createdAt?: string
}

export type UserDevicePayload = Omit<UserDevice, 'id' | 'createdAt'>

export const userApi = {
  getMyProfile() {
    return getBackendData<UserProfile>('users/me')
  },

  updateMyProfile(payload: UpdateMyProfilePayload) {
    return putBackendData<UserProfile>('users/me', payload)
  },

  getMyAddresses() {
    return getBackendData<UserAddress[]>('users/me/addresses')
  },

  createMyAddress(payload: UserAddressPayload) {
    return postBackendData<UserAddress>('users/me/addresses', payload)
  },

  updateMyAddress(id: number, payload: UserAddressPayload) {
    return putBackendData<UserAddress>(`users/me/addresses/${id}`, payload)
  },

  setMyDefaultAddress(id: number) {
    return patchBackendData<UserAddress>(`users/me/addresses/${id}/default`)
  },

  deleteMyAddress(id: number) {
    return deleteBackendData(`users/me/addresses/${id}`)
  },

  getMyPreferences() {
    return getBackendData<UserPreference>('users/me/preferences')
  },

  updateMyPreferences(payload: UserPreference) {
    return putBackendData<UserPreference>('users/me/preferences', payload)
  },

  getMyDevices() {
    return getBackendData<UserDevice[]>('users/me/devices')
  },

  registerMyDevice(payload: UserDevicePayload) {
    return postBackendData<UserDevice>('users/me/devices', payload)
  },

  deleteMyDevice(id: number) {
    return deleteBackendData(`users/me/devices/${id}`)
  },
}
