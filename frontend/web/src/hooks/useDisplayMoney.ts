import { useMemo } from 'react'

import { coerceMoneyAmount, formatDisplayMoney } from '../lib/currencyDisplay'
import { useAppSelector } from './reduxHooks'

/** Giá tour/đơn lưu VND trên BE — hiển thị theo currency trong preferences. */
export function useDisplayMoney(
  amountVnd: number | string | null | undefined,
): string {
  const { currency, language } = useAppSelector((state) => state.preferences)
  const normalized = coerceMoneyAmount(amountVnd)

  return useMemo(
    () => formatDisplayMoney(normalized, currency, language),
    [normalized, currency, language],
  )
}
