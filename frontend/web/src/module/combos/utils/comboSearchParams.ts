export type ComboType = "flight-hotel" | "car-hotel";

export type ComboSearchParams = {
  type: ComboType;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  infants: number;
};

export function parseComboSearchParams(
  search: URLSearchParams,
): ComboSearchParams {
  const type =
    search.get("type") === "car-hotel" ? "car-hotel" : "flight-hotel";
  return {
    type,
    from: search.get("from")?.trim() ?? "",
    to: search.get("to")?.trim() ?? "",
    departDate: search.get("departDate") ?? defaultDepartIso(),
    returnDate: search.get("returnDate") ?? defaultReturnIso(),
    destination: search.get("destination")?.trim() ?? "",
    checkIn: search.get("checkIn") ?? defaultDepartIso(),
    checkOut: search.get("checkOut") ?? defaultReturnIso(),
    rooms: Math.max(1, Number(search.get("rooms")) || 1),
    adults: Math.max(1, Number(search.get("adults")) || 2),
    children: Math.max(0, Number(search.get("children")) || 0),
    infants: Math.max(0, Number(search.get("infants")) || 0),
  };
}

export function buildComboSearchQuery(input: ComboSearchParams): string {
  const q = new URLSearchParams({
    type: input.type,
    destination: input.destination,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    departDate: input.departDate,
    returnDate: input.returnDate,
    rooms: String(input.rooms),
    adults: String(input.adults),
    children: String(input.children),
    infants: String(input.infants),
  });
  if (input.from) q.set("from", input.from);
  if (input.to) q.set("to", input.to);
  return q.toString();
}

function defaultDepartIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function defaultReturnIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 8);
  return d.toISOString().slice(0, 10);
}

export function totalComboGuests(p: ComboSearchParams): number {
  return p.adults + p.children + p.infants;
}
