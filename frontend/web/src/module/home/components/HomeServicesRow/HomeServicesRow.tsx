import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./HomeServicesRow.css";

const SERVICE_ICONS = [
  "https://thdtravel.com.vn/wp-content/uploads/2025/07/icon-dich-vu-khac-5.png",
  "https://thdtravel.com.vn/wp-content/uploads/2025/07/icon-dich-vu-khac-6.png",
  "https://thdtravel.com.vn/wp-content/uploads/2025/07/icon-dich-vu-khac-7.png",
  "https://thdtravel.com.vn/wp-content/uploads/2025/07/icon-dich-vu-khac-8.png",
] as const;

export function HomeServicesRow() {
  const { t } = useTranslation();

  const services = useMemo(
    () =>
      [
        { labelKey: "homePage.services.hotel", to: "/hotels", iconIndex: 0 as const },
        { labelKey: "homePage.services.carRental", to: "/car-rental", iconIndex: 1 as const },
        { labelKey: "homePage.services.flights", to: "/flights", iconIndex: 2 as const },
        { labelKey: "homePage.services.visa", to: "/visa", iconIndex: 3 as const },
      ] as const,
    [],
  );

  return (
    <div className="hsrow-wrap">
      <div className="hsrow-inner">
        {services.map((svc) => (
          <Link key={svc.labelKey} to={svc.to} className="hsrow-item">
            <span className="hsrow-icon">
              <img
                src={SERVICE_ICONS[svc.iconIndex]}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </span>
            <span className="hsrow-label">{t(svc.labelKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
