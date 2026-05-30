import type { ComboPackageResponse } from "@/api/server/Combo.api";
import { ComboOfferCard } from "./ComboOfferCard";

type ComboDealCardProps = {
  deal: ComboPackageResponse;
  onViewDetail?: () => void;
};

export function ComboDealCard({ deal, onViewDetail }: ComboDealCardProps) {
  return <ComboOfferCard deal={deal} onViewDetail={onViewDetail} fluid />;
}
