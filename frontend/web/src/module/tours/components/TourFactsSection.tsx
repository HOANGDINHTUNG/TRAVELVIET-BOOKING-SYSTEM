import { Compass } from "lucide-react";
import type { TourDetailCopy } from "../utils/tourDetailCopy";
import type { TourDetailViewModel } from "../utils/tourDetailViewModel";

type TourFactsSectionProps = {
  viewModel: TourDetailViewModel;
  copy: TourDetailCopy;
};

export function TourFactsSection({ viewModel, copy }: TourFactsSectionProps) {
  return (
    <section className="tour-facts-section" aria-label={copy.factsTitle}>
      <div className="tour-facts-title">
        <Compass size={20} />
        <h2>{copy.factsTitle}</h2>
      </div>

      <dl className="tour-facts-grid">
        {viewModel.facts.map((item) => (
          <div key={item.label} className="tour-fact-item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
