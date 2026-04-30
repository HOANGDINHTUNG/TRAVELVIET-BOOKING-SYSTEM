import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  MessageSquareReply,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react'
import {
  reviewApi,
  type Review,
} from '../../../api/server/Review.api'

type ReviewModerationPanelProps = {
  enableModeration?: boolean
}

const sentimentOptions = ['positive', 'neutral', 'negative', 'spam', 'hidden']

function formatDate(value: string | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getReviewSummary(review: Review) {
  return review.title || review.content || `Review #${review.id}`
}

export default function ReviewModerationPanel({
  enableModeration = true,
}: ReviewModerationPanelProps) {
  const [reviewId, setReviewId] = useState('')
  const [tourId, setTourId] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [tourReviews, setTourReviews] = useState<Review[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [sentiment, setSentiment] = useState('positive')
  const [working, setWorking] = useState('')
  const [message, setMessage] = useState('')

  const averageRating = useMemo(() => {
    if (!tourReviews.length) {
      return '-'
    }

    const total = tourReviews.reduce(
      (sum, review) => sum + Number(review.overallRating || 0),
      0,
    )
    return (total / tourReviews.length).toFixed(1)
  }, [tourReviews])

  const lookupReview = async () => {
    const id = Number(reviewId)
    if (!Number.isFinite(id) || id <= 0) {
      return
    }

    setWorking('review')
    setMessage('')

    try {
      const data = await reviewApi.getById(id)
      setSelectedReview(data)
      setSentiment(data.sentiment || 'positive')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai review.')
    } finally {
      setWorking('')
    }
  }

  const loadTourReviews = async () => {
    const id = Number(tourId)
    if (!Number.isFinite(id) || id <= 0) {
      return
    }

    setWorking('tour-reviews')
    setMessage('')

    try {
      const page = await reviewApi.getForTour(id, { page: 0, size: 12 })
      setTourReviews(page.content ?? [])
      if (page.content?.[0]) {
        setSelectedReview(page.content[0])
        setReviewId(String(page.content[0].id))
        setSentiment(page.content[0].sentiment || 'positive')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai review theo tour.')
    } finally {
      setWorking('')
    }
  }

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedReview || !replyContent.trim()) {
      return
    }

    setWorking('reply')
    setMessage('')

    try {
      const updated = await reviewApi.reply(selectedReview.id, {
        content: replyContent.trim(),
      })
      setSelectedReview(updated)
      setTourReviews((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setReplyContent('')
      setMessage('Da gui phan hoi review.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the phan hoi review.')
    } finally {
      setWorking('')
    }
  }

  const moderateReview = async () => {
    if (!selectedReview || !enableModeration) {
      return
    }

    setWorking('moderate')
    setMessage('')

    try {
      const updated = await reviewApi.moderate(selectedReview.id, { sentiment })
      setSelectedReview(updated)
      setTourReviews((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setMessage('Da cap nhat sentiment review.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the moderate review.')
    } finally {
      setWorking('')
    }
  }

  return (
    <section className="mgmt-review-desk" id="review-moderation">
      <header className="mgmt-review-head">
        <div>
          <p className="mgmt-kicker">REVIEW MODERATION</p>
          <h3>Kiem tra, phan hoi va gan sentiment cho review</h3>
          <p>
            Panel nay dung API review hien co: tra cuu review, lay review theo
            tour, phan hoi review va moderation sentiment.
          </p>
        </div>
        <div className="mgmt-review-summary">
          <span>
            <Star aria-hidden="true" />
            {averageRating} average
          </span>
          <span>
            <MessageSquareReply aria-hidden="true" />
            {tourReviews.length} loaded
          </span>
          <span>
            <ShieldCheck aria-hidden="true" />
            {enableModeration ? 'Moderation on' : 'Reply only'}
          </span>
        </div>
      </header>

      <div className="mgmt-review-toolbar">
        <label>
          <span>Review ID</span>
          <input value={reviewId} onChange={(event) => setReviewId(event.target.value)} />
        </label>
        <button type="button" onClick={() => void lookupReview()} disabled={working === 'review'}>
          <Search aria-hidden="true" />
          Tra cuu
        </button>
        <label>
          <span>Tour ID</span>
          <input value={tourId} onChange={(event) => setTourId(event.target.value)} />
        </label>
        <button
          type="button"
          onClick={() => void loadTourReviews()}
          disabled={working === 'tour-reviews'}
        >
          <Search aria-hidden="true" />
          Lay review tour
        </button>
      </div>

      <div className="mgmt-review-layout">
        <aside className="mgmt-review-list">
          {tourReviews.length === 0 ? (
            <p className="mgmt-review-empty">Nhap Tour ID de tai review gan nhat.</p>
          ) : (
            tourReviews.map((review) => (
              <button
                className={selectedReview?.id === review.id ? 'is-active' : ''}
                type="button"
                key={review.id}
                onClick={() => {
                  setSelectedReview(review)
                  setReviewId(String(review.id))
                  setSentiment(review.sentiment || 'positive')
                }}
              >
                <strong>{getReviewSummary(review)}</strong>
                <small>
                  {review.overallRating}/5 · {review.sentiment || 'no sentiment'} ·{' '}
                  {formatDate(review.createdAt)}
                </small>
              </button>
            ))
          )}
        </aside>

        <article className="mgmt-review-detail">
          {!selectedReview ? (
            <p className="mgmt-review-empty">Chon hoac tra cuu mot review de xu ly.</p>
          ) : (
            <>
              <header>
                <div>
                  <h4>{selectedReview.title || `Review #${selectedReview.id}`}</h4>
                  <p>
                    Tour {selectedReview.tourId || '-'} · Booking{' '}
                    {selectedReview.bookingId || '-'} · User {selectedReview.userId || '-'}
                  </p>
                </div>
                <span>{selectedReview.overallRating}/5</span>
              </header>

              <p className="mgmt-review-content">
                {selectedReview.content || 'Review nay chua co noi dung.'}
              </p>

              {selectedReview.aspects && selectedReview.aspects.length > 0 && (
                <div className="mgmt-review-aspects">
                  {selectedReview.aspects.map((aspect) => (
                    <span key={aspect.aspectName}>
                      {aspect.aspectName}: {aspect.aspectRating}/5
                    </span>
                  ))}
                </div>
              )}

              <div className="mgmt-review-replies">
                <strong>Replies</strong>
                {selectedReview.replies?.length ? (
                  selectedReview.replies.map((reply) => (
                    <article key={reply.id}>
                      <p>{reply.content}</p>
                      <small>{formatDate(reply.createdAt)}</small>
                    </article>
                  ))
                ) : (
                  <p className="mgmt-review-empty">Chua co phan hoi.</p>
                )}
              </div>

              <form className="mgmt-review-form" onSubmit={sendReply}>
                <label>
                  <span>Phan hoi</span>
                  <textarea
                    rows={4}
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                  />
                </label>
                <button type="submit" disabled={working === 'reply' || !replyContent.trim()}>
                  <MessageSquareReply aria-hidden="true" />
                  Gui phan hoi
                </button>
              </form>

              {enableModeration && (
                <div className="mgmt-review-moderation">
                  <label>
                    <span>Sentiment</span>
                    <select
                      value={sentiment}
                      onChange={(event) => setSentiment(event.target.value)}
                    >
                      {sentimentOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => void moderateReview()}
                    disabled={working === 'moderate'}
                  >
                    <ShieldCheck aria-hidden="true" />
                    Luu sentiment
                  </button>
                </div>
              )}
            </>
          )}
        </article>
      </div>

      {message && <p className="mgmt-review-message">{message}</p>}
    </section>
  )
}
