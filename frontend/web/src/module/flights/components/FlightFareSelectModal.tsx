import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { type FlightResponse } from "@/api/server/Flight.api";
import { formatDurationVi, formatPriceVnd } from "@/utils/formatters";
import { getAirlineMetaById } from "@/utils/flightHelpers";
import "./FlightFareSelectModal.css";

export type FareOption = {
  id: string;
  label: string;
  cabin: "economy" | "premium_economy" | "business" | "first";
  priceVnd: number;
  perks: string[];
};

function generateFareOptions(offer: FlightResponse): FareOption[] {
  const p = Number(offer.minPrice);
  return [
    {
      id: `${offer.id}:eco-flex`,
      label: "Economy Flex",
      cabin: "economy",
      priceVnd: p,
      perks: ["Hành lý xách tay", "Đổi vé linh hoạt"],
    },
    {
      id: `${offer.id}:premium`,
      label: "PREMIUM ECONOMY",
      cabin: "premium_economy",
      priceVnd: Math.round(p * 1.85),
      perks: ["Ghế rộng hơn", "Ưu tiên làm thủ tục"],
    },
  ];
}

/** Thay thế MockFlightOffer — dùng dữ liệu thực từ backend */
export type LegMeta = {
  label: string;
  fromIata: string;
  toIata: string;
  dateLabel: string;
  paxLabel: string;
  offer: FlightResponse;
};

export type FlightFareSelection = {
  outboundFareId: string;
  inboundFareId?: string;
};

