import type { TFunction } from "i18next";
import { useMemo } from "react";

import { useAppSelector } from "../../hooks/reduxHooks";
import {
  selectHome,
  selectMegaMenuForceLoading,
} from "../../module/home/store/homeSlice";
import {
  DropdownSectionHeading,
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
  SimpleNavItem,
  type HeaderNavAppearance,
} from "./ui/navbar-menu";
import { resolveHeaderMegaMenuImages } from "./headerMegaMenuAssets";
import { HEADER_NAV_LINKS } from "./headerNavConfig";

type HeaderMegaMenuProps = {
  t: TFunction;
  activeMenu: string | null;
  setActiveMenu: (item: string | null) => void;
  appearance: HeaderNavAppearance;
  isAuthenticated: boolean;
};

/**
 * Menu chính: Vietravel items; Điểm đến nằm trong dropdown Thêm.
 */
export function HeaderMegaMenu({
  t,
  activeMenu,
  setActiveMenu,
  appearance,
  isAuthenticated,
}: HeaderMegaMenuProps) {
  const home = useAppSelector(selectHome);
  const megaMenuForceLoading = useAppSelector(selectMegaMenuForceLoading);
  const megaImages = useMemo(() => resolveHeaderMegaMenuImages(home), [home]);
  const forceLoading = megaMenuForceLoading;

  const homeLabel = String(t("nav.home"));
  const packageTourLabel = String(t("header.nav.packageTour"));
  const flightLabel = String(t("header.nav.flightTicket"));
  const hotelLabel = String(t("header.nav.hotel"));
  const travelComboLabel = String(t("header.nav.travelCombo"));
  const destinationsLabel = String(t("homeQuick.destinations"));
  const addOnLabel = String(t("header.nav.addOnServices"));
  const moreLabel = String(t("header.megaMenu.more.label"));
  const toursLabel = String(t("homeQuick.tours"));

  return (
    <Menu setActive={setActiveMenu}>
      {/* Home — dropdown nhanh */}
      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={homeLabel}
        to={HEADER_NAV_LINKS.home}
        appearance={appearance}
      >
        <div className="flex min-w-[200px] flex-col gap-0.5">
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-32"
            to={HEADER_NAV_LINKS.home}
          >
            {String(t("header.megaMenu.home.landing"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-36"
            to={HEADER_NAV_LINKS.toursDomestic}
          >
            {String(t("header.exploreTours"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-40"
            to={HEADER_NAV_LINKS.toursFlash}
          >
            {String(t("homePage.lastMinuteDeals.sectionTitle"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-28"
            to={HEADER_NAV_LINKS.destinations}
          >
            {destinationsLabel}
          </HoveredLink>
        </div>
      </MenuItem>

      {/* Tour trọn gói — mega menu ảnh */}
      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={packageTourLabel}
        to={HEADER_NAV_LINKS.packageTour}
        appearance={appearance}
      >
        <div className="grid min-w-[min(640px,82vw)] grid-cols-2 gap-4 p-1 text-sm">
          <ProductItem
            forceLoading={forceLoading}
            title={String(t("header.megaMenu.tours.beachVn.title"))}
            description={String(t("header.megaMenu.tours.beachVn.description"))}
            to={HEADER_NAV_LINKS.toursBeach}
            src={megaImages.beachVn}
          />
          <ProductItem
            forceLoading={forceLoading}
            title={String(t("header.megaMenu.tours.intlHot.title"))}
            description={String(t("header.megaMenu.tours.intlHot.description"))}
            to={HEADER_NAV_LINKS.toursIntlHot}
            src={megaImages.intlHot}
          />
          <ProductItem
            forceLoading={forceLoading}
            title={String(t("header.megaMenu.tours.flash.title"))}
            description={String(t("header.megaMenu.tours.flash.description"))}
            to={HEADER_NAV_LINKS.toursFlash}
            src={megaImages.flashSale}
          />
          <ProductItem
            forceLoading={forceLoading}
            title={String(t("header.megaMenu.tours.domestic.title"))}
            description={String(
              t("header.megaMenu.tours.domestic.description"),
            )}
            to={HEADER_NAV_LINKS.toursDomestic}
            src={megaImages.domestic}
          />
        </div>
      </MenuItem>

      <SimpleNavItem
        item={flightLabel}
        to={HEADER_NAV_LINKS.flights}
        appearance={appearance}
      />

      <SimpleNavItem
        item={hotelLabel}
        to={HEADER_NAV_LINKS.hotels}
        appearance={appearance}
      />

      <SimpleNavItem
        item={travelComboLabel}
        to={HEADER_NAV_LINKS.travelCombo}
        appearance={appearance}
      />

      {/* Điểm đến — mega menu ảnh (giống Tour trọn gói) */}
      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={destinationsLabel}
        to={HEADER_NAV_LINKS.destinations}
        appearance={appearance}
      >
        <div className="grid min-w-[min(640px,82vw)] grid-cols-2 gap-4 p-1 text-sm">
          <ProductItem
            forceLoading={forceLoading}
            title="Việt Nam"
            description="Khám phá vẻ đẹp bất tận của thiên nhiên và văn hóa Việt."
            to={HEADER_NAV_LINKS.toursDomestic}
            src={megaImages.destVietnam}
          />
          <ProductItem
            forceLoading={forceLoading}
            title="Châu Á"
            description="Trải nghiệm sự giao thoa giữa truyền thống và hiện đại."
            to={HEADER_NAV_LINKS.toursInternational}
            src={megaImages.destAsia}
          />
          <ProductItem
            forceLoading={forceLoading}
            title="Châu Âu"
            description="Hành trình đến với những nền văn minh lâu đời rực rỡ."
            to={HEADER_NAV_LINKS.toursInternational}
            src={megaImages.destEurope}
          />
          <ProductItem
            forceLoading={forceLoading}
            title="Châu Mỹ"
            description="Khám phá tân thế giới với thiên nhiên hùng vĩ, đa dạng."
            to={HEADER_NAV_LINKS.toursInternational}
            src={megaImages.destAmericas}
          />
          <ProductItem
            forceLoading={forceLoading}
            title="Châu Phi"
            description="Trở về cội nguồn thiên nhiên hoang dã kỳ thú."
            to={HEADER_NAV_LINKS.toursInternational}
            src={megaImages.destAfrica}
          />
        </div>
      </MenuItem>

      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={addOnLabel}
        to={HEADER_NAV_LINKS.support}
        appearance={appearance}
      >
        <div className="flex flex-col gap-0.5">
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-28"
            to={HEADER_NAV_LINKS.visa}
          >
            {String(t("homePage.services.visa"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-32"
            to={HEADER_NAV_LINKS.carRental}
          >
            {String(t("homePage.services.carRental"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-36"
            to={HEADER_NAV_LINKS.flights}
          >
            {String(t("homePage.services.flights"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-28"
            to={HEADER_NAV_LINKS.hotels}
          >
            {String(t("homePage.services.hotel"))}
          </HoveredLink>
          <HoveredLink
            forceLoading={forceLoading}
            skeletonWidthClass="w-24"
            to={HEADER_NAV_LINKS.support}
          >
            {String(t("homeQuick.support"))}
          </HoveredLink>
        </div>
      </MenuItem>

      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={moreLabel}
        to={HEADER_NAV_LINKS.destinations}
        appearance={appearance}
      >
        <div className="grid min-w-[min(720px,92vw)] grid-cols-1 gap-4 p-1 lg:grid-cols-[1fr_1fr_minmax(280px,1.2fr)]">
          <div className="flex flex-col gap-0.5">
            <DropdownSectionHeading forceLoading={forceLoading}>
              {destinationsLabel}
            </DropdownSectionHeading>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-40"
              to={HEADER_NAV_LINKS.destinations}
            >
              {String(t("header.megaMenu.more.allDestinations"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-32"
              to={HEADER_NAV_LINKS.destDaNang}
            >
              {String(t("header.megaMenu.destinations.central.title"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-28"
              to={HEADER_NAV_LINKS.destHaLong}
            >
              {String(t("header.megaMenu.destinations.north.title"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-32"
              to={HEADER_NAV_LINKS.destPhuQuoc}
            >
              {String(t("header.megaMenu.destinations.south.title"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-28"
              to={HEADER_NAV_LINKS.destDaLat}
            >
              {String(t("header.megaMenu.destinations.highland.title"))}
            </HoveredLink>
          </div>

          <div className="flex flex-col gap-0.5">
            <DropdownSectionHeading forceLoading={forceLoading}>
              {String(t("header.megaMenu.more.exploreHeading"))}
            </DropdownSectionHeading>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-24"
              to={HEADER_NAV_LINKS.toursDomestic}
            >
              {toursLabel}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-36"
              to={HEADER_NAV_LINKS.toursInternational}
            >
              {String(t("header.megaMenu.more.international"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-32"
              to={HEADER_NAV_LINKS.toursEsg}
            >
              {String(t("header.megaMenu.more.esgTours"))}
            </HoveredLink>
            <HoveredLink
              forceLoading={forceLoading}
              skeletonWidthClass="w-24"
              to={HEADER_NAV_LINKS.support}
            >
              {String(t("homeQuick.support"))}
            </HoveredLink>
          </div>

          <div className="flex flex-col gap-0.5">
            <DropdownSectionHeading forceLoading={forceLoading}>
              {String(t("header.megaMenu.more.personalHeading"))}
            </DropdownSectionHeading>
            {forceLoading ? (
              <>
                <HoveredLink forceLoading skeletonWidthClass="w-28">
                  {" "}
                </HoveredLink>
                <HoveredLink forceLoading skeletonWidthClass="w-32">
                  {" "}
                </HoveredLink>
                <HoveredLink forceLoading skeletonWidthClass="w-24">
                  {" "}
                </HoveredLink>
              </>
            ) : isAuthenticated ? (
              <>
                <HoveredLink to={HEADER_NAV_LINKS.myBookings}>
                  {String(
                    t("header.myBookings", { defaultValue: "Đơn đã đặt" }),
                  )}
                </HoveredLink>
                <HoveredLink to={HEADER_NAV_LINKS.account}>
                  {String(t("header.accountPage"))}
                </HoveredLink>
              </>
            ) : (
              <HoveredLink to={HEADER_NAV_LINKS.login}>
                {String(t("header.login"))}
              </HoveredLink>
            )}
            {!forceLoading ? (
              <HoveredLink to={HEADER_NAV_LINKS.passport}>
                {String(t("homeQuick.passport"))}
              </HoveredLink>
            ) : null}
          </div>
        </div>
      </MenuItem>
    </Menu>
  );
}
