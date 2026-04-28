import { CheckCircle2 } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";

type TourOverviewSectionProps = {
  tour: BackendTour;
};

function parseHighlights(highlights?: string) {
  if (!highlights) return [];
  return highlights
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TourOverviewSection({ tour }: TourOverviewSectionProps) {
  const highlights = parseHighlights(tour.highlights);

  return (
    <section className="tour-overview-section">
      <div className="tour-detail-grid">
        <div className="tour-main-content">
          <h2 className="section-title">Tổng quan hành trình</h2>
          <div
            className="tour-description"
            dangerouslySetInnerHTML={{
              __html: tour.description || tour.shortDescription || "",
            }}
          />
        </div>

        <aside className="tour-highlights-panel">
          <h3 className="panel-title">Điểm nhấn nổi bật</h3>
          <ul className="highlights-list">
            {highlights.map((item, index) => (
              <li key={index} className="highlight-item">
                <CheckCircle2 className="text-emerald-500" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
