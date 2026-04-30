import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BrainCircuit, CalendarDays, Sparkles, Star, Users } from 'lucide-react'
import {
  recommendationApi,
  type RecommendationLog,
  type RecommendedTour,
} from '../../../../api/server/Recommendation.api'
import { getStoredAccessToken } from '../../../../utils/authSessionStorage'
import './PersonalizedRecommendations.css'

type RecommendationForm = {
  requestedTag: string
  requestedBudget: string
  requestedTripMode: string
  requestedPeopleCount: string
  requestedDepartureAt: string
  size: string
}

const initialForm: RecommendationForm = {
  requestedTag: '',
  requestedBudget: '',
  requestedTripMode: '',
  requestedPeopleCount: '2',
  requestedDepartureAt: '',
  size: '6',
}

function getCopy(language: string) {
  if (language === 'en') {
    return {
      eyebrow: 'Personalized',
      title: 'Tours matched to your travel signals',
      copy:
        'Generate recommendations from your preferences, wishlist, viewed tours, group size, and departure timing.',
      loginTitle: 'Sign in to get personal recommendations',
      loginCopy: 'TravelViet can use your account preferences and saved tours after login.',
      loginAction: 'Sign in',
      tag: 'Tag',
      budget: 'Budget',
      tripMode: 'Trip mode',
      people: 'People',
      departure: 'Departure',
      size: 'Count',
      generate: 'Generate recommendations',
      generating: 'Generating...',
      latest: 'Latest result',
      logs: 'Recent logs',
      noResults: 'No recommendations yet.',
      score: 'Score',
      rating: 'Rating',
      bookings: 'Bookings',
      viewTour: 'View tour',
      reasons: 'Reasons',
      allBudget: 'Use preference',
      allMode: 'Use preference',
      error: 'Could not generate recommendations.',
    }
  }

  return {
    eyebrow: 'Ca nhan hoa',
    title: 'Tour phu hop voi tin hieu du lich cua ban',
    copy:
      'Tao goi y tu so thich, wishlist, tour da xem, quy mo nhom va thoi diem khoi hanh.',
    loginTitle: 'Dang nhap de nhan goi y ca nhan',
    loginCopy: 'TravelViet se dung preferences va tour da luu sau khi dang nhap.',
    loginAction: 'Dang nhap',
    tag: 'Tag',
    budget: 'Ngan sach',
    tripMode: 'Kieu tour',
    people: 'So khach',
    departure: 'Khoi hanh',
    size: 'So luong',
    generate: 'Tao goi y',
    generating: 'Dang tao...',
    latest: 'Ket qua moi nhat',
    logs: 'Log gan day',
    noResults: 'Chua co goi y.',
    score: 'Diem',
    rating: 'Danh gia',
    bookings: 'Luot dat',
    viewTour: 'Xem tour',
    reasons: 'Ly do',
    allBudget: 'Theo so thich',
    allMode: 'Theo so thich',
    error: 'Khong the tao goi y.',
  }
}

