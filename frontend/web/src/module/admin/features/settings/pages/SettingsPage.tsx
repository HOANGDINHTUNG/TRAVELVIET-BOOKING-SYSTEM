import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Sliders,
  Settings,
  CreditCard,
  Globe,
  Bell,
  CalendarDays,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Mock State cho các cài đặt ---
  // 1. General
  const [siteName, setSiteName] = useState("TravelViet Booking");
  const [contactEmail, setContactEmail] = useState("support@travelviet.com");
  const [hotline, setHotline] = useState("1900 1234");
  const [currency, setCurrency] = useState("VND");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // 2. Booking Rules
  const [cancelHours, setCancelHours] = useState(24);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [depositPercent, setDepositPercent] = useState(30);

  // 3. Payment Gateways
  const [vnpayEnabled, setVnpayEnabled] = useState(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);

  // 4. SEO & Tracking
  const [gaId, setGaId] = useState("G-XXXXXXXXXX");
  const [fbPixelid, setFbPixelId] = useState("");
  const [metaTitle, setMetaTitle] = useState(" | TraveViet Chuyên Tour");
  const [allowIndexing, setAllowIndexing] = useState(true);

  // 5. Notifications
  const [autoEmailConfirm, setAutoEmailConfirm] = useState(true);
  const [smsToAdmin, setSmsToAdmin] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setShowSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: "general", label: "Thông Tin Chung", icon: <Settings size={18} /> },
    {
      id: "booking",
      label: "Cấu hình Booking",
      icon: <CalendarDays size={18} />,
    },
    { id: "payment", label: "Cổng Thanh Toán", icon: <CreditCard size={18} /> },
    { id: "seo", label: "SEO & Theo Dõi", icon: <Globe size={18} /> },
    {
      id: "notifications",
      label: "Email & Thông Báo",
      icon: <Bell size={18} />,
    },
  ];

  // Helper Custom Switch
  const CustomSwitch = ({
    checked,
    onChange,
    colorClass = "peer-checked:bg-indigo-600",
  }: {
    checked: boolean;
    onChange: (c: boolean) => void;
    colorClass?: string;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 ${colorClass}`}
      ></div>
    </label>
  );

  return (
    <div className="space-y-6 max-w-[1200px] pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.08] pointer-events-none transform translate-x-12 -translate-y-8">
          <Sliders size={140} />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Sliders size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cấu hình Hệ Thống
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              Thiết lập các thông số hoạt động cốt lõi, thanh toán và SEO.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={18} /> Đã lưu thành công!
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-bold text-sm uppercase tracking-wide shadow-md shadow-indigo-500/20 disabled:opacity-70 min-w-[160px]"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                Đang Lưu...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={18} /> Lưu Cấu Hình
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="flex flex-col md:flex-row w-full h-full"
        >
          {/* Sidebar Tabs */}
          <Tabs.List className="w-full md:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 flex md:flex-col gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all font-bold text-sm text-slate-600 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-700 focus:outline-none whitespace-nowrap"
              >
                {tab.icon}
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab Contents */}
          <div className="flex-1 p-6 sm:p-10 bg-white dark:bg-slate-900 overflow-y-auto w-full">
            {/* 1. General Info */}
            <Tabs.Content
              value="general"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Định Danh Hệ Thống
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tên Website / Thương hiệu
                    </label>
                    <input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tiền tệ mặc định
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold appearance-none"
                    >
                      <option value="VND">VND (Việt Nam Đồng)</option>
                      <option value="USD">USD (Đô la Mỹ)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Email Liên Hệ Hỗ Trợ
                    </label>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hotline (Số điện thoại)
                    </label>
                    <input
                      value={hotline}
                      onChange={(e) => setHotline(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Trạng Thái Hoạt Động
                </h2>
                <div className="flex items-center justify-between p-5 rounded-2xl border border-rose-100 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-900/10 transition hover:bg-rose-50/80">
                  <div className="flex flex-col gap-1 pr-4">
                    <label className="font-bold text-rose-700 dark:text-rose-400">
                      {" "}
                      Chế độ Bảo trì (Maintenance Mode)
                    </label>
                    <span className="text-sm font-medium text-slate-500">
                      Khách hàng sẽ thấy trang thông báo bảo trì, chặn mọi truy
                      cập thanh toán.
                    </span>
                  </div>
                  <CustomSwitch
                    checked={maintenanceMode}
                    onChange={setMaintenanceMode}
                    colorClass="peer-checked:bg-rose-500"
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* 2. Booking Rules */}
            <Tabs.Content
              value="booking"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Luật Đặt Vé (Booking Rules)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Thời gian giữ chỗ (Giờ)
                    </label>
                    <input
                      type="number"
                      value={cancelHours}
                      onChange={(e) => setCancelHours(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold tabular-nums"
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      Hệ thống sẽ tự hủy nếu chưa thanh toán.
                    </span>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tỷ lệ Cọc Trước (%)
                    </label>
                    <input
                      type="number"
                      value={depositPercent}
                      onChange={(e) =>
                        setDepositPercent(Number(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold tabular-nums"
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      % giá trị đơn hàng khách phải thanh toán ngay.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <div className="flex flex-col gap-1 pr-4">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      {" "}
                      Cho phép Đặt vé Ẩn danh (Guest Checkout)
                    </label>
                    <span className="text-sm font-medium text-slate-500">
                      Khách hàng có thể đặt vé mà không cần đăng nhập tài khoản.
                    </span>
                  </div>
                  <CustomSwitch
                    checked={guestCheckout}
                    onChange={setGuestCheckout}
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* 3. Payment */}
            <Tabs.Content
              value="payment"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Tích hợp Cổng Thanh Toán
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-900/10 hover:bg-indigo-50/60 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <div className="flex items-center gap-2">
                        <label className="font-bold text-indigo-900 dark:text-indigo-300">
                          {" "}
                          Ví điện tử VNPAY
                        </label>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-700 uppercase tracking-widest hidden sm:inline-block">
                          Khuyên dùng
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        Cho phép thanh toán bằng QR Code, thẻ nội địa và thẻ
                        quốc tế.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={vnpayEnabled}
                      onChange={setVnpayEnabled}
                      colorClass="peer-checked:bg-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {" "}
                        Chuyển khoản ngân hàng
                      </label>
                      <span className="text-sm font-medium text-slate-500">
                        Khách chuyển khoản bằng tay vào ngân hàng. Đòi hỏi xác
                        nhận thủ công.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={bankTransferEnabled}
                      onChange={setBankTransferEnabled}
                      colorClass="peer-checked:bg-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {" "}
                        Trả bằng tiền mặt
                      </label>
                      <span className="text-sm font-medium text-slate-500">
                        Cho phép trả tại cửa hàng hoặc phòng vé trực tiếp.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={cashEnabled}
                      onChange={setCashEnabled}
                      colorClass="peer-checked:bg-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* 4. SEO */}
            <Tabs.Content
              value="seo"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Theo dõi hành vi (Tracking Pixels)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Google Analytics ID
                    </label>
                    <input
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Facebook Pixel ID
                    </label>
                    <input
                      value={fbPixelid}
                      onChange={(e) => setFbPixelId(e.target.value)}
                      placeholder="Ex: 1234567890123"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Tối Ưu SEO
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {" "}
                        Cho phép Robots (Indexing)
                      </label>
                      <span className="text-sm font-medium text-slate-500">
                        Mở khóa nội dung cho GoogleBot và BingBot đọc dữ liệu.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={allowIndexing}
                      onChange={setAllowIndexing}
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hậu tố Tiêu đề (Meta Title Prefix)
                    </label>
                    <input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <span className="text-xs text-slate-500">
                      Chuỗi này sẽ dán vào đằng sau tiêu đề các trang.
                    </span>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            {/* 5. Notifications */}
            <Tabs.Content
              value="notifications"
              className="space-y-8 animate-in fade-in-50 duration-500"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  Workflow Tự Động
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {" "}
                        Auto-Reply Invoice
                      </label>
                      <span className="text-sm font-medium text-slate-500">
                        Gửi tự động hóa đơn PDF qua email cho khách.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={autoEmailConfirm}
                      onChange={setAutoEmailConfirm}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <div className="flex flex-col gap-1 pr-4">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {" "}
                        Alert Quản trị viên
                      </label>
                      <span className="text-sm font-medium text-slate-500">
                        Gửi SMS hoặc Zalo cho Admin khi có đặt cọc lớn.
                      </span>
                    </div>
                    <CustomSwitch
                      checked={smsToAdmin}
                      onChange={setSmsToAdmin}
                      colorClass="peer-checked:bg-amber-500"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}
