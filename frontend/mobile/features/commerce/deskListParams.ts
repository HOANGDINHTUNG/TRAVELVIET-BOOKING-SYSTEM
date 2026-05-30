import { PRODUCT_PAGE_SIZE } from '@/theme/commerceDesk';

export function deskListParams(keyword: string, page: number) {
  return {
    page,
    size: PRODUCT_PAGE_SIZE,
    keyword: keyword.trim() || undefined,
    sortBy: 'createdAt',
    sortDir: 'desc' as const,
  };
}
