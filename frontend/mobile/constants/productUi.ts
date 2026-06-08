import { colors } from '@/theme/colors';
import { radius, space } from '@/theme/spacing';

/** @deprecated Prefer theme/colors — giữ alias để không break import cũ */
export const ProductUi = {
  primary: colors.primary,
  background: colors.background,
  surface: colors.surface,
  text: colors.text,
  textMuted: colors.textMuted,
  border: colors.border,
  error: colors.error,
  success: colors.success,
  spacing: space,
  radius: radius.md,
} as const;
