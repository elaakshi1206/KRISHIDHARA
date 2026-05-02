"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Cloud, CloudRain, Sun, Wind, MapPin, 
  Scan, BarChart3, TrendingUp, Landmark, 
  MessageSquare, UserCircle, Bell,
  ChevronRight, ArrowUpRight, Plus, ShieldCheck, Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { fetchUserDetails } from "@/utils/supabase/profile";
import { useLanguage, Language } from "@/providers/LanguageProvider";

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // 1. If we already have saved user data locally, show dashboard immediately
      const savedData = localStorage.getItem("krishidhara_user");
      if (savedData) {
        localStorage.setItem("krishidhara_visited", "true");
        setUserData(JSON.parse(savedData));
        return;
      }

      // 2. Check if there is an active Supabase session
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
            // Authenticated but no profile yet — go to setup
            localStorage.setItem("krishidhara_visited", "true");
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/setup");
        }
        return;
      }

      // 3. No session and no local data — show splash on first visit, else go to login
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

  return (
    <div className="min-h-screen bg-green-50 pb-24">
      {/* Top Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm shadow-green-100 sticky top-0 z-20 border-b border-green-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center border border-green-200 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            <div>
              <p className="text-xs text-green-600 font-black uppercase tracking-wider">{t("common.app_name")}</p>
              <div className="flex items-center gap-1 text-green-900 font-bold">
                <MapPin size={14} className="text-yellow-500" />
                <span>{userData.village}, {userData.state}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="w-10 h-10 bg-yellow-50 border border-yellow-200 rounded-full flex items-center justify-center text-yellow-700 font-black text-xs"
              >
                {langLabels[language]}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-12 bg-white border border-green-100 rounded-2xl shadow-xl shadow-green-100/50 py-2 z-50 min-w-[120px]">
                  {langOptions.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => { setLanguage(opt.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-all ${language === opt.code ? "text-[var(--primary-green)] bg-green-50" : "text-green-800 hover:bg-green-50"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => router.push("/notifications")}
              className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100 relative"
            >
              <Bell size={20} className="text-green-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => router.push("/profile")} className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <UserCircle size={24} className="text-green-700" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-green-900 tracking-tight">
            {t("dashboard.greeting")}, {userData.name} 👋
          </h1>
          <p className="text-green-600 font-medium">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Weather Widget */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-green-600 to-green-800 rounded-[32px] p-6 text-white shadow-xl shadow-green-800/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 scale-150 rotate-12">
            <Sun size={120} />
          </div>
          
          <div className="relative flex justify-between items-start mb-6">
            <div>
              <p className="text-green-100 font-bold uppercase tracking-widest text-xs mb-1">{t("dashboard.weather_title")}</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold">32°C</span>
                <div className="bg-yellow-400/20 border border-yellow-300/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-200">{t("dashboard.sunny")}</div>
              </div>
            </div>
            <Sun size={48} className="text-yellow-300" />
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
            {[
              { label: t("dashboard.humidity"), val: "45%", icon: <CloudRain size={16} /> },
              { label: t("dashboard.wind"), val: "12km/h", icon: <Wind size={16} /> },
              { label: t("dashboard.uv"), val: t("dashboard.uv_high"), icon: <Sun size={16} /> },
              { label: t("dashboard.forecast"), val: t("dashboard.forecast_clear"), icon: <Cloud size={16} /> },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center text-white/60 mb-1">{item.icon}</div>
                <p className="text-[10px] text-white/60 font-bold uppercase">{item.label}</p>
                <p className="text-sm font-bold">{item.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: t("dashboard.quick_actions.monitor"), icon: <Scan className="text-green-600" />, path: "/monitor" },
            { label: t("dashboard.quick_actions.markets"), icon: <TrendingUp className="text-yellow-500" />, path: "/market" },
            { label: t("dashboard.quick_actions.schemes"), icon: <Landmark className="text-green-700" />, path: "/schemes" },
            { label: t("dashboard.quick_actions.expert"), icon: <MessageSquare className="text-yellow-600" />, path: "/chat" },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => router.push(action.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-green-100 group-active:scale-95 transition-all">
                {action.icon}
              </div>
              <span className="text-[11px] font-black text-green-800 uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Main Features */}
        <div className="mt-10 space-y-8">
          {/* Govt Schemes */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-green-900">{t("dashboard.schemes_hub")}</h2>
                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{t("dashboard.schemes_subtitle")}</p>
              </div>
              <button onClick={() => router.push("/schemes")} className="text-yellow-600 text-sm font-black flex items-center gap-1">
                {t("dashboard.view_all")} <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/schemes")}
                className="bg-white rounded-[28px] border-l-4 border-l-yellow-400 border border-yellow-100 bg-gradient-to-r from-white to-yellow-50/40 p-5 flex items-center gap-4 relative overflow-hidden shadow-sm cursor-pointer"
              >
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
                  <Landmark size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Hot</span>
                    <h3 className="font-bold text-green-900">{t("dashboard.pm_kisan_name")}</h3>
                  </div>
                  <p className="text-sm text-green-700 font-medium line-clamp-1">{t("dashboard.pm_kisan_desc")}</p>
                  <p className="text-xs text-yellow-600 font-black mt-2 flex items-center gap-1">
                    {t("dashboard.check_eligibility")} <ArrowUpRight size={14} />
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[24px] p-4 border border-green-100 shadow-sm border-l-4 border-l-green-500">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-green-900 text-sm mb-1 leading-tight">{t("dashboard.pm_fasal")}</h3>
                  <p className="text-[10px] text-green-600 font-medium">{t("dashboard.pm_fasal_desc")}</p>
                </div>
                <div className="bg-white rounded-[24px] p-4 border border-green-100 shadow-sm border-l-4 border-l-yellow-400">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-3">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-green-900 text-sm mb-1 leading-tight">{t("dashboard.soil_health")}</h3>
                  <p className="text-[10px] text-green-600 font-medium">{t("dashboard.soil_health_desc")}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Crop Monitoring */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-green-900">{t("dashboard.crop_monitoring")}</h2>
                <p className="text-xs text-green-600 font-black uppercase tracking-wider">{t("dashboard.crop_ai")}</p>
              </div>
            </div>
            
            <div className="relative h-48 rounded-[32px] overflow-hidden group shadow-lg">
              <Image 
                src="/hero.png" 
                alt="Crop Hero" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg">{t("dashboard.analyze_health")}</h3>
                <p className="text-white/70 text-sm mb-4">{t("dashboard.analyze_desc")}</p>
                <button 
                  onClick={() => router.push("/monitor")}
                  className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2 w-max"
                >
                  <Scan size={18} /> {t("common.scan_now")}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 px-6 py-4 flex justify-between items-center z-50 shadow-lg shadow-green-100/50">
        {[
          { label: t("common.home"), icon: <Sun size={24} />, active: true },
          { label: t("common.monitor"), icon: <Scan size={24} />, path: "/monitor" },
          { label: t("common.schemes"), icon: <Landmark size={24} />, path: "/schemes" },
          { label: t("common.market"), icon: <BarChart3 size={24} />, path: "/market" },
          { label: t("common.news"), icon: <Plus size={24} />, path: "/news" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => (item as any).path && router.push((item as any).path)}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-[var(--primary-green)]" : "text-green-400"}`}
          >
            <div className={`${item.active ? "bg-green-100 p-2 rounded-xl" : ""}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider ${item.active ? "text-green-700" : "text-green-400"}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
