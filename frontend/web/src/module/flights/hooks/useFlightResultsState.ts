import { useMemo, useState } from 'react'
import type { FlightAirlineId, FlightStopType, FlightTimeSlotId, MockFlightOffer } from '../data/flightSearchResultsMock'
import { MOCK_BUDGET_RANGE } from '../data/flightSearchResultsMock'

export type FlightSortKey = 'newest' | 'price-asc' | 'price-desc' | 'duration-asc'

type FilterState = {
  airlines: Set<FlightAirlineId>
  timeSlots: Set<FlightTimeSlotId>
  stops: Set<FlightStopType>
  budgetMin: number
  budgetMax: number
}

const ALL_AIRLINE_IDS: FlightAirlineId[] = [
  'vietjet',
  'vietravel',
  'bamboo',
  'vietnam',
  'sun-phuquoc',
]

const ALL_TIME_SLOTS: FlightTimeSlotId[] = ['early', 'morning', 'afternoon', 'evening']
const ALL_STOPS: FlightStopType[] = ['direct', 'one-stop']

function defaultFilters(): FilterState {
  return {
    airlines: new Set(ALL_AIRLINE_IDS),
    timeSlots: new Set(ALL_TIME_SLOTS),
    stops: new Set(ALL_STOPS),
    budgetMin: MOCK_BUDGET_RANGE.min,
    budgetMax: MOCK_BUDGET_RANGE.max,
  }
}

export function useFlightResultsState(offers: MockFlightOffer[]) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sortKey, setSortKey] = useState<FlightSortKey>('newest')
  const [quickTab, setQuickTab] = useState<'lowest' | 'shortest' | null>(null)

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (!filters.airlines.has(o.airlineId)) return false
      if (!filters.timeSlots.has(o.timeSlot)) return false
      if (!filters.stops.has(o.stopType)) return false
      if (o.priceVnd < filters.budgetMin || o.priceVnd > filters.budgetMax) return false
      return true
    })
  }, [offers, filters])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (quickTab === 'lowest') {
      list.sort((a, b) => a.priceVnd - b.priceVnd)
      return list
    }
    if (quickTab === 'shortest') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes || a.priceVnd - b.priceVnd)
      return list
    }
    switch (sortKey) {
      case 'price-asc':
        list.sort((a, b) => a.priceVnd - b.priceVnd)
        break
      case 'price-desc':
        list.sort((a, b) => b.priceVnd - a.priceVnd)
        break
      case 'duration-asc':
        list.sort((a, b) => a.durationMinutes - b.durationMinutes)
        break
      default:
        list.sort((a, b) => a.departTime.localeCompare(b.departTime))
    }
    return list
  }, [filtered, sortKey, quickTab])

  const bestPick = useMemo(
    () => offers.find((o) => o.isBestPick) ?? sorted[0],
    [offers, sorted],
  )

  const departList = useMemo(
    () => sorted.filter((o) => o.id !== bestPick?.id),
    [sorted, bestPick],
  )

  const lowestOffer = useMemo(
    () => [...offers].sort((a, b) => a.priceVnd - b.priceVnd)[0],
    [offers],
  )

  const shortestOffer = useMemo(
    () =>
      [...offers].sort(
        (a, b) => a.durationMinutes - b.durationMinutes || a.priceVnd - b.priceVnd,
      )[0],
    [offers],
  )

  const resetFilters = () => {
    setFilters(defaultFilters())
    setQuickTab(null)
    setSortKey('newest')
  }

  const toggleAirline = (id: FlightAirlineId) => {
    setFilters((prev) => {
      const next = new Set(prev.airlines)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, airlines: next }
    })
  }

  const toggleTimeSlot = (id: FlightTimeSlotId) => {
    setFilters((prev) => {
      const next = new Set(prev.timeSlots)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, timeSlots: next }
    })
  }

  const toggleStop = (id: FlightStopType) => {
    setFilters((prev) => {
      const next = new Set(prev.stops)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, stops: next }
    })
  }

  const setBudget = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, budgetMin: min, budgetMax: max }))
  }

  return {
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
  }
}
