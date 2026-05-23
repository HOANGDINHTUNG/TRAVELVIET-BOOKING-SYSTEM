import { useMemo } from 'react'

import { formatDisplayMoney } from '../lib/currencyDisplay'
import { useAppSelector } from './reduxHooks'

/** Giá tour/đơn lưu VND trên BE — hiển thị theo currency trong preferences. */
export function useDisplayMoney(amountVnd: number | null | undefined): string {
  const { currency, language } = useAppSelector((state) => state.preferences)

  return useMemo(
    () => formatDisplayMoney(amountVnd, currency, language),
    [amountVnd, currency, language],
  )
}
