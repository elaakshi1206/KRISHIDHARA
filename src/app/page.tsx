"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Bell, UserCircle, Sun, CloudRain, Wind,
  TrendingUp, TrendingDown, ChevronRight, Zap,
  Thermometer, Droplets, AlertTriangle, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { fetchUserDetails } from "@/utils/supabase/profile";
import { useLanguage, Language } from "@/providers/LanguageProvider";
import BottomNav from "@/components/ui/BottomNav";

const mandiRates = [
  { crop: "गेहूं", cropEn: "Wheat", price: 2840, change: 2.3, unit: "q", emoji: "🌾" },
  { crop: "कपास", cropEn: "Cotton", price: 7200, change: -1.1, unit: "q", emoji: "🤍" },
  { crop: "मूंगफली", cropEn: "Groundnut", price: 6800, change: 3.1, unit: "q", emoji: "🥜" },
  { crop: "प्याज", cropEn: "Onion", price: 1200, change: -0.8, unit: "q", emoji: "🧅" },
];

const quickActions = [
  { labelHi: "मौसम", emoji: "🌤️", path: "/weather", color: "#E1F5FE", iconColor: "#0288D1" },
  { labelHi: "मंडी", emoji: "📈", path: "/market", color: "#E8F5E9", iconColor: "#2E7D32" },
  { labelHi: "योजनाएं", emoji: "🏛️", path: "/schemes", color: "#FFF8E1", iconColor: "#F57F17" },
  { labelHi: "विशेषज्ञ", emoji: "👨‍🌾", path: "/chat", color: "#FCE4EC", iconColor: "#C62828" },
  { labelHi: "मेरा खेत", emoji: "🌱", path: "/my-farm", color: "#F3E5F5", iconColor: "#6A1B9A" },
  { labelHi: "बेचें", emoji: "🛒", path: "/sell", color: "#FFF3E0", iconColor: "#E65100" },
];

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const savedData = localStorage.getItem("krishidhara_user");
      if (savedData) {
        localStorage.setItem("krishidhara_visited", "true");
        setUserData(JSON.parse(savedData));
        return;
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const profile = await fetchUserDetails(user.id);
          if (profile) {
            const formattedData = {
              name: profile.full_name,
              village: profile.village,
              state: profile.state,
              ...profile.farm_details
            };
            setUserData(formattedData);
            localStorage.setItem("krishidhara_user", JSON.stringify(formattedData));
            localStorage.setItem("krishidhara_visited", "true");
          } else {
            localStorage.setItem("krishidhara_visited", "true");
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/setup");
        }
        return;
      }
      const hasVisited = localStorage.getItem("krishidhara_visited");
      if (!hasVisited) {
        localStorage.setItem("krishidhara_visited", "true");
        router.push("/splash");
      } else {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  if (!userData) return null;

  const langLabels: Record<Language, string> = { en: "EN", hi: "हि", mr: "म" };
  const langOptions: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  const firstName = (userData.name || "Farmer").split(" ")[0];

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--beige)" }}>
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-yellow-300" />
            <span className="text-green-100 text-sm font-semibold">
              {userData.village}, {userData.state}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-yellow-300 border border-white/20 bg-white/10"
              >
                {langLabels[language]}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-2xl py-1.5 z-50 min-w-[130px] border border-gray-100">
                  {langOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setLanguage(opt.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-all ${
                        language === opt.code ? "text-[var(--primary-green)] bg-green-50" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => router.push("/notifications")}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 relative"
            >
              <Bell size={18} className="text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full border border-green-700" />
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/20"
            >
              <UserCircle size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <p className="text-green-200 text-sm font-medium">नमस्ते 🙏</p>
          <h1 className="text-white text-2xl font-extrabold leading-tight">
            {firstName} Ji 🌾
          </h1>
          <p className="text-green-200 text-sm mt-0.5">आज का दिन शुभ हो!</p>
        </div>

        {/* Weather Card inside header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sun size={24} className="text-yellow-300" />
              <span className="text-white text-3xl font-black">32°C</span>
            </div>
            <p className="text-green-100 text-xs font-semibold">धूप वाला दिन · Clear Sky</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              { icon: <Droplets size={12}/>, val: "65%" },
              { icon: <Wind size={12}/>, val: "12km/h" },
              { icon: <CloudRain size={12}/>, val: "3 days" },
              { icon: <Thermometer size={12}/>, val: "UV High" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-green-100">
                <span className="opacity-70">{item.icon}</span>
                <span className="text-[11px] font-semibold">{item.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-5 mt-5 space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Crop Health", val: "अच्छा ✓", color: "var(--primary-green)", bg: "#E8F5E9" },
            { label: "Today's Rate", val: "₹2,840/q", color: "var(--orange-dark)", bg: "var(--orange-pale)" },
            { label: "Water Level", val: "78% 💧", color: "var(--sky-blue-dark)", bg: "var(--sky-blue-pale)" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-3 text-center" style={{ background: stat.bg }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: stat.color, opacity: 0.8 }}>{stat.label}</p>
              <p className="text-xs font-black" style={{ color: stat.color }}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="section-title text-base mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center"
                style={{ background: action.color }}
              >
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-[10px] font-bold leading-tight" style={{ color: action.iconColor }}>
                  {action.labelHi}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Mandi Rates Snapshot */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="section-title text-base">आज की मंडी दरें</h2>
              <p className="section-subtitle text-[10px]">Today's Mandi Rates</p>
            </div>
            <button
              onClick={() => router.push("/market")}
              className="flex items-center gap-1 text-xs font-bold"
              style={{ color: "var(--orange)" }}
            >
              सब देखें <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {mandiRates.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "var(--beige)" }}>
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{item.crop}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.cropEn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    ₹{item.price.toLocaleString("en-IN")}/{item.unit}
                  </p>
                  <div className="flex items-center justify-end gap-0.5">
                    {item.change > 0
                      ? <TrendingUp size={11} style={{ color: "var(--success)" }} />
                      : <TrendingDown size={11} style={{ color: "var(--danger)" }} />
                    }
                    <span className="text-[10px] font-bold"
                      style={{ color: item.change > 0 ? "var(--success)" : "var(--danger)" }}>
                      {item.change > 0 ? "+" : ""}{item.change}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-5 flex gap-4 items-center"
          style={{ background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)", border: "1px solid #FFCC8060" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: "var(--orange)", boxShadow: "0 4px 12px rgba(255,152,0,0.3)" }}>
            💡
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={11} style={{ color: "var(--orange-dark)" }} />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--orange-dark)" }}>आज की सलाह</span>
            </div>
            <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
              आज गेहूं की कटाई का सही समय है। सुबह जल्दी करें।
            </p>
          </div>
        </motion.div>

        {/* AI Crop Doctor Banner */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/monitor")}
          className="rounded-3xl p-5 flex items-center gap-4 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)", boxShadow: "0 8px 32px rgba(46,125,50,0.25)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            🔬
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={11} className="text-yellow-300" />
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300">AI Crop Doctor</span>
            </div>
            <p className="text-white font-bold text-sm leading-snug">फसल की फोटो लें और बीमारी पहचानें</p>
            <p className="text-green-200 text-[11px] mt-0.5">Instant disease &amp; pest detection</p>
          </div>
          <ChevronRight size={20} className="text-white/60 shrink-0" />
        </motion.div>

        {/* Weather Alert */}
        <div
          className="rounded-3xl p-4 flex items-start gap-3"
          style={{ background: "#FFF8E1", border: "1px solid #FBC02D40" }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--yellow-accent)" }}>
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>⚠️ मौसम चेतावनी</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
              मंगलवार को भारी बारिश की संभावना। कटाई में देरी करें।
            </p>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
    </div>
  );
}
