import { useEffect, useMemo, useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { reviewApi, type Review } from "../../../api/server/Review.api";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy } from "../utils/tourDetailCopy";

type TourReviewsSectionProps = {
  tour: BackendTour;
  copy: TourDetailCopy;
};

function formatRating(value: number | string | undefined) {
  const rating = Number(value);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "0.0";
}

export function TourReviewsSection({ tour, copy }: TourReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      setLoading(true);
      setError("");

      try {
        const response = await reviewApi.getForTour(tour.id, { page: 0, size: 6 });
        if (mounted) {
          setReviews(response.content);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : copy.noReviews);
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadReviews();

    return () => {
      mounted = false;
    };
  }, [copy.noReviews, tour.id]);

  const summary = useMemo(() => {
    const backendScore = Number(tour.averageRating);
    if (Number.isFinite(backendScore) && backendScore > 0) {
      return backendScore;
    }

    if (!reviews.length) {
      return 0;
    }

    return reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length;
  }, [reviews, tour.averageRating]);

  return (
    <section className="tour-section tour-reviews-section">
      <div className="tour-section-heading">
        <p className="tour-section-kicker">{copy.reviewsKicker}</p>
        <h2>{copy.reviewsTitle}</h2>
      </div>

      <div className="tour-reviews-summary">
        <div>
          <Star size={24} />
          <strong>{formatRating(summary)}</strong>
          <span>
            {tour.totalReviews ?? reviews.length} {copy.reviewCount}
          </span>
        </div>
        <p>{copy.wouldRecommend}</p>
      </div>

      {loading ? (
        <div className="tour-empty-state">{copy.reviewsLoading}</div>
      ) : error ? (
        <div className="tour-empty-state">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="tour-empty-state">{copy.noReviews}</div>
      ) : (
        <div className="tour-review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="tour-review-card">
              <div className="tour-review-card-head">
                <span>
                  <Star size={16} />
                  {review.overallRating}/5
                </span>
                {review.sentiment && <small>{review.sentiment}</small>}
              </div>
              <h3>{review.title || copy.reviewsTitle}</h3>
              {review.content && <p>{review.content}</p>}
              {review.wouldRecommend && (
                <em>
                  <MessageSquareText size={15} />
                  {copy.wouldRecommend}
                </em>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
