"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { recordLogin } from "@/utils/supabase/activity";
import { useLanguage, Language } from "@/providers/LanguageProvider";

export default function LoginPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const handleSendOTP = async () => {
    if (!inputValue) {
      toast.error(method === "phone" ? "Please enter your mobile number" : "Please enter your email");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.signInWithOtp(
        method === "phone" 
          ? { phone: `+91${inputValue}` } 
          : { email: inputValue }
      );

      if (error) {
        // Rate limit or phone not enabled — silently fall back to demo mode
        const isRateLimit = error.message?.toLowerCase().includes("rate limit") || error.message?.toLowerCase().includes("email rate");
        if (isRateLimit || error.status === 429) {
          setStep("otp");
          toast.info("Rate limit reached. Enter 123456 to continue in demo mode.");
        } else {
          setStep("otp");
          toast.info("OTP unavailable. Enter 123456 to continue in demo mode.");
        }
        return;
      }

      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Auth error:", error);
      // Still move to OTP step so user can use bypass
      setStep("otp");
      toast.info("Enter 123456 to continue in demo mode.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    
    try {
      if (otp === "123456") {
        // Default OTP bypass — create/sign-in a real Supabase account so data is stored in the actual DB
        // Derive a deterministic email+password from the user's phone/email input
        const identifier = method === "phone" ? `+91${inputValue}` : inputValue;
        const pseudoEmail = method === "phone"
          ? `${inputValue.replace(/\D/g, "")}@krishidhara.app`
          : inputValue;
        const pseudoPassword = `KD_${inputValue.replace(/\D/g, "")}_secure2024`;

        // Try sign-in first (returning user)
        let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: pseudoEmail,
          password: pseudoPassword,
        });

        let authUser = signInData?.user;
        let authSession = signInData?.session;

        // If sign-in fails (new user), create the account
        if (signInError || !authUser) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: pseudoEmail,
            password: pseudoPassword,
            options: {
              data: {
                phone_number: method === "phone" ? identifier : null,
                login_identifier: identifier,
              },
            },
          });

          if (signUpError) {
            console.error("[Login] Sign-up error:", signUpError);
            throw signUpError;
          }

          authUser = signUpData?.user ?? null;
          authSession = signUpData?.session ?? null;

          // If session is null, email confirmation is required in Supabase settings
          if (authUser && !authSession) {
            toast.error("Email confirmation is enabled. Please disable it in your Supabase dashboard (Authentication → Settings → Disable email confirmations) and try again.");
            setLoading(false);
            return;
          }
        }

        if (!authUser) {
          throw new Error("Authentication failed. Please try again.");
        }

        // Clear any old demo mode flags
        localStorage.removeItem("krishidhara_demo_mode");
        localStorage.setItem("krishidhara_user_id", authUser.id);

        try {
          await recordLogin(authUser.id, { method: method === "phone" ? "phone_bypass" : "email_bypass", timestamp: new Date().toISOString(), userAgent: window.navigator.userAgent });
        } catch (e) {
          // Ignore — login_history table may not exist yet
        }

        toast.success("Login successful!");
        router.push("/setup");
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp(
        method === "phone"
          ? { phone: `+91${inputValue}`, token: otp, type: "sms" }
          : { email: inputValue, token: otp, type: "email" }
      );

      if (error) throw error;

      if (data.user) {
        await recordLogin(data.user.id, {
          method,
          timestamp: new Date().toISOString(),
          userAgent: window.navigator.userAgent
        });

        toast.success("Login successful!");
        router.push("/setup");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const langOptions: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हि" },
    { code: "mr", label: "म" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Language Switcher Bar */}
      <div className="flex justify-end gap-2 px-6 pt-6">
        {langOptions.map(opt => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`w-10 h-10 rounded-full text-xs font-black border-2 transition-all ${
              language === opt.code 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-green-700 border-green-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Top Section with Logo */}
      <div className="bg-white px-6 pt-8 pb-8 rounded-b-[40px] shadow-sm border-b border-green-100 mx-4 mt-2 rounded-t-[40px]">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-2xl font-black text-green-900">{t("login.welcome")}</h2>
          <p className="text-green-600 mt-1 font-medium">{t("login.tagline")}</p>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-12 flex flex-col">
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-6 flex-1">
          {/* Method Toggle */}
          <div className="flex p-1 bg-green-50 rounded-2xl mb-8 border border-green-100">
            <button
              onClick={() => { setMethod("phone"); setStep("input"); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                method === "phone" ? "bg-white text-green-700 shadow-sm border border-green-100" : "text-green-500"
              }`}
            >
              <Phone size={18} /> {t("login.mobile")}
            </button>
            <button
              onClick={() => { setMethod("email"); setStep("input"); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                method === "email" ? "bg-white text-green-700 shadow-sm border border-green-100" : "text-green-500"
              }`}
            >
              <Mail size={18} /> {t("login.email")}
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
                  <label className="block text-sm font-black text-green-800 mb-2">
                    {method === "phone" ? t("login.enter_mobile") : t("login.enter_email")}
                  </label>
                  <div className="relative">
                    {method === "phone" && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold border-r border-green-200 pr-3">+91</span>
                    )}
                    <input
                      type={method === "phone" ? "tel" : "email"}
                      placeholder={method === "phone" ? t("login.placeholder_phone") : t("login.placeholder_email")}
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
                    <>{t("common.send_otp")} <ArrowRight size={20} /></>
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
                  <p className="text-green-700 mb-2">{t("login.verification_sent")}</p>
                  <p className="font-black text-green-900">{inputValue}</p>
                  <button onClick={() => setStep("input")} className="text-yellow-600 text-sm font-black mt-1">{t("common.change")}</button>
                </div>

                <div>
                  <label className="block text-sm font-black text-green-800 mb-2">{t("login.enter_otp")}</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field text-center text-2xl tracking-[0.5em] font-black"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-500">{t("login.resend_timer")}</span>
                  <button className="text-yellow-600 font-black opacity-50 cursor-not-allowed">{t("common.resend_otp")}</button>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>{t("common.verify")} <CheckCircle2 size={20} /></>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-100"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-green-400 font-medium">{t("common.or_continue")}</span>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-green-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50 transition-all">
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                <span className="font-bold text-green-800">Google</span>
              </button>
              <button className="flex-1 py-3 border border-green-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50 transition-all">
                <Image src="https://www.svgrepo.com/show/442911/apple.svg" alt="Apple" width={20} height={20} />
                <span className="font-bold text-green-800">Apple</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-green-500 px-8 leading-relaxed">
          {t("login.terms")} <span className="text-green-700 font-bold underline underline-offset-2">{t("login.terms_of_service")}</span> {t("login.and")} <span className="text-green-700 font-bold underline underline-offset-2">{t("login.privacy_policy")}</span>
        </p>
      </div>
    </div>
  );
}
