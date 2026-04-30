import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Compass,
  Flag,
  MapPinned,
  Plane,
  Stamp,
  Trophy,
} from 'lucide-react'
import {
  loyaltyApi,
  type TravelPassport,
  type UserCheckin,
  type UserMission,
} from '../../../api/server/Loyalty.api'
import { ErrorBlock } from '../../../components/common/ui/ErrorBlock'
import { PageLoader } from '../../../components/common/ux/PageLoader'
import { Footer } from '../../../components/Footer/Footer'
import './PassportPage.css'

type PassportLocale = 'vi' | 'en'

const copyByLocale = {
  vi: {
    loading: 'Dang tai passport...',
    errorTitle: 'Khong the tai passport',
    retry: 'Thu lai',
    backAccount: 'Ve tai khoan',
    kicker: 'Travel Passport',
    title: 'Ho chieu du lich cua ban',
    subtitle:
      'Theo doi diem da di, huy hieu da mo khoa, check-in va nhiem vu thanh vien.',
    passportNo: 'So passport',
    totalTours: 'Tour da di',
    totalDestinations: 'Diem den',
    totalCheckins: 'Check-in',
    lastTrip: 'Chuyen gan nhat',
    badges: 'Huy hieu',
    noBadges: 'Chua mo khoa huy hieu.',
    destinations: 'Diem da ghe tham',
    noDestinations: 'Chua co diem den trong passport.',
    missions: 'Nhiem vu',
    noMissions: 'Chua co nhiem vu.',
    claim: 'Nhan thuong',
    claimed: 'Da nhan',
    expired: 'Het han',
    inProgress: 'Dang lam',
    completed: 'Hoan thanh',
    reward: 'Thuong',
    progress: 'Tien do',
    claimSuccess: 'Da nhan thuong nhiem vu.',
    claimError: 'Khong the nhan thuong.',
    checkins: 'Lich su check-in',
    noCheckins: 'Chua co check-in.',
    booking: 'Booking',
    notUpdated: 'Chua cap nhat',
  },
  en: {
    loading: 'Loading passport...',
    errorTitle: 'Could not load passport',
    retry: 'Retry',
    backAccount: 'Back to account',
    kicker: 'Travel Passport',
    title: 'Your travel passport',
    subtitle:
      'Track visited places, unlocked badges, check-ins, and member missions.',
    passportNo: 'Passport no.',
    totalTours: 'Tours',
    totalDestinations: 'Destinations',
    totalCheckins: 'Check-ins',
    lastTrip: 'Last trip',
    badges: 'Badges',
    noBadges: 'No badges unlocked yet.',
    destinations: 'Visited destinations',
    noDestinations: 'No destination has been added to the passport yet.',
    missions: 'Missions',
    noMissions: 'No missions yet.',
    claim: 'Claim reward',
    claimed: 'Claimed',
    expired: 'Expired',
    inProgress: 'In progress',
    completed: 'Completed',
    reward: 'Reward',
    progress: 'Progress',
    claimSuccess: 'Mission reward claimed.',
    claimError: 'Could not claim reward.',
    checkins: 'Check-in history',
    noCheckins: 'No check-ins yet.',
    booking: 'Booking',
    notUpdated: 'Not updated',
  },
} satisfies Record<PassportLocale, Record<string, string>>

function getLocale(language: string): PassportLocale {
  return language === 'en' ? 'en' : 'vi'
}

function formatDate(value: string | undefined, locale: PassportLocale) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatNumber(value: number | string | undefined) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return '0'
  }

  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(numeric)
}

function getMissionStatusLabel(status: string | undefined, copy: Record<string, string>) {
  if (status === 'COMPLETED') {
    return copy.completed
  }
  if (status === 'CLAIMED') {
    return copy.claimed
  }
  if (status === 'EXPIRED') {
    return copy.expired
  }
  return copy.inProgress
}

