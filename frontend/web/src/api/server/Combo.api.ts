import type { PageResponse } from "../../types/api";
import { getBackendData } from "./serverApiClient";

export type ComboSearchRequest = {
  page?: number;
  size?: number;
  keyword?: string;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: string;
};

export type ComboPackageItemResponse = {
  id: number;
  itemType: string;
  itemRefId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ComboPackageResponse = {
  id: number;
  code: string;
  name: string;
  description: string;
  destinationId: number;
  comboType: string;
  basePrice: number;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  pricingRuleJson: string;
  startAt: string;
  endAt: string;
  finalPrice: number;
  isActive: boolean;
  items: ComboPackageItemResponse[];
  createdAt: string;
  updatedAt: string;
};

export const comboApi = {
  search(params: ComboSearchRequest = {}) {
    return getBackendData<PageResponse<ComboPackageResponse>>("combos", params);
  },
  getById(id: string | number) {
    return getBackendData<ComboPackageResponse>(`combos/${id}`);
  },
};

export async function fetchPublicCombos(params: ComboSearchRequest = {}) {
  const res = await comboApi.search(params);
  return res.content ?? [];
}
