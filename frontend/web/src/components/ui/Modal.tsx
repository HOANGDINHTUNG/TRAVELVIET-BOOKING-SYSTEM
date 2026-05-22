import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

type ModalProps = {
  open: boolean
  title: ReactNode
  description?: ReactNode
  onClose: () => void
  /** Khi `false`, click backdrop / nhấn Esc sẽ KHÔNG đóng (vd. khi đang submit). */
  dismissable?: boolean
  size?: ModalSize
  footer?: ReactNode
  children: ReactNode
  closeAriaLabel?: string
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

/**
 * Modal generic — render qua portal, có lock scroll body và Esc-to-close.
 * Không phụ thuộc thư viện Headless UI/Radix để giữ bundle nhỏ.
 */
function Modal(props: ModalProps) {
  const dismissable = props.dismissable ?? true

  useEffect(() => {
    if (!props.open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissable) {
        props.onClose()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', handleKey)
    }
  }, [props.open, props, dismissable])

  if (!props.open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissable) {
          props.onClose()
        }
      }}
    >
      <div
        className={`tv-modal-panel flex max-h-[92vh] w-full ${SIZE_CLASS[props.size ?? 'md']} flex-col overflow-hidden rounded-xl bg-card text-foreground shadow-2xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-foreground">
              {props.title}
            </h2>
            {props.description ? (
              <p className="text-xs text-muted-foreground">{props.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={props.onClose}
            disabled={!dismissable}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted disabled:opacity-50"
            aria-label={props.closeAriaLabel ?? 'Close dialog'}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">{props.children}</div>

        {props.footer ? (
          <footer className="tv-modal-footer flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
            {props.footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
