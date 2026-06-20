import { apiRequest } from '@/services/apiClient';

export interface UserAddress {
  id: number;
  userId: string;
  contactName: string;
  contactPhone: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine: string;
  isDefault: boolean;
}

export interface UpsertAddressRequest {
  contactName: string;
  contactPhone: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine: string;
  isDefault?: boolean;
}

export async function fetchMyAddresses() {
  return apiRequest<UserAddress[]>('/users/me/addresses');
}

export async function createAddress(address: UpsertAddressRequest) {
  return apiRequest<UserAddress>('/users/me/addresses', {
    method: 'POST',
    body: address,
  });
}

export async function updateAddress(id: number, address: UpsertAddressRequest) {
  return apiRequest<UserAddress>(`/users/me/addresses/${id}`, {
    method: 'PUT',
    body: address,
  });
}

export async function setAddressDefault(id: number) {
  return apiRequest<UserAddress>(`/users/me/addresses/${id}/default`, {
    method: 'PATCH',
  });
}

export async function deleteAddress(id: number) {
  return apiRequest<{ success: boolean; message: string }>(`/users/me/addresses/${id}`, {
    method: 'DELETE',
  });
}
