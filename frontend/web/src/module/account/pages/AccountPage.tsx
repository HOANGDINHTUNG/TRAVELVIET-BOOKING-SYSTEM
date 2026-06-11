import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  MessageSquareText,
  Plus,
  ReceiptText,
  Save,
  Star,
  TicketPercent,
  Trash2,
} from "lucide-react";
import { formatCurrencyVnd } from '@/utils/currency';
import {
  bookingApi,
  type Booking,
} from "../../../api/server/Booking.api";
import {
  notificationApi,
  type Notification,
} from "../../../api/server/Notification.api";
import {
  reviewApi,
  type Review,
} from "../../../api/server/Review.api";
import {
  userApi,
  type UserAddress,
  type UserPreference,
  type UserProfile,
} from "../../../api/server/User.api";
import {
  voucherApi,
  type ClaimedVoucher,
} from "../../../api/server/Voucher.api";
import {
  wishlistApi,
  type WishlistTour,
} from "../../../api/server/Wishlist.api";
import { ErrorBlock } from "../../../components/common/ui/ErrorBlock";
import { AccountPageSkeleton } from "../../../components/ui/skeletons/CustomerPageSkeletons";
import { Footer } from "../../../components/Footer/Footer";
import { CustomerPageHero } from "../../../components/ui/CustomerPageHero/CustomerPageHero";
import { persistStoredAuthUser } from "../../auth/api/authApi";
import { tourDetailPath } from "../../tours/utils/slug";
import "./AccountPage.css";

type AccountLocale = "vi" | "en";

type ProfileForm = {
  fullName: string;
  displayName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  avatarUrl: string;
};

type ReviewForm = {
  overallRating: number;
  title: string;
  content: string;
  wouldRecommend: boolean;
  itineraryRating: number;
  serviceRating: number;
  valueRating: number;
};

type AddressForm = {
  contactName: string;
  contactPhone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  isDefault: boolean;
};

type PreferenceForm = {
  budgetLevel: string;
  preferredTripMode: string;
  travelStyle: string;
  preferredDepartureCity: string;
  favoriteRegions: string;
  favoriteTags: string;
};