export function FlightFareSelectModal({
  open,
  onClose,
  outbound,
  inbound,
  locale,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  outbound: LegMeta;
  inbound?: LegMeta;
  locale: string;
  onConfirm: (payload: FlightFareSelection) => void;
}) {
  const { t } = useTranslation("translation", { keyPrefix: "flightsPage" });
  const [outFareId, setOutFareId] = useState<string>(
    () => generateFareOptions(outbound.offer)[0]?.id,
  );
  const [inFareId, setInFareId] = useState<string | undefined>(() =>
    inbound ? generateFareOptions(inbound.offer)[0]?.id : undefined,
  );

  const outFares = useMemo(
    () => generateFareOptions(outbound.offer),
    [outbound.offer],
  );
  const inFares = useMemo(
    () => (inbound ? generateFareOptions(inbound.offer) : []),
    [inbound],
  );

  const total = useMemo(() => {
    const out =
      outFares.find((f) => f.id === outFareId)?.priceVnd ??
      Number(outbound.offer.minPrice);
    const inn = inbound
      ? (inFares.find((f) => f.id === inFareId)?.priceVnd ??
        Number(inbound.offer.minPrice))
      : 0;
    return out + inn;
  }, [
    outFares,
    outFareId,
    outbound.offer.minPrice,
    inbound,
    inFares,
    inFareId,
  ]);

  if (!open) return null;

  const canConfirm = Boolean(outFareId) && (!inbound || Boolean(inFareId));

  return (
    <div
      className="ffm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t("dealSections.sectionAria")}
    >
      <div className="ffm-panel">
        <div className="ffm-head">
          <h3 className="ffm-title">Xem chuyến bay và chọn hạng ghế</h3>
          <button
            type="button"
            className="ffm-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <FareLegBlock
          legTitle="Bay đi"
          meta={outbound}
          locale={locale}
          fares={outFares}
          selectedFareId={outFareId}
          onSelectFare={setOutFareId}
        />

        {inbound ? (
          <FareLegBlock
            legTitle="Bay về"
            meta={inbound}
            locale={locale}
            fares={inFares}
            selectedFareId={inFareId ?? ""}
            onSelectFare={(id) => setInFareId(id)}
          />
        ) : null}

        <div className="ffm-footer">
          <div className="ffm-total">
            <span>Tổng tiền:</span>
            <strong>{formatPriceVnd(total, locale).replace("₫", "đ")}</strong>
            <small>*Giá vé đã bao gồm thuế phí, phụ thu</small>
          </div>
          <button
            type="button"
            className={cn("ffm-book", !canConfirm && "is-disabled")}
            disabled={!canConfirm}
            onClick={() =>
              onConfirm({ outboundFareId: outFareId, inboundFareId: inFareId })
            }
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(isoDateTime: string, locale: string): string {
  try {
    return new Date(isoDateTime).toLocaleTimeString(
      locale === "en" ? "en-GB" : "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    );
  } catch {
    return isoDateTime;
  }
}

function FareLegBlock({
  legTitle,
  meta,
  locale,
  fares,
  selectedFareId,
  onSelectFare,
}: {
  legTitle: string;
  meta: LegMeta;
  locale: string;
  fares: FareOption[];
  selectedFareId: string;
  onSelectFare: (id: string) => void;
}) {
  const airline = getAirlineMetaById(meta.offer.airlineId);
  const duration = formatDurationVi(meta.offer.durationMinutes);
  const stopLabel = "Bay thẳng";

  const departTime = formatTime(meta.offer.departureTimeLocal, locale);
  const arriveTime = formatTime(meta.offer.arrivalTimeLocal, locale);

  return (
    <section className="ffm-leg">
      <div className="ffm-leg__bar">
        <span className="ffm-leg__chip">{legTitle}</span>
        <span className="ffm-leg__route">
          ({meta.fromIata}) → ({meta.toIata})
        </span>
        <span className="ffm-leg__meta">
          {meta.dateLabel} | {meta.paxLabel}
        </span>
      </div>

      <div className="ffm-flight">
        <div className="ffm-airline">
          <span
            className="ffm-airline__mark"
            aria-hidden
            style={{ backgroundColor: airline.brandColor }}
          >
            {airline.logoText}
          </span>
          <span className="ffm-airline__name">{meta.offer.airlineName}</span>
          <span className="ffm-bag">7kg</span>
        </div>

        <div className="ffm-times">
          <div className="ffm-time">
            <strong>{departTime}</strong>
            <span>{meta.fromIata}</span>
          </div>
          <div className="ffm-mid">
            <span>{stopLabel}</span>
            <small>{duration}</small>
          </div>
          <div className="ffm-time ffm-time--end">
            <strong>{arriveTime}</strong>
            <span>{meta.toIata}</span>
          </div>
        </div>
      </div>

      <div className="ffm-fares">
        {fares.length > 0 ? (
          fares.map((fare) => {
            const selected = fare.id === selectedFareId;
            return (
              <button
                key={fare.id}
                type="button"
                className={cn("ffm-fare", selected && "is-selected")}
                onClick={() => onSelectFare(fare.id)}
              >
                <div className="ffm-fare__top">
                  <span className="ffm-fare__name">{fare.label}</span>
                </div>
                <div className="ffm-fare__price">
                  <span>Người lớn</span>
                  <strong>
                    {formatPriceVnd(fare.priceVnd, locale).replace("₫", "đ")}
                  </strong>
                </div>
                <div className="ffm-fare__actions">
                  <span className="ffm-fare__cond">Điều kiện</span>
                  <span
                    className={cn("ffm-fare__pick", selected && "is-picked")}
                  >
                    {selected ? "Đang chọn" : "Chọn"}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          // Nếu không có fare mock, hiển thị giá từ backend
          <button
            type="button"
            className={cn("ffm-fare", "is-selected")}
            onClick={() => onSelectFare("economy")}
          >
            <div className="ffm-fare__top">
              <span className="ffm-fare__name">Economy</span>
            </div>
            <div className="ffm-fare__price">
              <span>Người lớn</span>
              <strong>
                {formatPriceVnd(Number(meta.offer.minPrice), locale).replace(
                  "₫",
                  "đ",
                )}
              </strong>
            </div>
            <div className="ffm-fare__actions">
              <span className="ffm-fare__cond">Điều kiện</span>
              <span className={cn("ffm-fare__pick", "is-picked")}>
                Đang chọn
              </span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
