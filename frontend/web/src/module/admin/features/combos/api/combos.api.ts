import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";
import { useCrudMutation } from "../../../core/hooks/useCrudMutation";

// DTOs
export interface ComboPackageItem {
  id?: number;
  itemType: string;
  itemRefId?: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  unitPriceSnapshot?: number;
  isMandatory: boolean;
  sortOrder?: number;
}

export interface ComboPackage {
  id: number;
  code: string;
  name: string;
  description?: string;
  destinationId?: number;
  comboType: string;
  basePrice: number;
  discountType?: string;
  discountValue?: number;
  discountAmount: number;
  pricingRuleJson?: string;
  startAt?: string;
  endAt?: string;
  finalPrice: number;
  isActive: boolean;
  items: ComboPackageItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ComboPackageRequest {
  code: string;
  name: string;
  description?: string;
  destinationId?: number;
  comboType: string;
  basePrice: number;
  discountType?: string;
  discountValue?: number;
  discountAmount: number;
  pricingRuleJson?: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  items: ComboPackageItem[];
}

export const COMBO_QUERY_KEY = ["admin-combos"];

// API Methods
export const useGetCombos = (page: number, size: number, search?: string) => {
  return useQuery({
    queryKey: [...COMBO_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<ComboPackage>>(
        "/combo-packages",
        {
          params: { page, size, keyword: search || undefined },
        },
      );
      return data;
    },
  });
};

export const useCreateCombo = () => {
  return useCrudMutation<ComboPackage, ComboPackageRequest>({
    mutationFn: (request) => apiClient.post("/combo-packages", request),
    successMessage: "Đã thiết lập cấu hình Combo mới!",
    queryKeyToInvalidate: COMBO_QUERY_KEY,
  });
};

export const useUpdateCombo = (id: number | null) => {
  return useCrudMutation<ComboPackage, ComboPackageRequest>({
    mutationFn: (request) => apiClient.put(`/combo-packages/${id}`, request),
    successMessage: "Cập nhật Combo thành công!",
    queryKeyToInvalidate: COMBO_QUERY_KEY,
  });
};

export const useUpdateComboStatus = () => {
  return useCrudMutation<ComboPackage, { id: number; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      apiClient.patch(`/combo-packages/${id}/status`, { isActive }),
    successMessage: "Đã thay đổi trạng thái bán Combo!",
    queryKeyToInvalidate: COMBO_QUERY_KEY,
  });
};
