import type {
  HomeLowerExploreItem,
  HomeLowerGalleryItem,
  HomeLowerGuide,
  HomeLowerNews,
  HomeLowerTestimonial,
} from "./homeLower.types";

export const homeLowerEn = {
  sections: {
    testimonialsTitle: "What clients say about THD International Travel",
    galleryTitle: "Photo gallery",
    corporateTitle: "Featured corporate clients",
    exploreTitle: "Discover Vietnam",
    intlTitle: "Explore abroad",
    handbookTitle: "Travel handbook",
    thdNewsTitle: "THD International Travel news",
  },
  aria: {
    testimonialsPrev: "Previous",
    testimonialsNext: "Next",
    corporatePage: "Page {{page}}",
    intlMosaic: "International destinations",
  },
  links: {
    seeMore: "See more",
  },
  testimonials: [
    {
      id: 1,
      stars: 5,
      text: "The team handled everything thoughtfully—from guides and transport to hotels, meals, lively team building, and a memorable gala dinner. We could rest and strengthen our team spirit at the same time. Thank you for the care...",
      name: "Mr. Hung",
      location: "Thuy Nguyen – Hai Phong",
      avatar:
        "https://ui-avatars.com/api/?name=Hung&background=e87722&color=fff&size=56&bold=true",
    },
    {
      id: 2,
      stars: 5,
      text: 'The Electrolux Vietnam HCM branch highly appreciated THD Travel’s professionalism. Rooming for 500+ guests at the recent customer "PRIVATE EVENT" was coordinated smoothly...',
      name: "Ms. Truong Uyen Thanh",
      location: "An Khanh – Ho Chi Minh City",
      avatar:
        "https://ui-avatars.com/api/?name=Thanh&background=0b2340&color=fff&size=56&bold=true",
    },
    {
      id: 3,
      stars: 5,
      text: "THD Travel designed a great leisure itinerary for ON Vietnam. Flights, transfers, hotels, dining, and experiences were all arranged logically, leading to excellent satisfaction...",
      name: "Ms. Nguyen Mai",
      location: "Nguyen Dinh Chieu – Ho Chi Minh City",
      avatar:
        "https://ui-avatars.com/api/?name=Mai&background=3a7bd5&color=fff&size=56&bold=true",
    },
    {
      id: 4,
      stars: 5,
      text: "[Happy Money – Nano Linked Trading JSC] – With THD Travel’s dedicated support, our company trip combined with a seminar ran smoothly from start to finish. Not only...",
      name: "Ms. Tho Nguyen",
      location: "Dong Da – Hanoi",
      avatar:
        "https://ui-avatars.com/api/?name=Tho&background=2ecc71&color=fff&size=56&bold=true",
    },
    {
      id: 5,
      stars: 5,
      text: "This trip was truly meaningful for all staff. LITEON. A chance to recharge and strengthen our team spirit together.",
      name: "Mr. Tuan",
      location: "Thu Duc – Ho Chi Minh City",
      avatar:
        "https://ui-avatars.com/api/?name=Tuan&background=e74c3c&color=fff&size=56&bold=true",
    },
  ] satisfies HomeLowerTestimonial[],
  gallery: [
    {
      label: "Thailand group tour 2025",
      img: "https://saigontours.asia/images/news/2025/05/08/large/z6537479269984_f8721781db6f12bb6c534d2f8b342b7e_1746671158.jpg",
    },
    {
      label: "Japan group tour 2024",
      img: "https://vigotour.com.vn/wp-content/uploads/2024/01/doan-du-lich-nhat-ban-11-01-2024-1.jpg",
      tall: true,
    },
    {
      label: "Zhangjiajie group tour 2024",
      img: "https://vigotour.com.vn/wp-content/uploads/2024/12/doan-du-lich-trung-quoc-14-11-2024-1.jpg",
    },
    {
      label: "Singapore group tour 2024",
      img: "https://saigontours.asia/images/news/2023/10/05/large/anh-doan_1696477722.jpg",
    },
    {
      label: "South Korea group tour 2025",
      img: "https://saigontours.asia/images/news/2025/05/08/large/han-quoc-saigontours-2025_1746671638.jpg",
    },
  ] satisfies HomeLowerGalleryItem[],
  exploreFallback: [
    {
      label: "Cat Ba Island",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
      size: "large",
    },
    {
      label: "Ha Long",
      img: "https://cdn3.ivivu.com/2019/07/vinh-ha-long-cat-ba-tuyet-tac-thien-nhien-nhin-tu-bau-troi-ivivu-1.jpg",
      size: "medium",
    },
    {
      label: "Ha Giang",
      img: "https://bizweb.dktcdn.net/100/512/250/files/deo-ma-pi-leng-18981c60-cc9a-4377-b853-2814e60a4be4.jpg?v=1721309840626",
      size: "large",
    },
    {
      label: "Nghe An",
      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80",
      size: "small",
    },
    {
      label: "Muong Den",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      size: "small",
    },
    {
      label: "Ha Giang",
      img: "https://hagiangamazingtour.vn/upload/images/du-lich-ha-giang/song-nho-que-mua-nao-dep-7-.jpg",
      size: "small",
    },
    {
      label: "Mekong Delta – flood season",
      img: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/8/25/946185/Can-Tho-10.jpg",
      size: "small",
    },
  ] satisfies HomeLowerExploreItem[],
  intl: {
    rowLabels: [
      "Thailand",
      "Singapore",
      "China",
      "Japan",
      "South Korea",
    ],
    europe: "Europe",
  },
  mockGuides: [
    {
      id: 1,
      title: "5 team-building activities that strengthen teams effectively",
      date: "05/12/2026",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Mixing team building into a summer tour: yes or no?",
      date: "05/11/2026",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title:
        "How to pick a reliable travel company for large groups (key checklist...)",
      date: "05/05/2026",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title:
        "What makes a great trip? (Full checklist for individuals & groups...)",
      date: "05/04/2026",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    },
  ] satisfies HomeLowerGuide[],
  mockNews: [
    {
      id: 1,
      title:
        "KAZZA VINA – Team bonding in Cat Ba | 2D1N company trip with THD International Travel",
      date: "05/13/2026",
      thumb:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "ON Team Trip – Da Lat discovery and energy reset",
      date: "03/31/2026",
      thumb:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "VILAI Team Trip – Northwest nature experience",
      date: "03/31/2026",
      thumb:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "HN Media journey: experience and relaxation",
      date: "03/31/2026",
      thumb:
        "https://images.unsplash.com/photo-1527004013197-93668731837e?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      title:
        "LITEON company trip: Do Son – Bai Chay – Tuan Chau | Nov 8, 2025",
      date: "03/31/2026",
      thumb:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
  ] satisfies HomeLowerNews[],
};
