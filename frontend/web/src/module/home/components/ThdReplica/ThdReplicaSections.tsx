import { Link } from "react-router-dom";
import type { Destination, Tour } from "../../database/interface/publicTravel";
import { buildTourSlug } from "../../../tours/utils/slug";
import "./ThdReplicaSections.css";

type ThdReplicaSectionsProps = {
  domesticTours: Tour[];
  internationalTours: Tour[];
  destinations: Destination[];
};

type StoryItem = {
  title: string;
  date: string;
};

const serviceItems = ["Khách sạn", "Cho thuê xe", "Vé máy bay", "Dịch vụ visa"];

const hotCategories = [
  "Đông Tây Bắc",
  "Tâm Linh",
  "Hà Giang",
  "Biển Đảo",
  "Hàn Quốc",
];

const testimonials = [
  {
    quote:
      "Đánh giá cao sự chuyên nghiệp của đội ngũ. Quy trình đặt dịch vụ và check-in được xử lý nhanh, chính xác cho đoàn lớn.",
    author: "Electrolux Vietnam",
  },
  {
    quote:
      "Lịch trình nghỉ dưỡng được thiết kế hợp lý, dịch vụ đồng bộ từ di chuyển, khách sạn đến hoạt động trải nghiệm.",
    author: "ON Việt Nam",
  },
  {
    quote:
      "Chuyến đi kết hợp hội thảo diễn ra trọn vẹn, đội ngũ hỗ trợ tận tâm và linh hoạt theo nhu cầu doanh nghiệp.",
    author: "Happy Money",
  },
  {
    quote:
      "Team Building và Gala Dinner được tổ chức ấn tượng, giúp đội ngũ gắn kết và tái tạo năng lượng sau dự án.",
    author: "LITEON",
  },
];

const handbookStories: StoryItem[] = [
  { title: "5 Hoạt Động Teambuilding Giúp Gắn Kết Đội Ngũ Hiệu Quả", date: "12/05/2026" },
  { title: "Kết Hợp Teambuilding Trong Tour Hè: Nên Hay Không?", date: "11/05/2026" },
  {
    title: "Cách Chọn Công Ty Du Lịch Uy Tín Cho Tour Đoàn Lớn (Checklist Quan Trọng 2026)",
    date: "05/05/2026",
  },
  {
    title: "Một Chuyến Đi Tốt Cần Những Trải Nghiệm Gì? (Checklist 2026)",
    date: "04/05/2026",
  },
];

const companyStories: StoryItem[] = [
  { title: "ON Team Trip – Khám Phá Đà Lạt, Tái Tạo Năng Lượng", date: "31/03/2026" },
  { title: "VILAI Team Trip – Trải Nghiệm Thiên Nhiên Tây Bắc", date: "31/03/2026" },
  { title: "Hành Trình Của HN Media: Trải Nghiệm & Thư Giãn", date: "31/03/2026" },
  { title: "Company Trip LITEON: Đồ Sơn – Bãi Cháy – Tuần Châu", date: "31/03/2026" },
  { title: "Team TAL – Hành Trình Gắn Kết tại Flamingo Đại Lải", date: "31/03/2026" },
];

function formatPrice(price: number) {
  if (!price || price <= 0) {
    return "Giá: Liên hệ";
  }

  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

function TourCard({ tour }: { tour: Tour }) {
  const slug = buildTourSlug(tour.title.toLowerCase(), tour.id);

  return (
    <article className="thd-card">
      <img className="thd-card-image" src={tour.image} alt={tour.title} loading="lazy" />
      <div className="thd-card-body">
        <h3>{tour.title}</h3>
        <p className="thd-card-rating">★ {tour.rating ?? 4.9}</p>
        <p className="thd-card-days">{tour.days}</p>
        <p className="thd-card-from">Khởi hành: {tour.location || "Liên hệ tư vấn"}</p>
        <p className="thd-card-price">{formatPrice(tour.price)}</p>
        <Link to={`/tour/${slug}`} className="thd-card-link">
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}

function StoryList({ items }: { items: StoryItem[] }) {
  return (
    <div className="thd-story-list">
      {items.map((item) => (
        <article key={item.title} className="thd-story-item">
          <h4>{item.title}</h4>
          <p>{item.date}</p>
        </article>
      ))}
    </div>
  );
}

export function ThdReplicaSections({
  domesticTours,
  internationalTours,
  destinations,
}: ThdReplicaSectionsProps) {
  const gallery = destinations.filter((item) => Boolean(item.image)).slice(0, 5);
  const domestic = domesticTours.slice(0, 6);
  const international = internationalTours.slice(0, 6);

  return (
    <div className="thd-home">
      <section className="thd-services">
        {serviceItems.map((item) => (
          <button key={item} type="button" className="thd-service-chip">
            {item}
          </button>
        ))}
      </section>

      <section className="thd-section">
        <h2>Chương trình khuyến mãi mới nhất</h2>
        <div className="thd-promo-grid">
          <article>
            <strong>Ưu đãi 30% cho tour hè</strong>
            <p>Áp dụng cho nhóm từ 4 khách khi đặt sớm trước 21 ngày.</p>
          </article>
          <article>
            <strong>Miễn phí nâng hạng dịch vụ</strong>
            <p>Tặng xe đưa đón riêng cho khách đoàn doanh nghiệp.</p>
          </article>
          <article>
            <strong>Cơ hội giảm giá tới 50%</strong>
            <p>Đăng ký nhận bản tin để nhận ưu đãi riêng hàng tuần.</p>
          </article>
        </div>
      </section>

      <section className="thd-section">
        <h2>Tour HOT</h2>
        <div className="thd-chip-row">
          {hotCategories.map((item) => (
            <span key={item} className="thd-chip">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="thd-section">
        <div className="thd-section-head">
          <h2>Tour biển đảo trong nước</h2>
          <Link to="/tours">Xem thêm</Link>
        </div>
        <div className="thd-tour-grid">
          {domestic.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <section className="thd-section">
        <div className="thd-section-head">
          <h2>Tour HOT nước ngoài</h2>
          <Link to="/tours">Xem thêm</Link>
        </div>
        <div className="thd-tour-grid">
          {international.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <section className="thd-section">
        <h2>Khách hàng nói gì về TravelViet</h2>
        <div className="thd-testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.author}>
              <p>{item.quote}</p>
              <strong>{item.author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="thd-section">
        <h2>Thư viện hình ảnh</h2>
        <div className="thd-gallery-grid">
          {gallery.map((item) => (
            <article key={item.name}>
              <img src={item.image} alt={item.name} loading="lazy" />
              <h4>{item.name}</h4>
            </article>
          ))}
        </div>
      </section>

      <section className="thd-section">
        <h2>Khách hàng doanh nghiệp tiêu biểu</h2>
        <div className="thd-brand-row">
          {["LITEON", "ON Việt Nam", "Happy Money", "HN Media", "Electrolux"].map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>

      <section className="thd-section thd-two-col">
        <article>
          <h2>Khám phá Việt Nam</h2>
          <p>Đảo Ngọc Cát Bà</p>
          <p>Miền Tây - mùa nước nổi</p>
        </article>
        <article>
          <h2>Vi vu nước ngoài</h2>
          <p>Singapore – Malaysia</p>
          <p>Hàn Quốc mùa hoa</p>
        </article>
      </section>

      <section className="thd-section thd-two-col">
        <article>
          <h2>Cẩm nang du lịch</h2>
          <StoryList items={handbookStories} />
        </article>
        <article>
          <h2>Bản tin về TravelViet</h2>
          <StoryList items={companyStories} />
        </article>
      </section>
    </div>
  );
}
