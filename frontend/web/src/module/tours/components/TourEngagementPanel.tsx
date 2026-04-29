import { useEffect, useMemo, useState } from "react";
import { Heart, LogIn, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { wishlistApi } from "../../../api/server/Wishlist.api";
import type { BackendTour } from "../../home/database/interface/publicTravel";
import { getStoredAccessToken } from "../../../utils/authSessionStorage";
import type { TourDetailCopy } from "../utils/tourDetailCopy";

type TourEngagementPanelProps = {
  tour: BackendTour;
  copy: TourDetailCopy;
};

function formatRating(value: number | string | undefined) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating <= 0) {
    return "0.0";
  }

  return rating.toFixed(1);
}

export function TourEngagementPanel({ tour, copy }: TourEngagementPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isAuthenticated = Boolean(getStoredAccessToken());

  const rating = useMemo(() => formatRating(tour.averageRating), [tour.averageRating]);
  const reviewCount = tour.totalReviews ?? 0;

  useEffect(() => {
    let mounted = true;

    async function loadWishlist() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const wishlist = await wishlistApi.getMyTours();
        if (mounted) {
          setIsSaved(wishlist.some((item) => item.tourId === tour.id));
        }
      } catch {
        if (mounted) {
          setIsSaved(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, tour.id]);

  const toggleWishlist = async () => {
    if (!isAuthenticated || loading) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (isSaved) {
        await wishlistApi.removeTour(tour.id);
        setIsSaved(false);
        setMessage(copy.wishlistRemovedMessage);
      } else {
        await wishlistApi.addTour(tour.id);
        setIsSaved(true);
        setMessage(copy.wishlistSavedMessage);
      }
    } catch {
      setMessage(copy.wishlistError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tour-engagement-panel" aria-label={copy.reviewsTitle}>
      <div className="tour-engagement-rating">
        <Star size={22} />
        <div>
          <span>{copy.reviewScore}</span>
          <strong>{rating}</strong>
          <small>
            {reviewCount} {copy.reviewCount}
          </small>
        </div>
      </div>

      {isAuthenticated ? (
        <button
          type="button"
          className={isSaved ? "tour-wishlist-button saved" : "tour-wishlist-button"}
          onClick={toggleWishlist}
          disabled={loading}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? copy.wishlistSaved : copy.wishlistSave}
        </button>
      ) : (
        <Link to="/login" className="tour-wishlist-button">
          <LogIn size={18} />
          {copy.wishlistLogin}
        </Link>
      )}

      {message && <p className="tour-engagement-message">{message}</p>}
    </section>
  );
}
