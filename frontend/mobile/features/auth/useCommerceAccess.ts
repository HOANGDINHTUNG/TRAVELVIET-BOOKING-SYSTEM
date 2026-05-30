import { useEffect, useState } from 'react';
import {
  canToggleCampaignStatus,
  canToggleComboStatus,
  canToggleProductStatus,
  canToggleVoucherStatus,
  canViewCampaigns,
  canViewCommerceDesk,
  canViewCombos,
  canViewProducts,
  canViewVouchers,
} from '@/features/auth/commercePermissions';
import { ensureAccessContextLoaded } from '@/services/authSession';

export function useCommerceAccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureAccessContextLoaded();
        if (!cancelled) {
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không tải được quyền truy cập.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    loading,
    error,
    canViewDesk: canViewCommerceDesk(),
    canViewVouchers: canViewVouchers(),
    canViewCampaigns: canViewCampaigns(),
    canViewProducts: canViewProducts(),
    canViewCombos: canViewCombos(),
    canToggleProduct: canToggleProductStatus(),
    canToggleVoucher: canToggleVoucherStatus(),
    canToggleCampaign: canToggleCampaignStatus(),
    canToggleCombo: canToggleComboStatus(),
    /** @deprecated */
    canView: canViewCommerceDesk(),
    /** @deprecated */
    canToggle: canToggleProductStatus(),
  };
}
