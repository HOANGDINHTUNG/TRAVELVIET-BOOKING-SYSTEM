import { useEffect, useMemo, useState } from "react";
import {
  type HotelResponse,
  type HotelSearchRequest,
} from "@/api/server/Hotel.api";
import { getBackendData } from "@/api/server/serverApiClient";
import type { PageResponse } from "@/types/api";

export type HotelSortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc";

type FilterState = {
  propertyTypes: Set<string>;
  stars: Set<number>;
  budgetMin: number;
  budgetMax: number;
};

const DEFAULT_BUDGET_RANGE = { min: 0, max: 20000000 };

function defaultFilters(): FilterState {
  return {
    propertyTypes: new Set(["hotel", "resort", "apartment", "villa"]),
    stars: new Set([1, 2, 3, 4, 5]),
    budgetMin: DEFAULT_BUDGET_RANGE.min,
    budgetMax: DEFAULT_BUDGET_RANGE.max,
  };
}

export function useHotelResultsState(searchParams: HotelSearchRequest) {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortKey, setSortKey] = useState<HotelSortKey>("relevance");

  const performFetch = async (
    pageIdx: number,
    append: boolean,
    cancelToken: { cancelled: boolean },
  ) => {
    try {
      const res = await getBackendData<PageResponse<HotelResponse>>("hotels", {
        ...searchParams,
        page: pageIdx,
        size: 20,
      } as Record<string, unknown>);
      if (cancelToken.cancelled) return;

      const newItems = res?.content ?? [];
      if (append) {
        setHotels((prev) => [...prev, ...newItems]);
      } else {
        setHotels(newItems);
      }
      setHasMore(!res.last);
      setPage(res.page);
    } catch (error) {
      if (!cancelToken.cancelled) {
        console.error("Failed to fetch hotels:", error);
      }
    }
  };

  useEffect(() => {
    const cancelToken = { cancelled: false };
    async function fetchInitial() {
      setLoading(true);
      await performFetch(0, false, cancelToken);
      if (!cancelToken.cancelled) setLoading(false);
    }
    fetchInitial();
    return () => {
      cancelToken.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams.destinationId,
    searchParams.keyword,
    searchParams.checkinDate,
    searchParams.checkoutDate,
    searchParams.rooms,
    searchParams.adults,
    searchParams.children,
    searchParams.minStar,
    searchParams.maxStar,
    searchParams.page,
    searchParams.size,
  ]);

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    await performFetch(page + 1, true, { cancelled: false });
    setLoadingMore(false);
  };

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      // propertyType mock using title because no API field
      const nm = h.name.toLowerCase();
      let type = "hotel";
      if (nm.includes("resort")) type = "resort";
      else if (nm.includes("villa")) type = "villa";
      else if (nm.includes("apartment") || nm.includes("căn hộ"))
        type = "apartment";

      if (!filters.propertyTypes.has(type)) return false;
      if (!filters.stars.has(Math.floor(h.starRating))) return false;
      if (
        h.minRoomPrice < filters.budgetMin ||
        h.minRoomPrice > filters.budgetMax
      ) {
        return false;
      }
      return true;
    });
  }, [hotels, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => a.minRoomPrice - b.minRoomPrice);
        break;
      case "price-desc":
        list.sort((a, b) => b.minRoomPrice - a.minRoomPrice);
        break;
      case "rating-desc":
        list.sort(
          (a, b) =>
            b.reviewScore - a.reviewScore || a.minRoomPrice - b.minRoomPrice,
        );
        break;
      default:
        list.sort(
          (a, b) =>
            b.reviewScore - a.reviewScore || a.minRoomPrice - b.minRoomPrice,
        );
    }
    return list;
  }, [filtered, sortKey]);

  const resetFilters = () => setFilters(defaultFilters());

  const togglePropertyType = (id: string) => {
    setFilters((prev) => {
      const next = new Set(prev.propertyTypes);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, propertyTypes: next };
    });
  };

  const toggleStar = (star: number) => {
    setFilters((prev) => {
      const next = new Set(prev.stars);
      if (next.has(star)) next.delete(star);
      else next.add(star);
      return { ...prev, stars: next };
    });
  };

  const setBudget = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, budgetMin: min, budgetMax: max }));
  };

  return {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    sortKey,
    setSortKey,
    sorted,
    filteredCount: filtered.length,
    totalCount: hotels.length,
    filters,
    resetFilters,
    togglePropertyType,
    toggleStar,
    setBudget,
  };
}
