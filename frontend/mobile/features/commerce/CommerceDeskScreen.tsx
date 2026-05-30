import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CampaignDeskCard } from '@/components/commerce/CampaignDeskCard';
import { ComboDeskCard } from '@/components/commerce/ComboDeskCard';
import { CommerceAccessGate } from '@/components/commerce/CommerceAccessGate';
import { CommerceDeskHeader } from '@/components/commerce/CommerceDeskHeader';
import { CommerceEmptyState } from '@/components/commerce/CommerceEmptyState';
import { CommerceSegmentTabs, type CommerceDeskTab } from '@/components/commerce/CommerceSegmentTabs';
import { CommerceToolbar } from '@/components/commerce/CommerceToolbar';
import { ProductDeskCard } from '@/components/commerce/ProductDeskCard';
import { ProductPagination } from '@/components/commerce/ProductPagination';
import { VoucherDeskCard } from '@/components/commerce/VoucherDeskCard';
import { ApiConnectionBanner } from '@/components/products/ApiConnectionBanner';
import { ProductErrorState } from '@/components/products/ProductErrorState';
import { ProductListSkeleton } from '@/components/products/ProductListSkeleton';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { useCommerceAccess } from '@/features/auth/useCommerceAccess';
import {
  useCampaignList,
  useComboList,
  useToggleCampaignStatus,
  useToggleComboStatus,
  useToggleVoucherStatus,
  useVoucherList,
} from '@/features/commerce/hooks/usePromotionDesk';
import {
  useProductList,
  useToggleProductStatus,
} from '@/features/products/hooks/useProducts';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutes, asHref } from '@/lib/navigation';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';
import { ApiError } from '@/types/api';
import type { PromotionCampaign, ComboPackage, Voucher } from '@/types/promotion';
import type { Product } from '@/types/product';

type DeskPages = Record<CommerceDeskTab, number>;

const initialPages: DeskPages = {
  vouchers: 0,
  campaigns: 0,
  products: 0,
  combos: 0,
};

type DeskItem = Voucher | PromotionCampaign | Product | ComboPackage;

