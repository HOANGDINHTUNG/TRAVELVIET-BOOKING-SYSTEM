import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [openSection, setOpenSection] = useState<string>("ewallet");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-[#f8f9fa] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <h3 className="text-xl font-bold text-slate-800">
            Các hình thức thanh toán
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 transition p-2 rounded-full hover:bg-slate-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Ví điện tử */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpenSection(openSection === "ewallet" ? "" : "ewallet")
              }
            >
              <div className="font-bold text-slate-800">Ví điện tử</div>
              {openSection === "ewallet" ? (
                <ChevronUp className="text-slate-400" size={20} />
              ) : (
                <ChevronDown className="text-slate-400" size={20} />
              )}
            </div>
            {openSection === "ewallet" && (
              <div className="px-6 pb-6 pt-2 grid grid-cols-4 gap-4">
                {[
                  {
                    id: "payoo",
                    img: "https://homepage.momocdn.net/blogscontents/momo-upload-api-220810143130-637957386906231940.png",
                  },
                  {
                    id: "vnpay",
                    img: "https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png",
                  },
                  {
                    id: "momo",
                    img: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                  },
                  {
                    id: "zalopay",
                    img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`cursor-pointer rounded-xl border p-2 flex items-center justify-center transition-all ${
                      selectedMethod === m.id
                        ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/20"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={m.id}
                      className="hidden"
                      onChange={() => setSelectedMethod(m.id)}
                    />
                    <img
                      src={m.img}
                      alt={m.id}
                      className="h-8 object-contain"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Thẻ tín dụng */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() =>
                setOpenSection(openSection === "credit" ? "" : "credit")
              }
            >
              <div className="font-bold text-slate-800">Thẻ tín dụng</div>
              {openSection === "credit" ? (
                <ChevronUp className="text-slate-400" size={20} />
              ) : (
                <ChevronDown className="text-slate-400" size={20} />
              )}
            </div>
            {openSection === "credit" && (
              <div className="px-6 pb-6 pt-2 grid grid-cols-4 gap-4">
                {[
                  {
                    id: "visa",
                    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png",
                  },
                  {
                    id: "mastercard",
                    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png",
                  },
                  {
                    id: "jcb",
                    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/200px-JCB_logo.svg.png",
                  },
                  {
                    id: "amex",
                    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png",
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`cursor-pointer rounded-xl border p-2 flex items-center justify-center transition-all ${
                      selectedMethod === m.id
                        ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/20"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={m.id}
                      className="hidden"
                      onChange={() => setSelectedMethod(m.id)}
                    />
                    <img
                      src={m.img}
                      alt={m.id}
                      className="h-6 object-contain"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <label className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name="payment_method"
                value="chuyen_khoan"
                checked={selectedMethod === "chuyen_khoan"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-5 h-5 appearance-none rounded-full border-2 border-slate-300 focus:outline-none checked:border-blue-500 transition-colors cursor-pointer"
              />
              {selectedMethod === "chuyen_khoan" && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute pointer-events-none"></div>
              )}
            </div>
            <span className="font-bold text-slate-800">Chuyển khoản</span>
          </label>

          <label className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name="payment_method"
                value="tien_mat"
                checked={selectedMethod === "tien_mat"}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-5 h-5 appearance-none rounded-full border-2 border-slate-300 focus:outline-none checked:border-blue-500 transition-colors cursor-pointer"
              />
              {selectedMethod === "tien_mat" && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute pointer-events-none"></div>
              )}
            </div>
            <span className="font-bold text-slate-800">Tiền mặt</span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onConfirm}
            disabled={!selectedMethod}
            className="bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 font-bold px-12 py-3 rounded-full transition-colors disabled:opacity-50 min-w-[200px]"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
