import type { ComboSearchParams } from '../utils/comboSearchParams';

export type ComboFlightLeg = {
  id: string;
  airlineId: string;
  departTime: string;
  fromIata: string;
  toIata: string;
  stopLabel: string;
  durationLabel: string;
  arriveTime: string;
  carryOnKg: number;
  cabinClass: string;
};

export function getMockComboFlightLegs(params: ComboSearchParams): ComboFlightLeg[] {
  const legs: ComboFlightLeg[] = [];
  
  // Outbound
  legs.push({
    id: 'f-outbound',
    airlineId: 'vietnam',
    departTime: '08:00',
    fromIata: params.from || 'SGN',
    toIata: params.to || 'HAN',
    stopLabel: 'Bay thẳng',
    durationLabel: '2h 10m',
    arriveTime: '10:10',
    carryOnKg: 10,
    cabinClass: 'Phổ thông',
  });
  
  // Return flight
  legs.push({
    id: 'f-return',
    airlineId: 'vietnam',
    departTime: '18:00',
    fromIata: params.to || 'HAN',
    toIata: params.from || 'SGN',
    stopLabel: 'Bay thẳng',
    durationLabel: '2h 10m',
    arriveTime: '20:10',
    carryOnKg: 10,
    cabinClass: 'Phổ thông',
  });
  
  return legs;
}
