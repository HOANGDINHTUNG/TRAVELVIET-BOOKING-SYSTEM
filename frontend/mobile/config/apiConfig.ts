import { Platform } from "react-native";

export const PRODUCTION_API_BASE_URL = process.env.EXPO_PUBLIC_API_PUBLIC_URL;
export const DEVELOPMENT_API_BASE_URL = process.env.EXPO_PUBLIC_API_LOCAL_URL;

export function normalizeApiBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

/** @deprecated Dùng getApiBaseUrl() sau initializeApiBaseUrl */
export const API_BASE_URL = resolveApiBaseUrlFromEnv();

function resolveApiBaseUrlFromEnv(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (raw) return normalizeApiBaseUrl(raw);
  return DEVELOPMENT_API_BASE_URL
    ? normalizeApiBaseUrl(DEVELOPMENT_API_BASE_URL)
    : "";
}

export const API_CONFIG_HINT =
  Platform.OS === "android" && !process.env.EXPO_PUBLIC_API_URL
    ? "Emulator: 10.0.2.2:8088 — bật EXPO_PUBLIC_API_FAILOVER_ENABLED=true để fallback Render"
    : "Cấu hình EXPO_PUBLIC_API_URL trong .env";
