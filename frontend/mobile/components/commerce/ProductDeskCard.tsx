import React from 'react';
import { DeskCardShell, DeskMetaRow } from '@/components/commerce/deskCardParts';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import type { Product } from '@/types/product';
import { formatMoney } from '@/utils/formatMoney';

type Props = {
  product: Product;
  toggling: boolean;
  canToggle: boolean;
  onToggleStatus: () => void;
};

export function ProductDeskCard({ product, toggling, canToggle, onToggleStatus }: Props) {
  const isActive = product.isActive !== false;
  const subtitle = product.description?.trim() || product.productType || 'Product';

  return (
    <DeskCardShell
      code={product.sku}
      isActive={isActive}
      title={product.name}
      subtitle={subtitle}
      toggleOffLabel={commerceDeskCopy.toggleOff}
      toggleOnLabel={commerceDeskCopy.toggleOn}
      toggling={toggling}
      canToggle={canToggle}
      readOnlyHint={commerceDeskCopy.readOnlyProduct}
      onToggleStatus={onToggleStatus}>
      <DeskMetaRow label={commerceDeskCopy.price} value={formatMoney(product.unitPrice)} />
      <DeskMetaRow label={commerceDeskCopy.stock} value={String(product.stockQty ?? 0)} />
      <DeskMetaRow
        label={commerceDeskCopy.gift}
        value={product.isGiftable ? commerceDeskCopy.giftYes : commerceDeskCopy.giftNo}
      />
    </DeskCardShell>
  );
}
