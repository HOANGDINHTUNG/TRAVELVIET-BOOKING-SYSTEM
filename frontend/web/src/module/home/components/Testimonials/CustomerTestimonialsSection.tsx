import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  testimonialApi,
  type CustomerTestimonial,
} from "../../../../api/server/Testimonial.api";
import "./CustomerTestimonialsSection.css";

const fallbackTestimonials: CustomerTestimonial[] = [
  {
    id: -1,
    customerName: "Chi Nguyen Mai",
    customerTitle: "Nguyen Dinh Chieu - Ho Chi Minh",
    content:
      "CONG TY TNHH ON VIET NAM dac biet an tuong voi su chuyen nghiep cua TravelViet trong viec thiet ke hanh trinh nghi duong cho ON Viet Nam. Toan bo dich vu tu dat ve, xe dua don, khach san, am thuc den cac hoat dong deu rat chu dao.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    isVerified: true,
  },
  {
    id: -2,
    customerName: "Chi Tho Nguyen",
    customerTitle: "Dong Da - Ha Noi",
    content:
      "[Happy Money - Cong ty co phan TM lien ket Nano] Nho su ho tro tan tam cua TravelViet, chuyen du lich ket hop hoi thao cua doanh nghiep chung toi dien ra thuan loi va tron ven.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80",
    isVerified: true,
  },
  {
    id: -3,
    customerName: "Anh Hung",
    customerTitle: "Thuy Nguyen - Hai Phong",
    content:
      "[Cong ty TNHH LITEON] Chuyen di lan nay thuc su y nghia voi toan the nhan vien. TravelViet da sap xep chu dao tu tu van, di chuyen, luu tru, an uong den Team Building va Gala Dinner.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    isVerified: true,
  },
  {
    id: -4,
    customerName: "Chi Truong Uyen Thanh",
    customerTitle: "An Khanh - Ho Chi Minh",
    content:
      "HCM branch of Electrolux Vietnam danh gia cao su chuyen nghiep cua TravelViet. Toan bo khau dat phong cho hon 500 khach moi trong hoi nghi khach hang duoc xu ly nhanh chong.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    isVerified: true,
  },
];

function clampRating(value: number | undefined) {
  if (!value || !Number.isFinite(value)) {
    return 5;
  }

  return Math.min(Math.max(Math.round(value), 1), 5);
}

export function CustomerTestimonialsSection() {
  const { t } = useTranslation();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);

  useEffect(() => {
    let isMounted = true;

    testimonialApi
      .getPublicTestimonials()
      .then((items) => {
        if (isMounted) {
          setTestimonials(items ?? []);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTestimonials([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const normalized = testimonials
      .filter((item) => item.content && item.customerName)
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));

    return normalized.length > 0 ? normalized : fallbackTestimonials;
  }, [testimonials]);

  const scrollCards = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section className="customer-testimonials-section">
      <div className="section-shell customer-testimonials-shell">
        <h2>{t("testimonials.title")}</h2>

        <div className="customer-testimonials-stage">
          <button
            aria-label="Xem đánh giá trước"
            className="testimonial-nav testimonial-nav-left"
            type="button"
            onClick={() => scrollCards("left")}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="customer-testimonials-rail" ref={railRef}>
            {cards.map((item) => (
              <article className="customer-testimonial-card" key={item.id}>
                <div
                  className="testimonial-stars"
                  aria-label={t("testimonials.starsAria", {
                    count: clampRating(item.rating),
                  })}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      aria-hidden="true"
                      fill="currentColor"
                      key={index}
                      strokeWidth={1.8}
                    />
                  ))}
                  {item.isVerified !== false && (
                    <CheckCircle2
                      className="testimonial-verified"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <p>{item.content}</p>

                <footer>
                  <img
                    src={item.avatarUrl || fallbackTestimonials[0].avatarUrl}
                    alt={item.customerName || "Khach hang"}
                    loading="lazy"
                  />
                  <div>
                    <strong>{item.customerName}</strong>
                    <span>{item.customerTitle}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>

          <button
            aria-label={t("testimonials.nextAria")}
            className="testimonial-nav testimonial-nav-right"
            type="button"
            onClick={() => scrollCards("right")}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
