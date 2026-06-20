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
  coverImageUrl: string | null;
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
  avatarUrl?: string;
  coverImageUrl?: string;
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

export async function uploadMedia(fileUri: string): Promise<string> {
  const formData = new FormData();
  
  // Resolve filename and file extension/mimetype
  const uriParts = fileUri.split("/");
  const fileName = uriParts[uriParts.length - 1] || "photo.jpg";
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  
  let type = "image/jpeg";
  if (fileExtension === "png") {
    type = "image/png";
  } else if (fileExtension === "gif") {
    type = "image/gif";
  }

  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type,
  } as any);

  const res = await apiRequest<{ url: string }>("/media/upload", {
    method: "POST",
    body: formData,
  });
  
  return res.url;
}