export function CommerceDeskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const access = useCommerceAccess();

  const [activeTab, setActiveTab] = useState<CommerceDeskTab>('vouchers');
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState<DeskPages>(initialPages);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const deskReady = !access.loading && access.canViewDesk;
  const pageFor = useCallback(
    (tab: CommerceDeskTab) => (activeTab === tab ? pages[tab] : 0),
    [activeTab, pages]
  );

  const vouchers = useVoucherList(search, pageFor('vouchers'), deskReady && access.canViewVouchers);
  const campaigns = useCampaignList(search, pageFor('campaigns'), deskReady && access.canViewCampaigns);
  const products = useProductList(search, pageFor('products'), deskReady && access.canViewProducts);
  const combos = useComboList(search, pageFor('combos'), deskReady && access.canViewCombos);

  const toggleVoucher = useToggleVoucherStatus();
  const toggleCampaign = useToggleCampaignStatus();
  const toggleProduct = useToggleProductStatus();
  const toggleCombo = useToggleComboStatus();

  const activeQuery = {
    vouchers,
    campaigns,
    products,
    combos,
  }[activeTab];

  const items = (activeQuery.data?.content ?? []) as DeskItem[];
  const totalPages = Math.max(activeQuery.data?.totalPages ?? 1, 1);
  const currentPage = pages[activeTab];

  const summaryCounts = {
    vouchers: vouchers.data?.totalElements ?? 0,
    campaigns: campaigns.data?.totalElements ?? 0,
    products: products.data?.totalElements ?? 0,
    combos: combos.data?.totalElements ?? 0,
  };

  const goLogin = () => router.replace(asHref(AppRoutes.login));

  const canViewActiveTab = {
    vouchers: access.canViewVouchers,
    campaigns: access.canViewCampaigns,
    products: access.canViewProducts,
    combos: access.canViewCombos,
  }[activeTab];

  const setPage = (next: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: next }));
  };

  const runSearch = () => {
    setSearch(keyword);
    setPages(initialPages);
  };

  const reload = () => {
    void vouchers.refetch();
    void campaigns.refetch();
    void products.refetch();
    void combos.refetch();
  };

  const handleToggleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Không thể cập nhật.';
    showSnackbar(msg);
    if (err instanceof ApiError && err.status === 401) {
      goLogin();
    }
  };

  const handleToggleVoucher = (item: Voucher) => {
    if (!access.canToggleVoucher) {
      showSnackbar(commerceDeskCopy.readOnlyVoucher);
      return;
    }
    setTogglingId(item.id);
    toggleVoucher.mutate(
      { id: item.id, isActive: item.isActive === false },
      {
        onSuccess: () => showSnackbar(commerceDeskCopy.updatedVoucher),
        onError: handleToggleError,
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleToggleCampaign = (item: PromotionCampaign) => {
    if (!access.canToggleCampaign) {
      showSnackbar(commerceDeskCopy.readOnlyCampaign);
      return;
    }
    setTogglingId(item.id);
    toggleCampaign.mutate(
      { id: item.id, isActive: item.isActive === false },
      {
        onSuccess: () => showSnackbar(commerceDeskCopy.updatedCampaign),
        onError: handleToggleError,
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleToggleProduct = (item: Product) => {
    if (!access.canToggleProduct) {
      showSnackbar(commerceDeskCopy.readOnlyProduct);
      return;
    }
    setTogglingId(item.id);
    toggleProduct.mutate(
      { id: item.id, isActive: item.isActive === false },
      {
        onSuccess: () => showSnackbar(commerceDeskCopy.updatedProduct),
        onError: handleToggleError,
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleToggleCombo = (item: ComboPackage) => {
    if (!access.canToggleCombo) {
      showSnackbar(commerceDeskCopy.readOnlyCombo);
      return;
    }
    setTogglingId(item.id);
    toggleCombo.mutate(
      { id: item.id, isActive: item.isActive === false },
      {
        onSuccess: () => showSnackbar(commerceDeskCopy.updatedCombo),
        onError: handleToggleError,
        onSettled: () => setTogglingId(null),
      }
    );
  };

  if (access.loading) {
    return (
      <View style={[styles.center, { paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={commerceDesk.accent} />
      </View>
    );
  }

  if (access.error) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ProductErrorState
          message={access.error}
          onRetry={() => router.replace(asHref(AppRoutes.productTab))}
        />
      </View>
    );
  }

  if (!access.canViewDesk) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <CommerceAccessGate
          title="Không có quyền Commerce Desk"
          message="Cần voucher.view hoặc promotion.campaign.view (hoặc SUPER_ADMIN)."
          onLogin={goLogin}
        />
      </View>
    );
  }

  const error = activeQuery.error;
  const errorMessage =
    error instanceof ApiError
      ? error.status === 403
        ? 'Không đủ quyền truy cập tab này.'
        : error.message
      : 'Không thể kết nối máy chủ.';

  const listHeader = (
    <View style={styles.headerBlock}>
      {__DEV__ ? <ApiConnectionBanner /> : null}
      <CommerceDeskHeader counts={summaryCounts} />
      <CommerceSegmentTabs activeTab={activeTab} onChange={setActiveTab} />
      <CommerceToolbar
        keyword={keyword}
        loading={activeQuery.isLoading || activeQuery.isFetching}
        onChangeKeyword={setKeyword}
        onSearch={runSearch}
        onReload={reload}
      />
      {activeQuery.isLoading && !activeQuery.data ? <ProductListSkeleton /> : null}
    </View>
  );

  const renderItem = ({ item }: { item: DeskItem }) => {
    if (activeTab === 'vouchers') {
      const row = item as Voucher;
      return (
        <VoucherDeskCard
          voucher={row}
          toggling={togglingId === row.id}
          canToggle={access.canToggleVoucher}
          onToggleStatus={() => handleToggleVoucher(row)}
        />
      );
    }
    if (activeTab === 'campaigns') {
      const row = item as PromotionCampaign;
      return (
        <CampaignDeskCard
          campaign={row}
          toggling={togglingId === row.id}
          canToggle={access.canToggleCampaign}
          onToggleStatus={() => handleToggleCampaign(row)}
        />
      );
    }
    if (activeTab === 'combos') {
      const row = item as ComboPackage;
      return (
        <ComboDeskCard
          combo={row}
          toggling={togglingId === row.id}
          canToggle={access.canToggleCombo}
          onToggleStatus={() => handleToggleCombo(row)}
        />
      );
    }
    const row = item as Product;
    return (
      <ProductDeskCard
        product={row}
        toggling={togglingId === row.id}
        canToggle={access.canToggleProduct}
        onToggleStatus={() => handleToggleProduct(row)}
      />
    );
  };

  if (!canViewActiveTab) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {listHeader}
        <CommerceEmptyState message={commerceDeskCopy.noTabAccess} />
      </View>
    );
  }

  if (activeQuery.isError && !activeQuery.data) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {listHeader}
        <ProductErrorState
          message={errorMessage}
          onRetry={() => {
            if (error instanceof ApiError && error.status === 401) {
              goLogin();
              return;
            }
            reload();
          }}
        />
      </View>
    );
  }

  if (!activeQuery.isLoading && items.length === 0) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {listHeader}
        <CommerceEmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        ListFooterComponent={
          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            disabled={activeQuery.isFetching}
            onPrev={() => setPage(Math.max(0, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={activeQuery.isRefetching}
            onRefresh={reload}
            tintColor={commerceDesk.accent}
          />
        }
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: commerceDesk.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: commerceDesk.surfaceSoft,
  },
  headerBlock: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
  },
  list: {
    paddingHorizontal: space.md,
    paddingBottom: space.lg,
  },
});
