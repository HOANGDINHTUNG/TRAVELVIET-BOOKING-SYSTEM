import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isAxiosError } from 'axios'
import { Activity, Loader2, Play, RotateCcw } from 'lucide-react'
import { apiClient, getApiBaseUrl } from '../../../lib/apiClient'
import { API_PROBE_PRESETS, type ApiProbePreset } from '../config/apiProbePresets'

type RowStatus = 'idle' | 'loading' | 'done'

type ProbeRowState = {
  status: RowStatus
  httpStatus?: number
  ms?: number
  detail?: string
}

function initialRowMap(): Record<string, ProbeRowState> {
  return Object.fromEntries(API_PROBE_PRESETS.map((p) => [p.id, { status: 'idle' as const }]))
}

function formatParams(params: ApiProbePreset['params']): string {
  if (!params || Object.keys(params).length === 0) return ''
  return new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString()
}

function buildUrl(preset: ApiProbePreset): string {
  const q = formatParams(preset.params)
  return q ? `${preset.path}?${q}` : preset.path
}

export default function ManagementApiProbePage() {
  const { t } = useTranslation('management')
  const [rows, setRows] = useState<Record<string, ProbeRowState>>(() => initialRowMap())
  const [bulkRunning, setBulkRunning] = useState(false)

  const runOne = useCallback(async (preset: ApiProbePreset) => {
    setRows((prev) => ({
      ...prev,
      [preset.id]: { status: 'loading' },
    }))
    const started = performance.now()
    try {
      const res = await apiClient.get(preset.path, {
        params: preset.params,
        validateStatus: () => true,
        timeout: 15_000,
      })
      const ms = Math.round(performance.now() - started)
      let detail = ''
      try {
        const snippet = JSON.stringify(res.data)
        detail = snippet.length > 220 ? `${snippet.slice(0, 220)}…` : snippet
      } catch {
        detail = ''
      }
      setRows((prev) => ({
        ...prev,
        [preset.id]: {
          status: 'done',
          httpStatus: res.status,
          ms,
          detail: detail || undefined,
        },
      }))
    } catch (err) {
      const ms = Math.round(performance.now() - started)
      let detail = t('apiProbe.networkError')
      if (isAxiosError(err)) {
        if (err.response?.status != null) {
          detail = `${err.response.status} — ${String(err.message)}`
        } else {
          detail = String(err.message || t('apiProbe.networkError'))
        }
      }
      setRows((prev) => ({
        ...prev,
        [preset.id]: {
          status: 'done',
          httpStatus: isAxiosError(err) ? err.response?.status : undefined,
          ms,
          detail,
        },
      }))
    }
  }, [t])

  const runAll = useCallback(async () => {
    setBulkRunning(true)
    try {
      for (const preset of API_PROBE_PRESETS) {
        await runOne(preset)
      }
    } finally {
      setBulkRunning(false)
    }
  }, [runOne])

  const reset = useCallback(() => {
    setRows(initialRowMap())
  }, [])

  const presets = useMemo(() => API_PROBE_PRESETS, [])

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[var(--admin-primary)]">
          <Activity className="h-6 w-6" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
            {String(t('apiProbe.kicker'))}
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">
          {String(t('apiProbe.title'))}
        </h1>
        <p className="max-w-3xl text-sm text-[var(--admin-muted)]">{String(t('apiProbe.subtitle'))}</p>
        <p className="font-mono text-[11px] text-[var(--admin-muted)]">
          <span className="font-sans font-medium text-[var(--admin-text)]">
            {String(t('apiProbe.baseUrlLabel'))}
          </span>{' '}
          {getApiBaseUrl()}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={bulkRunning}
          onClick={() => void runAll()}
          className="inline-flex items-center gap-2 rounded-[var(--admin-radius)] bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-92 disabled:opacity-50 dark:text-[#1a1d21]"
        >
          {bulkRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Play className="h-4 w-4" aria-hidden />
          )}
          {String(t('apiProbe.runAll'))}
        </button>
        <button
          type="button"
          disabled={bulkRunning}
          onClick={reset}
          className="admin-icon-btn inline-flex items-center gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] px-3 py-2 text-sm font-semibold text-[var(--admin-text)] disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {String(t('apiProbe.reset'))}
        </button>
      </div>

      <div className="admin-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--admin-border)] text-sm">
            <thead className="bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))] text-[10px] uppercase tracking-wide text-[var(--admin-muted)]">
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-semibold">
                  {String(t('apiProbe.col.probe'))}
                </th>
                <th scope="col" className="px-4 py-2 text-left font-semibold">
                  {String(t('apiProbe.col.request'))}
                </th>
                <th scope="col" className="px-4 py-2 text-left font-semibold">
                  {String(t('apiProbe.col.result'))}
                </th>
                <th scope="col" className="px-4 py-2 text-right font-semibold">
                  {String(t('apiProbe.col.action'))}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)] text-[var(--admin-text)]">
              {presets.map((preset) => {
                const state = rows[preset.id] ?? { status: 'idle' as const }
                const url = buildUrl(preset)
                const badge =
                  state.status === 'done' && state.httpStatus != null ? (
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                        state.httpStatus >= 200 && state.httpStatus < 300
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                          : state.httpStatus === 401 || state.httpStatus === 403
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100'
                            : state.httpStatus === 404
                              ? 'bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-100'
                              : 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100'
                      }`}
                    >
                      HTTP {state.httpStatus}
                    </span>
                  ) : state.status === 'loading' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--admin-muted)]">
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      {String(t('apiProbe.running'))}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--admin-muted)]">—</span>
                  )

                return (
                  <tr key={preset.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--admin-text)]">
                        {String(t(`apiProbe.probes.${preset.id}.label`))}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-[var(--admin-muted)]">
                        {String(t(`apiProbe.probes.${preset.id}.hint`))}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--admin-muted)]">
                      <div className="text-[var(--admin-text)]">{preset.method}</div>
                      <div className="break-all">{url}</div>
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      <div className="flex flex-wrap items-center gap-2">
                        {badge}
                        {state.ms != null ? (
                          <span className="tabular-nums text-[var(--admin-muted)]">
                            {state.ms}
                            ms
                          </span>
                        ) : null}
                      </div>
                      {state.detail ? (
                        <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-all rounded-md bg-[color-mix(in_srgb,var(--admin-muted)_10%,var(--admin-surface))] p-2 text-[10px] text-[var(--admin-text)]">
                          {state.detail}
                        </pre>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={bulkRunning || state.status === 'loading'}
                        onClick={() => void runOne(preset)}
                        className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--admin-primary)] hover:bg-[color-mix(in_srgb,var(--admin-primary)_8%,var(--admin-surface))] disabled:opacity-50"
                      >
                        {String(t('apiProbe.runOne'))}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
