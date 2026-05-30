import { useEffect, useState, useRef, useCallback } from "react";
import { getBackendData } from "@/api/server/serverApiClient";
import type { PageResponse } from "@/types/api";
import type { HotelResponse } from "@/api/server/Hotel.api";
import { HotelOfferCard } from "../components/HotelOfferCard";
import { Footer } from "@/components/Footer/Footer";
import "../components/HotelFeaturedSections.css"; // Reuse card grid styling

export default function HotelCatalogPage() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchHotels = async (pageIdx: number, append: boolean) => {
    try {
      const res = await getBackendData<PageResponse<HotelResponse>>("hotels", {
        isActive: true,
        size: 20,
        page: pageIdx,
      });

      const newItems = res.content ?? [];
      if (append) {
        setHotels((prev) => [...prev, ...newItems]);
      } else {
        setHotels(newItems);
      }

      setHasMore(!res.last);
      setPage(res.page);
    } catch (err) {
      console.error("Failed to load hotels:", err);
    }
  };

  useEffect(() => {
    let active = true;
    fetchHotels(0, false).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchHotels(page + 1, true);
    setLoadingMore(false);
  }, [loading, loadingMore, hasMore, page]);

  useEffect(() => {
    if (!hasMore || loading) return undefined;
    const target = loadMoreRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            marginBottom: "32px",
            color: "#111827",
          }}
        >
          Tất cả khách sạn
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="hf-card hf-card--skeleton"
                style={{
                  background: "#f3f4f6",
                  minHeight: "380px",
                  borderRadius: "12px",
                }}
                aria-hidden
              />
            ))
          ) : hotels.length === 0 ? (
            <p>Không có khách sạn nào.</p>
          ) : (
            hotels.map((h) => <HotelOfferCard key={h.id} hotel={h} />)
          )}
        </div>

        {!loading && hasMore && (
          <div ref={loadMoreRef} style={{ height: "40px" }} aria-hidden />
        )}

        {loadingMore && (
          <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
            Đang tải thêm...
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
