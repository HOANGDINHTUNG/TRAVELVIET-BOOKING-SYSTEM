import type { PageResponse } from '../../types/api'
import {
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from './serverApiClient'
import type { ActiveStatusPayload, PageQuery } from './Promotion.api'

export type ProductType =
  | 'gear'
  | 'insurance'
  | 'food'
  | 'souvenir'
  | 'service'
  | 'gift'
  | string

export type Product = {
  id: number
  sku?: string
  name?: string
  description?: string
  productType?: ProductType
  unitPrice?: number | string
  stockQty?: number
  isGiftable?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProductQuery = PageQuery & {
  productType?: ProductType
  isGiftable?: boolean
}

export type ProductPayload = {
  sku: string
  name: string
  description?: string
  productType: ProductType
  unitPrice: number | string
  stockQty: number
  isGiftable?: boolean
  isActive?: boolean
}

export type ComboPackageItemPayload = {
  itemType: string
  itemRefId?: number
  itemName: string
  quantity: number
  unitPrice: number | string
}

export type ComboPackageItem = ComboPackageItemPayload & {
  id: number
  lineTotal?: number | string
}

export type ComboPackage = {
  id: number
  code?: string
  name?: string
  description?: string
  basePrice?: number | string
  discountAmount?: number | string
  finalPrice?: number | string
  isActive?: boolean
  items?: ComboPackageItem[]
  createdAt?: string
  updatedAt?: string
}

export type ComboPackageQuery = PageQuery

export type ComboPackagePayload = {
  code: string
  name: string
  description?: string
  basePrice: number | string
  discountAmount: number | string
  isActive?: boolean
  items: ComboPackageItemPayload[]
}

export const commerceApi = {
  getProducts(params: ProductQuery = {}) {
    return getBackendData<PageResponse<Product>>('products', params)
  },

  getProduct(id: number) {
    return getBackendData<Product>(`products/${id}`)
  },

  createProduct(payload: ProductPayload) {
    return postBackendData<Product>('products', payload)
  },

  updateProduct(id: number, payload: ProductPayload) {
    return putBackendData<Product>(`products/${id}`, payload)
  },

  updateProductStatus(id: number, payload: ActiveStatusPayload) {
    return patchBackendData<Product>(`products/${id}/status`, payload)
  },

  getComboPackages(params: ComboPackageQuery = {}) {
    return getBackendData<PageResponse<ComboPackage>>('combo-packages', params)
  },

  getComboPackage(id: number) {
    return getBackendData<ComboPackage>(`combo-packages/${id}`)
  },

  createComboPackage(payload: ComboPackagePayload) {
    return postBackendData<ComboPackage>('combo-packages', payload)
  },

  updateComboPackage(id: number, payload: ComboPackagePayload) {
    return putBackendData<ComboPackage>(`combo-packages/${id}`, payload)
  },

  updateComboPackageStatus(id: number, payload: ActiveStatusPayload) {
    return patchBackendData<ComboPackage>(`combo-packages/${id}/status`, payload)
  },
}
