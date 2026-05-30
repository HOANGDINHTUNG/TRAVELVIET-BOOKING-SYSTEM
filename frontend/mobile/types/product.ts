export const PRODUCT_TYPES = [
  'gear',
  'insurance',
  'food',
  'souvenir',
  'service',
  'gift',
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  productType: ProductType;
  unitPrice: number;
  stockQty: number;
  isGiftable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductRequest = {
  sku: string;
  name: string;
  description?: string;
  productType: ProductType;
  unitPrice: number;
  stockQty: number;
  isGiftable?: boolean;
  isActive?: boolean;
};

export type ProductSearchParams = {
  page?: number;
  size?: number;
  keyword?: string;
  productType?: ProductType;
  isGiftable?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};
