package com.wedservice.backend.module.tours.mapper;

import com.wedservice.backend.module.tours.entity.Tour;
import com.wedservice.backend.module.tours.entity.TourTranslation;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Merges {@link Tour} canonical columns with {@link TourTranslation} rows for public API responses.
 * <p>
 * Resolution order per field: non-blank value for the request locale, then non-blank Vietnamese
 * ({@code vi}) row, then the base column on {@link Tour}. {@code itinerary_summary} exists only
 * on translations, so it falls back {@code vi} then empty.
 * </p>
 * <p>
 * MapStruct {@link TourMapper} maps entity↔DTO for writes; runtime locale merge is performed here
 * because it depends on {@code Accept-Language} and optional DB rows.
 * </p>
 */
@Component
public class TourTranslationMergeHelper {

    /**
     * Text fields after applying translation fallback rules.
     */
    public record MergedTourTexts(
            String name,
            String shortDescription,
            String description,
            String highlights,
            String inclusions,
            String exclusions,
            String notes,
            String itinerarySummary
    ) {
        static MergedTourTexts fromCanonical(Tour tour) {
            return new MergedTourTexts(
                    tour.getName(),
                    tour.getShortDescription(),
                    tour.getDescription(),
                    tour.getHighlights(),
                    tour.getInclusions(),
                    tour.getExclusions(),
                    tour.getNotes(),
                    null
            );
        }
    }

    /**
     * @param primary      row for {@link com.wedservice.backend.common.i18n.LocaleTagUtil#currentLanguageTag()} (may be null)
     * @param vietnamese   row for {@code vi} when request locale is not Vietnamese; may be null
     */
    public MergedTourTexts merge(@Nullable TourTranslation primary,
                                 @Nullable TourTranslation vietnamese,
                                 Tour tour) {
        if (primary == null && vietnamese == null) {
            return MergedTourTexts.fromCanonical(tour);
        }
        return new MergedTourTexts(
                chain(field(primary, TourTranslation::getName), field(vietnamese, TourTranslation::getName), tour.getName()),
                chain(field(primary, TourTranslation::getShortDescription), field(vietnamese, TourTranslation::getShortDescription), tour.getShortDescription()),
                chain(field(primary, TourTranslation::getDescription), field(vietnamese, TourTranslation::getDescription), tour.getDescription()),
                chain(field(primary, TourTranslation::getHighlights), field(vietnamese, TourTranslation::getHighlights), tour.getHighlights()),
                chain(field(primary, TourTranslation::getInclusions), field(vietnamese, TourTranslation::getInclusions), tour.getInclusions()),
                chain(field(primary, TourTranslation::getExclusions), field(vietnamese, TourTranslation::getExclusions), tour.getExclusions()),
                chain(field(primary, TourTranslation::getNotes), field(vietnamese, TourTranslation::getNotes), tour.getNotes()),
                chain(field(primary, TourTranslation::getItinerarySummary), field(vietnamese, TourTranslation::getItinerarySummary), null)
        );
    }

    private static String field(@Nullable TourTranslation tr, java.util.function.Function<TourTranslation, String> getter) {
        return tr == null ? null : getter.apply(tr);
    }

    /**
     * Prefer translated string for the active locale, then Vietnamese translation, then canonical base.
     */
    private static String chain(@Nullable String preferred, @Nullable String vietnamese, @Nullable String base) {
        if (StringUtils.hasText(preferred)) {
            return preferred.trim();
        }
        if (StringUtils.hasText(vietnamese)) {
            return vietnamese.trim();
        }
        return base;
    }
}
