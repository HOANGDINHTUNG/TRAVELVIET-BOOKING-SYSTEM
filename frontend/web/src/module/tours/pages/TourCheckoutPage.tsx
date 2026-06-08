import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer/Footer";
import {
  tourCheckoutStorage,
  type TourCheckoutSession,
} from "../lib/tourCheckoutStorage";
import TourCheckoutForm from "../components/checkout/TourCheckoutForm";
import TourPayment from "../components/checkout/TourPayment";
import TourCheckoutSuccess from "../components/checkout/TourCheckoutSuccess";

export default function TourCheckoutPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<TourCheckoutSession | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    const data = tourCheckoutStorage.get();
    if (!data) {
      navigate("/tours"); // Fallback if no checkout session
      return;
    }
    setSession(data);
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="bg-[#f5f8fa] min-h-screen font-sans flex flex-col">
      {/* Header Stepper Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center gap-4 text-sm font-medium overflow-x-auto whitespace-nowrap">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 1 ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep >= 1 ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              1
            </span>
            <span>Nhập thông tin</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 mx-1" />
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 2 ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep >= 2 ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              2
            </span>
            <span>Thanh toán</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 mx-1" />
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 3 ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                currentStep >= 3 ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              3
            </span>
            <span>Hoàn tất</span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 py-8 relative">
        {currentStep === 1 && (
          <TourCheckoutForm
            session={session}
            onNext={(id: number) => {
              setBookingId(id);
              setCurrentStep(2);
            }}
          />
        )}
        {currentStep === 2 && bookingId && (
          <TourPayment
            session={session}
            bookingId={bookingId}
            onBack={() => setCurrentStep(1)}
            onSuccess={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && bookingId && (
          <TourCheckoutSuccess
            session={session}
            bookingId={bookingId}
            onNavigateHome={() => navigate("/")}
          />
        )}
      </main>

      {currentStep !== 2 && <Footer />}
    </div>
  );
}
