import { useEffect, useMemo, useState } from "react";
import {
  comboApi,
  type ComboPackageResponse,
  type ComboSearchRequest,
} from "@/api/server/Combo.api";

export type CatalogScope = "domestic" | "international";
export type CatalogTransportFilter = "all" | "car" | "flight";
export type CatalogBudgetKey = "under5" | "5to10" | "10to20" | "over20";
export type CatalogSortKey = "price-asc" | "price-desc" | "rating-desc";

export type ComboCatalogFiltersState = {
  scope: CatalogScope;
  transport: CatalogTransportFilter;
  departure: string;
  destination: string;
  departDate: string;
  minStars: number | null;
  budget: CatalogBudgetKey | null;
  sort: CatalogSortKey;
};

export const CATALOG_DEPARTURE_OPTIONS = [
  { value: "all", labelKey: "catalog.filters.all" },
  { value: "DAD", labelKey: "catalog.filters.departureDAD" },
  { value: "HAN", labelKey: "catalog.filters.departureHAN" },
  { value: "SGN", labelKey: "catalog.filters.departureSGN" },
];

export const CATALOG_DESTINATION_OPTIONS = [
  { value: "all", labelKey: "catalog.filters.all" },
  { value: "BKK", labelKey: "catalog.filters.destBKK" },
  { value: "PQC", labelKey: "catalog.filters.destPQC" },
  { value: "NHA", labelKey: "catalog.filters.destNHA" },
];

const DEFAULT_DEPART_DATE = "2026-05-27";

const INITIAL: ComboCatalogFiltersState = {
  scope: "domestic",
  transport: "all",
  departure: "all",
  destination: "all",
  departDate: DEFAULT_DEPART_DATE,
  minStars: null,
  budget: null,
  sort: "price-asc",
};

function matchesBudget(
  price: number,
  budget: CatalogBudgetKey | null,
): boolean {
  if (!budget) return true;
  if (budget === "under5") return price < 5_000_000;
  if (budget === "5to10") return price >= 5_000_000 && price < 10_000_000;
  if (budget === "10to20") return price >= 10_000_000 && price < 20_000_000;
  return price >= 20_000_000;
}

export function useComboCatalogFilters() {
  const [combos, setCombos] = useState<ComboPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [filters, setFilters] = useState<ComboCatalogFiltersState>(INITIAL);

  const performFetch = async (pageToLoad: number, append: boolean) => {
    try {
      const searchReq: ComboSearchRequest = {
        isActive: true,
        page: pageToLoad,
        size: 20,
      };

      const res = await comboApi.search(searchReq);
      const newItems = res.content ?? [];

      if (append) {
        setCombos((prev) => [...prev, ...newItems]);
      } else {
        setCombos(newItems);
      }

      setHasMore(!res.last);
      setNextPage(res.page + 1);
    } catch (error) {
      console.error("Failed to fetch combos:", error);
    }
  };

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      setLoading(true);
      await performFetch(0, false);
      if (active) setLoading(false);
    };
    loadInitial();
    return () => {
      active = false;
    };
  }, [filters.transport]); // Refetch on major type change, others can be local filtering

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    await performFetch(nextPage, true);
    setLoadingMore(false);
  };

  const filtered = useMemo(() => {
    let list = combos.filter((deal) => {
      if (filters.transport === "car" && deal.comboType !== "HOTEL_CAR")
        return false;
      if (filters.transport === "flight" && deal.comboType !== "HOTEL_FLIGHT")
        return false;
      if (!matchesBudget(deal.finalPrice, filters.budget)) return false;
      return true;
    });

    if (filters.sort === "price-desc") {
      list = [...list].sort((a, b) => b.finalPrice - a.finalPrice);
    } else {
      list = [...list].sort((a, b) => a.finalPrice - b.finalPrice);
    }

    return list;
  }, [combos, filters]);

  const reset = () => setFilters(INITIAL);

  const patch = (partial: Partial<ComboCatalogFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  return {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    filters,
    filtered,
    reset,
    patch,
  };
}