const copyByLocale = {
  vi: {
    loading: "Đang tải tài khoản...",
    errorTitle: "Không thể tải tài khoản",
    retry: "Thử lại",
    kicker: "Tài khoản của tôi",
    title: "Trung tâm tài khoản",
    subtitle: "Quản lý hồ sơ, đặt tour, voucher và các thiết lập cá nhân.",
    profile: "Hồ sơ",
    profileHint: "Thông tin này được đồng bộ với avatar trên header sau khi lưu.",
    fullName: "Họ tên",
    displayName: "Tên hiển thị",
    phone: "Số điện thoại",
    gender: "Giới tính",
    dateOfBirth: "Ngày sinh",
    avatarUrl: "URL Avatar",
    saveProfile: "Lưu hồ sơ",
    saving: "Đang lưu...",
    saved: "Đã cập nhật hồ sơ.",
    saveError: "Không thể cập nhật hồ sơ.",
    memberLevel: "Hạng thành viên",
    loyaltyPoints: "Điểm tích lũy",
    totalSpent: "Tổng chi tiêu",
    bookings: "Lịch sử đặt tour",
    noBookings: "Chưa có booking nào.",
    bookingCode: "Mã booking",
    travellers: "Hành khách",
    amount: "Tổng tiền",
    viewBooking: "Xem chi tiết",
    contact: "Liên hệ",
    addresses: "Địa chỉ",
    defaultAddress: "Mặc định",
    noAddresses: "Chưa có địa chỉ.",
    addAddress: "Thêm địa chỉ",
    contactName: "Tên liên hệ",
    contactPhone: "Số điện thoại",
    province: "Tỉnh/Thành",
    district: "Quận/Huyện",
    ward: "Phường/Xã",
    addressLine: "Địa chỉ cụ thể",
    setDefault: "Đặt mặc định",
    delete: "Xóa",
    vouchers: "Voucher của tôi",
    noVouchers: "Chưa có voucher.",
    voucherCode: "Mã voucher",
    claimVoucher: "Nhận voucher",
    claimSuccess: "Đã nhận voucher.",
    wishlist: "Yêu thích",
    noWishlist: "Chưa có tour yêu thích.",
    viewTour: "Xem tour",
    removeWishlist: "Bỏ lưu",
    notifications: "Thông báo",
    markAllRead: "Đọc tất cả",
    markRead: "Đã đọc",
    noNotifications: "Chưa có thông báo.",
    preferences: "Sở thích du lịch",
    savePreferences: "Lưu sở thích",
    budgetLevel: "Ngân sách",
    preferredTripMode: "Kiểu chuyến đi",
    travelStyle: "Phong cách",
    preferredDepartureCity: "Nơi khởi hành",
    favoriteRegions: "Vùng yêu thích",
    favoriteTags: "Tag yêu thích",
    commaHint: "Cách nhau bằng dấu phẩy",
    actionSuccess: "Đã cập nhật.",
    actionError: "Không thể xử lý yêu cầu.",
    reviews: "Đánh giá của tôi",
    reviewable: "Chờ đánh giá",
    noReviewableBookings: "Chưa có booking hoàn tất để đánh giá.",
    myReviews: "Đã đánh giá",
    noMyReviews: "Chưa có đánh giá nào.",
    writeReview: "Viết đánh giá",
    cancelReview: "Hủy",
    submitReview: "Gửi đánh giá",
    submittingReview: "Đang gửi...",
    reviewTitle: "Tiêu đề",
    reviewContent: "Cảm nhận của bạn",
    recommendTour: "Tôi sẽ giới thiệu tour này",
    overallRating: "Tổng thể",
    itineraryRating: "Lịch trình",
    serviceRating: "Dịch vụ",
    valueRating: "Giá trị",
    reviewSaved: "Đã gửi đánh giá.",
    reviewError: "Không thể gửi đánh giá.",
    notUpdated: "Chưa cập nhật",
  },
  en: {
    loading: "Loading account...",
    errorTitle: "Could not load account",
    retry: "Retry",
    kicker: "My Account",
    title: "Account center",
    subtitle: "Manage your profile, bookings, vouchers, and personal travel signals from the backend.",
    profile: "Profile",
    profileHint: "Saved profile changes sync back to the avatar dropdown.",
    fullName: "Full name",
    displayName: "Display name",
    phone: "Phone",
    gender: "Gender",
    dateOfBirth: "Date of birth",
    avatarUrl: "Avatar URL",
    saveProfile: "Save profile",
    saving: "Saving...",
    saved: "Profile updated.",
    saveError: "Could not update profile.",
    memberLevel: "Member level",
    loyaltyPoints: "Loyalty points",
    totalSpent: "Total spent",
    bookings: "Booking history",
    noBookings: "No bookings yet.",
    bookingCode: "Booking code",
    travellers: "Travellers",
    amount: "Amount",
    viewBooking: "View booking",
    contact: "Contact",
    addresses: "Addresses",
    defaultAddress: "Default",
    noAddresses: "No addresses yet.",
    addAddress: "Add address",
    contactName: "Contact name",
    contactPhone: "Phone",
    province: "Province",
    district: "District",
    ward: "Ward",
    addressLine: "Address line",
    setDefault: "Set default",
    delete: "Delete",
    vouchers: "My vouchers",
    noVouchers: "No vouchers yet.",
    voucherCode: "Voucher code",
    claimVoucher: "Claim voucher",
    claimSuccess: "Voucher claimed.",
    wishlist: "Wishlist",
    noWishlist: "No saved tours yet.",
    viewTour: "View tour",
    removeWishlist: "Remove",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    markRead: "Mark read",
    noNotifications: "No notifications yet.",
    preferences: "Preferences",
    savePreferences: "Save preferences",
    budgetLevel: "Budget",
    preferredTripMode: "Trip mode",
    travelStyle: "Travel style",
    preferredDepartureCity: "Departure city",
    favoriteRegions: "Favorite regions",
    favoriteTags: "Favorite tags",
    commaHint: "Separate with commas",
    actionSuccess: "Updated.",
    actionError: "Could not process the request.",
    reviews: "My reviews",
    reviewable: "Ready to review",
    noReviewableBookings: "No completed bookings are ready for review.",
    myReviews: "Reviewed",
    noMyReviews: "No reviews yet.",
    writeReview: "Write review",
    cancelReview: "Cancel",
    submitReview: "Submit review",
    submittingReview: "Submitting...",
    reviewTitle: "Title",
    reviewContent: "Your experience",
    recommendTour: "I would recommend this tour",
    overallRating: "Overall",
    itineraryRating: "Itinerary",
    serviceRating: "Service",
    valueRating: "Value",
    reviewSaved: "Review submitted.",
    reviewError: "Could not submit review.",
    notUpdated: "Not updated",
  },
} satisfies Record<AccountLocale, Record<string, string>>;