function getProgressPercent(mission: UserMission) {
  const progress = Number(mission.progress)
  const goal = Number(mission.goal)
  if (!Number.isFinite(progress) || !Number.isFinite(goal) || goal <= 0) {
    return 0
  }

  return Math.min(100, Math.round((progress / goal) * 100))
}

export default function PassportPage() {
  const { i18n } = useTranslation()
  const locale = getLocale(i18n.language)
  const copy = copyByLocale[locale]
  const [passport, setPassport] = useState<TravelPassport | null>(null)
  const [missions, setMissions] = useState<UserMission[]>([])
  const [checkins, setCheckins] = useState<UserCheckin[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const unlockedBadgeCount = useMemo(
    () => (passport?.badges ?? []).filter((badge) => badge.isActive !== false).length,
    [passport?.badges],
  )

  const loadPassport = async () => {
    setLoading(true)
    setError('')

    try {
      const [passportData, missionData, checkinData] = await Promise.all([
        loyaltyApi.getMyPassport(),
        loyaltyApi.getMyMissions().catch(() => []),
        loyaltyApi.getMyCheckins().catch(() => []),
      ])

      setPassport(passportData)
      setMissions(missionData)
      setCheckins(checkinData)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : copy.errorTitle)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPassport()
  }, [])

  const claimMission = async (missionId: number) => {
    setClaimingId(missionId)
    setMessage('')

    try {
      const updated = await loyaltyApi.claimMission(missionId)
      setMissions((current) =>
        current.map((mission) => (mission.id === updated.id ? updated : mission)),
      )
      setMessage(copy.claimSuccess)
    } catch (claimError) {
      setMessage(claimError instanceof Error ? claimError.message : copy.claimError)
    } finally {
      setClaimingId(null)
    }
  }

  if (loading) {
    return <PageLoader label={copy.loading} />
  }

  if (error) {
    return (
      <main className="passport-error">
        <ErrorBlock title={copy.errorTitle} message={error} />
        <button type="button" onClick={() => void loadPassport()}>
          {copy.retry}
        </button>
      </main>
    )
  }

  return (
    <div className="passport-page">
      <main className="passport-shell">
        <Link className="passport-back-link" to="/account">
          <ArrowLeft aria-hidden="true" />
          {copy.backAccount}
        </Link>

        <section className="passport-hero">
          <div>
            <span>{copy.kicker}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <div className="passport-booklet">
            <Stamp aria-hidden="true" />
            <small>{copy.passportNo}</small>
            <strong>{passport?.passportNo || copy.notUpdated}</strong>
          </div>
        </section>

        <section className="passport-metrics" aria-label="Passport summary">
          <article>
            <Plane aria-hidden="true" />
            <span>{copy.totalTours}</span>
            <strong>{passport?.totalTours ?? 0}</strong>
          </article>
          <article>
            <MapPinned aria-hidden="true" />
            <span>{copy.totalDestinations}</span>
            <strong>{passport?.totalDestinations ?? 0}</strong>
          </article>
          <article>
            <CheckCircle2 aria-hidden="true" />
            <span>{copy.totalCheckins}</span>
            <strong>{passport?.totalCheckins ?? 0}</strong>
          </article>
          <article>
            <Award aria-hidden="true" />
            <span>{copy.badges}</span>
            <strong>{unlockedBadgeCount}</strong>
          </article>
        </section>

        <div className="passport-layout">
          <section className="passport-panel passport-missions-panel">
            <header>
              <div>
                <h2>{copy.missions}</h2>
                <p>{missions.length}</p>
              </div>
              <Trophy aria-hidden="true" />
            </header>

            {missions.length === 0 ? (
              <p className="passport-empty">{copy.noMissions}</p>
            ) : (
              <div className="passport-mission-list">
                {missions.map((mission) => {
                  const percent = getProgressPercent(mission)
                  const canClaim = mission.status === 'COMPLETED'

                  return (
                    <article key={mission.id}>
                      <div className="passport-mission-head">
                        <div>
                          <strong>{mission.mission?.name || mission.mission?.code}</strong>
                          <span>{mission.mission?.description || copy.notUpdated}</span>
                        </div>
                        <small className={`mission-status is-${mission.status?.toLowerCase() || 'in-progress'}`}>
                          {getMissionStatusLabel(mission.status, copy)}
                        </small>
                      </div>
                      <div className="passport-progress">
                        <div style={{ width: `${percent}%` }} />
                      </div>
                      <dl>
                        <div>
                          <dt>{copy.progress}</dt>
                          <dd>
                            {formatNumber(mission.progress)} / {formatNumber(mission.goal)}
                          </dd>
                        </div>
                        <div>
                          <dt>{copy.reward}</dt>
                          <dd>
                            {mission.mission?.rewardType || copy.notUpdated}
                            {mission.mission?.rewardValue
                              ? ` ${formatNumber(mission.mission.rewardValue)}`
                              : ''}
                          </dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        onClick={() => void claimMission(mission.id)}
                        disabled={!canClaim || claimingId === mission.id}
                      >
                        <BadgeCheck aria-hidden="true" />
                        {mission.status === 'CLAIMED' ? copy.claimed : copy.claim}
                      </button>
                    </article>
                  )
                })}
              </div>
            )}

            {message && <p className="passport-message">{message}</p>}
          </section>

          <section className="passport-panel">
            <header>
              <div>
                <h2>{copy.badges}</h2>
                <p>{unlockedBadgeCount}</p>
              </div>
              <Award aria-hidden="true" />
            </header>
            {(passport?.badges ?? []).length === 0 ? (
              <p className="passport-empty">{copy.noBadges}</p>
            ) : (
              <div className="passport-badge-grid">
                {(passport?.badges ?? []).map((badge) => (
                  <article key={badge.passportBadgeId}>
                    <Award aria-hidden="true" />
                    <strong>{badge.badgeName || badge.badgeCode}</strong>
                    <span>{badge.badgeDescription || copy.notUpdated}</span>
                    <small>{formatDate(badge.unlockedAt, locale)}</small>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="passport-secondary-grid">
          <section className="passport-panel">
            <header>
              <div>
                <h2>{copy.destinations}</h2>
                <p>{passport?.totalDestinations ?? 0}</p>
              </div>
              <Compass aria-hidden="true" />
            </header>
            {(passport?.visitedDestinations ?? []).length === 0 ? (
              <p className="passport-empty">{copy.noDestinations}</p>
            ) : (
              <div className="passport-stack-list">
                {(passport?.visitedDestinations ?? []).map((destination) => (
                  <article key={destination.visitedId}>
                    <strong>{destination.destinationName || copy.notUpdated}</strong>
                    <span>{formatDate(destination.lastVisitedAt, locale)}</span>
                    {destination.destinationUuid && (
                      <Link to={`/destinations/${destination.destinationUuid}`}>
                        {destination.destinationSlug || destination.destinationUuid}
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="passport-panel">
            <header>
              <div>
                <h2>{copy.checkins}</h2>
                <p>{checkins.length}</p>
              </div>
              <Flag aria-hidden="true" />
            </header>
            {checkins.length === 0 ? (
              <p className="passport-empty">{copy.noCheckins}</p>
            ) : (
              <div className="passport-stack-list">
                {checkins.map((checkin) => (
                  <article key={checkin.id}>
                    <strong>{checkin.destinationName || copy.notUpdated}</strong>
                    <span>
                      {copy.booking}: {checkin.bookingCode || checkin.bookingId || copy.notUpdated}
                    </span>
                    {checkin.note && <p>{checkin.note}</p>}
                    <small>
                      <Clock3 aria-hidden="true" />
                      {formatDate(checkin.createdAt, locale)}
                    </small>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
