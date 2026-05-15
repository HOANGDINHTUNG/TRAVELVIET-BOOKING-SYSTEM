export const homePageEn = {
  bannerCta: "View tour details",
  defaultBannerTeaser: "Discover a memorable journey with TravelViet.",
  bannerSubtitleFallback: "Featured tour",

  search: {
    departurePlaceholder: "Departure point...",
    tourTypePlaceholder: "Tour type...",
    destinationPlaceholder: "Destination...",
    datePlaceholder: "Departure date...",
    dateInputTitle: "Departure date",
    searchButton: "Search",
    departures: [
      { value: "Từ Hà Nội", label: "From Hanoi" },
      { value: "Từ Hồ Chí Minh", label: "From Ho Chi Minh City" },
      { value: "Từ Đà Nẵng", label: "From Da Nang" },
      { value: "Từ Cần Thơ", label: "From Can Tho" },
    ],
    tourTypes: [
      { value: "Tour trong nước", label: "Domestic tours" },
      { value: "Tour nước ngoài", label: "International tours" },
      { value: "Tour theo yêu cầu", label: "Custom / on-demand tours" },
    ],
    destinations: [
      { value: "Hà Nội", label: "Hanoi" },
      { value: "Đà Nẵng", label: "Da Nang" },
      { value: "Hội An", label: "Hoi An" },
      { value: "Huế", label: "Hue" },
      { value: "Nha Trang", label: "Nha Trang" },
      { value: "Phú Quốc", label: "Phu Quoc" },
      { value: "Đà Lạt", label: "Da Lat" },
      { value: "Hạ Long", label: "Ha Long" },
      { value: "Sapa", label: "Sapa" },
      { value: "Hà Giang", label: "Ha Giang" },
      { value: "Nhật Bản", label: "Japan" },
      { value: "Hàn Quốc", label: "South Korea" },
      { value: "Thái Lan", label: "Thailand" },
      { value: "Singapore", label: "Singapore" },
    ],
  },

  services: {
    hotel: "Hotels",
    carRental: "Car rental",
    flights: "Flights",
    visa: "Visa services",
  },

  promotions: {
    sectionTitle: "Latest promotional programs",
    defaultSubtitle: "Latest tour offers",
    defaultBadge: "Promotion",
    defaultCta: "View offer",
    fallback: [
      {
        id: -1,
        title: "Travel — Teambuilding — Gala",
        subtitle: "All-in summer corporate programs from 30 guests.",
        badge: "Corporate offer",
        imageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Corporate group enjoying outdoor team building",
        ctaLabel: "View offer",
        ctaUrl: "/tours",
      },
      {
        id: -2,
        title: "The whole company goes together",
        subtitle: "Full-package tours for groups of 50 to 1000 guests.",
        badge: "Large groups",
        imageUrl:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Company employees on a shared trip",
        ctaLabel: "Get a quote",
        ctaUrl: "/tours",
      },
      {
        id: -3,
        title: "A journey to connect",
        subtitle: "Discounts for families of 6 guests or more.",
        badge: "Family",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Family relaxing on the beach",
        ctaLabel: "Book now",
        ctaUrl: "/tours",
      },
    ],
  },

  tourHot: {
    title: "TOUR HOT",
    subtitle:
      "Hover a tour to change the background to another photo from its album (not the same as the card). Initially shows the first tour’s backdrop.",
    featured: "Featured",
    newest: "Newest",
    filterAria: "Filter hot tours",
    viewDetails: "View details",
    slots: {
      northWest: "Northwest Vietnam",
      spiritual: "Spiritual journeys",
      haGiang: "Ha Giang",
      islands: "Beaches & islands",
      korea: "South Korea",
    },
  },
};
