import { ClipboardCheck, Info, ShieldCheck, XCircle } from "lucide-react";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";

type TourPolicySectionProps = {
  tour: BackendTour;
  copy: TourDetailCopy;
};

function HtmlBlock({ html, fallback }: { html?: string; fallback: string }) {
  if (!html) {
    return <p>{fallback}</p>;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function TourPolicySection({ tour, copy }: TourPolicySectionProps) {
  const policy = tour.cancellationPolicy;

  return (
    <section className="tour-section tour-policy-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.policyKicker}</p>
        <h2>{copy.policyTitle}</h2>
      </div>

      <div className="tour-policy-grid">
        <article className="tour-policy-card">
          <div className="tour-policy-card-header">
            <ShieldCheck size={22} />
            <h3>{copy.inclusions}</h3>
          </div>
          <div className="tour-policy-content">
            <HtmlBlock html={tour.inclusions} fallback={copy.noContent} />
          </div>
        </article>

        <article className="tour-policy-card">
          <div className="tour-policy-card-header danger">
            <XCircle size={22} />
            <h3>{copy.exclusions}</h3>
          </div>
          <div className="tour-policy-content">
            <HtmlBlock html={tour.exclusions} fallback={copy.noContent} />
          </div>
        </article>

        <article className="tour-policy-card">
          <div className="tour-policy-card-header info">
            <Info size={22} />
            <h3>{copy.notes}</h3>
          </div>
          <div className="tour-policy-content">
            <HtmlBlock html={tour.notes} fallback={copy.noContent} />
          </div>
        </article>

        <article className="tour-policy-card">
          <div className="tour-policy-card-header">
            <ClipboardCheck size={22} />
            <h3>{copy.checklistTitle}</h3>
          </div>
          <div className="tour-policy-content">
            {tour.checklistItems?.length ? (
              <ul>
                {tour.checklistItems.map((item) => (
                  <li key={item.id}>
                    {item.itemName}
                    {item.isRequired ? " *" : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{copy.noContent}</p>
            )}
          </div>
        </article>
      </div>

      {policy && (
        <article className="tour-cancellation-panel">
          <div>
            <p className="tour-section-kicker">{copy.cancellationPolicy}</p>
            <h3>{policy.name}</h3>
            {policy.description && <p>{policy.description}</p>}
          </div>
          {policy.rules?.length > 0 && (
            <ul>
              {policy.rules.map((rule) => (
                <li key={rule.id}>
                  <strong>{rule.refundPercent}%</strong>
                  <span>{rule.notes || copy.noContent}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </section>
  );
}
