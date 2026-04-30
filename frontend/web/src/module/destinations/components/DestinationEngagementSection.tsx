import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Bell,
  BellOff,
  CheckCircle2,
  MapPinned,
  Navigation,
  Plus,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  destinationApi,
  type DestinationFollow,
  type DestinationFollowPayload,
} from '../../../api/server/Destination.api'
import { weatherApi, type RouteEstimate } from '../../../api/server/Weather.api'
import { getStoredAccessToken } from '../../../utils/authSessionStorage'
import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from '../utils/destinationDetailCopy'

type DestinationEngagementSectionProps = {
  detail: DestinationDetail
  copy: DestinationDetailCopy
  locale: 'vi' | 'en'
}

type FollowSettings = Required<DestinationFollowPayload>

type ProposalForm = {
  name: string
  province: string
  district: string
  region: string
  address: string
  shortDescription: string
  bestTimeFromMonth: string
  bestTimeToMonth: string
  crowdLevelDefault: string
}

const defaultFollowSettings: FollowSettings = {
  notifyEvent: true,
  notifyVoucher: true,
  notifyNewTour: true,
  notifyBestSeason: true,
}

function getText(locale: 'vi' | 'en') {
  if (locale === 'en') {
    return {
      kicker: 'Trip signals',
      title: 'Follow, propose, and route planning',
      followTitle: 'Destination follow',
      followCopy: 'Save this destination and choose what TravelViet should notify you about.',
      loginToFollow: 'Sign in to follow',
      follow: 'Follow destination',
      unfollow: 'Unfollow',
      saveSettings: 'Save settings',
      notifyEvent: 'Events',
      notifyVoucher: 'Vouchers',
      notifyNewTour: 'New tours',
      notifyBestSeason: 'Best season',
      followed: 'You are following this destination.',
      followSaved: 'Follow settings saved.',
      followRemoved: 'Destination removed from follows.',
      proposeTitle: 'Propose a new destination',
      proposeCopy: 'Send a candidate destination to the content team for review.',
      proposeName: 'Destination name',
      province: 'Province',
      district: 'District',
      region: 'Region',
      address: 'Address',
      shortDescription: 'Short description',
      fromMonth: 'From month',
      toMonth: 'To month',
      crowd: 'Crowd level',
      submitProposal: 'Submit proposal',
      proposalSaved: 'Proposal submitted for review.',
      routeTitle: 'Route estimates',
      fromLabel: 'From',
      toLabel: 'To',
      searchRoutes: 'Search routes',
      noRoutes: 'No route estimate yet.',
      distance: 'Distance',
      duration: 'Duration',
      minutes: 'min',
      openMap: 'Open map',
      error: 'Could not process the request.',
    }
  }

  return {
    kicker: 'Tin hieu chuyen di',
    title: 'Theo doi, de xuat va uoc tinh tuyen duong',
    followTitle: 'Theo doi diem den',
    followCopy: 'Luu diem den va chon loai thong bao TravelViet se gui cho ban.',
    loginToFollow: 'Dang nhap de theo doi',
    follow: 'Theo doi diem den',
    unfollow: 'Bo theo doi',
    saveSettings: 'Luu cai dat',
    notifyEvent: 'Su kien',
    notifyVoucher: 'Voucher',
    notifyNewTour: 'Tour moi',
    notifyBestSeason: 'Mua dep',
    followed: 'Ban dang theo doi diem den nay.',
    followSaved: 'Da luu cai dat theo doi.',
    followRemoved: 'Da bo theo doi diem den.',
    proposeTitle: 'De xuat diem den moi',
    proposeCopy: 'Gui diem den tiem nang de doi noi dung xem xet.',
    proposeName: 'Ten diem den',
    province: 'Tinh/Thanh',
    district: 'Quan/Huyen',
    region: 'Vung mien',
    address: 'Dia chi',
    shortDescription: 'Mo ta ngan',
    fromMonth: 'Tu thang',
    toMonth: 'Den thang',
    crowd: 'Muc dong',
    submitProposal: 'Gui de xuat',
    proposalSaved: 'Da gui de xuat cho admin duyet.',
    routeTitle: 'Uoc tinh tuyen duong',
    fromLabel: 'Tu',
    toLabel: 'Den',
    searchRoutes: 'Tim tuyen',
    noRoutes: 'Chua co uoc tinh tuyen duong.',
    distance: 'Khoang cach',
    duration: 'Thoi gian',
    minutes: 'phut',
    openMap: 'Mo ban do',
    error: 'Khong the xu ly yeu cau.',
  }
}

function toSettings(follow: DestinationFollow | null): FollowSettings {
  return {
    notifyEvent: follow?.notifyEvent ?? defaultFollowSettings.notifyEvent,
    notifyVoucher: follow?.notifyVoucher ?? defaultFollowSettings.notifyVoucher,
    notifyNewTour: follow?.notifyNewTour ?? defaultFollowSettings.notifyNewTour,
    notifyBestSeason: follow?.notifyBestSeason ?? defaultFollowSettings.notifyBestSeason,
  }
}

