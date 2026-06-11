export const genderOptions = [
  { value: "UNKNOWN", label: "Chưa xác định" },
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export const memberLevelOptions = [
  { value: "", label: "Tất cả hạng" },
  { value: "NONE", label: "Không có" },
  { value: "BRONZE", label: "Đồng" },
  { value: "SILVER", label: "Bạc" },
  { value: "GOLD", label: "Vàng" },
  { value: "PLATINUM", label: "Bạch kim" },
  { value: "DIAMOND", label: "Kim cương" },
];

export const userCategoryOptions = [
  { value: "CUSTOMER", label: "Khách hàng" },
  { value: "ENTERPRISE", label: "Doanh nghiệp" },
  { value: "AGENT", label: "Đại lý" },
  { value: "SYSTEM", label: "Hệ thống" },
];

export const userStatusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Tạm khóa" },
  { value: "SUSPENDED", label: "Đình chỉ" },
];

export function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getUserDisplayName(
  user?: Record<string, unknown> | null,
): string {
  if (!user) return "Chưa cập nhật";
  return (
    (user.displayName as string) ||
    (user.fullName as string) ||
    (user.email as string) ||
    (user.phone as string) ||
    "Chưa cập nhật"
  );
}

export function labelFor(
  options: { value: string; label: string }[],
  value?: string | null,
  fallback: string = "Unknown",
): string {
  if (!value) return fallback;
  const match = options.find(
    (opt) => opt.value.toLowerCase() === value.toLowerCase(),
  );
  return match ? match.label : value;
}
