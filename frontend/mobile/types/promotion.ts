export type DeskPageParams = {
  page?: number;
  size?: number;
  keyword?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

export type Voucher = {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  discountType?: string;
  discountValue?: number | string;
  usedCount?: number;
  endAt?: string;
  isActive?: boolean;
};

export type PromotionCampaign = {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  displayTitle?: string;
  displaySubtitle?: string;
  isFeatured?: boolean;
  targetMemberLevel?: string;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
};

export type ComboPackage = {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  basePrice?: number | string;
  discountAmount?: number | string;
  finalPrice?: number | string;
  isActive?: boolean;
};
