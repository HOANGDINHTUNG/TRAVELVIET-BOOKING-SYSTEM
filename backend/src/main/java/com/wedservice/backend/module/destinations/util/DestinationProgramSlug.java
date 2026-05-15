package com.wedservice.backend.module.destinations.util;

/**
 * Slug dạng travel.com.vn: {@code ...-pid-11106} — lấy id ở hậu tố {@code -pid-}.
 */
public final class DestinationProgramSlug {

    private DestinationProgramSlug() {
    }

    public static Long parseTrailingPid(String programSlug) {
        if (programSlug == null || programSlug.isBlank()) {
            return null;
        }
        int idx = programSlug.toLowerCase().lastIndexOf("-pid-");
        if (idx < 0) {
            return null;
        }
        String tail = programSlug.substring(idx + 5).trim();
        try {
            return Long.parseLong(tail);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String build(String slug, long id) {
        return slug + "-pid-" + id;
    }
}
