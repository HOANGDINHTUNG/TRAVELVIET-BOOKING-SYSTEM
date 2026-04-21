export type Tour = {
  id: number
  translationKey: string
  title: string
  location: string
  category: string
  days: string
  price: number
  rating: number
  image: string
  highlights: string[]
}

export type HeroSlide = {
  titleTop: string
  titleMain: string
  kicker: string
  copy: string
  image: string
}

export type Destination = {
  translationKey: string
  name: string
  tours: string
  image: string
}

export const heroSlides: HeroSlide[] = [
  {
    titleTop: 'The world awaits',
    titleMain: "Let's Explore",
    kicker: 'TravelViet Signature Tours',
    copy:
      'Turn your travel dreams into unforgettable experiences. We design personal trips that combine adventure, comfort, and local culture.',
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Wake up by the sea',
    titleMain: 'Island Escape',
    kicker: 'Phu Quoc Beach Holiday',
    copy:
      'White sand, clear water, sunset dinners, and resort stays arranged in one smooth booking flow for couples, families, and groups.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Touch the clouds',
    titleMain: 'Mountain Trails',
    kicker: 'Sa Pa Discovery',
    copy:
      'Move through rice terraces, mountain villages, and cool highland air with a flexible route built around your pace.',
    image:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Follow the heritage',
    titleMain: 'Ancient Cities',
    kicker: 'Hoi An, Da Nang, Hue',
    copy:
      'Explore lantern streets, royal architecture, coastal food, and cultural stops with transport, hotel, and tickets handled for you.',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Sail into limestone',
    titleMain: 'Bay Wonders',
    kicker: 'Ha Long Cruise',
    copy:
      'Drift between emerald water, limestone towers, cave stops, and quiet sunset decks on a curated northern Vietnam escape.',
    image:
      'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Breathe in the pines',
    titleMain: 'Highland Retreat',
    kicker: 'Da Lat Slow Travel',
    copy:
      'Cool mornings, pine hills, lakeside cafes, flower valleys, and relaxed stays for travelers who want a softer pace.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Dive into blue',
    titleMain: 'Coastal Energy',
    kicker: 'Nha Trang Island Hop',
    copy:
      'Combine island hopping, snorkeling, seafood lunches, and beachfront evenings with a light, easy-moving itinerary.',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2200&q=85',
  },
  {
    titleTop: 'Flow through rice fields',
    titleMain: 'River Kingdom',
    kicker: 'Ninh Binh Daydream',
    copy:
      'Glide through caves, bike village paths, climb viewpoints, and unwind among limestone valleys and calm water.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=85',
  },
]

export const tours: Tour[] = [
  {
    id: 1,
    translationKey: 'heritage',
    title: 'Di san mien Trung',
    location: 'Da Nang, Hoi An, Hue',
    category: 'Di san',
    days: '4 ngay 3 dem',
    price: 5490000,
    rating: 4.9,
    image: heroSlides[3].image,
    highlights: ['Pho co Hoi An', 'Dai Noi Hue', 'Ba Na Hills'],
  },
  {
    id: 2,
    translationKey: 'island',
    title: 'Nghi duong dao ngoc',
    location: 'Phu Quoc',
    category: 'Bien dao',
    days: '3 ngay 2 dem',
    price: 4390000,
    rating: 4.8,
    image: heroSlides[1].image,
    highlights: ['Bai Sao', 'Sunset Town', 'Lan ngam san ho'],
  },
  {
    id: 3,
    translationKey: 'mountain',
    title: 'San may Tay Bac',
    location: 'Sa Pa, Lao Cai',
    category: 'Kham pha',
    days: '3 ngay 2 dem',
    price: 3690000,
    rating: 4.7,
    image: heroSlides[2].image,
    highlights: ['Fansipan', 'Ban Cat Cat', 'Ruong bac thang'],
  },
  {
    id: 4,
    translationKey: 'city',
    title: 'Ky nghi thanh pho bien',
    location: 'Da Nang',
    category: 'Thanh pho',
    days: '5 ngay 4 dem',
    price: 4890000,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Cau Rong', 'Bien My Khe', 'Son Tra'],
  },
  {
    id: 5,
    translationKey: 'retreat',
    title: 'An nhien mien bien',
    location: 'Nha Trang',
    category: 'Nghi duong',
    days: '7 ngay 6 dem',
    price: 6990000,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Dao Hon Mun', 'VinWonders', 'Bun ca'],
  },
  {
    id: 6,
    translationKey: 'romance',
    title: 'Lang man cao nguyen',
    location: 'Da Lat',
    category: 'Cap doi',
    days: '4 ngay 3 dem',
    price: 4290000,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ho Tuyen Lam', 'Doi thong', 'Cho dem'],
  },
]

export const destinations: Destination[] = [
  {
    translationKey: 'haLong',
    name: 'Ha Long',
    tours: '18 tour',
    image:
      'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'daLat',
    name: 'Da Lat',
    tours: '24 tour',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'nhaTrang',
    name: 'Nha Trang',
    tours: '16 tour',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'ninhBinh',
    name: 'Ninh Binh',
    tours: '12 tour',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'hoiAn',
    name: 'Hoi An',
    tours: '20 tour',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'hue',
    name: 'Hue',
    tours: '14 tour',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'phuQuoc',
    name: 'Phu Quoc',
    tours: '22 tour',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'saPa',
    name: 'Sa Pa',
    tours: '19 tour',
    image:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'daNang',
    name: 'Da Nang',
    tours: '26 tour',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80',
  },
  {
    translationKey: 'mekongDelta',
    name: 'Mekong Delta',
    tours: '11 tour',
    image:
      'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=900&q=80',
  },
]
