"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Scan, Camera, Upload, 
  ShieldCheck, AlertTriangle, Activity, 
  CheckCircle2, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/providers/LanguageProvider";

export default function MonitorPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "scanning" | "result">("idle");
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setStatus("scanning");
    setProgress(0);
  };

  useEffect(() => {
    if (status === "scanning") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus("result"), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-green-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between sticky top-0 z-20 bg-green-900/80 backdrop-blur-md border-b border-green-800">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-green-800 rounded-2xl active:scale-95 transition-all border border-green-700"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black italic tracking-tight">{t("monitor.title")}</h1>
        <div className="w-12"></div>
      </div>

      <div className="px-6 pb-28">
        {/* Main Scanner Area */}
        <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-green-800 border-4 border-green-700 shadow-2xl mt-4">
          <Image 
            src="/hero.png" 
            alt="Crop to scan" 
            fill 
            className={`object-cover transition-all duration-1000 ${status === "scanning" ? "scale-110 blur-[2px]" : ""}`} 
          />
          
          <AnimatePresence>
            {status === "idle" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/50 backdrop-blur-[2px]"
              >
                <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border-2 border-yellow-400/40">
                  <Camera size={40} className="text-yellow-300" />
                </div>
                <p className="font-black text-lg mb-2 text-white">{t("monitor.ready")}</p>
                <p className="text-sm text-white/60 font-bold mb-8">{t("monitor.place_leaf")}</p>
                <button 
                  onClick={startScan}
                  className="bg-yellow-400 text-green-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-yellow-500/30 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Scan size={20} /> {t("monitor.start_analysis")}
                </button>
              </motion.div>
            )}

            {status === "scanning" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8)] z-10"
                />
                
                {/* Overlay Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 opacity-10">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-yellow-300" />
                  ))}
                </div>

                {/* Progress UI */}
                <div className="absolute bottom-12 left-6 right-6 bg-green-900/80 backdrop-blur-md p-6 rounded-3xl border border-green-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-yellow-400">{t("monitor.analyzing")}</span>
                    <span className="text-sm font-black text-white">{progress}%</span>
                  </div>
                  <div className="h-2 bg-green-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {status === "result" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-green-900/95 backdrop-blur-xl p-8 flex flex-col"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center mb-6 border-4 border-yellow-400/30">
                    <CheckCircle2 size={50} className="text-yellow-400" />
                  </div>
                  <h2 className="text-3xl font-black mb-2 text-white">{t("monitor.healthy")}</h2>
                  <p className="text-green-300 font-bold mb-10">{t("monitor.analysis_complete")}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-green-800/60 p-4 rounded-3xl border border-green-700 text-left">
                      <Activity size={20} className="text-yellow-400 mb-3" />
                      <p className="text-[10px] font-black uppercase text-green-400 tracking-widest">{t("monitor.health_score")}</p>
                      <p className="text-xl font-black text-yellow-400">94.2%</p>
                    </div>
                    <div className="bg-green-800/60 p-4 rounded-3xl border border-green-700 text-left">
                      <ShieldCheck size={20} className="text-green-400 mb-3" />
                      <p className="text-[10px] font-black uppercase text-green-400 tracking-widest">{t("monitor.pest_status")}</p>
                      <p className="text-xl font-black text-green-400">{t("monitor.safe")}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStatus("idle")}
                  className="bg-yellow-400 text-green-900 w-full py-5 rounded-[24px] font-black text-lg active:scale-95 transition-all mt-8"
                >
                  {t("monitor.scan_another")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Cards */}
        <div className="mt-6 space-y-4">
          <div className="bg-green-800 border border-green-700 rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-400">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm text-white">{t("monitor.nearby_alerts")}</h4>
              <p className="text-xs text-green-400 font-medium leading-relaxed">{t("monitor.nearby_alerts_desc")}</p>
            </div>
          </div>
          
          <div className="bg-green-800 border border-green-700 rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/30 rounded-2xl flex items-center justify-center text-green-300">
              <Info size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm text-white">{t("monitor.tips")}</h4>
              <p className="text-xs text-green-400 font-medium leading-relaxed">{t("monitor.tips_desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-green-900 border-t border-green-800 flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-800 border border-green-700 py-4 rounded-2xl font-black text-sm text-white active:scale-95 transition-all">
          <Upload size={18} /> {t("monitor.from_gallery")}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-green-900 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">
          <Camera size={18} /> {t("monitor.open_camera")}
        </button>
      </div>
    </div>
  );
}
