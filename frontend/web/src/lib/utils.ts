import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Hợp nhất Tailwind class — chuẩn Shadcn UI.
 *
 * Quy ước: mọi component dùng utility-class của Tailwind v4 NÊN gọi
 * `cn(...)` thay vì nối chuỗi tay. Hàm sẽ:
 * 1. Loại trùng key Tailwind (vd. `p-2` + `p-4` ⇒ giữ `p-4` ở cuối).
 * 2. Bỏ qua giá trị falsy / array lồng nhau (giống `clsx`).
 *
 * Mọi primitive ShadcnUI (Sheet, Command, Dropdown, …) trong `components/ui/`
 * đều import từ đây qua alias `@/lib/utils`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
