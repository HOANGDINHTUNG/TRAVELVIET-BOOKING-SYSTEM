export const homePageVi = {
  bannerCta: "Xem tour chi tiết",
  defaultBannerTeaser: "Khám phá hành trình đáng nhớ cùng TravelViet.",
  bannerSubtitleFallback: "Tour nổi bật",

  search: {
    departurePlaceholder: "Nơi khởi hành...",
    tourTypePlaceholder: "Loại tour...",
    destinationPlaceholder: "Điểm đến...",
    datePlaceholder: "Ngày khởi hành...",
    dateInputTitle: "Ngày khởi hành",
    searchButton: "Tìm kiếm",
    departures: [
      { value: "Từ Hà Nội", label: "Từ Hà Nội" },
      { value: "Từ Hồ Chí Minh", label: "Từ Hồ Chí Minh" },
      { value: "Từ Đà Nẵng", label: "Từ Đà Nẵng" },
      { value: "Từ Cần Thơ", label: "Từ Cần Thơ" },
    ],
    tourTypes: [
      { value: "Tour trong nước", label: "Tour trong nước" },
      { value: "Tour nước ngoài", label: "Tour nước ngoài" },
      { value: "Tour theo yêu cầu", label: "Tour theo yêu cầu" },
    ],
    destinations: [
      { value: "Hà Nội", label: "Hà Nội" },
      { value: "Đà Nẵng", label: "Đà Nẵng" },
      { value: "Hội An", label: "Hội An" },
      { value: "Huế", label: "Huế" },
      { value: "Nha Trang", label: "Nha Trang" },
      { value: "Phú Quốc", label: "Phú Quốc" },
      { value: "Đà Lạt", label: "Đà Lạt" },
      { value: "Hạ Long", label: "Hạ Long" },
      { value: "Sapa", label: "Sapa" },
      { value: "Hà Giang", label: "Hà Giang" },
      { value: "Nhật Bản", label: "Nhật Bản" },
      { value: "Hàn Quốc", label: "Hàn Quốc" },
      { value: "Thái Lan", label: "Thái Lan" },
      { value: "Singapore", label: "Singapore" },
    ],
  },

  services: {
    hotel: "Khách sạn",
    carRental: "Cho thuê xe",
    flights: "Vé máy bay",
    visa: "Dịch vụ visa",
  },

  promotions: {
    sectionTitle: "Chương trình khuyến mãi mới nhất",
    defaultSubtitle: "Ưu đãi tour mới nhất",
    defaultBadge: "Khuyến mãi",
    defaultCta: "Xem ưu đãi",
    fallback: [
      {
        id: -1,
        title: "Du lịch – Teambuilding – Gala",
        subtitle: "Chương trình hè trọn gói cho doanh nghiệp từ 30 khách.",
        badge: "Ưu đãi doanh nghiệp",
        imageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Đoàn khách tham gia hoạt động team building ngoài trời",
        ctaLabel: "Xem ưu đãi",
        ctaUrl: "/tours",
      },
      {
        id: -2,
        title: "Cả công ty cùng đi",
        subtitle: "Gói tour trọn gói cho đoàn 50 đến 1000 khách.",
        badge: "Tour đoàn lớn",
        imageUrl:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Nhóm nhân viên công ty cùng tham gia chuyến đi",
        ctaLabel: "Nhận tư vấn",
        ctaUrl: "/tours",
      },
      {
        id: -3,
        title: "Hành trình gắn kết",
        subtitle: "Giảm giá cho nhóm gia đình từ 6 khách trở lên.",
        badge: "Gia đình",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Gia đình nghỉ dưỡng trên bãi biển",
        ctaLabel: "Đặt tour ngay",
        ctaUrl: "/tours",
      },
    ],
  },

  tourHot: {
    title: "TOUR HOT",
    subtitle:
      "Di chuột lên tour để nền đổi theo một ảnh khác trong album (không trùng ảnh trên thẻ). Ban đầu hiển thị ảnh nền của tour đầu tiên.",
    featured: "Nổi bật",
    newest: "Mới nhất",
    filterAria: "Lọc tour hot",
    viewDetails: "Xem chi tiết",
    slots: {
      northWest: "Đông Tây Bắc",
      spiritual: "Tâm Linh",
      haGiang: "Hà Giang",
      islands: "Biển Đảo",
      korea: "Hàn Quốc",
    },
  },
};
