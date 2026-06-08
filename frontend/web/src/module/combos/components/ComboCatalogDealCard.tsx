import { type ComboPackageResponse } from "@/api/server/Combo.api";
import { ComboOfferCard } from "./ComboOfferCard";

type ComboCatalogDealCardProps = {
  deal: ComboPackageResponse;
  onViewDetail: () => void;
};

export function ComboCatalogDealCard({
  deal,
  onViewDetail,
}: ComboCatalogDealCardProps) {
  return (
    <ComboOfferCard
      deal={deal}
      onViewDetail={onViewDetail}
      fluid
      showBadge={false}
    />
  );
}
