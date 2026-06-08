import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";
import type {
  AdminUser,
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  Role,
} from "../../../../../api/server/SystemAdmin.api";

export const USER_QUERY_KEY = ["admin-users"];
export const ROLE_QUERY_KEY = ["admin-roles"];

export const useGetUsers = (
  page: number,
  size: number,
  search?: string,
  status?: string,
  roleCode?: string,
) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, "list", page, size, search, status, roleCode],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<AdminUser>>("/users", {
        params: {
          page,
          size,
          keyword: search || undefined,
          status,
          roleCode,
        },
      });
      return data;
    },
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, "list"],
    queryFn: async () => {
      const { data } = await apiClient.get<Role[]>("/roles");
      return data;
    },
  });
};

export const useCreateUser = () => {
  return useCrudMutation<AdminUser, AdminCreateUserPayload>({
    mutationFn: (request) => apiClient.post("/users", request),
    successMessage: "Đã tạo tài khoản thành công!",
    queryKeyToInvalidate: USER_QUERY_KEY,
  });
};

export const useUpdateUser = (id: string | null) => {
  return useCrudMutation<AdminUser, AdminUpdateUserPayload>({
    mutationFn: (request) => apiClient.put(`/users/${id}`, request),
    successMessage: "Đã cập nhật thông tin tài khoản thành công!",
    queryKeyToInvalidate: USER_QUERY_KEY,
  });
};

export const useDeactivateUser = () => {
  return useCrudMutation<AdminUser, string>({
    mutationFn: (id) => apiClient.patch(`/users/${id}/deactivate`),
    successMessage: "Đã khóa hệ thống tài khoản!",
    queryKeyToInvalidate: USER_QUERY_KEY,
  });
};
