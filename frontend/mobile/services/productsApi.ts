import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';
import type { Product, ProductRequest, ProductSearchParams } from '@/types/product';

export async function fetchProducts(params: ProductSearchParams = {}) {
  return apiRequest<PageResponse<Product>>('/products', {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      keyword: params.keyword,
      productType: params.productType,
      isGiftable: params.isGiftable,
      isActive: params.isActive,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc',
    },
  });
}

export async function fetchProduct(id: number) {
  return apiRequest<Product>(`/products/${id}`);
}

export async function createProduct(request: ProductRequest) {
  return apiRequest<Product>('/products', {
    method: 'POST',
    body: request,
  });
}

export async function updateProduct(id: number, request: ProductRequest) {
  return apiRequest<Product>(`/products/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function setProductActive(id: number, isActive: boolean) {
  return apiRequest<Product>(`/products/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}
