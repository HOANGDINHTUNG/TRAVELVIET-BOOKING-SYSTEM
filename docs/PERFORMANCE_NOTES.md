# Backend performance notes (application layer)

> SQL/index tuning is tracked separately. This file records **service/API-layer** hotspots and refactor decisions.

## Pillar map

| Area | CACHING | ASYNC | PAYLOAD | OBSERVABILITY |
|------|---------|-------|---------|---------------|
| `TourQueryServiceImpl.searchTours` | `@Cacheable("tours")` — batch media/tags inside cache entry | enrich runs sync in request thread | list caps media/tags | add batch loaders |
| `TourQueryServiceImpl.getTour` | add `@Cacheable("tour-details")` | — | full detail DTO | — |
| `BookingCommandServiceImpl` | booking reads uncached (user-specific) | stats sync → event after commit | `BookingResponse` heavy for lists* | publish async sync |
| `DestinationQueryServiceImpl` | already cached | detail build sync | large detail payload | log on batch count failure |
| `SystemFacade.health` | no long TTL | sync aggregate | — | add latency fields later |
| API failover startup | — | probe blocks startup | — | reuse HttpClient |
| Hikari / Tomcat | — | — | — | pool sizes in Java config — externalize later |

\*Future: `BookingSummaryResponse` for `/bookings/me` if payload audits show bloat.

## Refactors applied — Phase 3 (2026-05, Kubernetes)

1. **Redis rate limit** — `RedisRateLimitBucketStore` + `LettuceBasedProxyManager`; `app.security.rate-limit.store=redis`.
2. **Hybrid cache** — `app.cache.mode=hybrid`: Caffeine L1 + Redis L2 for `tours` / `tour-details`; Pub/Sub `cache:invalidate:tours`.
3. **Redis-only cache** — `app.cache.mode=redis` (no L1).
4. **Async stats eviction** — `TourStatsSyncEventListener` → `TourCacheEvictor.evictAfterStatsSync(tourId)`.
5. **Resilience4j** — `ResilientHttpApiReachabilityProbe` (CB + 3s time limit).
6. **Profile** — `application-k8s.yaml` for cluster defaults.

## Refactors applied — Phase 2 (2026-05)

1. **Tour cache eviction** — `TourCacheEvictor`: `tours` clear all; `tour-details` prefix `{tourId}_` for all locales. Wired in `TourCommandServiceImpl` writes.
2. **BookingSummaryResponse** — `GET /bookings/me` returns slim DTO; detail stays `BookingResponse` on `GET /bookings/{id}`.
3. **Hikari externalized** — `spring.datasource.hikari.*` → `HikariPoolProperties` → `DataSourceFailoverConfig.createHikari`.
4. **Rate limit store** — `RateLimitBucketStore` + `InMemoryRateLimitBucketStore`; Redis via new bean when `store=redis` + `spring-data-redis`.
5. **Parallel health** — `SystemFacade` uses `healthCheckExecutor` + `CompletableFuture` (timeout 5s, per-slice `*DurationMs`).
6. **Async API probe** — `ApiEndpointFailoverStartup` registers LOCAL default, probes on `apiProbeExecutor`.

## Refactors applied — Phase 1 (2026-05)

1. **Tour list N+1** — `findByTourIdIn` batch for media/tags; list view caps (3 media, 8 tags).
2. **Tour detail cache** — Caffeine cache `tour-details`, key `tourId + locale`.
3. **Booking stats sync** — `TourStatsSyncRequestedEvent` + `@TransactionalEventListener(AFTER_COMMIT)` + `@Async("appTaskExecutor")`.
4. **Async executor** — `AppAsyncProperties` / `app.async.*` bounded pool for background work.
5. **Response compression** — `server.compression.*` in `application.yaml`.

## Invalidation (TODO when tour write paths grow)

- On tour/tag/media mutation: `@CacheEvict(value = {"tours", "tour-details"}, allEntries = true)` or key-based eviction.
- Booking mutations: evict user booking list cache if introduced.

## LRU / hot-user caching (not implemented)

For RAM limits, consider Caffeine `maximumSize` + optional Redis for `tours` search keys; segment by `userId` activity score (top 10–15% TTL boost) only if metrics show repeat reads.