function formatNumber(value: number | string | undefined) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return '0'
  }

  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(numeric)
}

export function DestinationEngagementSection({
  detail,
  copy,
  locale,
}: DestinationEngagementSectionProps) {
  const text = getText(locale)
  const isAuthenticated = Boolean(getStoredAccessToken())
  const [follow, setFollow] = useState<DestinationFollow | null>(null)
  const [settings, setSettings] = useState<FollowSettings>(defaultFollowSettings)
  const [routeFrom, setRouteFrom] = useState('')
  const [routeTo, setRouteTo] = useState(detail.name)
  const [routes, setRoutes] = useState<RouteEstimate[]>([])
  const [proposalForm, setProposalForm] = useState<ProposalForm>({
    name: '',
    province: detail.province || '',
    district: '',
    region: detail.region || '',
    address: '',
    shortDescription: '',
    bestTimeFromMonth: '',
    bestTimeToMonth: '',
    crowdLevelDefault: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const routeDestination = useMemo(
    () => detail.province || detail.region || detail.name,
    [detail.name, detail.province, detail.region],
  )

  useEffect(() => {
    let mounted = true

    async function loadFollowState() {
      if (!isAuthenticated) {
        return
      }

      try {
        const page = await destinationApi.getMyFollows(0, 100)
        const match = page.content.find((item) => item.destinationUuid === detail.uuid) ?? null
        if (mounted) {
          setFollow(match)
          setSettings(toSettings(match))
        }
      } catch {
        if (mounted) {
          setFollow(null)
          setSettings(defaultFollowSettings)
        }
      }
    }

    void loadFollowState()

    return () => {
      mounted = false
    }
  }, [detail.uuid, isAuthenticated])

  useEffect(() => {
    let mounted = true

    async function loadRoutes() {
      try {
        const data = await weatherApi.getRouteEstimates({ toLabel: routeDestination })
        if (mounted) {
          setRoutes(data)
        }
      } catch {
        if (mounted) {
          setRoutes([])
        }
      }
    }

    void loadRoutes()

    return () => {
      mounted = false
    }
  }, [routeDestination])

  const updateSetting =
    (field: keyof FollowSettings) => (event: ChangeEvent<HTMLInputElement>) => {
      setSettings((current) => ({ ...current, [field]: event.target.checked }))
    }

  const followDestination = async () => {
    setLoading(true)
    setMessage('')

    try {
      const saved = follow
        ? await destinationApi.updateFollowSettings(detail.uuid, settings)
        : await destinationApi.followDestination(detail.uuid, settings)
      setFollow(saved)
      setSettings(toSettings(saved))
      setMessage(text.followSaved)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.error)
    } finally {
      setLoading(false)
    }
  }

  const unfollowDestination = async () => {
    setLoading(true)
    setMessage('')

    try {
      await destinationApi.unfollowDestination(detail.uuid)
      setFollow(null)
      setSettings(defaultFollowSettings)
      setMessage(text.followRemoved)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.error)
    } finally {
      setLoading(false)
    }
  }

  const submitProposal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!proposalForm.name.trim() || !proposalForm.province.trim()) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await destinationApi.proposeDestination({
        name: proposalForm.name.trim(),
        province: proposalForm.province.trim(),
        district: proposalForm.district.trim() || undefined,
        region: proposalForm.region.trim() || undefined,
        countryCode: 'VN',
        address: proposalForm.address.trim() || undefined,
        shortDescription: proposalForm.shortDescription.trim() || undefined,
        bestTimeFromMonth: proposalForm.bestTimeFromMonth
          ? Number(proposalForm.bestTimeFromMonth)
          : undefined,
        bestTimeToMonth: proposalForm.bestTimeToMonth
          ? Number(proposalForm.bestTimeToMonth)
          : undefined,
        crowdLevelDefault: proposalForm.crowdLevelDefault || undefined,
      })
      setProposalForm({
        name: '',
        province: detail.province || '',
        district: '',
        region: detail.region || '',
        address: '',
        shortDescription: '',
        bestTimeFromMonth: '',
        bestTimeToMonth: '',
        crowdLevelDefault: '',
      })
      setMessage(text.proposalSaved)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.error)
    } finally {
      setLoading(false)
    }
  }

  const searchRoutes = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await weatherApi.getRouteEstimates({
        fromLabel: routeFrom.trim() || undefined,
        toLabel: routeTo.trim() || undefined,
      })
      setRoutes(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : text.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="destination-detail-section destination-engagement-section">
      <div className="destination-detail-section-heading">
        <p>{text.kicker}</p>
        <h2>{text.title}</h2>
      </div>

      <div className="destination-engagement-grid">
        <article className="destination-engagement-card">
          <header>
            <Bell aria-hidden="true" />
            <div>
              <h3>{text.followTitle}</h3>
              <p>{text.followCopy}</p>
            </div>
          </header>

          {isAuthenticated ? (
            <>
              {follow && <strong className="destination-follow-state">{text.followed}</strong>}
              <div className="destination-follow-settings">
                {(
                  [
                    ['notifyEvent', text.notifyEvent],
                    ['notifyVoucher', text.notifyVoucher],
                    ['notifyNewTour', text.notifyNewTour],
                    ['notifyBestSeason', text.notifyBestSeason],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field}>
                    <input
                      type="checkbox"
                      checked={settings[field]}
                      onChange={updateSetting(field)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <div className="destination-engagement-actions">
                <button type="button" onClick={followDestination} disabled={loading}>
                  <CheckCircle2 aria-hidden="true" />
                  {follow ? text.saveSettings : text.follow}
                </button>
                {follow && (
                  <button
                    type="button"
                    className="is-secondary"
                    onClick={unfollowDestination}
                    disabled={loading}
                  >
                    <BellOff aria-hidden="true" />
                    {text.unfollow}
                  </button>
                )}
              </div>
            </>
          ) : (
            <Link className="destination-engagement-link" to="/login">
              <Bell aria-hidden="true" />
              {text.loginToFollow}
            </Link>
          )}
        </article>

        <article className="destination-engagement-card">
          <header>
            <Plus aria-hidden="true" />
            <div>
              <h3>{text.proposeTitle}</h3>
              <p>{text.proposeCopy}</p>
            </div>
          </header>

          <form className="destination-proposal-form" onSubmit={submitProposal}>
            <label>
              <span>{text.proposeName}</span>
              <input
                value={proposalForm.name}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>{text.province}</span>
              <input
                value={proposalForm.province}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    province: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>{text.district}</span>
              <input
                value={proposalForm.district}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    district: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>{text.region}</span>
              <input
                value={proposalForm.region}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    region: event.target.value,
                  }))
                }
              />
            </label>
            <label className="is-wide">
              <span>{text.address}</span>
              <input
                value={proposalForm.address}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
              />
            </label>
            <label className="is-wide">
              <span>{text.shortDescription}</span>
              <textarea
                rows={3}
                value={proposalForm.shortDescription}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    shortDescription: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>{text.fromMonth}</span>
              <input
                type="number"
                min="1"
                max="12"
                value={proposalForm.bestTimeFromMonth}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    bestTimeFromMonth: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span>{text.toMonth}</span>
              <input
                type="number"
                min="1"
                max="12"
                value={proposalForm.bestTimeToMonth}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    bestTimeToMonth: event.target.value,
                  }))
                }
              />
            </label>
            <label className="is-wide">
              <span>{text.crowd}</span>
              <select
                value={proposalForm.crowdLevelDefault}
                onChange={(event) =>
                  setProposalForm((current) => ({
                    ...current,
                    crowdLevelDefault: event.target.value,
                  }))
                }
              >
                <option value="">{copy.updating}</option>
                <option value="LOW">{copy.crowdLabels.LOW}</option>
                <option value="MEDIUM">{copy.crowdLabels.MEDIUM}</option>
                <option value="HIGH">{copy.crowdLabels.HIGH}</option>
                <option value="VERY_HIGH">{copy.crowdLabels.VERY_HIGH}</option>
              </select>
            </label>
            <button type="submit" disabled={loading}>
              <Send aria-hidden="true" />
              {text.submitProposal}
            </button>
          </form>
        </article>

        <article className="destination-engagement-card destination-route-card">
          <header>
            <Navigation aria-hidden="true" />
            <div>
              <h3>{text.routeTitle}</h3>
              <p>{copy.weatherApi}</p>
            </div>
          </header>

          <form className="destination-route-form" onSubmit={searchRoutes}>
            <label>
              <span>{text.fromLabel}</span>
              <input value={routeFrom} onChange={(event) => setRouteFrom(event.target.value)} />
            </label>
            <label>
              <span>{text.toLabel}</span>
              <input value={routeTo} onChange={(event) => setRouteTo(event.target.value)} />
            </label>
            <button type="submit" disabled={loading}>
              <MapPinned aria-hidden="true" />
              {text.searchRoutes}
            </button>
          </form>

          {routes.length === 0 ? (
            <p className="destination-engagement-empty">{text.noRoutes}</p>
          ) : (
            <div className="destination-route-list">
              {routes.slice(0, 4).map((route) => (
                <div key={route.id}>
                  <strong>
                    {route.fromLabel || text.fromLabel} {'->'} {route.toLabel || detail.name}
                  </strong>
                  <span>
                    {text.distance}: {formatNumber(route.distanceKm)} km
                  </span>
                  <span>
                    {text.duration}: {route.durationMinutes ?? 0} {text.minutes}
                  </span>
                  {route.googleMapUrl && (
                    <a href={route.googleMapUrl} target="_blank" rel="noreferrer">
                      {text.openMap}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      {message && <p className="destination-engagement-message">{message}</p>}
    </section>
  )
}