function formatMoney(value: number | string | undefined, currency = 'VND') {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return `0 ${currency}`
  }

  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(amount)} ${currency}`
}

function formatDate(value: string | undefined, language: string) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatDuration(tour: RecommendedTour) {
  if (!tour.durationDays && !tour.durationNights) {
    return ''
  }

  return `${tour.durationDays ?? 0}N${tour.durationNights ? `/${tour.durationNights}D` : ''}`
}

function getRecommendations(log: RecommendationLog | null) {
  return log?.recommendations ?? []
}

export function PersonalizedRecommendations() {
  const { i18n } = useTranslation()
  const copy = getCopy(i18n.language)
  const isAuthenticated = Boolean(getStoredAccessToken())
  const [form, setForm] = useState<RecommendationForm>(initialForm)
  const [latestLog, setLatestLog] = useState<RecommendationLog | null>(null)
  const [logs, setLogs] = useState<RecommendationLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const recommendations = useMemo(() => getRecommendations(latestLog), [latestLog])

  useEffect(() => {
    let mounted = true

    async function loadLogs() {
      if (!isAuthenticated) {
        return
      }

      try {
        const data = await recommendationApi.getLogs()
        if (mounted) {
          setLogs(data)
          setLatestLog(data[0] ?? null)
        }
      } catch {
        if (mounted) {
          setLogs([])
        }
      }
    }

    void loadLogs()

    return () => {
      mounted = false
    }
  }, [isAuthenticated])

  const updateForm =
    (field: keyof RecommendationForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const generateRecommendations = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const generated = await recommendationApi.generateTours({
        requestedTag: form.requestedTag.trim() || undefined,
        requestedBudget: form.requestedBudget || undefined,
        requestedTripMode: form.requestedTripMode || undefined,
        requestedPeopleCount: form.requestedPeopleCount
          ? Number(form.requestedPeopleCount)
          : undefined,
        requestedDepartureAt: form.requestedDepartureAt
          ? `${form.requestedDepartureAt}T00:00:00`
          : undefined,
        size: form.size ? Number(form.size) : 6,
      })
      setLatestLog(generated)
      setLogs((current) => [generated, ...current.filter((item) => item.logId !== generated.logId)])
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : copy.error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="section-shell recommendation-section">
        <div className="recommendation-login">
          <BrainCircuit aria-hidden="true" />
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2>{copy.loginTitle}</h2>
            <p>{copy.loginCopy}</p>
          </div>
          <Link to="/login">{copy.loginAction}</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-shell recommendation-section">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>
        <p>{copy.copy}</p>
      </div>

      <div className="recommendation-layout">
        <form className="recommendation-form" onSubmit={generateRecommendations}>
          <label>
            <span>{copy.tag}</span>
            <input
              value={form.requestedTag}
              onChange={updateForm('requestedTag')}
              placeholder="bien, family, heritage"
            />
          </label>
          <label>
            <span>{copy.budget}</span>
            <select value={form.requestedBudget} onChange={updateForm('requestedBudget')}>
              <option value="">{copy.allBudget}</option>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
              <option value="luxury">LUXURY</option>
            </select>
          </label>
          <label>
            <span>{copy.tripMode}</span>
            <select value={form.requestedTripMode} onChange={updateForm('requestedTripMode')}>
              <option value="">{copy.allMode}</option>
              <option value="group">GROUP</option>
              <option value="private">PRIVATE</option>
              <option value="shared">SHARED</option>
            </select>
          </label>
          <label>
            <span>{copy.people}</span>
            <input
              type="number"
              min="1"
              value={form.requestedPeopleCount}
              onChange={updateForm('requestedPeopleCount')}
            />
          </label>
          <label>
            <span>{copy.departure}</span>
            <input
              type="date"
              value={form.requestedDepartureAt}
              onChange={updateForm('requestedDepartureAt')}
            />
          </label>
          <label>
            <span>{copy.size}</span>
            <input type="number" min="1" max="20" value={form.size} onChange={updateForm('size')} />
          </label>
          <button type="submit" disabled={loading}>
            <Sparkles aria-hidden="true" />
            {loading ? copy.generating : copy.generate}
          </button>
          {error && <p className="recommendation-error">{error}</p>}
        </form>

        <div className="recommendation-results">
          <header>
            <div>
              <h3>{copy.latest}</h3>
              <p>{formatDate(latestLog?.createdAt, i18n.language)}</p>
            </div>
            <BrainCircuit aria-hidden="true" />
          </header>

          {recommendations.length === 0 ? (
            <p className="recommendation-empty">{copy.noResults}</p>
          ) : (
            <div className="recommendation-card-grid">
              {recommendations.map((tour) => (
                <article key={tour.tourId}>
                  <div className="recommendation-score">
                    <Star aria-hidden="true" />
                    <strong>{Number(tour.recommendationScore ?? 0).toFixed(1)}</strong>
                    <span>{copy.score}</span>
                  </div>
                  <div>
                    <h3>{tour.tourName || tour.tourCode || `Tour #${tour.tourId}`}</h3>
                    <p>{tour.shortDescription}</p>
                    <div className="recommendation-meta">
                      <span>
                        <CalendarDays aria-hidden="true" />
                        {formatDuration(tour)}
                      </span>
                      <span>
                        <Users aria-hidden="true" />
                        {tour.totalBookings ?? 0} {copy.bookings}
                      </span>
                    </div>
                    <strong>{formatMoney(tour.basePrice, tour.currency)}</strong>
                    {(tour.scoringReasons ?? []).length > 0 && (
                      <small>
                        {copy.reasons}: {(tour.scoringReasons ?? []).join(', ')}
                      </small>
                    )}
                    <Link to={`/tours/${tour.tourId}`}>{copy.viewTour}</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {logs.length > 1 && (
        <div className="recommendation-log-strip">
          <span>{copy.logs}</span>
          {logs.slice(0, 5).map((log) => (
            <button type="button" key={log.logId} onClick={() => setLatestLog(log)}>
              {formatDate(log.createdAt, i18n.language)}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
