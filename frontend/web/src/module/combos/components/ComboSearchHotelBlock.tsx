import { useMemo, useState } from 'react'
import { BedDouble, ChevronDown, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { OptimizedImage } from '@/components/common/media/OptimizedImage'
import {
  sortComboHotels,
  type ComboHotelResult,
  type ComboHotelSortKey,
} from '../data/comboSearchHotelMock'
import { formatComboPrice } from '../utils/formatComboPrice'

type ComboSearchHotelBlockProps = {
  hotels: ComboHotelResult[]
  stayTitle: string
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="csr-hotel-stars" aria-label={`${count}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          strokeWidth={0}
          fill={i < count ? '#f5b301' : '#e5e7eb'}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function ComboSearchHotelBlock({ hotels, stayTitle }: ComboSearchHotelBlockProps) {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'combosPage' })
  const [sortKey, setSortKey] = useState<ComboHotelSortKey>('price-asc')

  const sorted = useMemo(() => sortComboHotels(hotels, sortKey), [hotels, sortKey])

  const onSelect = () => {
    toast.info(t('search.comingSoonToast'))
  }

  return (
    <section className="csr-hotels" aria-labelledby="csr-hotels-title">
      <header className="csr-hotels__head">
        <div className="csr-hotels__head-left">
          <h2 id="csr-hotels-title" className="csr-hotels__title">
            <span className="csr-section-icon" aria-hidden>
              <BedDouble size={16} strokeWidth={2.2} />
            </span>
            {stayTitle}
          </h2>
          <p className="csr-hotels__note">{t('results.priceDisclaimer')}</p>
        </div>
        <label className="csr-hotels__sort">
          <span className="csr-hotels__sort-label">{t('results.sortLabel')}</span>
          <span className="csr-hotels__sort-select">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as ComboHotelSortKey)}
              aria-label={t('results.sortLabel')}
            >
              <option value="price-asc">{t('results.sortPriceAsc')}</option>
              <option value="price-desc">{t('results.sortPriceDesc')}</option>
              <option value="rating-desc">{t('results.sortRating')}</option>
            </select>
            <ChevronDown size={14} className="csr-hotels__sort-chevron" aria-hidden />
          </span>
        </label>
      </header>

      <div className="csr-hotels__grid">
        {sorted.map((hotel) => (
          <article key={hotel.id} className="csr-hotel-card">
            <div className="csr-hotel-card__media">
              <OptimizedImage
                src={hotel.image}
                alt={hotel.title}
                width={280}
                height={170}
                cloudinaryWidth={560}
                className="csr-hotel-card__img"
              />
            </div>
            <div className="csr-hotel-card__body">
              <h3 className="csr-hotel-card__title">{hotel.title}</h3>
              <StarRow count={hotel.rating} />
              <div className="csr-hotel-card__footer">
                <p className="csr-hotel-card__price">
                  <span>{t('results.comboPriceFrom')}</span>
                  <strong>{formatComboPrice(hotel.comboPriceVnd, i18n.language)}₫</strong>
                </p>
                <button type="button" className="csr-hotel-card__select" onClick={onSelect}>
                  {t('results.selectButton')}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
