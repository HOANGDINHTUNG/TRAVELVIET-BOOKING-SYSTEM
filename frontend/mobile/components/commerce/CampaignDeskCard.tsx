import React from 'react';
import { DeskCardShell, DeskMetaRow } from '@/components/commerce/deskCardParts';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import type { PromotionCampaign } from '@/types/promotion';
import { formatDate } from '@/utils/formatDate';

type Props = {
  campaign: PromotionCampaign;
  toggling: boolean;
  canToggle: boolean;
  onToggleStatus: () => void;
};

export function CampaignDeskCard({ campaign, toggling, canToggle, onToggleStatus }: Props) {
  const isActive = campaign.isActive !== false;
  const title = campaign.displayTitle || campaign.name || '—';
  const subtitle =
    campaign.displaySubtitle || campaign.description || 'Promotion campaign';
  const display =
    campaign.isFeatured ? 'Featured' : campaign.targetMemberLevel || 'ALL';

  return (
    <DeskCardShell
      code={campaign.code ?? '—'}
      isActive={isActive}
      title={title}
      subtitle={subtitle}
      toggleOffLabel={commerceDeskCopy.toggleCampaignOff}
      toggleOnLabel={commerceDeskCopy.toggleCampaignOn}
      toggling={toggling}
      canToggle={canToggle}
      readOnlyHint={commerceDeskCopy.readOnlyCampaign}
      onToggleStatus={onToggleStatus}>
      <DeskMetaRow label={commerceDeskCopy.campaignDisplay} value={display} />
      <DeskMetaRow label={commerceDeskCopy.campaignStart} value={formatDate(campaign.startAt)} />
      <DeskMetaRow label={commerceDeskCopy.campaignEnd} value={formatDate(campaign.endAt)} />
    </DeskCardShell>
  );
}
