import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import Modal from './Modal'

type ConfirmDialogProps = {
  open: boolean
  title: ReactNode
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  isPending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog(props: ConfirmDialogProps) {
  const { t } = useTranslation('management')
  const variant = props.variant ?? 'danger'
  const confirmClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700'
      : 'bg-[var(--color-primary,#0ea5e9)] hover:opacity-90'

  return (
    <Modal
      open={props.open}
      title={props.title}
      onClose={props.onCancel}
      dismissable={!props.isPending}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={props.onCancel}
            disabled={props.isPending}
            className="tv-confirm-btn-secondary rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {props.cancelLabel ??
              String(t('common.cancel', { defaultValue: 'Huỷ' }))}
          </button>
          <button
            type="button"
            onClick={props.onConfirm}
            disabled={props.isPending}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50 ${confirmClass}`}
          >
            {props.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {props.confirmLabel ??
              String(t('common.confirm', { defaultValue: 'Xác nhận' }))}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{props.message}</p>
    </Modal>
  )
}

export default ConfirmDialog
