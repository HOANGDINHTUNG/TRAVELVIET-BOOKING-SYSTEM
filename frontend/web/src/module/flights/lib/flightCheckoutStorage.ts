import type { FlightCheckoutSession } from '../types/flightCheckout'

const STORAGE_KEY = 'flight:checkout:session'

export function saveFlightCheckoutSession(session: FlightCheckoutSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function loadFlightCheckoutSession(): FlightCheckoutSession | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as FlightCheckoutSession
    if (!parsed || parsed.v !== 1) return null
    return parsed
  } catch {
    return null
  }
}

export function clearFlightCheckoutSession(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

