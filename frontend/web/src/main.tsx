import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './lib/i18n'
import './index.css'
import { AppProviders } from './app/AppProviders.tsx'
import { bootstrapApi } from './app/bootstrapApi'
import router from './router'

async function startApp() {
  await bootstrapApi()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
}

void startApp()
