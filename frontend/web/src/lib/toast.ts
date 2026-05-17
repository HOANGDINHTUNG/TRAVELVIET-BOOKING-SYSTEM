import { toast, type ExternalToast } from 'sonner'
import type { TOptions } from 'i18next'

import i18n from './i18n'

/**
 * Wrapper Sonner chuẩn dự án — Phase 3 (UX).
 *
 * Mục tiêu:
 * 1. **Không hardcode chuỗi**: mỗi toast luôn nhận i18n key (BE error code,
 *    user message…). Fallback message khi key không tồn tại để vẫn hiển thị.
 * 2. **Preset thống nhất**: success/info/warning/error/loading/promise có
 *    duration, icon, style đồng bộ với theme dự án.
 * 3. **Promise toast**: gói 1 tác vụ async với 3 trạng thái — không cần lặp
 *    `toast.loading()` + `toast.success()` + `toast.error()` thủ công.
 *
 * Cách dùng:
 * ```ts
 * import { showSuccess, showError, runWithToast } from '@/lib/toast'
 *
 * showSuccess('booking.created', { count: 2 })
 * showError('api.error.500', undefined, { description: err.message })
 *
 * await runWithToast(api.deleteTour(id), {
 *   loadingKey: 'tours.deleting',
 *   successKey: 'tours.deleted',
 *   errorKey: 'tours.deleteFailed',
 * })
 * ```
 */

type ToastKey = string

type SonnerOptions = ExternalToast

type WithDescription = SonnerOptions & {
  description?: string
  descriptionKey?: ToastKey
  descriptionVars?: TOptions
}

/** Resolve i18n key → string. Trả về raw key nếu không có translation. */
function tr(key: ToastKey | undefined, vars?: TOptions): string | undefined {
  if (!key) return undefined
  if (!i18n.isInitialized) return key
  const value = i18n.t(key, vars)
  return typeof value === 'string' ? value : key
}

/** Merge tham số chung + description (key hoặc raw). */
function buildOptions(
  vars: TOptions | undefined,
  opts: WithDescription | undefined,
): SonnerOptions {
  if (!opts) return {}
  const { description, descriptionKey, descriptionVars, ...rest } = opts
  const resolvedDescription =
    description ?? tr(descriptionKey, descriptionVars ?? vars)
  return resolvedDescription
    ? { ...rest, description: resolvedDescription }
    : rest
}

export function showSuccess(
  key: ToastKey,
  vars?: TOptions,
  opts?: WithDescription,
) {
  return toast.success(tr(key, vars) ?? key, buildOptions(vars, opts))
}

export function showError(
  key: ToastKey,
  vars?: TOptions,
  opts?: WithDescription,
) {
  return toast.error(tr(key, vars) ?? key, buildOptions(vars, opts))
}

export function showInfo(
  key: ToastKey,
  vars?: TOptions,
  opts?: WithDescription,
) {
  return toast.info(tr(key, vars) ?? key, buildOptions(vars, opts))
}

export function showWarning(
  key: ToastKey,
  vars?: TOptions,
  opts?: WithDescription,
) {
  return toast.warning(tr(key, vars) ?? key, buildOptions(vars, opts))
}

export function showLoading(
  key: ToastKey,
  vars?: TOptions,
  opts?: WithDescription,
) {
  return toast.loading(tr(key, vars) ?? key, buildOptions(vars, opts))
}

export function dismissToast(id?: string | number) {
  if (id == null) toast.dismiss()
  else toast.dismiss(id)
}

type RunWithToastOptions<TData> = {
  loadingKey?: ToastKey
  successKey?: ToastKey
  errorKey?: ToastKey
  loadingVars?: TOptions
  successVars?: TOptions | ((data: TData) => TOptions | undefined)
  errorVars?: TOptions | ((err: unknown) => TOptions | undefined)
  /** Có message mặc định khi BE/UI không có key. Ưu tiên `errorMessage` của Error. */
  fallbackErrorMessage?: string
  /** Custom render error message từ thrown error. */
  formatError?: (err: unknown) => string | undefined
}

/**
 * Gắn 1 toast lifecycle vào promise — show loading → resolve success / reject error.
 * Trả về promise gốc để caller `await`.
 */
export function runWithToast<TData>(
  promise: Promise<TData>,
  opts: RunWithToastOptions<TData>,
): Promise<TData> {
  const {
    loadingKey,
    successKey,
    errorKey,
    loadingVars,
    successVars,
    errorVars,
    fallbackErrorMessage,
    formatError,
  } = opts

  toast.promise(promise, {
    loading: tr(loadingKey, loadingVars) ?? loadingKey ?? '...',
    success: (data) => {
      const vars =
        typeof successVars === 'function' ? successVars(data) : successVars
      return tr(successKey, vars) ?? successKey ?? ''
    },
    error: (err) => {
      const vars = typeof errorVars === 'function' ? errorVars(err) : errorVars
      return (
        tr(errorKey, vars) ??
        formatError?.(err) ??
        (err instanceof Error ? err.message : undefined) ??
        fallbackErrorMessage ??
        errorKey ??
        'Error'
      )
    },
  })

  return promise
}
