import { useRef, useEffect, type FC } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { scheduleIdleTask } from "@/utils/scheduleIdle";

gsap.registerPlugin(ScrollTrigger);

// ===== INTERFACE DATA =========================================
// Dự án nào dùng cũng phải map về cấu trúc Slide này.
export interface BannerSlide {
  /** Dòng meta nhỏ trên cùng. VD: "EN • 2024", "Phú Quốc • Tour 5N4Đ" */
  place: string;
  /** Tiêu đề chính (h1). Có thể là chữ hoặc HTML chứa <img> cho logo */
  title: string;
  /** Phụ đề/subtitle */
  subtitle: string;
  /** Mô tả dài (~2-4 dòng) */
  description: string;
  /** URL ảnh nền chất lượng cao (>=1920px) */
  image: string;
  /** Đường dẫn xem chi tiết khi bấm CTA */
  detailPath: string;
  /** (Tùy chọn) URL ảnh logo dùng làm tiêu đề thay chữ */
  logoImage?: string | null;
}

interface BannerHomeProps {
  slides: BannerSlide[];
  /** Số slide tối đa hiển thị, mặc định 6 */
  maxSlides?: number;
  /** Label CTA button, mặc định "Xem chi tiết" */
  ctaLabel?: string;
}

const BannerHome: FC<BannerHomeProps> = ({
  slides: rawSlides,
  maxSlides = 6,
  ctaLabel,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");
  const resolvedCtaLabel = ctaLabel ?? t("homePage.bannerCta");

  const demoRef = useRef<HTMLDivElement | null>(null);
  const demoCardsRef = useRef<HTMLDivElement | null>(null);
  const slideNumbersRef = useRef<HTMLDivElement | null>(null);
  const detailsEvenRef = useRef<HTMLDivElement | null>(null);
  const detailsOddRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const arrowLeftRef = useRef<HTMLButtonElement | null>(null);
  const arrowRightRef = useRef<HTMLButtonElement | null>(null);

  const slides = rawSlides.slice(0, maxSlides).filter((s) => !!s.image);

  useEffect(() => {
    if (!slides.length) return undefined;

    return scheduleIdleTask(() => {
    const demoEl = demoRef.current;
    const demoCardsEl = demoCardsRef.current;
    const slideNumbersEl = slideNumbersRef.current;
    const detailsEvenEl = detailsEvenRef.current;
    const detailsOddEl = detailsOddRef.current;
    const indicatorEl = indicatorRef.current;
    const progressBarEl = progressRef.current;
    const arrowLeft = arrowLeftRef.current;
    const arrowRight = arrowRightRef.current;

    if (
      !demoEl ||
      !demoCardsEl ||
      !slideNumbersEl ||
      !detailsEvenEl ||
      !detailsOddEl ||
      !indicatorEl ||
      !progressBarEl
    )
      return;

    const isMobile = window.innerWidth < 768;
    const ease = "power3.out"; // ===== Movizone DNA easing =====
    const STAGGER = 0.1; // ===== Movizone DNA stagger =====
    const REVEAL_DURATION = 0.9;

    let isCancelled = false;
    /** Tạm dừng lượt slide + parallax khi banner không trong viewport hoặc tab ẩn */
    let loopPaused = false;
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        setTimeout(r, ms);
      });

    const ctx = gsap.context(() => {
      // Phase 1: thay innerHTML injection bằng React JSX (xem return bên dưới).
      // GSAP vẫn select bằng id `#card{i}` / `#card-content-{i}` / `#slide-item-{i}`
      // ⇒ logic loop/parallax không đổi, nhưng đã sạch XSS và dễ a11y.

      const range = (n: number) => Array(n).fill(0).map((_, j) => j);
      const getBannerMetrics = () => ({
        width: demoEl.clientWidth || window.innerWidth,
        height: demoEl.clientHeight || window.innerHeight,
      });
      const set = gsap.set;
      const getCard = (i: number) => `#card${i}`;
      const getCardContent = (i: number) => `#card-content-${i}`;
      const getSliderItem = (i: number) => `#slide-item-${i}`;

      function animate(
        target: gsap.TweenTarget | null,
        duration: number,
        props: gsap.TweenVars,
      ) {
        if (!target) return Promise.resolve();
        return new Promise<void>((res) => {
          gsap.to(target, { ...props, duration, onComplete: () => res() });
        });
      }

      const order = range(slides.length);
      let detailsEven = true;

      // CTA click -> navigate
      // Card-content CTA buttons có React `onClick` đã gắn (xem JSX render).
      // Còn 2 khối DetailsBlock (`#details-even`, `#details-odd`) vẫn dùng
      // querySelectorAll vì nội dung text được tween qua `updateDetails()`
      // và CTA ở DetailsBlock cần phản ánh slide hiện tại (order[0]).
      const detailsCtaCleanups: Array<() => void> = [];
      demoEl
        .querySelectorAll<HTMLButtonElement>(
          "#details-even .discover, #details-odd .discover",
        )
        .forEach((btn) => {
          const onClick = () => {
            const idx = order[0];
            if (slides[idx]?.detailPath) navigate(slides[idx].detailPath);
          };
          btn.addEventListener("click", onClick);
          detailsCtaCleanups.push(() =>
            btn.removeEventListener("click", onClick),
          );
        });

      let offsetTop = 200;
      let offsetLeft = 700;
      const cardWidth = isMobile ? 110 : 130;
      const cardHeight = isMobile ? 170 : 200;
      const gap = 16;
      const numberSize = 50;
      let isAnimating = false;

      function updateDetails(detailsEl: HTMLElement | null, index: number) {
        if (!detailsEl) return;
        const s = slides[index];
        const place = detailsEl.querySelector<HTMLDivElement>(".place-box .text");
        const t1 = detailsEl.querySelector<HTMLDivElement>(".title-1");
        const t2 = detailsEl.querySelector<HTMLDivElement>(".title-2");
        const desc = detailsEl.querySelector<HTMLDivElement>(".desc");
        if (!s || !place || !t1 || !t2 || !desc) return;

        // An toàn XSS — dùng textContent / createElement thay innerHTML.
        place.textContent = s.place;

        // Giữ nguyên dấu accent bar (Movizone DNA): render lại span đầu tiên.
        const existingAccent = place.querySelector("span");
        if (!existingAccent) {
          const accent = document.createElement("span");
          accent.className =
            "absolute w-[26px] h-0.5 md:w-[34px] md:h-[3px] rounded-full bg-[var(--color-accent)] left-0 top-0";
          place.insertBefore(accent, place.firstChild);
        }

        if (s.logoImage) {
          while (t1.firstChild) t1.removeChild(t1.firstChild);
          const img = document.createElement("img");
          img.src = s.logoImage;
          img.alt = s.title || "";
          img.className =
            "max-h-[52px] md:max-h-[72px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]";
          t1.appendChild(img);
        } else {
          t1.textContent = s.title;
        }
        t2.textContent = s.subtitle;
        desc.textContent = s.description;
      }

      function staggerRevealDetails(detailsActive: HTMLElement, baseDelay = 0.25) {
        const sel = detailsActive.querySelectorAll.bind(detailsActive);
        gsap.to(sel(".text"), {
          y: 0,
          opacity: 1,
          delay: baseDelay + STAGGER * 0,
          duration: REVEAL_DURATION,
          ease,
        });
        gsap.to(sel(".title-1"), {
          y: 0,
          opacity: 1,
          delay: baseDelay + STAGGER * 1,
          duration: REVEAL_DURATION,
          ease,
        });
        gsap.to(sel(".title-2"), {
          y: 0,
          opacity: 1,
          delay: baseDelay + STAGGER * 2,
          duration: REVEAL_DURATION,
          ease,
        });
        gsap.to(sel(".desc"), {
          y: 0,
          opacity: 1,
          delay: baseDelay + STAGGER * 3,
          duration: REVEAL_DURATION,
          ease,
        });
        gsap.to(sel(".cta"), {
          y: 0,
          opacity: 1,
          delay: baseDelay + STAGGER * 4,
          duration: REVEAL_DURATION,
          ease,
        });
      }

      function resetDetailsInitial(detailsEl: HTMLElement) {
        set(detailsEl.querySelectorAll(".text"), { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".title-1"), { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".title-2"), { y: 100, opacity: 0 });
        set(detailsEl.querySelectorAll(".desc"), { y: 50, opacity: 0 });
        set(detailsEl.querySelectorAll(".cta"), { y: 60, opacity: 0 });
      }

      function init() {
        const [active, ...rest] = order;
        const detailsActive = detailsEven ? detailsEvenEl : detailsOddEl;
        const detailsInactive = detailsEven ? detailsOddEl : detailsEvenEl;
        const { height, width } = getBannerMetrics();

        offsetTop = height - cardHeight - 32;
        offsetLeft = width - (cardWidth + gap) * rest.length - 32;

        set(getCard(active), { x: 0, y: 0, width, height, borderRadius: 0 });
        set(getCardContent(active), { x: 0, y: 0, opacity: 0 });

        if (detailsActive && detailsInactive) {
          set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
          set(detailsInactive, { opacity: 0, zIndex: 12 });
          resetDetailsInitial(detailsInactive);
          resetDetailsInitial(detailsActive);
        }

        set(progressBarEl, {
          width: 260 * (1 / order.length) * (active + 1),
        });
        set(indicatorEl, { x: -window.innerWidth });

        if (!isMobile) {
          rest.forEach((i, idx) => {
            const x = offsetLeft + idx * (cardWidth + gap);
            set(getCard(i), {
              x,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30,
              borderRadius: 14,
            });
            set(getCardContent(i), { x, y: offsetTop, zIndex: 40 });
            set(getSliderItem(i), { x: (idx + 1) * numberSize });
          });
        } else {
          rest.forEach((i) => {
            set(getCard(i), { opacity: 0, pointerEvents: "none" });
            set(getCardContent(i), { opacity: 0, pointerEvents: "none" });
            set(getSliderItem(i), { opacity: 0 });
          });
          set(slideNumbersEl, { opacity: 0 });
        }

        if (detailsActive) {
          gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: 0.15 });
          staggerRevealDetails(detailsActive, 0.25);
        }

        updateDetails(detailsActive, order[0]);
      }

      function step(): Promise<void> {
        if (isAnimating || isCancelled) return Promise.resolve();
        isAnimating = true;

        return new Promise<void>((resolve) => {
          order.push(order.shift() as number);
          detailsEven = !detailsEven;

          const detailsActive = detailsEven ? detailsEvenEl : detailsOddEl;
          const detailsInactive = detailsEven ? detailsOddEl : detailsEvenEl;

          updateDetails(detailsActive, order[0]);

          if (detailsActive && detailsInactive) {
            set(detailsActive, { zIndex: 22 });
            gsap.to(detailsActive, { opacity: 1, delay: 0.15, ease });
            staggerRevealDetails(detailsActive, 0.15);
            set(detailsInactive, { zIndex: 12 });
          }

          const [active, ...rest] = order;
          const prv = rest[rest.length - 1];
          const { width, height } = getBannerMetrics();
          const offsetTopLocal = height - cardHeight - 32;
          const offsetLeftLocal = width - (cardWidth + gap) * rest.length - 32;

          set(getCard(active), { opacity: 1, pointerEvents: "auto" });
          set(getCard(prv), { zIndex: 10 });
          set(getCard(active), { zIndex: 20 });
          gsap.to(getCard(prv), { scale: 1.5, ease });

          gsap.to(getCardContent(active), { opacity: 0, duration: 0.3, ease });
          gsap.to(getSliderItem(active), { x: 0, ease });
          gsap.to(getSliderItem(prv), { x: -numberSize, ease });
          gsap.to(progressBarEl, {
            width: 260 * (1 / order.length) * (active + 1),
            ease,
          });

          gsap.to(getCard(active), {
            x: 0,
            y: 0,
            ease,
            width,
            height,
            borderRadius: 0,
            onComplete: () => {
              if (!isMobile) {
                const xNew =
                  offsetLeftLocal + (rest.length - 1) * (cardWidth + gap);
                set(getCard(prv), {
                  x: xNew,
                  y: offsetTopLocal,
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: 30,
                  borderRadius: 14,
                  scale: 1,
                });
                set(getCardContent(prv), {
                  x: xNew,
                  y: offsetTopLocal,
                  opacity: 1,
                  zIndex: 40,
                });
                set(getSliderItem(prv), { x: rest.length * numberSize });
              } else {
                set(getCard(prv), { opacity: 0, pointerEvents: "none" });
                set(getCardContent(prv), {
                  opacity: 0,
                  pointerEvents: "none",
                });
              }

              if (detailsInactive) {
                set(detailsInactive, { opacity: 0 });
                resetDetailsInitial(detailsInactive);
              }
              isAnimating = false;
              resolve();
            },
          });

          if (!isMobile) {
            rest.forEach((i, idx) => {
              if (i !== prv) {
                const xNew = offsetLeftLocal + idx * (cardWidth + gap);
                set(getCard(i), { zIndex: 30 });
                gsap.to(getCard(i), {
                  x: xNew,
                  y: offsetTopLocal,
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 14,
                  ease,
                  delay: 0.05 * (idx + 1),
                });
                gsap.to(getCardContent(i), {
                  x: xNew,
                  y: offsetTopLocal,
                  opacity: 1,
                  zIndex: 40,
                  ease,
                  delay: 0.05 * (idx + 1),
                });
                gsap.to(getSliderItem(i), {
                  x: (idx + 1) * numberSize,
                  ease,
                });
              }
            });
          }
        });
      }

      async function loop() {
        while (!isCancelled) {
          while (loopPaused && !isCancelled) {
            await sleep(200);
          }
          if (isCancelled) break;

          const { width } = getBannerMetrics();
          await animate(indicatorEl, 2, { x: 0 });
          if (isCancelled) break;

          while (loopPaused && !isCancelled) {
            await sleep(200);
          }
          if (isCancelled) break;

          await animate(indicatorEl, 0.8, { x: width, delay: 0.3 });
          if (isCancelled) break;

          while (loopPaused && !isCancelled) {
            await sleep(200);
          }
          if (isCancelled) break;

          gsap.set(indicatorEl, { x: -width });
          await step();
        }
      }

      function loadImage(src: string) {
        return new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });
      }
      /**
       * IMPORTANT (TravelViet integration):
       * BannerHome không được "đứng yên" chỉ vì 1 ảnh lỗi/404/CORS.
       * Nếu Promise.all reject -> init() không chạy -> UI chồng lên nhau.
       * Vì vậy ta dùng allSettled và luôn proceed init.
       */
      const loadImages = () =>
        Promise.allSettled(slides.map((s) => loadImage(s.image)));

      const handleNext = () => {
        if (!isAnimating && !isCancelled) void step();
      };
      const handlePrev = () => {
        if (isAnimating || order.length <= 1 || isCancelled) return;
        const a = order.pop();
        if (a !== undefined) order.unshift(a);
        const b = order.pop();
        if (b !== undefined) order.unshift(b);
        void step();
      };

      arrowRight?.addEventListener("click", handleNext);
      arrowLeft?.addEventListener("click", handlePrev);

      // ============ PARALLAX (scrub 1.5) — chỉ text; KHÔNG dịch cả lớp ảnh (yPercent)
      // vì sẽ lộ nền đen dưới trong overflow-hidden.
      const parallaxTriggers: ScrollTrigger[] = [];

      const textTargets = [detailsEvenEl, detailsOddEl].filter(
        Boolean,
      ) as HTMLElement[];
      if (textTargets.length) {
        const fg = gsap.to(textTargets, {
          yPercent: -15,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: demoEl,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
        if (fg.scrollTrigger) parallaxTriggers.push(fg.scrollTrigger);
      }

      const setParallaxEnabled = (on: boolean) => {
        parallaxTriggers.forEach((t) => {
          if (on) {
            t.enable(false);
          } else {
            t.disable(false);
          }
        });
      };

      const syncPauseFromVisibility = () => {
        if (document.hidden) {
          loopPaused = true;
          setParallaxEnabled(false);
          return;
        }
        const r = demoEl.getBoundingClientRect();
        const vh = window.innerHeight || 0;
        const visible =
          r.bottom > 0 && r.top < vh && r.width > 0 && r.height > 0;
        loopPaused = !visible;
        setParallaxEnabled(visible);
      };

      const io = new IntersectionObserver(
        ([e]) => {
          if (document.hidden) {
            loopPaused = true;
            setParallaxEnabled(false);
            return;
          }
          loopPaused = !e.isIntersecting;
          setParallaxEnabled(e.isIntersecting);
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(demoEl);

      const onVisibility = () => {
        syncPauseFromVisibility();
        if (!document.hidden) {
          ScrollTrigger.refresh();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      const handleResize = () => {
        if (!isAnimating) init();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      async function start() {
        try {
          syncPauseFromVisibility();

          // Init ngay để layout không bị chồng lớp.
          init();
          ScrollTrigger.refresh();

          // Load ảnh xong (thành công hay thất bại) đều refresh lại để parallax/height chuẩn.
          await loadImages();
          ScrollTrigger.refresh();
          await loop();
        } catch (e) {
          console.error(e);
        }
      }
      void start();

      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", handleResize);
        arrowRight?.removeEventListener("click", handleNext);
        arrowLeft?.removeEventListener("click", handlePrev);
        parallaxTriggers.forEach((t) => t.kill());
        detailsCtaCleanups.forEach((cleanup) => cleanup());
      };
    }, demoRef);

    return () => {
      isCancelled = true;
      ctx.revert();
    };
    }, { timeout: 2_000 });
  }, [slides, navigate, resolvedCtaLabel]);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t("hero.carouselAria")}
      className="relative h-dvh min-h-svh w-full bg-black text-white overflow-hidden font-sans"
    >
      {/* Thanh cam indicator (cùng tông nút Tìm kiếm HomeSearchBar) */}
      <div
        ref={indicatorRef}
        className="indicator fixed left-0 right-0 top-0 h-[5px] bg-[var(--color-accent)] z-40"
        aria-hidden
      />

      <div id="demo" ref={demoRef} className="relative w-full h-full">
        {/* Cinematic Overlay Gradient System */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none
                        bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_85%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none
                        bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_18%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.75)_100%)]"
        />

        {/* Cards layer — render React JSX (Phase 1) thay innerHTML injection.
            GSAP vẫn tween bằng selector id, không cần đổi logic loop. */}
        <div
          id="demo-cards"
          ref={demoCardsRef}
          className="absolute inset-0 z-0"
        >
          {slides.map((s, i) => (
            <div
              key={`card-${i}`}
              id={`card${i}`}
              className="card absolute left-0 top-0 shadow-[6px_6px_10px_2px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden bg-black"
              role="group"
              aria-roledescription="slide"
              aria-label={t("hero.slideLabel", {
                current: i + 1,
                total: slides.length,
                title: s.title,
              })}
            >
              <img
                src={s.image}
                alt={s.title}
                width={1920}
                height={1080}
                decoding="async"
                {...(i === 0
                  ? { fetchPriority: "high" as const, loading: "eager" as const }
                  : { fetchPriority: "low" as const, loading: "lazy" as const })}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
              />
            </div>
          ))}
          {slides.map((s, i) => (
            <div
              key={`card-content-${i}`}
              id={`card-content-${i}`}
              className="card-content absolute inset-0 text-white/90"
              aria-hidden
            >
              <div className="flex h-full w-full items-end">
                <div className="w-full bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 md:p-4">
                  <div className="text-[11px] md:text-[13px] font-medium text-white/70">
                    {s.place}
                  </div>
                  <div className="mt-1 font-['Oswald',sans-serif] font-semibold text-[13px] md:text-[16px] leading-snug line-clamp-3 break-words">
                    {s.title}
                  </div>
                  <div className="font-['Oswald',sans-serif] text-[11px] md:text-[13px] text-white/70 leading-snug line-clamp-3 break-words">
                    {s.subtitle}
                  </div>
                  <div className="text-[11px] md:text-[12px] leading-snug text-white/80 line-clamp-2">
                    {s.description}
                  </div>
                  <div className="cta mt-4 flex items-center gap-4 pointer-events-auto">
                    <button
                      type="button"
                      aria-label={t("hero.bookmark")}
                      className="bookmark w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--color-accent)] text-white grid place-items-center border-none shadow-[0_8px_18px_rgba(255,102,0,0.45)] transition-transform hover:scale-105 active:scale-95"
                    >
                      <span className="text-[16px] md:text-[18px] leading-none">
                        ★
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        s.detailPath ? navigate(s.detailPath) : undefined
                      }
                      className="discover h-8 md:h-9 px-5 md:px-6 rounded-full border border-white/80 text-[10px] md:text-[11px] uppercase bg-black/30 backdrop-blur tracking-[0.18em] hover:bg-white hover:text-black transition-colors"
                    >
                      {resolvedCtaLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILS EVEN */}
        <DetailsBlock
          ctaLabel={resolvedCtaLabel}
          refEl={detailsEvenRef}
          id="details-even"
          z={30}
        />
        {/* DETAILS ODD */}
        <DetailsBlock
          ctaLabel={resolvedCtaLabel}
          refEl={detailsOddRef}
          id="details-odd"
          z={20}
        />

        {/* Pagination */}
        <div
          className="pagination hidden md:inline-flex absolute left-4 md:left-6 bottom-4 md:bottom-6 items-center gap-4 md:gap-5 z-80 pointer-events-auto"
          role="group"
          aria-label={t("hero.controlsAria")}
        >
          <button
            type="button"
            aria-label={t("hero.prevSlide")}
            ref={arrowLeftRef}
            className="arrow arrow-left  w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur hover:border-white/70 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-white/75"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label={t("hero.nextSlide")}
            ref={arrowRightRef}
            className="arrow arrow-right w-10 h-10 md:w-[46px] md:h-[46px] rounded-full border-2 border-white/30 grid place-items-center bg-black/40 backdrop-blur ml-1 md:ml-3 hover:border-white/70 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6 text-white/75"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
          <div className="progress-sub-container ml-2 md:ml-4 flex items-center h-[42px] w-[190px] md:w-60">
            <div className="progress-sub-background w-full h-[3px] bg-white/25 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="progress-sub-foreground h-[3px] bg-[var(--color-accent)]"
              />
            </div>
          </div>
          <div
            id="slide-numbers"
            ref={slideNumbersRef}
            className="slide-numbers relative w-[42px] h-[42px] md:w-[50px] md:h-[50px] overflow-hidden z-30 bg-black/40 rounded-full border border-white/20 backdrop-blur"
            aria-hidden
          >
            {slides.map((_, i) => (
              <div
                key={`slide-item-${i}`}
                id={`slide-item-${i}`}
                className="item w-[42px] h-[42px] md:w-[50px] md:h-[50px] absolute top-0 left-0 grid place-items-center text-[22px] md:text-[28px] font-bold text-white"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-component: block details (meta + title + sub + desc + CTA)
const DetailsBlock: FC<{
  refEl: React.RefObject<HTMLDivElement | null>;
  id: string;
  z: number;
  ctaLabel: string;
}> = ({ refEl, id, z, ctaLabel }) => (
  <div
    id={id}
    ref={refEl}
    className={`details absolute top-28 left-5 md:top-1/4 md:left-12 lg:left-16 max-w-[640px]`}
    style={{ zIndex: z }}
  >
    <div className="place-box min-h-[40px] overflow-hidden relative">
      <div className="text pt-3 text-[12px] md:text-[14px] tracking-[0.18em] uppercase font-medium text-white/85 flex flex-wrap items-center gap-2">
        <span className="absolute w-[26px] h-0.5 md:w-[34px] md:h-[3px] rounded-full bg-[var(--color-accent)] left-0 top-0" />
      </div>
    </div>
    <div className="title-box-1 mt-2 min-h-[96px] md:min-h-[132px] lg:min-h-[168px] max-h-[min(42vh,380px)] overflow-hidden">
      <div className="title-1 font-['Oswald',sans-serif] font-bold text-[32px] sm:text-[36px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] whitespace-normal break-words max-w-[min(94vw,640px)]" />
    </div>
    <div className="title-box-2 mt-1 min-h-[2rem] md:min-h-[2.75rem] max-h-[5.5rem] overflow-hidden">
      <div className="title-2 font-['Oswald',sans-serif] font-medium text-[14px] sm:text-[16px] md:text-[22px] leading-snug uppercase tracking-[0.08em] text-white/85 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)] whitespace-normal break-words max-w-[min(94vw,640px)]" />
    </div>
    <div className="desc mt-5 w-[300px] md:w-[560px] max-h-[110px] text-[13px] md:text-[15px] leading-relaxed text-white/85 overflow-hidden line-clamp-4" />
    <div className="cta mt-7 flex items-center max-w-[500px] gap-4">
      <button
        type="button"
        className="bookmark w-10 h-10 rounded-full bg-[var(--color-accent)] text-white grid place-items-center border-none shadow-[0_10px_24px_rgba(255,102,0,0.35)] hover:scale-110 transition-transform duration-300"
      >
        <span className="text-[18px] leading-none">★</span>
      </button>
      <button
        type="button"
        className="discover h-10 px-7 rounded-full border border-white/80 text-[11px] md:text-[12px] uppercase bg-black/30 backdrop-blur tracking-[0.22em] font-semibold hover:bg-white hover:text-black hover:border-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {ctaLabel}
      </button>
    </div>
  </div>
);

export default BannerHome;

