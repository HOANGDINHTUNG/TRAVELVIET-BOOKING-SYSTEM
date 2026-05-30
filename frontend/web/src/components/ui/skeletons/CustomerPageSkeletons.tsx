import type { CustomerPageHeroVariant } from '../CustomerPageHero/CustomerPageHero'
import { PageSkeletonBlock } from './PageSkeletonBlock'

import './CustomerPageSkeletons.css'

function CustomerPageHeroSkeleton({
  variant = 'ocean',
  withAvatar = false,
}: {
  variant?: CustomerPageHeroVariant
  withAvatar?: boolean
}) {
  return (
    <section
      className={`cph-sk cph-sk--${variant}${withAvatar ? ' cph-sk--with-avatar' : ''}`}
      aria-hidden
    >
      <div className="cph-sk__inner">
        <div>
          <PageSkeletonBlock className="cph-sk__kicker psb" as="div" />
          <PageSkeletonBlock className="cph-sk__title psb" as="div" />
          <PageSkeletonBlock className="cph-sk__lead psb" as="div" />
          <div className="cph-sk__metrics">
            {Array.from({ length: 4 }, (_, i) => (
              <PageSkeletonBlock key={i} className="cph-sk__metric psb" as="div" />
            ))}
          </div>
        </div>
        {withAvatar ? <PageSkeletonBlock className="cph-sk__avatar psb" as="div" /> : null}
      </div>
    </section>
  )
}

export function AccountPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="teal" withAvatar />
      <div className="account-sk-shell" aria-busy="true" aria-label="Đang tải tài khoản">
        <div className="account-sk-metric-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <PageSkeletonBlock key={i} className="account-sk-metric psb" as="div" />
          ))}
        </div>
        <div className="account-sk-layout">
          <div className="account-sk-panel">
            <PageSkeletonBlock className="account-sk-panel-head psb" as="div" />
            {Array.from({ length: 5 }, (_, i) => (
              <PageSkeletonBlock key={i} className="account-sk-field psb" as="div" />
            ))}
            <PageSkeletonBlock className="account-sk-btn psb" as="div" />
          </div>
          <div className="account-sk-panel">
            <PageSkeletonBlock className="account-sk-panel-head psb" as="div" />
            {Array.from({ length: 4 }, (_, i) => (
              <PageSkeletonBlock key={i} className="account-sk-field psb" as="div" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function MyBookingsPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="ocean" />
      <div className="mybk-page" aria-busy="true" aria-label="Đang tải đơn đặt">
        <div className="mybk-inner">
          <div className="mybk-sk-filters">
            {Array.from({ length: 5 }, (_, i) => (
              <PageSkeletonBlock key={i} className="mybk-sk-chip psb" as="div" />
            ))}
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <div className="mybk-sk-card" key={i}>
              <div className="mybk-sk-card-top">
                <PageSkeletonBlock className="mybk-sk-line-lg psb" as="div" />
                <PageSkeletonBlock className="mybk-sk-line-sm psb" as="div" />
              </div>
              <PageSkeletonBlock className="mybk-sk-line psb" as="div" />
              <PageSkeletonBlock className="mybk-sk-line psb" as="div" />
              <div className="mybk-sk-actions">
                <PageSkeletonBlock className="mybk-sk-btn psb" as="div" />
                <PageSkeletonBlock className="mybk-sk-btn psb" as="div" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function BookingDetailPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="teal" />
      <div className="booking-detail-sk" aria-busy="true" aria-label="Đang tải booking">
        <PageSkeletonBlock className="psb" style={{ width: 140, height: 14, marginBottom: 16 }} as="div" />
        <div className="booking-detail-sk-grid">
          <PageSkeletonBlock className="booking-detail-sk-card psb" as="div" />
          <PageSkeletonBlock className="booking-detail-sk-card psb" as="div" />
        </div>
        <PageSkeletonBlock
          className="psb"
          style={{ width: '100%', height: 180, marginTop: 16, borderRadius: 14 }}
          as="div"
        />
      </div>
    </>
  )
}

export function SupportCenterPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="sunset" />
      <div className="support-sk-shell" aria-busy="true" aria-label="Đang tải hỗ trợ">
        <PageSkeletonBlock className="psb" style={{ width: 120, height: 14, marginBottom: 16 }} as="div" />
        <div className="support-sk-layout">
          <div className="support-sk-panel">
            <PageSkeletonBlock className="psb" style={{ width: 100, height: 16, marginBottom: 12 }} as="div" />
            {Array.from({ length: 4 }, (_, i) => (
              <PageSkeletonBlock key={i} className="support-sk-session psb" as="div" />
            ))}
          </div>
          <div className="support-sk-panel">
            <PageSkeletonBlock className="psb" style={{ width: 120, height: 16, marginBottom: 12 }} as="div" />
            <PageSkeletonBlock className="psb" style={{ width: '100%', height: 220, borderRadius: 12 }} as="div" />
          </div>
        </div>
      </div>
    </>
  )
}

export function PassportPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="sunset" />
      <div className="account-sk-shell" aria-busy="true" aria-label="Đang tải passport">
        <div className="account-sk-layout">
          <div className="account-sk-panel">
            <PageSkeletonBlock className="account-sk-panel-head psb" as="div" />
            {Array.from({ length: 6 }, (_, i) => (
              <PageSkeletonBlock key={i} className="account-sk-field psb" as="div" />
            ))}
          </div>
          <div className="account-sk-panel">
            <PageSkeletonBlock className="account-sk-panel-head psb" as="div" />
            {Array.from({ length: 5 }, (_, i) => (
              <PageSkeletonBlock key={i} className="support-sk-session psb" as="div" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function ScheduleChatPageSkeleton() {
  return (
    <>
      <CustomerPageHeroSkeleton variant="ocean" />
      <div className="support-sk-shell" aria-busy="true" aria-label="Đang tải chat">
        <PageSkeletonBlock className="psb" style={{ width: 120, height: 14, marginBottom: 16 }} as="div" />
        <PageSkeletonBlock className="psb" style={{ width: '100%', height: 360, borderRadius: 14 }} as="div" />
      </div>
    </>
  )
}

export function ManagementContentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mgmt-sk-grid" aria-busy="true" aria-label="Đang tải dữ liệu quản trị">
      {Array.from({ length: count }, (_, i) => (
        <article className="mgmt-sk-card" key={i}>
          <PageSkeletonBlock className="mgmt-sk-media psb" as="div" />
          <div className="mgmt-sk-body">
            <PageSkeletonBlock className="psb" style={{ width: '80%', height: 16, marginBottom: 8 }} as="div" />
            <PageSkeletonBlock className="psb" style={{ width: '100%', height: 12, marginBottom: 6 }} as="div" />
            <PageSkeletonBlock className="psb" style={{ width: '60%', height: 12 }} as="div" />
          </div>
        </article>
      ))}
    </div>
  )
}
