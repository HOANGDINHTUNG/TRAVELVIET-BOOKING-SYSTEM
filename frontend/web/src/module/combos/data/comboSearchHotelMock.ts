import type { ComboSearchParams } from '../utils/comboSearchParams';

export type ComboHotelResult = {
  id: string;
  title: string;
  rating: number;
  image: string;
  comboPriceVnd: number;
};

export type ComboHotelSortKey = 'price-asc' | 'price-desc' | 'rating-desc';

const MOCK_HOTELS: ComboHotelResult[] = [
  {
    id: 'h1',
    title: 'Vinpearl Resort & Spa Phú Quốc',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    comboPriceVnd: 5490000,
  },
  {
    id: 'h2',
    title: 'InterContinental Danang Sun Peninsula Resort',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    comboPriceVnd: 12500000,
  },
  {
    id: 'h3',
    title: 'Pullman Vung Tau Hotel',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    comboPriceVnd: 3200000,
  },
  {
    id: 'h4',
    title: 'Hanoi La Siesta Hotel & Spa',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    comboPriceVnd: 2800000,
  },
  {
    id: 'h5',
    title: 'Sheraton Saigon Hotel & Towers',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    comboPriceVnd: 4100000,
  }
];

export function getMockComboHotelResults(params: ComboSearchParams): ComboHotelResult[] {
  // Modifying prices dynamically based on nights/destination
  const destination = params.destination?.toLowerCase() || '';
  if (destination.includes('phú quốc') || destination.includes('phu quoc')) {
    return MOCK_HOTELS.filter(h => h.id === 'h1' || h.id === 'h3');
  }
  if (destination.includes('đà nẵng') || destination.includes('da nang')) {
    return MOCK_HOTELS.filter(h => h.id === 'h2' || h.id === 'h4');
  }
  return MOCK_HOTELS;
}

export function sortComboHotels(hotels: ComboHotelResult[], sortKey: ComboHotelSortKey): ComboHotelResult[] {
  const list = [...hotels];
  if (sortKey === 'price-asc') {
    return list.sort((a, b) => a.comboPriceVnd - b.comboPriceVnd);
  }
  if (sortKey === 'price-desc') {
    return list.sort((a, b) => b.comboPriceVnd - a.comboPriceVnd);
  }
  if (sortKey === 'rating-desc') {
    return list.sort((a, b) => b.rating - a.rating);
  }
  return list;
}
