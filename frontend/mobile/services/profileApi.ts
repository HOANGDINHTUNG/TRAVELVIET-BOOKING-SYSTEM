import { apiRequest } from "@/services/apiClient";

export interface UserResponse {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  displayName: string;
  gender: string;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  userCategory: string;
  role: string;
  roles: string[];
  status: string;
  memberLevel: string;
  loyaltyPoints: number;
  totalSpent: number;
}

export interface UpdateMyProfileRequest {
  fullName?: string;
  displayName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

export async function fetchMyProfile() {
  return apiRequest<UserResponse>("/users/me", {
    method: "GET",
  });
}

export async function updateMyProfile(data: UpdateMyProfileRequest) {
  return apiRequest<UserResponse>("/users/me", {
    method: "PUT",
    body: data,
  });
}
