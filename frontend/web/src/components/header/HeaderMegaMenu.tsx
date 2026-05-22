import type { TFunction } from 'i18next'

import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
  type HeaderNavAppearance,
} from './ui/navbar-menu'
import { HEADER_MEGA_IMAGES, HEADER_MEGA_LINKS } from './headerMegaMenuConfig'

type HeaderMegaMenuProps = {
  t: TFunction
  activeMenu: string | null
  setActiveMenu: (item: string | null) => void
  appearance: HeaderNavAppearance
  isAuthenticated: boolean
}

export function HeaderMegaMenu({
  t,
  activeMenu,
  setActiveMenu,
  appearance,
  isAuthenticated,
}: HeaderMegaMenuProps) {
  const homeLabel = String(t('nav.home'))
  const toursLabel = String(t('homeQuick.tours'))
  const destinationsLabel = String(t('homeQuick.destinations'))
  const moreLabel = String(t('header.megaMenu.more.label'))

  return (
    <Menu setActive={setActiveMenu}>
      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={homeLabel}
        to={HEADER_MEGA_LINKS.home}
        appearance={appearance}
      >
        <div className="flex min-w-[200px] flex-col space-y-3 text-sm">
          <HoveredLink to={HEADER_MEGA_LINKS.home}>
            {String(t('header.megaMenu.home.landing'))}
          </HoveredLink>
          <HoveredLink to={HEADER_MEGA_LINKS.toursDomestic}>
            {String(t('header.exploreTours'))}
          </HoveredLink>
          <HoveredLink to={HEADER_MEGA_LINKS.toursFlash}>
            {String(t('homePage.lastMinuteDeals.sectionTitle'))}
          </HoveredLink>
          <HoveredLink to={HEADER_MEGA_LINKS.destinations}>
            {String(t('homeQuick.destinations'))}
          </HoveredLink>
        </div>
      </MenuItem>

      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={toursLabel}
        to={HEADER_MEGA_LINKS.toursDomestic}
        appearance={appearance}
      >
        <div className="grid min-w-[min(640px,82vw)] grid-cols-2 gap-4 p-1 text-sm">
          <ProductItem
            title={String(t('header.megaMenu.tours.beachVn.title'))}
            description={String(t('header.megaMenu.tours.beachVn.description'))}
            to={HEADER_MEGA_LINKS.toursBeach}
            src={HEADER_MEGA_IMAGES.beachVn}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.intlHot.title'))}
            description={String(t('header.megaMenu.tours.intlHot.description'))}
            to={HEADER_MEGA_LINKS.toursIntlHot}
            src={HEADER_MEGA_IMAGES.intlHot}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.flash.title'))}
            description={String(t('header.megaMenu.tours.flash.description'))}
            to={HEADER_MEGA_LINKS.toursFlash}
            src={HEADER_MEGA_IMAGES.flashSale}
          />
          <ProductItem
            title={String(t('header.megaMenu.tours.domestic.title'))}
            description={String(t('header.megaMenu.tours.domestic.description'))}
            to={HEADER_MEGA_LINKS.toursDomestic}
            src={HEADER_MEGA_IMAGES.domestic}
          />
        </div>
      </MenuItem>

      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={destinationsLabel}
        to={HEADER_MEGA_LINKS.destinations}
        appearance={appearance}
      >
        <div className="grid min-w-[min(640px,82vw)] grid-cols-2 gap-4 p-1 text-sm">
          <ProductItem
            title={String(t('header.megaMenu.destinations.central.title'))}
            description={String(t('header.megaMenu.destinations.central.description'))}
            to={HEADER_MEGA_LINKS.destDaNang}
            src={HEADER_MEGA_IMAGES.destCentral}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.north.title'))}
            description={String(t('header.megaMenu.destinations.north.description'))}
            to={HEADER_MEGA_LINKS.destHaLong}
            src={HEADER_MEGA_IMAGES.destNorth}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.south.title'))}
            description={String(t('header.megaMenu.destinations.south.description'))}
            to={HEADER_MEGA_LINKS.destPhuQuoc}
            src={HEADER_MEGA_IMAGES.destSouth}
          />
          <ProductItem
            title={String(t('header.megaMenu.destinations.highland.title'))}
            description={String(t('header.megaMenu.destinations.highland.description'))}
            to={HEADER_MEGA_LINKS.destDaLat}
            src={HEADER_MEGA_IMAGES.destHighland}
          />
        </div>
      </MenuItem>

      <MenuItem
        setActive={setActiveMenu}
        active={activeMenu}
        item={moreLabel}
        to={HEADER_MEGA_LINKS.support}
        appearance={appearance}
      >
        <div className="grid min-w-[320px] grid-cols-2 gap-6 p-1 pr-2 text-sm">
          <div className="flex flex-col space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">
              {String(t('header.megaMenu.more.exploreHeading'))}
            </p>
            <HoveredLink to={HEADER_MEGA_LINKS.destinations}>
              {String(t('header.megaMenu.more.allDestinations'))}
            </HoveredLink>
            <HoveredLink to={HEADER_MEGA_LINKS.toursInternational}>
              {String(t('header.megaMenu.more.international'))}
            </HoveredLink>
            <HoveredLink to={HEADER_MEGA_LINKS.toursEsg}>
              {String(t('header.megaMenu.more.esgTours'))}
            </HoveredLink>
            <HoveredLink to={HEADER_MEGA_LINKS.support}>
              {String(t('homeQuick.support'))}
            </HoveredLink>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">
              {String(t('header.megaMenu.more.personalHeading'))}
            </p>
            {isAuthenticated ? (
              <HoveredLink to={HEADER_MEGA_LINKS.account}>
                {String(t('header.accountPage'))}
              </HoveredLink>
            ) : (
              <HoveredLink to={HEADER_MEGA_LINKS.login}>
                {String(t('header.login'))}
              </HoveredLink>
            )}
            <HoveredLink to={HEADER_MEGA_LINKS.passport}>
              {String(t('homeQuick.passport'))}
            </HoveredLink>
          </div>
        </div>
      </MenuItem>
    </Menu>
  )
}
