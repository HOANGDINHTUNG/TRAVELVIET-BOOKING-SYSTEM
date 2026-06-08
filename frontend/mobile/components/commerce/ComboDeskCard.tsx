import React from 'react';
import { DeskCardShell, DeskMetaRow } from '@/components/commerce/deskCardParts';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import type { ComboPackage } from '@/types/promotion';
import { formatMoney } from '@/utils/formatMoney';

type Props = {
  combo: ComboPackage;
  toggling: boolean;
  canToggle: boolean;
  onToggleStatus: () => void;
};

export function ComboDeskCard({ combo, toggling, canToggle, onToggleStatus }: Props) {
  const isActive = combo.isActive !== false;
  const subtitle = combo.description?.trim() || 'Combo package';

  return (
    <DeskCardShell
      code={combo.code ?? '—'}
      isActive={isActive}
      title={combo.name ?? '—'}
      subtitle={subtitle}
      toggleOffLabel={commerceDeskCopy.toggleComboOff}
      toggleOnLabel={commerceDeskCopy.toggleComboOn}
      toggling={toggling}
      canToggle={canToggle}
      readOnlyHint={commerceDeskCopy.readOnlyCombo}
      onToggleStatus={onToggleStatus}>
      <DeskMetaRow label={commerceDeskCopy.comboBase} value={formatMoney(combo.basePrice)} />
      <DeskMetaRow label={commerceDeskCopy.comboDiscount} value={formatMoney(combo.discountAmount)} />
      <DeskMetaRow label={commerceDeskCopy.comboFinal} value={formatMoney(combo.finalPrice)} />
    </DeskCardShell>
  );
}
