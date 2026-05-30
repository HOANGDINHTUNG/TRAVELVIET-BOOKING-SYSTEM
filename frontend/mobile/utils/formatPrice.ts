import { formatMoney } from '@/utils/formatMoney';

/** @deprecated Dùng formatMoney + hậu tố " đ" để đồng bộ web */
export function formatVnd(value: number) {
  return `${formatMoney(value)} đ`;
}
