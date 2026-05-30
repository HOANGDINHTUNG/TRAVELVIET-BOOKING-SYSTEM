import { BedDouble, Bus, MapPin, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  StarRating,
  TravelOfferCardFrame,
} from "@/components/ui/TravelOfferCard";
import { TruncatedTextTooltip } from "@/components/ui/TruncatedTextTooltip";

import { type ComboPackageResponse } from "@/api/server/Combo.api";
import { formatComboPrice } from "../utils/formatComboPrice";

import "./ComboOfferCard.css";

type ComboOfferCardProps = {
  deal: ComboPackageResponse;
  onViewDetail?: () => void;
  fluid?: boolean;
  showBadge?: boolean;
};

export function ComboOfferCard({
  deal,
  onViewDetail,
  fluid = false,
}: ComboOfferCardProps) {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "combosPage",
  });

  const isFlight = deal.comboType?.includes("FLIGHT");

  const flightItem = deal.items?.find((i) => i.itemType === "FLIGHT");
  const hotelItem = deal.items?.find((i) => i.itemType === "HOTEL");
  const airlineName = flightItem ? flightItem.itemName : "";
  const hotelName = hotelItem ? hotelItem.itemName : "Khách sạn";

  const priceText = `${formatComboPrice(deal.finalPrice, i18n.language)}₫`;
  const mockImage = `https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=720`;

  const navigate = useNavigate();

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail();
      return;
    }
    navigate(`/combos/${deal.id}`);
  };

  return (
    <TravelOfferCardFrame
      ariaLabel={`${deal.name}, ${priceText}`}
      imageUrl={mockImage}
      imageAlt={deal.name}
      widthMode={fluid ? "fluid" : "fixed"}
      className="combo-offer-card"
      priceLabel={t("hotDeals.priceFrom")}
      priceValue={priceText}
      ctaVariant="yellow"
      cta={
        <button type="button" onClick={handleViewDetail}>
          {t("hotDeals.details")}
        </button>
      }
    >
      <TruncatedTextTooltip
        as="h3"
        text={deal.name}
        lineClamp={2}
        side="top"
        className="mb-1.5 min-h-[38px] text-[14px] font-bold leading-[1.35] text-foreground"
      />
      <StarRating count={5} className="mb-2" />

      <ul className="tv-offer-card__meta">
        <li className="tv-offer-card__meta-row">
          <span className="tv-offer-card__meta-item">
            <MapPin size={14} strokeWidth={1.75} aria-hidden />
            <TruncatedTextTooltip text={hotelName} lineClamp={1} side="top" />
          </span>
          <span className="tv-offer-card__meta-item">
            {isFlight ? (
              <Plane size={14} strokeWidth={1.75} aria-hidden />
            ) : (
              <Bus size={14} strokeWidth={1.75} aria-hidden />
            )}
            {airlineName || (isFlight ? "Máy bay" : "Xe khách")}
          </span>
        </li>
        <li className="tv-offer-card__meta-item">
          <BedDouble size={14} strokeWidth={1.75} aria-hidden />
          {t("hotDeals.metaHotelStars", { count: 5 })}
        </li>
      </ul>
    </TravelOfferCardFrame>
  );
}
