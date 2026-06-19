import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

import type { TourResponse } from "../../types/publicTour";
import { parseTourTextList } from "../../utils/tourDetailFormatters";
import { normalizeCancellationPolicy } from "./tourPublicDetailNormalize";
import { PRODUCT_TAB_META, type ProductTabKey } from "./productDetailsTabMeta";

import "./ProductDetailsTabs.css";

type ProductDetailsTabsProps = {
  tour: TourResponse;
  className?: string;
};

type TabItem = {
  key: ProductTabKey;
  label: string;
  body: string;
};

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function TabBody({ tabKey, body }: { tabKey: ProductTabKey; body: string }) {
  const meta = PRODUCT_TAB_META[tabKey];
  const plain = stripHtml(body);
  const lines = parseTourTextList(plain);

  if (tabKey === "inclusions" && lines.length > 0) {
    return (
      <ul className="tour-public-product-tabs__list">
        {lines.map((line) => (
          <li key={line} className="tour-public-product-tabs__list-item">
            <span
              className="tour-public-product-tabs__list-marker bg-emerald-100 text-emerald-700"
              aria-hidden
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (tabKey === "exclusions" && lines.length > 0) {
    return (
      <ul className="tour-public-product-tabs__list">
        {lines.map((line) => (
          <li key={line} className="tour-public-product-tabs__list-item">
            <span
              className="tour-public-product-tabs__list-marker bg-rose-100 text-rose-600"
              aria-hidden
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.75} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (tabKey === "highlights" && lines.length > 1) {
    return (
      <ul className="tour-public-product-tabs__list">
        {lines.map((line) => (
          <li key={line} className="tour-public-product-tabs__list-item">
            <span
              className={cn(
                "tour-public-product-tabs__list-marker",
                meta.iconWrap,
              )}
              aria-hidden
            >
              <meta.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (tabKey === "highlights") {
    return (
      <div className={cn("tour-public-product-tabs__callout", meta.accentText)}>
        <span
          className={cn(
            "tour-public-product-tabs__panel-head-icon shrink-0",
            meta.iconWrap,
          )}
          aria-hidden
        >
          <meta.icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <p className="tour-public-product-tabs__prose m-0 flex-1">{plain}</p>
      </div>
    );
  }

  return <p className="tour-public-product-tabs__prose">{plain}</p>;
}

export function ProductDetailsTabs({
  tour,
  className,
}: ProductDetailsTabsProps) {
  const tourId = tour.id;
  const { t } = useTranslation("tours");
  const policy = normalizeCancellationPolicy(tour.cancellationPolicy);

  const tabs = useMemo(() => {
    const list: TabItem[] = [];
    if (tour.description?.trim()) {
      list.push({
        key: "description",
        label: String(t("detail.tabs.description")),
        body: tour.description,
      });
    }
    if (tour.highlights?.trim()) {
      list.push({
        key: "highlights",
        label: String(t("detail.tabs.highlights")),
        body: tour.highlights,
      });
    }
    if (tour.inclusions?.trim()) {
      list.push({
        key: "inclusions",
        label: String(t("detail.tabs.inclusions")),
        body: tour.inclusions,
      });
    }
    if (tour.exclusions?.trim()) {
      list.push({
        key: "exclusions",
        label: String(t("detail.tabs.exclusions")),
        body: tour.exclusions,
      });
    }
    if (tour.notes?.trim()) {
      list.push({
        key: "notes",
        label: String(t("detail.tabs.notes")),
        body: tour.notes,
      });
    }
    if (policy?.description?.trim() || policy?.name) {
      list.push({
        key: "policy",
        label: String(t("detail.tabs.policy")),
        body:
          [policy?.name, policy?.description].filter(Boolean).join("\n\n") ||
          "",
      });
    }
    return list;
  }, [
    policy,
    t,
    tour.description,
    tour.exclusions,
    tour.highlights,
    tour.inclusions,
    tour.notes,
  ]);

  const [tab, setTab] = useState<ProductTabKey | null>(null);

  useEffect(() => {
    setTab(null);
  }, [tourId]);

  const active =
    tab && tabs.some((item) => item.key === tab)
      ? tab
      : (tabs[0]?.key as ProductTabKey | undefined);

  if (tabs.length === 0 || !active) {
    return null;
  }

  const activeTab = tabs.find((item) => item.key === active)!;
  const activeMeta = PRODUCT_TAB_META[active];

  return (
    <section
      className={cn(
        "tour-public-product-tabs rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 p-4 shadow-xl shadow-slate-900/6 dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] ring-1 ring-slate-900/5 dark:ring-white/5 backdrop-blur-md md:p-5 text-[var(--color-text)]",
        className,
      )}
      aria-label={String(
        t("detail.productDetailsAria", {
          defaultValue: "Chi tiết chương trình",
        }),
      )}
    >
      <div
        role="tablist"
        aria-label={String(
          t("detail.productDetailsAria", {
            defaultValue: "Chi tiết chương trình",
          }),
        )}
        className="flex flex-wrap gap-2"
      >
        {tabs.map((item) => {
          const meta = PRODUCT_TAB_META[item.key];
          const Icon = meta.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.key)}
              className={cn(
                "tour-public-product-tabs__tab shrink-0 rounded-full px-3 py-2 text-xs sm:px-3.5 sm:text-sm",
                isActive ? meta.tabActive : meta.tabIdle,
              )}
            >
              <span
                className={cn(
                  "tour-public-product-tabs__tab-icon",
                  isActive ? "bg-white/20 text-white" : meta.iconWrap,
                )}
                aria-hidden
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.35} />
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className={cn(
          "tour-public-product-tabs__panel mt-1 rounded-2xl border border-white/60 dark:border-white/5 bg-gradient-to-br p-4 shadow-inner shadow-slate-900/[0.03] dark:shadow-black/20 dark:bg-[image:none] dark:bg-slate-900/40 md:p-5",
          activeMeta.panelGradient,
        )}
      >
        <header className="mb-3 flex items-center gap-3 border-b border-slate-900/5 pb-3">
          <span
            className={cn(
              "tour-public-product-tabs__panel-head-icon",
              activeMeta.iconWrap,
            )}
            aria-hidden
          >
            <activeMeta.icon className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <h3
            className={cn(
              "font-serif text-base font-bold tracking-tight md:text-lg",
              activeMeta.accentText,
            )}
          >
            {activeTab.label}
          </h3>
        </header>

        <div className="tour-public-product-tabs__body">
          <TabBody tabKey={active} body={activeTab.body} />
        </div>
      </div>

      {policy && active === "policy" ? (
        <p className="text-xs text-slate-500">
          {String(t("detail.cta.viewPolicy"))} — {policy.name}
        </p>
      ) : null}
    </section>
  );
}
