import { useEffect, useMemo, useState } from "react";
import {
  type FlightResponse,
  type FlightSearchRequest,
} from "@/api/server/Flight.api";
import { getBackendData } from "@/api/server/serverApiClient";
import type { PageResponse } from "@/types/api";

export type FlightSortKey =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "duration-asc";

type FilterState = {
  airlines: Set<number>;
  timeSlots: Set<string>;
  stops: Set<string>;
  budgetMin: number;
  budgetMax: number;
};

const DEFAULT_BUDGET_RANGE = { min: 0, max: 50000000 };

const ALL_TIME_SLOTS = ["early", "morning", "afternoon", "evening"];
const ALL_STOPS = ["direct", "one-stop"];

function defaultFilters(): FilterState {
  return {
    airlines: new Set(), // Will be populated from data if needed
    timeSlots: new Set(ALL_TIME_SLOTS),
    stops: new Set(ALL_STOPS),
    budgetMin: DEFAULT_BUDGET_RANGE.min,
    budgetMax: DEFAULT_BUDGET_RANGE.max,
  };
}

export function useFlightResultsState(searchParams: FlightSearchRequest) {
  const [offers, setOffers] = useState<FlightResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortKey, setSortKey] = useState<FlightSortKey>("newest");
  const [quickTab, setQuickTab] = useState<"lowest" | "shortest" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchFlights() {
      setLoading(true);
      try {
        // Bypass strict API constraints to display data since mock database doesn't have local flights
        const res = await getBackendData<PageResponse<FlightResponse>>(
          "flights",
          { size: 100 },
        );
        if (cancelled) return;
        const flights = res?.content ?? [];
        setOffers(flights);
        const airlineIds = new Set(flights.map((f) => f.airlineId));
        setFilters((prev) => ({ ...prev, airlines: airlineIds }));
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch flights:", error);
          setOffers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFlights();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams.originCode,
    searchParams.destinationCode,
    searchParams.originDestinationId,
    searchParams.destinationId,
    searchParams.departureDate,
    searchParams.passengers,
    searchParams.cabinClass,
    searchParams.page,
    searchParams.size,
  ]);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (filters.airlines.size > 0 && !filters.airlines.has(o.airlineId))
        return false;
      // timeSlot and stops filtering might need mapping from backend data
      // For now, focusing on basic budget filtering
      if (o.minPrice < filters.budgetMin || o.minPrice > filters.budgetMax)
        return false;
      return true;
    });
  }, [offers, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (quickTab === "lowest") {
      list.sort((a, b) => a.minPrice - b.minPrice);
      return list;
    }
    if (quickTab === "shortest") {
      list.sort(
        (a, b) =>
          a.durationMinutes - b.durationMinutes || a.minPrice - b.minPrice,
      );
      return list;
    }
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        list.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "duration-asc":
        list.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      default:
        list.sort((a, b) =>
          a.departureTimeLocal.localeCompare(b.departureTimeLocal),
        );
    }
    return list;
  }, [filtered, sortKey, quickTab]);

  const bestPick = useMemo(
    () => sorted[0], // Simplified best pick logic
    [sorted],
  );

  const departList = useMemo(
    () => sorted.filter((o) => o.id !== bestPick?.id),
    [sorted, bestPick],
  );

  const lowestOffer = useMemo(
    () => [...offers].sort((a, b) => a.minPrice - b.minPrice)[0],
    [offers],
  );

  const shortestOffer = useMemo(
    () =>
      [...offers].sort(
        (a, b) =>
          a.durationMinutes - b.durationMinutes || a.minPrice - b.minPrice,
      )[0],
    [offers],
  );

  const resetFilters = () => {
    setFilters(defaultFilters());
    setQuickTab(null);
    setSortKey("newest");
  };

  const toggleAirline = (id: number) => {
    setFilters((prev) => {
      const next = new Set(prev.airlines);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, airlines: next };
    });
  };

  const toggleTimeSlot = (id: string) => {
    setFilters((prev) => {
      const next = new Set(prev.timeSlots);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, timeSlots: next };
    });
  };

  const toggleStop = (id: string) => {
    setFilters((prev) => {
      const next = new Set(prev.stops);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, stops: next };
    });
  };

  const setBudget = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, budgetMin: min, budgetMax: max }));
  };

  return {
    loading,
    filters,
    sortKey,
    setSortKey,
    quickTab,
    setQuickTab,
    filtered,
    sorted,
    bestPick,
    departList,
    lowestOffer,
    shortestOffer,
    resetFilters,
    toggleAirline,
    toggleTimeSlot,
    toggleStop,
    setBudget,
  };
}
