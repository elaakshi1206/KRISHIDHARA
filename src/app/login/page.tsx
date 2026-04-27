"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = () => {
    if (!inputValue) {
      toast.error(method === "phone" ? "Please enter your mobile number" : "Please enter your email");
      return;
    }
    setLoading(true);
    // Simulate API call for demo purposes
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success("OTP sent successfully! (Demo Mode)");
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }
    setLoading(true);
    // Simulate verification for demo purposes
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful!");
      router.push("/setup");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Section with Logo */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome to KrishiDhara</h2>
          <p className="text-slate-500 mt-1">Kisanon Ka Sacha Saathi</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-12 flex flex-col">
        <div className="bg-white rounded-3xl shadow-sm p-6 flex-1">
          {/* Method Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => { setMethod("phone"); setStep("input"); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                method === "phone" ? "bg-white text-primary-green shadow-sm" : "text-slate-500"
              }`}
            >
              <Phone size={18} /> Mobile
            </button>
            <button
              onClick={() => { setMethod("email"); setStep("input"); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                method === "email" ? "bg-white text-primary-green shadow-sm" : "text-slate-500"
              }`}
            >
              <Mail size={18} /> Email
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.div
                key="input-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {method === "phone" ? "Enter Mobile Number" : "Enter Email Address"}
                  </label>
                  <div className="relative">
                    {method === "phone" && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold border-r pr-3">+91</span>
                    )}
                    <input
                      type={method === "phone" ? "tel" : "email"}
                      placeholder={method === "phone" ? "00000 00000" : "farmer@example.com"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`input-field ${method === "phone" ? "pl-16" : "pl-4"}`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Send OTP <ArrowRight size={20} /></>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-slate-600 mb-2">Verification code sent to</p>
                  <p className="font-bold text-slate-800">{inputValue}</p>
                  <button onClick={() => setStep("input")} className="text-primary-green text-sm font-semibold mt-1">Change</button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field text-center text-2xl tracking-[1em] font-bold"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Resend OTP in 00:45</span>
                  <button className="text-primary-green font-bold opacity-50 cursor-not-allowed">Resend Now</button>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Verify & Continue <CheckCircle2 size={20} /></>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-slate-400">Or continue with</span>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                <span className="font-semibold text-slate-700">Google</span>
              </button>
              <button className="flex-1 py-3 border border-slate-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <Image src="https://www.svgrepo.com/show/442911/apple.svg" alt="Apple" width={20} height={20} />
                <span className="font-semibold text-slate-700">Apple</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 px-8 leading-relaxed">
          By continuing, you agree to our <span className="text-slate-600 font-semibold underline underline-offset-2">Terms of Service</span> and <span className="text-slate-600 font-semibold underline underline-offset-2">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
