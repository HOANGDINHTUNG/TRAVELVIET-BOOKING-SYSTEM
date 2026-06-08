import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deskListParams } from '@/features/commerce/deskListParams';
import { campaignKeys, comboKeys, voucherKeys } from '@/features/commerce/commerceDeskKeys';
import { fetchCampaigns, fetchVouchers, setCampaignActive, setVoucherActive } from '@/services/promotionApi';
import { fetchComboPackages, setComboPackageActive } from '@/services/comboPackagesApi';

export function useVoucherList(keyword: string, page: number, enabled = true) {
  return useQuery({
    queryKey: voucherKeys.list(keyword, page),
    queryFn: () => fetchVouchers(deskListParams(keyword, page)),
    staleTime: 30_000,
    enabled,
  });
}

export function useToggleVoucherStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => setVoucherActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
    },
  });
}

export function useCampaignList(keyword: string, page: number, enabled = true) {
  return useQuery({
    queryKey: campaignKeys.list(keyword, page),
    queryFn: () => fetchCampaigns(deskListParams(keyword, page)),
    staleTime: 30_000,
    enabled,
  });
}

export function useToggleCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => setCampaignActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

export function useComboList(keyword: string, page: number, enabled = true) {
  return useQuery({
    queryKey: comboKeys.list(keyword, page),
    queryFn: () => fetchComboPackages(deskListParams(keyword, page)),
    staleTime: 30_000,
    enabled,
  });
}

export function useToggleComboStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      setComboPackageActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: comboKeys.lists() });
    },
  });
}
