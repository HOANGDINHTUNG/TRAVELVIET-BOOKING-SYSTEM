import type { TFunction } from 'i18next'

import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
  SimpleNavItem,
  type HeaderNavAppearance,
} from './ui/navbar-menu'
import { HEADER_MEGA_IMAGES } from './headerMegaMenuConfig'
import { HEADER_NAV_LINKS } from './headerNavConfig'

type HeaderMegaMenuProps = {
  t: TFunction
  activeMenu: string | null
  setActiveMenu: (item: string | null) => void
  appearance: HeaderNavAppearance
  isAuthenticated: boolean
}

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
  const homeLabel = String(t('nav.home'))
  const packageTourLabel = String(t('header.nav.packageTour'))
  const flightLabel = String(t('header.nav.flightTicket'))
  const hotelLabel = String(t('header.nav.hotel'))
  const travelComboLabel = String(t('header.nav.travelCombo'))
  const destinationsLabel = String(t('homeQuick.destinations'))
  const addOnLabel = String(t('header.nav.addOnServices'))
  const moreLabel = String(t('header.megaMenu.more.label'))
  const toursLabel = String(t('homeQuick.tours'))

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
          <HoveredLink to={HEADER_NAV_LINKS.home}>
            {String(t('header.megaMenu.home.landing'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.toursDomestic}>
            {String(t('header.exploreTours'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.toursFlash}>
            {String(t('homePage.lastMinuteDeals.sectionTitle'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.destinations}>
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
            title={String(t('header.megaMenu.tours.beachVn.title'))}
            description={String(t('header.megaMenu.tours.beachVn.description'))}
            to={HEADER_NAV_LINKS.toursBeach}
            src={HEADER_MEGA_IMAGES.beachVn}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.intlHot.title'))}
            description={String(t('header.megaMenu.tours.intlHot.description'))}
            to={HEADER_NAV_LINKS.toursIntlHot}
            src={HEADER_MEGA_IMAGES.intlHot}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.flash.title'))}
            description={String(t('header.megaMenu.tours.flash.description'))}
            to={HEADER_NAV_LINKS.toursFlash}
            src={HEADER_MEGA_IMAGES.flashSale}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.domestic.title'))}
            description={String(t('header.megaMenu.tours.domestic.description'))}
            to={HEADER_NAV_LINKS.toursDomestic}
            src={HEADER_MEGA_IMAGES.domestic}
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
            title={String(t('header.megaMenu.more.allDestinations'))}
            description={String(t('header.megaMenu.destinations.all.description'))}
            to={HEADER_NAV_LINKS.destinations}
            src={HEADER_MEGA_IMAGES.destAll}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.central.title'))}
            description={String(t('header.megaMenu.destinations.central.description'))}
            to={HEADER_NAV_LINKS.destDaNang}
            src={HEADER_MEGA_IMAGES.destCentral}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.north.title'))}
            description={String(t('header.megaMenu.destinations.north.description'))}
            to={HEADER_NAV_LINKS.destHaLong}
            src={HEADER_MEGA_IMAGES.destNorth}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.south.title'))}
            description={String(t('header.megaMenu.destinations.south.description'))}
            to={HEADER_NAV_LINKS.destPhuQuoc}
            src={HEADER_MEGA_IMAGES.destSouth}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.highland.title'))}
            description={String(t('header.megaMenu.destinations.highland.description'))}
            to={HEADER_NAV_LINKS.destDaLat}
            src={HEADER_MEGA_IMAGES.destHighland}
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
          <HoveredLink to={HEADER_NAV_LINKS.visa}>
            {String(t('homePage.services.visa'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.carRental}>
            {String(t('homePage.services.carRental'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.flights}>
            {String(t('homePage.services.flights'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.hotels}>
            {String(t('homePage.services.hotel'))}
          </HoveredLink>
          <HoveredLink to={HEADER_NAV_LINKS.support}>
            {String(t('homeQuick.support'))}
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
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {destinationsLabel}
            </p>
            <HoveredLink to={HEADER_NAV_LINKS.destinations}>
              {String(t('header.megaMenu.more.allDestinations'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.destDaNang}>
              {String(t('header.megaMenu.destinations.central.title'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.destHaLong}>
              {String(t('header.megaMenu.destinations.north.title'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.destPhuQuoc}>
              {String(t('header.megaMenu.destinations.south.title'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.destDaLat}>
              {String(t('header.megaMenu.destinations.highland.title'))}
            </HoveredLink>
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {String(t('header.megaMenu.more.exploreHeading'))}
            </p>
            <HoveredLink to={HEADER_NAV_LINKS.toursDomestic}>{toursLabel}</HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.toursInternational}>
              {String(t('header.megaMenu.more.international'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.toursEsg}>
              {String(t('header.megaMenu.more.esgTours'))}
            </HoveredLink>
            <HoveredLink to={HEADER_NAV_LINKS.support}>
              {String(t('homeQuick.support'))}
            </HoveredLink>
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {String(t('header.megaMenu.more.personalHeading'))}
            </p>
            {isAuthenticated ? (
              <>
                <HoveredLink to={HEADER_NAV_LINKS.myBookings}>
                  {String(t('header.myBookings', { defaultValue: 'Đơn đã đặt' }))}
                </HoveredLink>
                <HoveredLink to={HEADER_NAV_LINKS.account}>
                  {String(t('header.accountPage'))}
                </HoveredLink>
              </>
            ) : (
              <HoveredLink to={HEADER_NAV_LINKS.login}>
                {String(t('header.login'))}
              </HoveredLink>
            )}
            <HoveredLink to={HEADER_NAV_LINKS.passport}>
              {String(t('homeQuick.passport'))}
            </HoveredLink>
          </div>
        </div>
      </MenuItem>
    </Menu>
  )
}