function getLocale(language: string): AccountLocale {
  return language === "en" ? "en" : "vi";
}

function buildProfileForm(profile: UserProfile | null): ProfileForm {
  return {
    fullName: profile?.fullName ?? "",
    displayName: profile?.displayName ?? "",
    phone: profile?.phone ?? "",
    gender: profile?.gender ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    avatarUrl: profile?.avatarUrl ?? "",
  };
}

function buildReviewForm(): ReviewForm {
  return {
    overallRating: 5,
    title: "",
    content: "",
    wouldRecommend: true,
    itineraryRating: 5,
    serviceRating: 5,
    valueRating: 5,
  };
}

function buildAddressForm(): AddressForm {
  return {
    contactName: "",
    contactPhone: "",
    province: "",
    district: "",
    ward: "",
    addressLine: "",
    isDefault: false,
  };
}

function buildPreferenceForm(preferences: UserPreference | null): PreferenceForm {
  return {
    budgetLevel: preferences?.budgetLevel ?? "",
    preferredTripMode: preferences?.preferredTripMode ?? "",
    travelStyle: preferences?.travelStyle ?? "",
    preferredDepartureCity: preferences?.preferredDepartureCity ?? "",
    favoriteRegions: preferences?.favoriteRegions?.join(", ") ?? "",
    favoriteTags: preferences?.favoriteTags?.join(", ") ?? "",
  };
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string | undefined, locale: AccountLocale) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    dateStyle: "medium",
  }).format(date);
}

function getTravellerCount(booking: Booking) {
  return (
    (booking.adults ?? 0) +
    (booking.children ?? 0) +
    (booking.infants ?? 0) +
    (booking.seniors ?? 0)
  );
}

function getStatusClass(status: string | undefined) {
  return `account-status ${status ? `is-${status.replaceAll("_", "-")}` : ""}`;
}

function canReviewBooking(booking: Booking) {
  return booking.status === "checked_in" || booking.status === "completed";
}

