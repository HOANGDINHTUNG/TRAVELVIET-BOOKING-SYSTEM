import type { Href } from 'expo-router';

/** Commerce desk — một màn list (đồng bộ web PromotionCommercePanel tab Products) */
export const ProductRoutes = {
  list: '/(tabs)/products',
} as const;

export function asHref(path: string): Href {
  return path as Href;
}

export const AppRoutes = {
  login: '/(auth)/login',
  register: '/(auth)/register',
  productTab: '/(tabs)/products',
  tabs: '/(tabs)',
} as const;
