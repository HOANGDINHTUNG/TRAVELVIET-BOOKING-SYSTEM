# AI Chat Setup

## Endpoint

With the current Spring Boot configuration:

- `server.port=8088`
- `server.servlet.context-path=/api/v1`

the AI chat endpoint is:

```http
POST http://localhost:8088/api/v1/ai/chat
```

The controller path inside Spring is `/ai/chat`. If the deployment must expose exactly `/api/ai/chat`, add a reverse proxy rule or change the global context path carefully because existing APIs currently depend on `/api/v1`.

## Gemini Key

Set the key only in backend environment variables:

```bash
GEMINI_API_KEY=your_real_gemini_api_key_here
```

Do not put Gemini keys in Vite, Expo, React, or React Native environment files.

## No Data Behavior

When backend services cannot find matching data, the AI flow returns:

```text
Hiện hệ thống chưa có dữ liệu phù hợp cho câu hỏi này.
```

The backend does not call Gemini for no-data cases.

## Current Data Coverage

The first implementation is wired to the real services that exist in this codebase:

- Tours: `TourQueryService`
- Destinations: `DestinationQueryService`
- Bookings: `BookingQueryService`, only for authenticated users
- Support request guidance: backend-owned public support context

These intents are intentionally routed to the safe no-data response until their real modules/services exist in the backend:

- Order tracking
- Shipment tracking
- SmartBox status
- Sensor status

Do not add mock data for these flows. When the real services are added, extend `AiDataProvider` to call them directly and format only the fields that are safe to send into the Gemini prompt.

## Frontend URLs

Web uses `VITE_API_BASE_URL`, for example:

```bash
VITE_API_BASE_URL=http://localhost:8088/api/v1
```

Mobile uses `EXPO_PUBLIC_API_URL`, for example:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8088/api/v1
```

Neither frontend environment file should contain `GEMINI_API_KEY` or any Gemini API key value.
