import React from 'react';
import { DeskCardShell, DeskMetaRow } from '@/components/commerce/deskCardParts';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import type { Voucher } from '@/types/promotion';
import { formatDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/formatMoney';

type Props = {
  voucher: Voucher;
  toggling: boolean;
  canToggle: boolean;
  onToggleStatus: () => void;
};

export function VoucherDeskCard({ voucher, toggling, canToggle, onToggleStatus }: Props) {
  const isActive = voucher.isActive !== false;
  const subtitle = voucher.description?.trim() || voucher.discountType || 'Voucher';

  return (
    <DeskCardShell
      code={voucher.code ?? '—'}
      isActive={isActive}
      title={voucher.name ?? '—'}
      subtitle={subtitle}
      toggleOffLabel={commerceDeskCopy.toggleVoucherOff}
      toggleOnLabel={commerceDeskCopy.toggleVoucherOn}
      toggling={toggling}
      canToggle={canToggle}
      readOnlyHint={commerceDeskCopy.readOnlyVoucher}
      onToggleStatus={onToggleStatus}>
      <DeskMetaRow label={commerceDeskCopy.voucherValue} value={formatMoney(voucher.discountValue)} />
      <DeskMetaRow label={commerceDeskCopy.voucherUsed} value={String(voucher.usedCount ?? 0)} />
      <DeskMetaRow label={commerceDeskCopy.voucherEnd} value={formatDate(voucher.endAt)} />
    </DeskCardShell>
  );
}
