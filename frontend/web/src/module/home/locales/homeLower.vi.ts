import type {
  HomeLowerExploreItem,
  HomeLowerGalleryItem,
  HomeLowerGuide,
  HomeLowerNews,
  HomeLowerTestimonial,
} from "./homeLower.types";

export const homeLowerVi = {
  sections: {
    testimonialsTitle: "Khách hàng nói gì về Lữ Hành Quốc Tế THD",
    galleryTitle: "Thư viện hình ảnh",
    corporateTitle: "Khách hàng doanh nghiệp tiêu biểu",
    exploreTitle: "Khám phá Việt Nam",
    intlTitle: "Vi vu nước ngoài",
    handbookTitle: "Cẩm nang du lịch",
    thdNewsTitle: "Bản tin về Lữ hành quốc tế THD",
  },
  aria: {
    testimonialsPrev: "Trước",
    testimonialsNext: "Tiếp",
    corporatePage: "Trang {{page}}",
    intlMosaic: "Điểm đến quốc tế",
  },
  links: {
    seeMore: "Xem thêm",
  },
  testimonials: [
    {
      id: 1,
      stars: 5,
      text: "Travel đã sắp xếp chu đáo từ tour viên, di chuyển, lưu trú, ăn uống đến các hoạt động Team Building sôi động và Gala Dinner ấn tượng. Đây là cơ hội để chúng tôi vừa nghỉ ngơi, vừa gắn kết tinh thần tập thể. Cảm ơn các bạn đã tư...",
      name: "Anh Hưng",
      location: "Thủy Nguyên – Hải Phòng",
      avatar:
        "https://ui-avatars.com/api/?name=Hung&background=e87722&color=fff&size=56&bold=true",
    },
    {
      id: 2,
      stars: 5,
      text: '"HCM branch of electrolux Vietnam" đánh giá cao sự chuyên nghiệp của THD Travel. Toàn bộ khâu đặt phòng cho hơn 500 khách mời trong hội nghị khách hàng "PRIVATE EVENT" vừa qua...',
      name: "Chị Trương Uyên Thanh",
      location: "An Khánh – Hồ Chí Minh",
      avatar:
        "https://ui-avatars.com/api/?name=Thanh&background=0b2340&color=fff&size=56&bold=true",
    },
    {
      id: 3,
      stars: 5,
      text: "nghiệp của THD Travel trong việc thiết kế hành trình nghỉ dưỡng của ON Việt Nam. Toàn bộ dịch vụ từ đặt vé, xe đưa đón, khách sạn, ẩm thực đến các hoạt động trải nghiệm đều được sắp xếp hợp lý, sao sự hài lòng tuyệt đối...",
      name: "Chị Nguyễn Mai",
      location: "Nguyễn Đình Chiểu – Hồ Chí Minh",
      avatar:
        "https://ui-avatars.com/api/?name=Mai&background=3a7bd5&color=fff&size=56&bold=true",
    },
    {
      id: 4,
      stars: 5,
      text: "[Happy Money – Công ty cổ phần TM liên kết Nano] – Nhờ sự hỗ trợ tận tâm của THD Travel, chuyến du lịch kết hợp hội thảo của doanh nghiệp chúng tôi diễn ra thuận lợi và trọn vẹn. Không chỉ...",
      name: "Chị Thơ Nguyễn",
      location: "Đống Đa – Hà Nội",
      avatar:
        "https://ui-avatars.com/api/?name=Tho&background=2ecc71&color=fff&size=56&bold=true",
    },
    {
      id: 5,
      stars: 5,
      text: "Chuyến đi lần này thực sự ý nghĩa với toàn thể nhân viên. LITEON. Đây là cơ hội để chúng tôi vừa nghỉ ngơi, vừa gắn kết tinh thần tập thể.",
      name: "Anh Tuấn",
      location: "Thủ Đức – Hồ Chí Minh",
      avatar:
        "https://ui-avatars.com/api/?name=Tuan&background=e74c3c&color=fff&size=56&bold=true",
    },
  ] satisfies HomeLowerTestimonial[],
  gallery: [
    {
      label: "Đoàn Thái Lan 2025",
      img: "https://saigontours.asia/images/news/2025/05/08/large/z6537479269984_f8721781db6f12bb6c534d2f8b342b7e_1746671158.jpg",
    },
    {
      label: "Đoàn Nhật Bản 2024",
      img: "https://vigotour.com.vn/wp-content/uploads/2024/01/doan-du-lich-nhat-ban-11-01-2024-1.jpg",
      tall: true,
    },
    {
      label: "Đoàn Trương Gia Giới 2024",
      img: "https://vigotour.com.vn/wp-content/uploads/2024/12/doan-du-lich-trung-quoc-14-11-2024-1.jpg",
    },
    {
      label: "Đoàn Singapore 2024",
      img: "https://saigontours.asia/images/news/2023/10/05/large/anh-doan_1696477722.jpg",
    },
    {
      label: "Đoàn Hàn Quốc 2025",
      img: "https://saigontours.asia/images/news/2025/05/08/large/han-quoc-saigontours-2025_1746671638.jpg",
    },
  ] satisfies HomeLowerGalleryItem[],
  exploreFallback: [
    {
      label: "Đảo Ngọc Cát Bà",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
      size: "large",
    },
    {
      label: "Hạ Long",
      img: "https://cdn3.ivivu.com/2019/07/vinh-ha-long-cat-ba-tuyet-tac-thien-nhien-nhin-tu-bau-troi-ivivu-1.jpg",
      size: "medium",
    },
    {
      label: "Hà Giang",
      img: "https://bizweb.dktcdn.net/100/512/250/files/deo-ma-pi-leng-18981c60-cc9a-4377-b853-2814e60a4be4.jpg?v=1721309840626",
      size: "large",
    },
    {
      label: "Nghệ An",
      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80",
      size: "small",
    },
    {
      label: "Mường Đen",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      size: "small",
    },
    {
      label: "Hà Giang",
      img: "https://hagiangamazingtour.vn/upload/images/du-lich-ha-giang/song-nho-que-mua-nao-dep-7-.jpg",
      size: "small",
    },
    {
      label: "Miền Tây – Mùa Nước Nổi",
      img: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/8/25/946185/Can-Tho-10.jpg",
      size: "small",
    },
  ] satisfies HomeLowerExploreItem[],
  intl: {
    rowLabels: [
      "Thái Lan",
      "Singapore",
      "Trung Quốc",
      "Nhật Bản",
      "Hàn Quốc",
    ],
    europe: "Châu Âu",
  },
  mockGuides: [
    {
      id: 1,
      title:
        "5 Hoạt Động Teambuilding Giúp Gắn Kết Đội Ngũ Hiệu Quả",
      date: "12/05/2026",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Kết Hợp Teambuilding Trong Tour Hè: Nên Hay Không?",
      date: "11/05/2026",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title:
        "Cách Chọn Công Ty Du Lịch Uy Tín Cho Tour Đoàn Lớn (Checklist Quan Trọng...)",
      date: "05/05/2026",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title:
        "Một Chuyến Đi Tốt Cần Những Trải Nghiệm Gì? (Checklist Đầy Đủ Cho Cá Nhân &...)",
      date: "04/05/2026",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    },
  ] satisfies HomeLowerGuide[],
  mockNews: [
    {
      id: 1,
      title:
        "KAZZA VINA – Gắn kết tập thể tại Cát Bà | Company Trip 2N1Đ cùng Lữ Hành Quốc Tế THD",
      date: "13/05/2026",
      thumb:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "ON Team Trip – Khám Phá Đà Lạt, Tái Tạo Năng Lượng",
      date: "31/03/2026",
      thumb:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "VILAI Team Trip – Trải Nghiệm Thiên Nhiên Tây Bắc",
      date: "31/03/2026",
      thumb:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Hành Trình Của HN Media: Trải Nghiệm & Thư Giãn",
      date: "31/03/2026",
      thumb:
        "https://images.unsplash.com/photo-1527004013197-93668731837e?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      title:
        "Hành Trình Company Trip LITEON: Đồ Sơn – Bãi Cháy – Tuần Châu | 08/11/2025",
      date: "31/03/2026",
      thumb:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    },
  ] satisfies HomeLowerNews[],
};
