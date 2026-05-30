import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, setProductActive } from '@/services/productsApi';
import { productKeys } from '@/features/products/productKeys';
import { PRODUCT_PAGE_SIZE } from '@/theme/commerceDesk';

export function useProductList(keyword: string, page: number, enabled = true) {
  return useQuery({
    queryKey: productKeys.list(keyword, page),
    queryFn: () =>
      fetchProducts({
        page,
        size: PRODUCT_PAGE_SIZE,
        keyword: keyword.trim() || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
    staleTime: 30_000,
    enabled,
  });
}

/** Giống web toggleProduct — đảo isActive */
export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setProductActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
