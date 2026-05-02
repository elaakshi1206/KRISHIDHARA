"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, TrendingUp, TrendingDown, MapPin, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { useLanguage } from "@/providers/LanguageProvider";

const priceHistory = {
  "Wheat": [
    { day: "Mon", price: 2210 }, { day: "Tue", price: 2235 }, { day: "Wed", price: 2220 },
    { day: "Thu", price: 2260 }, { day: "Fri", price: 2250 }, { day: "Sat", price: 2280 }, { day: "Sun", price: 2275 },
  ],
  "Rice": [
    { day: "Mon", price: 2195 }, { day: "Tue", price: 2205 }, { day: "Wed", price: 2180 },
    { day: "Thu", price: 2190 }, { day: "Fri", price: 2175 }, { day: "Sat", price: 2185 }, { day: "Sun", price: 2183 },
  ],
  "Maize": [
    { day: "Mon", price: 1910 }, { day: "Tue", price: 1925 }, { day: "Wed", price: 1940 },
    { day: "Thu", price: 1935 }, { day: "Fri", price: 1950 }, { day: "Sat", price: 1965 }, { day: "Sun", price: 1962 },
  ],
  "Cotton": [
    { day: "Mon", price: 6850 }, { day: "Tue", price: 6900 }, { day: "Wed", price: 6950 },
    { day: "Thu", price: 6920 }, { day: "Fri", price: 7000 }, { day: "Sat", price: 7050 }, { day: "Sun", price: 7020 },
  ]
};

export default function MarketPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  const prices = [
    { crop: "Wheat", price: "₹2,275/q", trend: "up", change: "+₹25" },
    { crop: "Rice", price: "₹2,183/q", trend: "down", change: "-₹10" },
    { crop: "Maize", price: "₹1,962/q", trend: "up", change: "+₹15" },
    { crop: "Cotton", price: "₹7,020/q", trend: "up", change: "+₹120" },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-xl shadow-sm border border-green-100 active:scale-95 transition-all">
          <ChevronLeft size={24} className="text-green-700" />
        </button>
        <h1 className="text-2xl font-black text-green-900 tracking-tight">{t("market.title")}</h1>
      </div>

      {/* Graph Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={selectedCrop}
        className="bg-white rounded-[32px] p-6 mb-8 border border-green-100 shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-green-500 font-black uppercase tracking-widest mb-1">{t("market.weekly_trend")}</p>
            <h2 className="text-xl font-black text-green-900">{selectedCrop} {t("market.price_flow")}</h2>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-yellow-700 text-xs font-black">
            <Calendar size={14} />
            {t("market.last_7_days")}
          </div>
        </div>

        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory[selectedCrop as keyof typeof priceHistory]}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#16a34a', fontWeight: 'bold'}} />
              <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '12px', fontWeight: 'bold', color: '#14532d' }} />
              <Area type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Prices List */}
      <div className="bg-white rounded-[32px] p-6 mb-6 border border-green-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-yellow-500" />
            <span className="font-black text-green-900">{t("market.mandi")}</span>
          </div>
          <span className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg border border-green-100">{t("market.updated")}</span>
        </div>
        
        <div className="space-y-3">
          {prices.map((p, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedCrop(p.crop)}
              className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all border-2 ${
                selectedCrop === p.crop 
                ? "bg-green-50 border-green-300 scale-[1.02] shadow-sm" 
                : "bg-green-50/50 border-transparent hover:bg-green-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                  selectedCrop === p.crop ? "bg-green-600 text-white" : "bg-white text-green-500 border border-green-100"
                }`}>
                  {p.crop[0]}
                </div>
                <div className="text-left">
                  <p className="font-black text-green-900">{p.crop}</p>
                  <p className="text-[10px] text-green-500 font-black uppercase tracking-tighter">Min: ₹{parseInt(p.price.replace(/[₹,]/g, '')) - 100}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-green-900">{p.price}</p>
                <p className={`text-[10px] font-black flex items-center justify-end gap-1 uppercase ${p.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                  {p.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {p.change}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Alert Card */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[32px] p-6 text-white shadow-xl shadow-green-900/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <h3 className="font-black text-lg">{t("market.price_alert")}</h3>
        </div>
        <p className="text-sm text-green-100/80 mb-6 font-medium">{t("market.alert_desc")}</p>
        <button className="bg-yellow-400 text-green-900 w-full py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-sm">
          {t("common.set_alert")}
        </button>
      </div>
    </div>
  );
}
