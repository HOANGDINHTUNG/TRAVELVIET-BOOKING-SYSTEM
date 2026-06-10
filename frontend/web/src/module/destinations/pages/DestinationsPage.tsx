import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { destinationApi } from "../../../api/server/Destination.api";
import { Footer } from "../../../components/Footer/Footer";
import { PageSkeletonBlock } from "../../../components/ui/skeletons/PageSkeletonBlock";
import type { Destination } from "../../home/database/interface/publicTravel";
import { DestinationsPageMainSkeleton } from "../components/DestinationsPageSkeleton";
import "../components/DestinationsPageSkeleton.css";
import "../styles/DestinationsPage.css";

const HERO_DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1440&q=80";

function isDomestic(destination: Destination) {
  const checkStr = [destination.name, destination.region, destination.province]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const internationalKeywords = [
    "singapore",
    "thái lan",
    "bangkok",
    "seoul",
    "tokyo",
    "mỹ",
    "châu",
    "maldives",
    "thượng hải",
    "nước ngoài",
    "quốc tế",
    "hàn quốc",
    "nhật bản",
  ];
  return !internationalKeywords.some((kw) => checkStr.includes(kw));
}

const MOCK_VN_PROVINCES = [
  {
    name: "Phú Quốc",
    image:
      "https://images.unsplash.com/photo-1544648782-9a039750d7e6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vũng Tàu",
    image:
      "https://images.unsplash.com/photo-1574681602447-fd4ee3b10b05?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a540ac6e8a8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Quy Nhơn",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Phan Thiết",
    image:
      "https://images.unsplash.com/photo-1519046909882-ff08b4f4c1be?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Phú Yên",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  },
  { name: "Hải Phòng" },
  { name: "Hạ Long" },
  { name: "Sapa" },
  { name: "Ninh Bình" },
  { name: "Hà Nội" },
  { name: "Mộc Châu" },
  { name: "Hà Giang" },
  { name: "Cao Bằng" },
  { name: "Huế" },
  { name: "Quảng Bình" },
  { name: "Hội An" },
  { name: "Buôn Ma Thuột" },
  { name: "Pleiku" },
  { name: "Măng Đen" },
  { name: "Tây Ninh" },
  { name: "Đồng Nai" },
  { name: "Bình Dương" },
  { name: "Cần Thơ" },
  { name: "An Giang" },
  { name: "Cà Mau" },
  { name: "Kiên Giang" },
  { name: "Đồng Tháp" },
  { name: "Bến Tre" },
  { name: "Tiền Giang" },
  { name: "Vĩnh Long" },
  { name: "Trà Vinh" },
].map(
  (item, idx) =>
    ({
      uuid: `mock-vn-${idx}`,
      name: item.name,
      region: "Việt Nam",
      image:
        item.image || `https://picsum.photos/seed/vnprovince${idx}/800/600`,
    }) as Destination,
);

export default function DestinationsPage() {
  const { t, i18n } = useTranslation();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const roots = await destinationApi.getRootDestinations();
        if (!isActive) return;
        setDestinations(roots);
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Không thể tải danh sách điểm đến.",
          );
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void load();
    return () => {
      isActive = false;
    };
  }, []);

  const resolveDestinationName = useCallback(
    (item: Destination) => {
      const key = item.translationKey
        ? `data.destinations.${item.translationKey}`
        : "";
      return key && i18n.exists(key) ? t(key) : item.name;
    },
    [i18n, t],
  );

  const { domestic, international } = useMemo(() => {
    const dm: Destination[] = [...MOCK_VN_PROVINCES];
    const int: Destination[] = [];
    for (const d of destinations) {
      if (isDomestic(d)) dm.push(d);
      else int.push(d);
    }
    return { domestic: dm, international: int };
  }, [destinations]);

  useEffect(() => {
    if (!error || destinations.length > 0) return;
    toast.error(error);
  }, [destinations.length, error]);

  const renderGrid = (
    items: Destination[],
    title: string,
    subtitle: string,
  ) => {
    if (items.length === 0) return null;

    return (
      <section className="dest-masonry-section">
        <div className="dest-masonry-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="dest-grid-masonry">
          {items.map((destination, index) => {
            const destinationName = resolveDestinationName(destination);

            return (
              <Link
                key={destination.uuid ?? destination.name}
                to={`/hotels?destinationId=${destination.id || destination.uuid}`}
                className="dest-masonry-card"
                style={{ "--card-idx": Math.min(index, 11) } as CSSProperties}
              >
                {destination.image && (
                  <img
                    src={destination.image}
                    alt={destinationName}
                    className="dest-masonry-card__img"
                    loading="lazy"
                  />
                )}
                <div className="dest-masonry-card__overlay" />
                <div className="dest-masonry-card__content">
                  <h3 className="dest-masonry-card__name">{destinationName}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <>
      <main className="dest-page">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className={`dest-page-hero${loading ? " dest-page-hero--skeleton" : ""}`}
        >
          <img
            src={HERO_DEFAULT_IMAGE}
            alt=""
            aria-hidden="true"
            className="dest-page-hero__img"
            loading="eager"
          />
          <div className="dest-page-hero__overlay" aria-hidden="true" />
          <div className="dest-page-hero__content">
            {loading ? (
              <PageSkeletonBlock
                as="div"
                style={{ width: 280, height: 32, margin: "0 auto" }}
              />
            ) : (
              <h1 className="dest-page-hero__title">
                Khám phá các điểm đến hấp dẫn
              </h1>
            )}
          </div>
        </section>

        {/* ── Main content ──────────────────────────────────── */}
        <div className="dest-page-main">
          <div className="dest-page-inner">
            {loading || (error && destinations.length === 0) ? (
              <DestinationsPageMainSkeleton />
            ) : destinations.length === 0 ? (
              <div className="dest-empty">
                <Compass size={38} strokeWidth={1.4} aria-hidden="true" />
                <h2 className="dest-empty__title">Chưa có điểm đến nào</h2>
              </div>
            ) : (
              <div className="dest-masonry-container">
                {renderGrid(
                  domestic,
                  "Điểm đến yêu thích trong nước",
                  "Lên rừng xuống biển. Trọn vẹn Việt Nam",
                )}

                {renderGrid(
                  international,
                  "Điểm đến yêu thích nước ngoài",
                  "Bao la thế giới. Bốn bể là nhà",
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
