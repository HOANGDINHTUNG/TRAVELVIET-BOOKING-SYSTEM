import { OptimizedImage } from '@/components/common/media/OptimizedImage'
import { BRAND_LOGO_SRC } from '@/constants/brandAssets'
import './FlightHoldExpiredModal.css'

type FlightHoldExpiredModalProps = {
  onSelectAgain: () => void
}

export function FlightHoldExpiredModal({ onSelectAgain }: FlightHoldExpiredModalProps) {
  return (
    <div
      className="fc-hold-expired-backdrop"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fc-hold-expired-title"
      aria-describedby="fc-hold-expired-desc"
    >
      <div className="fc-hold-expired-modal">
        <div className="fc-hold-expired-modal__art" aria-hidden>
          <OptimizedImage
            src={BRAND_LOGO_SRC}
            alt=""
            width={120}
            height={120}
            cloudinaryWidth={240}
            className="fc-hold-expired-modal__mascot"
          />
        </div>
        <h2 id="fc-hold-expired-title" className="fc-hold-expired-modal__title">
          Thời gian giữ chỗ đã hết hạn
        </h2>
        <p id="fc-hold-expired-desc" className="fc-hold-expired-modal__desc">
          Đã hết thời gian giữ chỗ của chuyến bay này, quý khách vui lòng chọn lại để tránh gặp sự cố hết vé
        </p>
        <button type="button" className="fc-hold-expired-modal__cta" onClick={onSelectAgain}>
          Chọn lại chuyến bay
        </button>
      </div>
    </div>
  )
}
