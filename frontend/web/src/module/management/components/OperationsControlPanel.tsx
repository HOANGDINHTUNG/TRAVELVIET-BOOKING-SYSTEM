import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  BellPlus,
  CreditCard,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { notificationApi } from '../../../api/server/Notification.api'
import {
  paymentApi,
  type Payment,
  type Refund,
} from '../../../api/server/Payment.api'

type RefundForm = {
  bookingId: string
  requestedBy: string
  reasonType: string
  reasonDetail: string
  requestedAmount: string
}

type NotificationForm = {
  userId: string
  notificationType: string
  channel: string
  title: string
  body: string
  referenceType: string
  referenceId: string
  payload: string
}

const notificationTypes = [
  'BOOKING',
  'PAYMENT',
  'WEATHER',
  'PROMOTION',
  'SCHEDULE_CHANGE',
  'REMINDER',
  'SYSTEM',
  'CHAT',
  'SUPPORT',
  'DESTINATION_FOLLOW',
]

const notificationChannels = ['IN_APP', 'PUSH', 'EMAIL', 'SMS']

function formatMoney(value: number | string | undefined) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '-'
  }

  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(amount)} VND`
}

function parsePositiveNumber(value: string) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null
}

type OperationsControlPanelProps = {
  enableNotification?: boolean
}

export default function OperationsControlPanel({
  enableNotification = true,
}: OperationsControlPanelProps) {
  const [paymentId, setPaymentId] = useState('')
  const [refundId, setRefundId] = useState('')
  const [approveAmount, setApproveAmount] = useState('')
  const [payment, setPayment] = useState<Payment | null>(null)
  const [refund, setRefund] = useState<Refund | null>(null)
  const [refundForm, setRefundForm] = useState<RefundForm>({
    bookingId: '',
    requestedBy: '',
    reasonType: 'customer_request',
    reasonDetail: '',
    requestedAmount: '',
  })
  const [notificationForm, setNotificationForm] = useState<NotificationForm>({
    userId: '',
    notificationType: 'SYSTEM',
    channel: 'IN_APP',
    title: '',
    body: '',
    referenceType: '',
    referenceId: '',
    payload: '',
  })
  const [working, setWorking] = useState('')
  const [message, setMessage] = useState('')

  const lookupPayment = async () => {
    const id = Number(paymentId)
    if (!Number.isFinite(id) || id <= 0) {
      return
    }

    setWorking('payment')
    setMessage('')

    try {
      setPayment(await paymentApi.getById(id))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai payment.')
    } finally {
      setWorking('')
    }
  }

  const lookupRefund = async () => {
    const id = Number(refundId)
    if (!Number.isFinite(id) || id <= 0) {
      return
    }

    setWorking('refund')
    setMessage('')

    try {
      const data = await paymentApi.getRefund(id)
      setRefund(data)
      setApproveAmount(String(data.requestedAmount ?? ''))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai refund.')
    } finally {
      setWorking('')
    }
  }

  const createRefund = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const bookingId = Number(refundForm.bookingId)
    const requestedAmount = parsePositiveNumber(refundForm.requestedAmount)

    if (!Number.isFinite(bookingId) || bookingId <= 0 || !requestedAmount) {
      setMessage('Booking ID va so tien refund phai hop le.')
      return
    }

    setWorking('create-refund')
    setMessage('')

    try {
      const created = await paymentApi.createRefund({
        bookingId,
        requestedAmount,
        requestedBy: refundForm.requestedBy.trim() || undefined,
        reasonType: refundForm.reasonType.trim() || undefined,
        reasonDetail: refundForm.reasonDetail.trim() || undefined,
      })
      setRefund(created)
      setRefundId(String(created.id))
      setApproveAmount(String(created.requestedAmount ?? requestedAmount))
      setMessage('Da tao refund request.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tao refund.')
    } finally {
      setWorking('')
    }
  }

  const approveRefund = async () => {
    if (!refund?.id) {
      return
    }

    const approvedAmount = parsePositiveNumber(approveAmount)
    if (!approvedAmount) {
      setMessage('So tien approve phai lon hon 0.')
      return
    }

    setWorking('approve-refund')
    setMessage('')

    try {
      const updated = await paymentApi.approveRefund(refund.id, { approvedAmount })
      setRefund(updated)
      setMessage('Da approve refund.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the approve refund.')
    } finally {
      setWorking('')
    }
  }

  const sendNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!notificationForm.userId.trim() || !notificationForm.title.trim() || !notificationForm.body.trim()) {
      setMessage('Notification can userId, title va body.')
      return
    }

    const referenceId = notificationForm.referenceId
      ? Number(notificationForm.referenceId)
      : undefined

    setWorking('notification')
    setMessage('')

    try {
      await notificationApi.createAdminNotification({
        userId: notificationForm.userId.trim(),
        notificationType: notificationForm.notificationType,
        channel: notificationForm.channel || undefined,
        title: notificationForm.title.trim(),
        body: notificationForm.body.trim(),
        referenceType: notificationForm.referenceType.trim() || undefined,
        referenceId: Number.isFinite(referenceId) ? referenceId : undefined,
        payload: notificationForm.payload.trim() || undefined,
      })
      setNotificationForm((current) => ({
        ...current,
        title: '',
        body: '',
        referenceType: '',
        referenceId: '',
        payload: '',
      }))
      setMessage('Da gui notification.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the gui notification.')
    } finally {
      setWorking('')
    }
  }

  return (
    <section className="mgmt-ops-desk" id="operations-control">
      <header className="mgmt-ops-head">
        <div>
          <p className="mgmt-kicker">OPERATIONS CONTROL</p>
          <h3>Payment, refund va notification thao tac nhanh</h3>
          <p>
            Backend hien co payment/refund theo ID va notification create. Panel
            nay gom cac thao tac van hanh phu hop voi API dang co.
          </p>
        </div>
        <div className="mgmt-ops-summary">
          <span>
            <CreditCard aria-hidden="true" />
            Payment lookup
          </span>
          <span>
            <RotateCcw aria-hidden="true" />
            Refund flow
          </span>
          <span>
            <BellPlus aria-hidden="true" />
            Admin notification
          </span>
        </div>
      </header>

      <div className="mgmt-ops-grid">
        <article className="mgmt-ops-card">
          <header>
            <CreditCard aria-hidden="true" />
            <h4>Payment detail</h4>
          </header>
          <div className="mgmt-ops-inline-form">
            <label>
              <span>Payment ID</span>
              <input
                value={paymentId}
                onChange={(event) => setPaymentId(event.target.value)}
              />
            </label>
            <button type="button" onClick={() => void lookupPayment()} disabled={working === 'payment'}>
              <Search aria-hidden="true" />
              Tra cuu
            </button>
          </div>
          {payment && (
            <dl className="mgmt-ops-result">
              <div>
                <dt>Code</dt>
                <dd>{payment.paymentCode || payment.id}</dd>
              </div>
              <div>
                <dt>Booking</dt>
                <dd>{payment.bookingId}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{formatMoney(payment.amount)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{payment.status || '-'}</dd>
              </div>
            </dl>
          )}
        </article>

        <article className="mgmt-ops-card">
          <header>
            <RotateCcw aria-hidden="true" />
            <h4>Refund lookup / approve</h4>
          </header>
          <div className="mgmt-ops-inline-form">
            <label>
              <span>Refund ID</span>
              <input
                value={refundId}
                onChange={(event) => setRefundId(event.target.value)}
              />
            </label>
            <button type="button" onClick={() => void lookupRefund()} disabled={working === 'refund'}>
              <Search aria-hidden="true" />
              Tra cuu
            </button>
          </div>
          {refund && (
            <>
              <dl className="mgmt-ops-result">
                <div>
                  <dt>Code</dt>
                  <dd>{refund.refundCode || refund.id}</dd>
                </div>
                <div>
                  <dt>Booking</dt>
                  <dd>{refund.bookingId}</dd>
                </div>
                <div>
                  <dt>Requested</dt>
                  <dd>{formatMoney(refund.requestedAmount)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{refund.status || '-'}</dd>
                </div>
              </dl>
              <div className="mgmt-ops-inline-form">
                <label>
                  <span>Approved amount</span>
                  <input
                    value={approveAmount}
                    onChange={(event) => setApproveAmount(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void approveRefund()}
                  disabled={working === 'approve-refund'}
                >
                  <ShieldCheck aria-hidden="true" />
                  Approve
                </button>
              </div>
            </>
          )}
        </article>

        <article className="mgmt-ops-card">
          <header>
            <RefreshCcw aria-hidden="true" />
            <h4>Create refund</h4>
          </header>
          <form className="mgmt-ops-form" onSubmit={createRefund}>
            <label>
              <span>Booking ID</span>
              <input
                value={refundForm.bookingId}
                onChange={(event) =>
                  setRefundForm((current) => ({ ...current, bookingId: event.target.value }))
                }
              />
            </label>
            <label>
              <span>Requested amount</span>
              <input
                value={refundForm.requestedAmount}
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    requestedAmount: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>Requested by</span>
              <input
                value={refundForm.requestedBy}
                onChange={(event) =>
                  setRefundForm((current) => ({ ...current, requestedBy: event.target.value }))
                }
              />
            </label>
            <label>
              <span>Reason type</span>
              <input
                value={refundForm.reasonType}
                onChange={(event) =>
                  setRefundForm((current) => ({ ...current, reasonType: event.target.value }))
                }
              />
            </label>
            <label className="mgmt-ops-wide">
              <span>Reason detail</span>
              <textarea
                rows={3}
                value={refundForm.reasonDetail}
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    reasonDetail: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit" disabled={working === 'create-refund'}>
              Tao refund
            </button>
          </form>
        </article>

        {enableNotification && (
          <article className="mgmt-ops-card">
            <header>
              <BellPlus aria-hidden="true" />
              <h4>Send notification</h4>
            </header>
            <form className="mgmt-ops-form" onSubmit={sendNotification}>
              <label>
                <span>User ID</span>
                <input
                  value={notificationForm.userId}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, userId: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Type</span>
                <select
                  value={notificationForm.notificationType}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      notificationType: event.target.value,
                    }))
                  }
                >
                  {notificationTypes.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Channel</span>
                <select
                  value={notificationForm.channel}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, channel: event.target.value }))
                  }
                >
                  {notificationChannels.map((channel) => (
                    <option value={channel} key={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Reference ID</span>
                <input
                  value={notificationForm.referenceId}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      referenceId: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="mgmt-ops-wide">
                <span>Title</span>
                <input
                  value={notificationForm.title}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </label>
              <label className="mgmt-ops-wide">
                <span>Body</span>
                <textarea
                  rows={3}
                  value={notificationForm.body}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, body: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Reference type</span>
                <input
                  value={notificationForm.referenceType}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      referenceType: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>Payload JSON</span>
                <input
                  value={notificationForm.payload}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, payload: event.target.value }))
                  }
                />
              </label>
              <button type="submit" disabled={working === 'notification'}>
                Gui notification
              </button>
            </form>
          </article>
        )}
      </div>

      {message && <p className="mgmt-ops-message">{message}</p>}
    </section>
  )
}
