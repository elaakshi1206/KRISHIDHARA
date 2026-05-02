"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ArrowRight, CheckCircle2, Leaf } from "lucide-react";
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
        const pseudoEmail = method === "phone"
          ? `${inputValue.replace(/\D/g, "")}@krishidhara.app`
          : inputValue;
        const pseudoPassword = `KD_${inputValue.replace(/\D/g, "")}_secure2024`;
        let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: pseudoEmail,
          password: pseudoPassword,
        });
        let authUser = signInData?.user;
        let authSession = signInData?.session;
        if (signInError || !authUser) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: pseudoEmail,
            password: pseudoPassword,
            options: {
              data: {
                phone_number: method === "phone" ? `+91${inputValue}` : null,
                login_identifier: method === "phone" ? `+91${inputValue}` : inputValue,
              },
            },
          });
          if (signUpError) throw signUpError;
          authUser = signUpData?.user ?? null;
          authSession = signUpData?.session ?? null;
          if (authUser && !authSession) {
            toast.error("Email confirmation is enabled in Supabase. Please disable it and try again.");
            setLoading(false);
            return;
          }
        }
        if (!authUser) throw new Error("Authentication failed. Please try again.");
        localStorage.removeItem("krishidhara_demo_mode");
        localStorage.setItem("krishidhara_user_id", authUser.id);
        try {
          await recordLogin(authUser.id, { method: method === "phone" ? "phone_bypass" : "email_bypass", timestamp: new Date().toISOString(), userAgent: window.navigator.userAgent });
        } catch (e) {}
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
        await recordLogin(data.user.id, { method, timestamp: new Date().toISOString(), userAgent: window.navigator.userAgent });
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--beige)" }}>
      {/* Green Hero Header */}
      <div
        className="px-6 pt-14 pb-10 flex flex-col items-center"
        style={{
          background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        {/* Language switcher */}
        <div className="self-end flex gap-2 mb-6">
          {langOptions.map(opt => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className="w-9 h-9 rounded-xl text-xs font-black border border-white/20 transition-all"
              style={{
                background: language === opt.code ? "white" : "rgba(255,255,255,0.1)",
                color: language === opt.code ? "var(--primary-green)" : "rgba(255,255,255,0.8)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Logo Area */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
          <Leaf size={40} className="text-white" />
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-1">KrishiDhara</h1>
        <p className="text-green-100 text-sm font-medium text-center">
          {t("login.tagline") || "किसान का डिजिटल साथी 🌾"}
        </p>
      </div>

      {/* Login Card */}
      <div className="flex-1 px-5 pt-6 pb-10">
        <div className="card">
          <h2 className="text-center font-extrabold text-xl mb-5" style={{ color: "var(--text-primary)" }}>
            {t("login.welcome") || "लॉगिन करें"}
          </h2>

          {/* Method Toggle */}
          <div className="flex p-1 rounded-2xl mb-6" style={{ background: "var(--beige)" }}>
            <button
              onClick={() => { setMethod("phone"); setStep("input"); }}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: method === "phone" ? "white" : "transparent",
                color: method === "phone" ? "var(--primary-green)" : "var(--text-muted)",
                boxShadow: method === "phone" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Phone size={16} /> {t("login.mobile") || "Mobile"}
            </button>
            <button
              onClick={() => { setMethod("email"); setStep("input"); }}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: method === "email" ? "white" : "transparent",
                color: method === "email" ? "var(--primary-green)" : "var(--text-muted)",
                boxShadow: method === "email" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Mail size={16} /> {t("login.email") || "Email"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.div key="input-step" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
                    {method === "phone" ? (t("login.enter_mobile") || "Mobile Number") : (t("login.enter_email") || "Email")}
                  </label>
                  <div className="relative">
                    {method === "phone" && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm border-r pr-3"
                        style={{ color: "var(--primary-green)", borderColor: "var(--border)" }}>
                        +91
                      </span>
                    )}
                    <input
                      type={method === "phone" ? "tel" : "email"}
                      placeholder={method === "phone" ? "10-digit mobile number" : "your@email.com"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`input-field ${method === "phone" ? "pl-16" : "pl-4"}`}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 text-sm"
                  style={{ background: "linear-gradient(135deg, #2E7D32, #388E3C)", boxShadow: "0 6px 20px rgba(46,125,50,0.3)" }}
                >
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <>{t("common.send_otp") || "OTP भेजें"} <ArrowRight size={18} /></>
                  }
                </button>
              </motion.div>
            ) : (
              <motion.div key="otp-step" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-5">
                <div className="text-center p-3 rounded-2xl" style={{ background: "var(--beige)" }}>
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>OTP भेजा गया</p>
                  <p className="font-black text-base" style={{ color: "var(--text-primary)" }}>{inputValue}</p>
                  <button onClick={() => setStep("input")} className="text-xs font-black mt-1"
                    style={{ color: "var(--orange)" }}>
                    {t("common.change") || "Change"} →
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>
                    {t("login.enter_otp") || "6-digit OTP"}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field text-center text-2xl tracking-[0.5em] font-black"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span style={{ color: "var(--text-muted)" }}>{t("login.resend_timer") || "Resend in 30s"}</span>
                  <button className="font-black opacity-50" style={{ color: "var(--orange)" }}>
                    {t("common.resend_otp") || "Resend OTP"}
                  </button>
                </div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 text-sm"
                  style={{ background: "linear-gradient(135deg, #2E7D32, #388E3C)", boxShadow: "0 6px 20px rgba(46,125,50,0.3)" }}
                >
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <>{t("common.verify") || "Verify करें"} <CheckCircle2 size={18} /></>
                  }
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-4 rounded-2xl text-center"
          style={{ background: "var(--orange-pale)", border: "1px solid var(--orange-light)" }}>
          <p className="text-xs font-bold" style={{ color: "var(--orange-dark)" }}>
            💡 Demo Mode: Any number + OTP <span className="font-black">123456</span>
          </p>
        </div>

        <p className="mt-5 text-center text-xs px-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {t("login.terms") || "By continuing, you agree to our"}{" "}
          <span className="font-bold underline" style={{ color: "var(--primary-green)" }}>
            {t("login.terms_of_service") || "Terms of Service"}
          </span>{" "}
          {t("login.and") || "and"}{" "}
          <span className="font-bold underline" style={{ color: "var(--primary-green)" }}>
            {t("login.privacy_policy") || "Privacy Policy"}
          </span>
        </p>
      </div>
    </div>
  );
}