export default function AccountPage() {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);
  const copy = copyByLocale[locale];
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>(() => buildProfileForm(null));
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(() => buildAddressForm());
  const [preferenceForm, setPreferenceForm] = useState<PreferenceForm>(() =>
    buildPreferenceForm(null),
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vouchers, setVouchers] = useState<ClaimedVoucher[]>([]);
  const [wishlist, setWishlist] = useState<WishlistTour[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeReviewBookingId, setActiveReviewBookingId] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewForm>(() => buildReviewForm());
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accountActionLoading, setAccountActionLoading] = useState(false);
  const [accountActionMessage, setAccountActionMessage] = useState("");
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const reviewedBookingIds = useMemo(
    () => new Set(reviews.map((review) => review.bookingId).filter(Boolean)),
    [reviews],
  );

  const reviewableBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => canReviewBooking(booking) && !reviewedBookingIds.has(booking.id),
      ),
    [bookings, reviewedBookingIds],
  );

  const loadAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        profileData,
        addressData,
        preferenceData,
        bookingData,
        voucherData,
        wishlistData,
        notificationData,
        reviewData,
      ] = await Promise.all([
        userApi.getMyProfile(),
        userApi.getMyAddresses().catch(() => []),
        userApi.getMyPreferences().catch(() => null),
        bookingApi.getMine().catch(() => []),
        voucherApi.getMyVouchers().catch(() => []),
        wishlistApi.getMyTours().catch(() => []),
        notificationApi.getMine().catch(() => []),
        reviewApi.getMine({ page: 0, size: 50 }).catch(() => null),
      ]);

      setProfile(profileData);
      setForm(buildProfileForm(profileData));
      setAddresses(addressData);
      setPreferences(preferenceData);
      setPreferenceForm(buildPreferenceForm(preferenceData));
      setBookings(bookingData);
      setVouchers(voucherData);
      setWishlist(wishlistData);
      setNotifications(notificationData);
      setReviews(reviewData?.content ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : copy.errorTitle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccount();
  }, []);

  const updateFormField =
    (field: keyof ProfileForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const updateReviewTextField =
    (field: "title" | "content") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReviewForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const updateReviewRatingField =
    (field: "overallRating" | "itineraryRating" | "serviceRating" | "valueRating") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setReviewForm((current) => ({ ...current, [field]: Number(event.target.value) }));
    };

  const updateAddressField =
    (field: keyof AddressForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "isDefault" ? event.target.checked : event.target.value;
      setAddressForm((current) => ({ ...current, [field]: value }));
    };

  const updatePreferenceField =
    (field: keyof PreferenceForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setPreferenceForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage("");

    try {
      const updated = await userApi.updateMyProfile({
        fullName: form.fullName.trim() || undefined,
        displayName: form.displayName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        gender: form.gender.trim() || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
      });

      setProfile(updated);
      setForm(buildProfileForm(updated));
      persistStoredAuthUser(updated);
      window.dispatchEvent(new Event("travelviet:login"));
      setSaveMessage(copy.saved);
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  const markAllNotificationsRead = async () => {
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      await notificationApi.markAllRead();
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const markNotificationRead = async (id: number) => {
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      const updated = await notificationApi.markRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, ...updated, isRead: true } : notification,
        ),
      );
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const createAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !addressForm.contactName.trim() ||
      !addressForm.contactPhone.trim() ||
      !addressForm.province.trim() ||
      !addressForm.district.trim() ||
      !addressForm.addressLine.trim()
    ) {
      return;
    }

    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      const created = await userApi.createMyAddress({
        contactName: addressForm.contactName.trim(),
        contactPhone: addressForm.contactPhone.trim(),
        province: addressForm.province.trim(),
        district: addressForm.district.trim(),
        ward: addressForm.ward.trim() || undefined,
        addressLine: addressForm.addressLine.trim(),
        isDefault: addressForm.isDefault,
      });

      setAddresses((current) => {
        const next = addressForm.isDefault
          ? current.map((address) => ({ ...address, isDefault: false }))
          : current;
        return [created, ...next];
      });
      setAddressForm(buildAddressForm());
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const setDefaultAddress = async (id: number) => {
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      const updated = await userApi.setMyDefaultAddress(id);
      setAddresses((current) =>
        current.map((address) =>
          address.id === id
            ? { ...address, ...updated, isDefault: true }
            : { ...address, isDefault: false },
        ),
      );
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      await userApi.deleteMyAddress(id);
      setAddresses((current) => current.filter((address) => address.id !== id));
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const claimVoucher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!voucherCode.trim()) {
      return;
    }

    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      const claimed = await voucherApi.claim({ voucherCode: voucherCode.trim() });
      setVouchers((current) => [claimed, ...current]);
      setVoucherCode("");
      setAccountActionMessage(copy.claimSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const removeWishlistTour = async (tourId: number) => {
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      await wishlistApi.removeTour(tourId);
      setWishlist((current) => current.filter((item) => item.tourId !== tourId));
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const savePreferences = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountActionLoading(true);
    setAccountActionMessage("");

    try {
      const updated = await userApi.updateMyPreferences({
        ...preferences,
        budgetLevel: preferenceForm.budgetLevel.trim() || undefined,
        preferredTripMode: preferenceForm.preferredTripMode.trim() || undefined,
        travelStyle: preferenceForm.travelStyle.trim() || undefined,
        preferredDepartureCity:
          preferenceForm.preferredDepartureCity.trim() || undefined,
        favoriteRegions: splitCommaList(preferenceForm.favoriteRegions),
        favoriteTags: splitCommaList(preferenceForm.favoriteTags),
      });

      setPreferences(updated);
      setPreferenceForm(buildPreferenceForm(updated));
      setAccountActionMessage(copy.actionSuccess);
    } catch (actionError) {
      setAccountActionMessage(
        actionError instanceof Error ? actionError.message : copy.actionError,
      );
    } finally {
      setAccountActionLoading(false);
    }
  };

  const openReviewForm = (bookingId: number) => {
    setActiveReviewBookingId(bookingId);
    setReviewForm(buildReviewForm());
    setReviewMessage("");
  };

  const submitReview = async (booking: Booking) => {
    setReviewSubmitting(true);
    setReviewMessage("");

    try {
      const created = await reviewApi.create({
        bookingId: booking.id,
        overallRating: reviewForm.overallRating,
        title: reviewForm.title.trim() || undefined,
        content: reviewForm.content.trim() || undefined,
        wouldRecommend: reviewForm.wouldRecommend,
        aspects: [
          {
            aspectName: copy.itineraryRating,
            aspectRating: reviewForm.itineraryRating,
          },
          {
            aspectName: copy.serviceRating,
            aspectRating: reviewForm.serviceRating,
          },
          {
            aspectName: copy.valueRating,
            aspectRating: reviewForm.valueRating,
          },
        ],
      });

      setReviews((current) => [created, ...current]);
      setActiveReviewBookingId(null);
      setReviewForm(buildReviewForm());
      setReviewMessage(copy.reviewSaved);
    } catch (submitError) {
      setReviewMessage(
        submitError instanceof Error ? submitError.message : copy.reviewError,
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <AccountPageSkeleton />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <main className="account-error">
        <ErrorBlock title={copy.errorTitle} message={error} />
        <button type="button" onClick={() => void loadAccount()}>
          {copy.retry}
        </button>
      </main>
    );
  }

  const heroMetrics = [
    { icon: <BadgeCheck size={14} />, value: profile?.memberLevel || "—", label: copy.memberLevel },
    { icon: <TicketPercent size={14} />, value: profile?.loyaltyPoints ?? 0, label: copy.loyaltyPoints },
    { icon: <ReceiptText size={14} />, value: formatCurrencyVnd(profile?.totalSpent), label: copy.totalSpent },
    { icon: <Bell size={14} />, value: unreadCount || "—", label: copy.notifications },
  ];

  return (
    <>
      <CustomerPageHero
        variant="teal"
        kicker={copy.kicker}
        title={profile?.displayName || profile?.fullName || copy.title}
        lead={copy.subtitle}
        avatar={profile?.avatarUrl ?? ""}
        metrics={heroMetrics}
      />

      <div className="account-page">
        <main className="account-shell">
          <section className="account-metric-grid" aria-label="Account summary">
          <article>
            <BadgeCheck aria-hidden="true" />
            <span>{copy.memberLevel}</span>
            <strong>{profile?.memberLevel || copy.notUpdated}</strong>
          </article>
          <article>
            <TicketPercent aria-hidden="true" />
            <span>{copy.loyaltyPoints}</span>
            <strong>{profile?.loyaltyPoints ?? 0}</strong>
          </article>
          <article>
            <ReceiptText aria-hidden="true" />
            <span>{copy.totalSpent}</span>
            <strong>{formatCurrencyVnd(profile?.totalSpent)}</strong>
          </article>
          <article>
            <Bell aria-hidden="true" />
            <span>{copy.notifications}</span>
            <strong>{unreadCount}</strong>
          </article>
        </section>

        <div className="account-layout">
          <section className="account-panel account-profile-panel">
            <header>
              <div>
                <h2>{copy.profile}</h2>
                <p>{copy.profileHint}</p>
              </div>
            </header>

            <form className="account-profile-form" onSubmit={saveProfile}>
              <label>
                <span>{copy.fullName}</span>
                <input value={form.fullName} onChange={updateFormField("fullName")} />
              </label>
              <label>
                <span>{copy.displayName}</span>
                <input value={form.displayName} onChange={updateFormField("displayName")} />
              </label>
              <label>
                <span>{copy.phone}</span>
                <input value={form.phone} onChange={updateFormField("phone")} />
              </label>
              <label>
                <span>{copy.gender}</span>
                <input value={form.gender} onChange={updateFormField("gender")} />
              </label>
              <label>
                <span>{copy.dateOfBirth}</span>
                <input type="date" value={form.dateOfBirth} onChange={updateFormField("dateOfBirth")} />
              </label>
              <label className="is-wide">
                <span>{copy.avatarUrl}</span>
                <input value={form.avatarUrl} onChange={updateFormField("avatarUrl")} />
              </label>
              <button type="submit" disabled={saving}>
                <Save aria-hidden="true" />
                {saving ? copy.saving : copy.saveProfile}
              </button>
              {saveMessage && <p className="account-form-message">{saveMessage}</p>}
            </form>
          </section>

          <section className="account-panel account-bookings-panel">
            <header>
              <div>
                <h2>{copy.bookings}</h2>
                <p>{bookings.length} booking</p>
              </div>
            </header>

            {bookings.length === 0 ? (
              <p className="account-empty">{copy.noBookings}</p>
            ) : (
              <div className="account-booking-list">
                {bookings.map((booking) => (
                  <article className="account-booking-item" key={booking.id}>
                    <div>
                      <span>{copy.bookingCode}</span>
                      <strong>{booking.bookingCode || `#${booking.id}`}</strong>
                    </div>
                    <span className={getStatusClass(booking.status)}>
                      {booking.status || copy.notUpdated}
                    </span>
                    <dl>
                      <div>
                        <dt>{copy.travellers}</dt>
                        <dd>{getTravellerCount(booking)}</dd>
                      </div>
                      <div>
                        <dt>{copy.amount}</dt>
                        <dd>{formatCurrencyVnd(booking.finalAmount)}</dd>
                      </div>
                      <div>
                        <dt>{copy.contact}</dt>
                        <dd>{booking.contactName || booking.contactPhone || copy.notUpdated}</dd>
                      </div>
                    </dl>
                    <Link to={`/bookings/${booking.id}`}>
                      {copy.viewBooking}
                      <ChevronRight aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="account-secondary-grid">
          <section className="account-panel">
            <header>
              <div>
                <h2>{copy.addresses}</h2>
                <p>{addresses.length}</p>
              </div>
              <MapPin aria-hidden="true" />
            </header>
            <form className="account-compact-form" onSubmit={createAddress}>
              <label>
                <span>{copy.contactName}</span>
                <input
                  value={addressForm.contactName}
                  onChange={updateAddressField("contactName")}
                />
              </label>
              <label>
                <span>{copy.contactPhone}</span>
                <input
                  value={addressForm.contactPhone}
                  onChange={updateAddressField("contactPhone")}
                />
              </label>
              <label>
                <span>{copy.province}</span>
                <input
                  value={addressForm.province}
                  onChange={updateAddressField("province")}
                />
              </label>
              <label>
                <span>{copy.district}</span>
                <input
                  value={addressForm.district}
                  onChange={updateAddressField("district")}
                />
              </label>
              <label>
                <span>{copy.ward}</span>
                <input value={addressForm.ward} onChange={updateAddressField("ward")} />
              </label>
              <label>
                <span>{copy.addressLine}</span>
                <input
                  value={addressForm.addressLine}
                  onChange={updateAddressField("addressLine")}
                />
              </label>
              <label className="account-checkbox-row">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={updateAddressField("isDefault")}
                />
                <span>{copy.defaultAddress}</span>
              </label>
              <button type="submit" disabled={accountActionLoading}>
                <Plus aria-hidden="true" />
                {copy.addAddress}
              </button>
            </form>
            {addresses.length === 0 ? (
              <p className="account-empty">{copy.noAddresses}</p>
            ) : (
              <div className="account-stack-list">
                {addresses.map((address) => (
                  <article key={address.id}>
                    <strong>{address.contactName}</strong>
                    <span>{address.contactPhone}</span>
                    <p>
                      {[address.addressLine, address.ward, address.district, address.province]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {address.isDefault && <small>{copy.defaultAddress}</small>}
                    <div className="account-card-actions">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => void setDefaultAddress(address.id)}
                          disabled={accountActionLoading}
                        >
                          <CheckCircle2 aria-hidden="true" />
                          {copy.setDefault}
                        </button>
                      )}
                      <button
                        type="button"
                        className="is-danger"
                        onClick={() => void deleteAddress(address.id)}
                        disabled={accountActionLoading}
                      >
                        <Trash2 aria-hidden="true" />
                        {copy.delete}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="account-panel">
            <header>
              <div>
                <h2>{copy.vouchers}</h2>
                <p>{vouchers.length}</p>
              </div>
              <TicketPercent aria-hidden="true" />
            </header>
            <form className="account-inline-form" onSubmit={claimVoucher}>
              <label>
                <span>{copy.voucherCode}</span>
                <input
                  value={voucherCode}
                  onChange={(event) => setVoucherCode(event.target.value)}
                />
              </label>
              <button type="submit" disabled={accountActionLoading}>
                <Plus aria-hidden="true" />
                {copy.claimVoucher}
              </button>
            </form>
            {vouchers.length === 0 ? (
              <p className="account-empty">{copy.noVouchers}</p>
            ) : (
              <div className="account-stack-list">
                {vouchers.map((voucher) => (
                  <article key={voucher.id}>
                    <strong>{voucher.voucherCode || voucher.code || voucher.name}</strong>
                    <span>{voucher.name || voucher.description || copy.notUpdated}</span>
                    <p>
                      {formatCurrencyVnd(voucher.discountValue)}
                      {voucher.endAt ? ` · ${formatDate(voucher.endAt, locale)}` : ""}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="account-panel">
            <header>
              <div>
                <h2>{copy.wishlist}</h2>
                <p>{wishlist.length}</p>
              </div>
              <Heart aria-hidden="true" />
            </header>
            {wishlist.length === 0 ? (
              <p className="account-empty">{copy.noWishlist}</p>
            ) : (
              <div className="account-stack-list">
                {wishlist.map((item) => (
                  <article key={item.wishlistId}>
                    <strong>{item.tourName || item.tourCode || `Tour #${item.tourId}`}</strong>
                    <span>{formatCurrencyVnd(item.basePrice)}</span>
                    <Link to={tourDetailPath(item.tourId, item.tourName)}>
                      {copy.viewTour}
                      <ChevronRight aria-hidden="true" />
                    </Link>
                    <button
                      className="account-inline-action is-danger"
                      type="button"
                      onClick={() => void removeWishlistTour(item.tourId)}
                      disabled={accountActionLoading}
                    >
                      <Trash2 aria-hidden="true" />
                      {copy.removeWishlist}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="account-panel account-reviews-panel">
            <header>
              <div>
                <h2>{copy.reviews}</h2>
                <p>
                  {reviewableBookings.length} {copy.reviewable}
                </p>
              </div>
              <MessageSquareText aria-hidden="true" />
            </header>

            <div className="account-review-columns">
              <div>
                <h3>{copy.reviewable}</h3>
                {reviewableBookings.length === 0 ? (
                  <p className="account-empty">{copy.noReviewableBookings}</p>
                ) : (
                  <div className="account-stack-list">
                    {reviewableBookings.slice(0, 3).map((booking) => (
                      <article className="account-reviewable-card" key={booking.id}>
                        <strong>{booking.bookingCode || `#${booking.id}`}</strong>
                        <span>{formatCurrencyVnd(booking.finalAmount)}</span>
                        <p>{formatDate(booking.createdAt, locale)}</p>
                        {activeReviewBookingId === booking.id ? (
                          <div className="account-review-form">
                            <label>
                              <span>{copy.overallRating}</span>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={reviewForm.overallRating}
                                onChange={updateReviewRatingField("overallRating")}
                              />
                              <strong>{reviewForm.overallRating}/5</strong>
                            </label>
                            <label>
                              <span>{copy.itineraryRating}</span>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={reviewForm.itineraryRating}
                                onChange={updateReviewRatingField("itineraryRating")}
                              />
                              <strong>{reviewForm.itineraryRating}/5</strong>
                            </label>
                            <label>
                              <span>{copy.serviceRating}</span>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={reviewForm.serviceRating}
                                onChange={updateReviewRatingField("serviceRating")}
                              />
                              <strong>{reviewForm.serviceRating}/5</strong>
                            </label>
                            <label>
                              <span>{copy.valueRating}</span>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={reviewForm.valueRating}
                                onChange={updateReviewRatingField("valueRating")}
                              />
                              <strong>{reviewForm.valueRating}/5</strong>
                            </label>
                            <label className="is-wide">
                              <span>{copy.reviewTitle}</span>
                              <input
                                value={reviewForm.title}
                                onChange={updateReviewTextField("title")}
                              />
                            </label>
                            <label className="is-wide">
                              <span>{copy.reviewContent}</span>
                              <textarea
                                value={reviewForm.content}
                                onChange={updateReviewTextField("content")}
                                rows={4}
                              />
                            </label>
                            <label className="account-review-checkbox">
                              <input
                                type="checkbox"
                                checked={reviewForm.wouldRecommend}
                                onChange={(event) =>
                                  setReviewForm((current) => ({
                                    ...current,
                                    wouldRecommend: event.target.checked,
                                  }))
                                }
                              />
                              <span>{copy.recommendTour}</span>
                            </label>
                            <div className="account-review-actions">
                              <button
                                type="button"
                                onClick={() => void submitReview(booking)}
                                disabled={reviewSubmitting}
                              >
                                <Star aria-hidden="true" />
                                {reviewSubmitting ? copy.submittingReview : copy.submitReview}
                              </button>
                              <button
                                type="button"
                                className="is-secondary"
                                onClick={() => setActiveReviewBookingId(null)}
                                disabled={reviewSubmitting}
                              >
                                {copy.cancelReview}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="account-inline-action"
                            type="button"
                            onClick={() => openReviewForm(booking.id)}
                          >
                            <Star aria-hidden="true" />
                            {copy.writeReview}
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3>{copy.myReviews}</h3>
                {reviews.length === 0 ? (
                  <p className="account-empty">{copy.noMyReviews}</p>
                ) : (
                  <div className="account-stack-list">
                    {reviews.slice(0, 4).map((review) => (
                      <article className="account-review-card" key={review.id}>
                        <strong>
                          <Star aria-hidden="true" />
                          {review.overallRating}/5
                        </strong>
                        <span>{review.title || `Tour #${review.tourId}`}</span>
                        {review.content && <p>{review.content}</p>}
                        <small>{formatDate(review.createdAt, locale)}</small>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {reviewMessage && <p className="account-form-message">{reviewMessage}</p>}
          </section>

          <section className="account-panel">
            <header>
              <div>
                <h2>{copy.notifications}</h2>
                <p>{unreadCount}</p>
              </div>
              <button
                className="account-small-action"
                type="button"
                onClick={() => void markAllNotificationsRead()}
                disabled={unreadCount === 0 || accountActionLoading}
              >
                {copy.markAllRead}
              </button>
            </header>
            {notifications.length === 0 ? (
              <p className="account-empty">{copy.noNotifications}</p>
            ) : (
              <div className="account-stack-list">
                {notifications.slice(0, 5).map((notification) => (
                  <article
                    className={!notification.isRead ? "is-unread" : ""}
                    key={notification.id}
                  >
                    <strong>{notification.title || notification.notificationType}</strong>
                    <span>{notification.message || copy.notUpdated}</span>
                    <p>{formatDate(notification.createdAt, locale)}</p>
                    {!notification.isRead && (
                      <button
                        className="account-inline-action"
                        type="button"
                        onClick={() => void markNotificationRead(notification.id)}
                        disabled={accountActionLoading}
                      >
                        <CheckCircle2 aria-hidden="true" />
                        {copy.markRead}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="account-panel account-preference-panel">
            <header>
              <div>
                <h2>{copy.preferences}</h2>
                <p>{preferences?.preferredTripMode || copy.notUpdated}</p>
              </div>
              <Home aria-hidden="true" />
            </header>
            <form className="account-compact-form" onSubmit={savePreferences}>
              <label>
                <span>{copy.budgetLevel}</span>
                <input
                  value={preferenceForm.budgetLevel}
                  onChange={updatePreferenceField("budgetLevel")}
                />
              </label>
              <label>
                <span>{copy.preferredTripMode}</span>
                <input
                  value={preferenceForm.preferredTripMode}
                  onChange={updatePreferenceField("preferredTripMode")}
                />
              </label>
              <label>
                <span>{copy.travelStyle}</span>
                <input
                  value={preferenceForm.travelStyle}
                  onChange={updatePreferenceField("travelStyle")}
                />
              </label>
              <label>
                <span>{copy.preferredDepartureCity}</span>
                <input
                  value={preferenceForm.preferredDepartureCity}
                  onChange={updatePreferenceField("preferredDepartureCity")}
                />
              </label>
              <label>
                <span>{copy.favoriteRegions}</span>
                <input
                  placeholder={copy.commaHint}
                  value={preferenceForm.favoriteRegions}
                  onChange={updatePreferenceField("favoriteRegions")}
                />
              </label>
              <label>
                <span>{copy.favoriteTags}</span>
                <input
                  placeholder={copy.commaHint}
                  value={preferenceForm.favoriteTags}
                  onChange={updatePreferenceField("favoriteTags")}
                />
              </label>
              <button type="submit" disabled={accountActionLoading}>
                <Save aria-hidden="true" />
                {copy.savePreferences}
              </button>
            </form>
          </section>
        </div>
        {accountActionMessage && (
          <p className="account-global-message">{accountActionMessage}</p>
        )}
        </main>
        <Footer />
      </div>
    </>
  );
}
