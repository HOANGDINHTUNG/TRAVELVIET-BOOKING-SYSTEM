import type {
  Destination,
  Tour,
} from "../../module/home/database/interface/publicTravel";
import { HEADER_MEGA_IMAGES } from "./headerMegaMenuConfig";

function firstTourImage(tours: Tour[]): string {
  const hit = tours.find((t) => t.image?.trim());
  return hit?.image?.trim() ?? "";
}

function firstDestinationImage(destinations: Destination[]): string {
  const hit = destinations.find((d) => d.image?.trim());
  return hit?.image?.trim() ?? "";
}

function destinationImageMatching(
  destinations: Destination[],
  pattern: RegExp,
): string {
  const hit = destinations.find(
    (d) =>
      d.image?.trim() &&
      (pattern.test(d.name ?? "") ||
        pattern.test(d.province ?? "") ||
        pattern.test(d.region ?? "")),
  );
  return hit?.image?.trim() ?? "";
}

export type HeaderMegaMenuImages = typeof HEADER_MEGA_IMAGES;

type MegaMenuHomeSlice = {
  destinations: Destination[];
  tours: Tour[];
  toursDomesticBeach: Tour[];
  toursInternationalHot: Tour[];
  toursLastMinuteDeals: Tour[];
};

/** Ảnh dropdown: ưu tiên media từ BE, fallback Unsplash tĩnh. */
export function resolveHeaderMegaMenuImages(
  home: MegaMenuHomeSlice,
): Record<keyof HeaderMegaMenuImages, string> {
  const {
    destinations,
    tours,
    toursDomesticBeach,
    toursInternationalHot,
    toursLastMinuteDeals,
  } = home;

  const beach = firstTourImage(toursDomesticBeach);
  const intl = firstTourImage(toursInternationalHot);
  const flash = firstTourImage(toursLastMinuteDeals);
  const domestic = firstTourImage(tours);

  const destAll = firstDestinationImage(destinations);
  const central =
    destinationImageMatching(
      destinations,
      /đà nẵng|da nang|huế|hue|hội an|hoi an/i,
    ) || firstDestinationImage(destinations);
  const north =
    destinationImageMatching(
      destinations,
      /hạ long|ha long|hà nội|hanoi|sapa/i,
    ) || firstDestinationImage(destinations);
  const south =
    destinationImageMatching(
      destinations,
      /phú quốc|phu quoc|phú yên|phu yen|nha trang/i,
    ) || firstDestinationImage(destinations);
  const highland =
    destinationImageMatching(
      destinations,
      /đà lạt|da lat|tây nguyên|highland/i,
    ) || firstDestinationImage(destinations);

  return {
    beachVn: beach || HEADER_MEGA_IMAGES.beachVn,
    intlHot: intl || HEADER_MEGA_IMAGES.intlHot,
    flashSale: flash || HEADER_MEGA_IMAGES.flashSale,
    domestic: domestic || HEADER_MEGA_IMAGES.domestic,
    destAll: destAll || HEADER_MEGA_IMAGES.destAll,
    destCentral: central || HEADER_MEGA_IMAGES.destCentral,
    destNorth: north || HEADER_MEGA_IMAGES.destNorth,
    destSouth: south || HEADER_MEGA_IMAGES.destSouth,
    destHighland: highland || HEADER_MEGA_IMAGES.destHighland,
    destVietnam: HEADER_MEGA_IMAGES.destVietnam,
    destAsia: HEADER_MEGA_IMAGES.destAsia,
    destEurope: HEADER_MEGA_IMAGES.destEurope,
    destAmericas: HEADER_MEGA_IMAGES.destAmericas,
    destAfrica: HEADER_MEGA_IMAGES.destAfrica,
  };
}
