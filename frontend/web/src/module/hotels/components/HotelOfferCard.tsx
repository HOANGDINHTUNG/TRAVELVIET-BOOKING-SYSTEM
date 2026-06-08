import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  StarRating,
  TravelOfferCardFrame,
} from "@/components/ui/TravelOfferCard";
import { TruncatedTextTooltip } from "@/components/ui/TruncatedTextTooltip";

import { type HotelResponse } from "@/api/server/Hotel.api";

type HotelOfferCardProps = {
  hotel: HotelResponse;
};

export function HotelOfferCard({ hotel }: HotelOfferCardProps) {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "hotelsPage",
  });
  const navigate = useNavigate();

  const priceText = `${new Intl.NumberFormat(i18n.language === "vi" ? "vi-VN" : "en-US").format(hotel.minRoomPrice)}₫`;
  const mockImage = `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=640&q=80`;

  return (
    <TravelOfferCardFrame
      ariaLabel={`${hotel.name}, ${priceText}`}
      imageUrl={mockImage}
      imageAlt={hotel.name}
      widthMode="fixed"
      priceLabel={t("featured.priceFrom") || "Giá từ:"}
      priceValue={priceText}
      ctaVariant="yellow"
      cta={
        <button type="button" onClick={() => navigate(`/hotels/${hotel.id}`)}>
          {"Xem phòng"}
        </button>
      }
    >
      <TruncatedTextTooltip
        as="h3"
        text={hotel.name}
        lineClamp={2}
        side="top"
        className="mb-1.5 min-h-[38px] text-[14px] font-bold leading-[1.35] text-foreground"
      />
      <StarRating count={Math.floor(hotel.starRating || 0)} className="mb-2" />

      <ul className="tv-offer-card__meta">
        <li className="tv-offer-card__meta-row">
          <span className="tv-offer-card__meta-item">
            <MapPin size={14} strokeWidth={1.75} aria-hidden />
            <TruncatedTextTooltip
              text={`${hotel.district ? `${hotel.district}, ` : ""}${hotel.province}`}
              lineClamp={1}
              side="top"
            />
          </span>
        </li>
      </ul>
    </TravelOfferCardFrame>
  );
}
