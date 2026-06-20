import { Platform } from "react-native";
import Constants from "expo-constants";
import {
  DEVELOPMENT_API_BASE_URL,
  PRODUCTION_API_BASE_URL,
  normalizeApiBaseUrl,
} from "@/config/apiConfig";

const HEALTH_PATH = "/system/health";
const PROBE_MS = 4000;

let activeBaseUrl: string | null = null;

export function getApiBaseUrl() {
  return activeBaseUrl ?? resolveApiBaseUrlFromEnv();
}

export function resolveApiBaseUrlFromEnv(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) {
    return normalizeApiBaseUrl(explicit);
  }
  let localUrl = process.env.EXPO_PUBLIC_API_LOCAL_URL ?? "http://10.0.2.2:8088/api/v1";
  if (Platform.OS === "ios" && localUrl.includes("10.0.2.2")) {
    localUrl = localUrl.replace("10.0.2.2", "localhost");
  }
  return normalizeApiBaseUrl(localUrl);
}

function resolvePublicApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_PUBLIC_URL?.trim();
  const fallback = explicit ?? PRODUCTION_API_BASE_URL ?? "";
  return fallback ? normalizeApiBaseUrl(fallback) : "";
}

function shouldUseFailover(): boolean {
  const flag = process.env.EXPO_PUBLIC_API_FAILOVER_ENABLED;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return __DEV__;
}

async function probeHealth(baseUrl: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_MS);
  try {
    const response = await fetch(
      `${normalizeApiBaseUrl(baseUrl)}${HEALTH_PATH}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Dev: thử local (emulator/localhost) rồi LAN IP, rồi Render — giống web `apiBaseUrl.ts`.
 */
export async function initializeApiBaseUrl(): Promise<string> {
  const localUrl = resolveApiBaseUrlFromEnv();
  const publicUrl = resolvePublicApiBaseUrl();

  if (!shouldUseFailover() || localUrl === publicUrl) {
    activeBaseUrl = localUrl;
    return localUrl;
  }

  // 1. Thử local URL gốc (localhost hoặc 10.0.2.2)
  const localOk = await probeHealth(localUrl);
  if (localOk) {
    activeBaseUrl = localUrl;
    return localUrl;
  }

  // 2. Thử tự động dò LAN IP từ expo-constants (cho thiết bị thật)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.developerTool?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    "";
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    if (ip && ip !== "127.0.0.1" && ip !== "localhost" && !ip.startsWith("10.")) {
      let lanUrl = localUrl;
      if (lanUrl.includes("10.0.2.2")) {
        lanUrl = lanUrl.replace("10.0.2.2", ip);
      } else if (lanUrl.includes("localhost")) {
        lanUrl = lanUrl.replace("localhost", ip);
      } else if (lanUrl.includes("127.0.0.1")) {
        lanUrl = lanUrl.replace("127.0.0.1", ip);
      }

      if (lanUrl !== localUrl) {
        const lanOk = await probeHealth(lanUrl);
        if (lanOk) {
          activeBaseUrl = lanUrl;
          return lanUrl;
        }
      }
    }
  }

  // 3. Fallback ra Render public
  activeBaseUrl = publicUrl;
  return publicUrl;
}
