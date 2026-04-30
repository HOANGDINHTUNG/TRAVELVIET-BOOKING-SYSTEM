import { useEffect, useMemo, useState } from 'react'
import {
  BadgePercent,
  Boxes,
  PackageCheck,
  RefreshCcw,
  Search,
  TicketPercent,
} from 'lucide-react'
import {
  commerceApi,
  type ComboPackage,
  type Product,
} from '../../../api/server/Commerce.api'
import {
  promotionApi,
  type PromotionCampaign,
  type Voucher,
} from '../../../api/server/Promotion.api'

type PromotionTab = 'vouchers' | 'campaigns' | 'products' | 'combos'

const tabs: Array<{ id: PromotionTab; label: string }> = [
  { id: 'vouchers', label: 'Vouchers' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'products', label: 'Products' },
  { id: 'combos', label: 'Combos' },
]

function formatMoney(value: number | string | undefined) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '-'
  }

  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(amount)
}

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
  }).format(date)
}

function statusLabel(isActive: boolean | undefined) {
  return isActive === false ? 'Tam tat' : 'Dang bat'
}

export default function PromotionCommercePanel() {
  const [activeTab, setActiveTab] = useState<PromotionTab>('vouchers')
  const [keyword, setKeyword] = useState('')
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [combos, setCombos] = useState<ComboPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const totals = useMemo(
    () => ({
      vouchers: vouchers.length,
      campaigns: campaigns.length,
      products: products.length,
      combos: combos.length,
    }),
    [campaigns.length, combos.length, products.length, vouchers.length],
  )

  const loadData = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: 0,
        size: 12,
        keyword: keyword.trim() || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }
      const [voucherPage, campaignPage, productPage, comboPage] = await Promise.all([
        promotionApi.getVouchers(params),
        promotionApi.getCampaigns(params),
        commerceApi.getProducts(params),
        commerceApi.getComboPackages(params),
      ])

      setVouchers(voucherPage.content ?? [])
      setCampaigns(campaignPage.content ?? [])
      setProducts(productPage.content ?? [])
      setCombos(comboPage.content ?? [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the tai promotion data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const refreshWithKeyword = () => {
    void loadData()
  }

  const toggleVoucher = async (item: Voucher) => {
    setWorkingId(`voucher-${item.id}`)
    setMessage('')

    try {
      const updated = await promotionApi.updateVoucherStatus(item.id, {
        isActive: item.isActive === false,
      })
      setVouchers((current) =>
        current.map((voucher) => (voucher.id === updated.id ? updated : voucher)),
      )
      setMessage('Da cap nhat voucher.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the cap nhat voucher.')
    } finally {
      setWorkingId(null)
    }
  }

  const toggleCampaign = async (item: PromotionCampaign) => {
    setWorkingId(`campaign-${item.id}`)
    setMessage('')

    try {
      const updated = await promotionApi.updateCampaignStatus(item.id, {
        isActive: item.isActive === false,
      })
      setCampaigns((current) =>
        current.map((campaign) => (campaign.id === updated.id ? updated : campaign)),
      )
      setMessage('Da cap nhat campaign.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the cap nhat campaign.')
    } finally {
      setWorkingId(null)
    }
  }

  const toggleProduct = async (item: Product) => {
    setWorkingId(`product-${item.id}`)
    setMessage('')

    try {
      const updated = await commerceApi.updateProductStatus(item.id, {
        isActive: item.isActive === false,
      })
      setProducts((current) =>
        current.map((product) => (product.id === updated.id ? updated : product)),
      )
      setMessage('Da cap nhat product.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the cap nhat product.')
    } finally {
      setWorkingId(null)
    }
  }

  const toggleCombo = async (item: ComboPackage) => {
    setWorkingId(`combo-${item.id}`)
    setMessage('')

    try {
      const updated = await commerceApi.updateComboPackageStatus(item.id, {
        isActive: item.isActive === false,
      })
      setCombos((current) =>
        current.map((combo) => (combo.id === updated.id ? updated : combo)),
      )
      setMessage('Da cap nhat combo package.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Khong the cap nhat combo.')
    } finally {
      setWorkingId(null)
    }
  }

  return (
    <section className="mgmt-promo-desk" id="promotion-commerce">
      <header className="mgmt-promo-head">
        <div>
          <p className="mgmt-kicker">PROMOTION & COMMERCE</p>
          <h3>Dieu phoi voucher, campaign va package ban kem</h3>
          <p>
            Man hinh nay dung cac API voucher, promotion campaign, product va
            combo package de kiem tra nhanh danh sach va bat/tat trang thai.
          </p>
        </div>
        <div className="mgmt-promo-summary">
          <span>
            <TicketPercent aria-hidden="true" />
            {totals.vouchers} vouchers
          </span>
          <span>
            <BadgePercent aria-hidden="true" />
            {totals.campaigns} campaigns
          </span>
          <span>
            <PackageCheck aria-hidden="true" />
            {totals.products} products
          </span>
          <span>
            <Boxes aria-hidden="true" />
            {totals.combos} combos
          </span>
        </div>
      </header>

      <div className="mgmt-promo-toolbar">
        <div className="mgmt-promo-tabs" role="tablist" aria-label="Promotion data">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? 'is-active' : ''}
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label>
          <Search aria-hidden="true" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                refreshWithKeyword()
              }
            }}
            placeholder="Tim theo ma hoac ten"
          />
        </label>

        <button type="button" onClick={refreshWithKeyword} disabled={loading}>
          <RefreshCcw aria-hidden="true" />
          Tai lai
        </button>
      </div>

      {loading ? (
        <p className="mgmt-promo-empty">Dang tai promotion data...</p>
      ) : (
        <>
          {activeTab === 'vouchers' && (
            <div className="mgmt-promo-grid">
              {vouchers.map((item) => (
                <article className="mgmt-promo-card" key={item.id}>
                  <header>
                    <span>{item.code}</span>
                    <strong>{statusLabel(item.isActive)}</strong>
                  </header>
                  <h4>{item.name}</h4>
                  <p>{item.description || item.discountType || 'Voucher'}</p>
                  <dl>
                    <div>
                      <dt>Gia tri</dt>
                      <dd>{formatMoney(item.discountValue)}</dd>
                    </div>
                    <div>
                      <dt>Da dung</dt>
                      <dd>{item.usedCount ?? 0}</dd>
                    </div>
                    <div>
                      <dt>Ket thuc</dt>
                      <dd>{formatDate(item.endAt)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={workingId === `voucher-${item.id}`}
                    onClick={() => void toggleVoucher(item)}
                  >
                    {item.isActive === false ? 'Bat voucher' : 'Tat voucher'}
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="mgmt-promo-grid">
              {campaigns.map((item) => (
                <article className="mgmt-promo-card" key={item.id}>
                  <header>
                    <span>{item.code}</span>
                    <strong>{statusLabel(item.isActive)}</strong>
                  </header>
                  <h4>{item.name}</h4>
                  <p>{item.description || 'Promotion campaign'}</p>
                  <dl>
                    <div>
                      <dt>Level</dt>
                      <dd>{item.targetMemberLevel || 'ALL'}</dd>
                    </div>
                    <div>
                      <dt>Bat dau</dt>
                      <dd>{formatDate(item.startAt)}</dd>
                    </div>
                    <div>
                      <dt>Ket thuc</dt>
                      <dd>{formatDate(item.endAt)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={workingId === `campaign-${item.id}`}
                    onClick={() => void toggleCampaign(item)}
                  >
                    {item.isActive === false ? 'Bat campaign' : 'Tat campaign'}
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="mgmt-promo-grid">
              {products.map((item) => (
                <article className="mgmt-promo-card" key={item.id}>
                  <header>
                    <span>{item.sku}</span>
                    <strong>{statusLabel(item.isActive)}</strong>
                  </header>
                  <h4>{item.name}</h4>
                  <p>{item.description || item.productType || 'Product'}</p>
                  <dl>
                    <div>
                      <dt>Gia</dt>
                      <dd>{formatMoney(item.unitPrice)}</dd>
                    </div>
                    <div>
                      <dt>Ton kho</dt>
                      <dd>{item.stockQty ?? 0}</dd>
                    </div>
                    <div>
                      <dt>Gift</dt>
                      <dd>{item.isGiftable ? 'Co' : 'Khong'}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={workingId === `product-${item.id}`}
                    onClick={() => void toggleProduct(item)}
                  >
                    {item.isActive === false ? 'Bat product' : 'Tat product'}
                  </button>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'combos' && (
            <div className="mgmt-promo-grid">
              {combos.map((item) => (
                <article className="mgmt-promo-card" key={item.id}>
                  <header>
                    <span>{item.code}</span>
                    <strong>{statusLabel(item.isActive)}</strong>
                  </header>
                  <h4>{item.name}</h4>
                  <p>{item.description || 'Combo package'}</p>
                  <dl>
                    <div>
                      <dt>Gia goc</dt>
                      <dd>{formatMoney(item.basePrice)}</dd>
                    </div>
                    <div>
                      <dt>Giam</dt>
                      <dd>{formatMoney(item.discountAmount)}</dd>
                    </div>
                    <div>
                      <dt>Gia ban</dt>
                      <dd>{formatMoney(item.finalPrice)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={workingId === `combo-${item.id}`}
                    onClick={() => void toggleCombo(item)}
                  >
                    {item.isActive === false ? 'Bat combo' : 'Tat combo'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {!loading &&
        ((activeTab === 'vouchers' && vouchers.length === 0) ||
          (activeTab === 'campaigns' && campaigns.length === 0) ||
          (activeTab === 'products' && products.length === 0) ||
          (activeTab === 'combos' && combos.length === 0)) && (
          <p className="mgmt-promo-empty">Khong co du lieu phu hop.</p>
        )}

      {message && <p className="mgmt-promo-message">{message}</p>}
    </section>
  )
}
