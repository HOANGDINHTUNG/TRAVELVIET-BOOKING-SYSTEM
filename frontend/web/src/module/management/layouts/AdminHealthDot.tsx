import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiClient } from '../../../lib/apiClient'

type HealthState = 'ok' | 'fail' | 'idle'

/**
 * Đèn trạng thái API (GET /system/health — public).
 * Không chặn UI; chỉ hiển thị góc header.
 */
export default function AdminHealthDot() {
  const { t } = useTranslation('management')
  const [state, setState] = useState<HealthState>('idle')

  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      try {
        await apiClient.get('system/health')
        if (!cancelled) setState('ok')
      } catch {
        if (!cancelled) setState('fail')
      }
    }
    void ping()
    const id = window.setInterval(() => void ping(), 90_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const color =
    state === 'ok'
      ? 'bg-emerald-500 shadow-[0_0_0_2px_color-mix(in_srgb,var(--admin-surface)_90%,transparent)]'
      : state === 'fail'
        ? 'bg-rose-500 shadow-[0_0_0_2px_color-mix(in_srgb,var(--admin-surface)_90%,transparent)]'
        : 'bg-[var(--admin-muted)] opacity-60'

  const title =
    state === 'ok'
      ? t('adminShell.health.ok')
      : state === 'fail'
        ? t('adminShell.health.fail')
        : t('adminShell.health.checking')

  return (
    <span
      className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
      title={String(title)}
      aria-label={String(title)}
      role="status"
    />
  )
}
