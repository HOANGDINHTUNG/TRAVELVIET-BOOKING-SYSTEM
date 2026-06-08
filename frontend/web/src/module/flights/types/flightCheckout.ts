import type { FlightSearchParams } from "../utils/flightSearchParams";
import type { FlightResponse } from "@/api/server/Flight.api";

export type FlightCabinClass =
  | "economy"
  | "premium_economy"
  | "business"
  | "first";

export type FareOption = {
  id: string;
  label: string;
  cabin: FlightCabinClass;
  priceVnd: number;
  perks: string[];
};

export type SelectedFlightLeg = {
  fromIata: string;
  toIata: string;
  departDateIso: string;
  offer: FlightResponse;
  fare: FareOption;
};

export type FlightCheckoutSession = {
  /** version for forward-compatible localStorage/sessionStorage */
  v: 1;
  createdAtMs: number;
  holdExpiresAtMs: number;
  params: FlightSearchParams;
  /** selected legs */
  outbound: SelectedFlightLeg;
  inbound?: SelectedFlightLeg;
  /** computed totals */
  paxTotal: number;
  totalAmountVnd: number;
};
