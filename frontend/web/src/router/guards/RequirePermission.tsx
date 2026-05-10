import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import ForbiddenPage from '../../components/error/ForbiddenPage'
import {
  selectPermissions,
  useAuthStore,
} from '../../stores/authStore'

type BasePermissionProps = {
  /** Render khi không thoả mãn permission. Mặc định: render `null` (silent). */
  fallback?: ReactNode
  /** Khi `true`: hiển thị `<ForbiddenPage />` thay vì `null`. */
  showForbidden?: boolean
  /** Children — bắt buộc khi dùng như component bao quanh; nếu dùng cho route, để rỗng để render `<Outlet />`. */
  children?: ReactNode
}

type PermissionProps =
  | (BasePermissionProps & {
      permission: string
      anyOf?: never
      allOf?: never
    })
  | (BasePermissionProps & {
      permission?: never
      anyOf: string[]
      allOf?: never
    })
  | (BasePermissionProps & {
      permission?: never
      anyOf?: never
      allOf: string[]
    })

function evaluate(
  granted: string[],
  required:
    | { kind: 'one'; value: string }
    | { kind: 'any'; value: string[] }
    | { kind: 'all'; value: string[] },
): boolean {
  const grantedSet = new Set(granted)
  switch (required.kind) {
    case 'one':
      return grantedSet.has(required.value)
    case 'any':
      return required.value.some((perm) => grantedSet.has(perm))
    case 'all':
      return required.value.every((perm) => grantedSet.has(perm))
  }
}

/**
 * Lớp guard 3 — gating theo permission (ví dụ `booking.cancel`, `tour.update`).
 *
 * Có thể dùng theo 2 cách:
 *
 * 1. Component bao quanh:
 * ```tsx
 * <RequirePermission permission="booking.cancel" showForbidden>
 *   <CancelButton />
 * </RequirePermission>
 * ```
 *
 * 2. Layout route:
 * ```tsx
 * { element: <RequirePermission anyOf={["booking.view"]} />, children: [...] }
 * ```
 */
function RequirePermission(props: PermissionProps) {
  const granted = useAuthStore(selectPermissions)

  const required: Parameters<typeof evaluate>[1] =
    'permission' in props && props.permission !== undefined
      ? { kind: 'one', value: props.permission }
      : 'anyOf' in props && props.anyOf !== undefined
        ? { kind: 'any', value: props.anyOf }
        : { kind: 'all', value: props.allOf as string[] }

  const allowed = evaluate(granted, required)

  if (!allowed) {
    if (props.showForbidden) {
      const reason =
        required.kind === 'one'
          ? `Yêu cầu quyền: ${required.value}.`
          : required.kind === 'any'
            ? `Yêu cầu một trong các quyền: ${required.value.join(', ')}.`
            : `Yêu cầu đầy đủ các quyền: ${required.value.join(', ')}.`
      return <ForbiddenPage reason={reason} />
    }
    return props.fallback ?? null
  }

  return props.children ?? <Outlet />
}

export default RequirePermission
