import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './lib/i18n'
import './index.css'
import { AppProviders } from './app/AppProviders.tsx'
import { bootstrapApi } from './app/bootstrapApi'
import { applyApiClientBaseUrl } from './lib/apiClient'
import router from './router'

/** Không chặn first paint quá lâu khi probe API public (tối đa ~1.5s). */
const BOOTSTRAP_RENDER_CAP_MS = 1_500

async function startApp() {
  applyApiClientBaseUrl()

  const bootstrapDone = bootstrapApi()
  await Promise.race([
    bootstrapDone,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, BOOTSTRAP_RENDER_CAP_MS)
    }),
  ])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )

  void bootstrapDone.then(() => applyApiClientBaseUrl())
}

void startApp()
