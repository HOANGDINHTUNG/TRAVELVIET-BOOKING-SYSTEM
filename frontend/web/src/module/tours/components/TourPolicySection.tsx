import { Info, ShieldCheck, XCircle } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";

type TourPolicySectionProps = {
  tour: BackendTour;
};

export function TourPolicySection({ tour }: TourPolicySectionProps) {
  return (
    <section className="tour-policy-section">
      <h2 className="section-title">Thông tin bổ sung & Chính sách</h2>

      <div className="policy-grid">
        <div className="policy-card inclusions">
          <div className="policy-card-header">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h3>Bao gồm</h3>
          </div>
          <div
            className="policy-card-content"
            dangerouslySetInnerHTML={{
              __html: tour.inclusions || "Liên hệ để biết thêm chi tiết",
            }}
          />
        </div>

        <div className="policy-card exclusions">
          <div className="policy-card-header">
            <XCircle className="text-red-500" size={24} />
            <h3>Không bao gồm</h3>
          </div>
          <div
            className="policy-card-content"
            dangerouslySetInnerHTML={{
              __html: tour.exclusions || "Liên hệ để biết thêm chi tiết",
            }}
          />
        </div>

        <div className="policy-card notes full-width">
          <div className="policy-card-header">
            <Info className="text-blue-500" size={24} />
            <h3>Lưu ý quan trọng</h3>
          </div>
          <div
            className="policy-card-content"
            dangerouslySetInnerHTML={{
              __html: tour.notes || "Không có lưu ý đặc biệt",
            }}
          />
        </div>
      </div>
    </section>
  );
}
