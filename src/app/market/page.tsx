"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, TrendingUp, TrendingDown, MapPin,
  Search, Bot, Bell, Star
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";

const CROPS = [
  { name: "गेहूं", nameEn: "Wheat", emoji: "🌾", price: 2840, change: 2.3, mandi: "Rajkot", minPrice: 2720, maxPrice: 2900 },
  { name: "प्याज", nameEn: "Onion", emoji: "🧅", price: 1200, change: -1.5, mandi: "Gondal", minPrice: 1100, maxPrice: 1350 },
  { name: "सूरजमुखी", nameEn: "Sunflower", emoji: "🌻", price: 5600, change: 0.8, mandi: "Rajkot", minPrice: 5400, maxPrice: 5750 },
  { name: "मूंगफली", nameEn: "Groundnut", emoji: "🥜", price: 6800, change: 3.1, mandi: "Junagadh", minPrice: 6500, maxPrice: 6950 },
  { name: "कपास", nameEn: "Cotton", emoji: "🤍", price: 7200, change: -1.1, mandi: "Rajkot", minPrice: 6900, maxPrice: 7400 },
  { name: "मक्का", nameEn: "Maize", emoji: "🌽", price: 1962, change: 1.4, mandi: "Gondal", minPrice: 1850, maxPrice: 2050 },
];

const priceHistory: Record<string, { day: string; price: number }[]> = {
  "Wheat":     [{ day: "Apr 3", price: 2680 }, { day: "Apr 8", price: 2710 }, { day: "Apr 13", price: 2695 }, { day: "Apr 18", price: 2760 }, { day: "Apr 23", price: 2780 }, { day: "Apr 28", price: 2810 }, { day: "May 2", price: 2840 }],
  "Onion":     [{ day: "Apr 3", price: 1050 }, { day: "Apr 8", price: 1080 }, { day: "Apr 13", price: 1150 }, { day: "Apr 18", price: 1200 }, { day: "Apr 23", price: 1300 }, { day: "Apr 28", price: 1220 }, { day: "May 2", price: 1200 }],
  "Sunflower": [{ day: "Apr 3", price: 5300 }, { day: "Apr 8", price: 5380 }, { day: "Apr 13", price: 5450 }, { day: "Apr 18", price: 5500 }, { day: "Apr 23", price: 5520 }, { day: "Apr 28", price: 5580 }, { day: "May 2", price: 5600 }],
  "Groundnut": [{ day: "Apr 3", price: 6400 }, { day: "Apr 8", price: 6480 }, { day: "Apr 13", price: 6550 }, { day: "Apr 18", price: 6620 }, { day: "Apr 23", price: 6700 }, { day: "Apr 28", price: 6750 }, { day: "May 2", price: 6800 }],
  "Cotton":    [{ day: "Apr 3", price: 7400 }, { day: "Apr 8", price: 7350 }, { day: "Apr 13", price: 7300 }, { day: "Apr 18", price: 7250 }, { day: "Apr 23", price: 7220 }, { day: "Apr 28", price: 7150 }, { day: "May 2", price: 7200 }],
  "Maize":     [{ day: "Apr 3", price: 1880 }, { day: "Apr 8", price: 1900 }, { day: "Apr 13", price: 1920 }, { day: "Apr 18", price: 1935 }, { day: "Apr 23", price: 1945 }, { day: "Apr 28", price: 1955 }, { day: "May 2", price: 1962 }],
};

// Mandi comparison data per crop (in a real app, this is fetched from API)
const mandiComparison: Record<string, { mandi: string; modal: number; min: number; max: number }[]> = {
  "Wheat":     [{ mandi: "Rajkot",    modal: 2840, min: 2720, max: 2900 }, { mandi: "Gondal",    modal: 2790, min: 2680, max: 2860 }, { mandi: "Junagadh",  modal: 2950, min: 2820, max: 3000 }, { mandi: "Amreli",    modal: 2760, min: 2650, max: 2820 }, { mandi: "Bhavnagar", modal: 2810, min: 2700, max: 2880 }],
  "Onion":     [{ mandi: "Gondal",    modal: 1200, min: 1100, max: 1350 }, { mandi: "Rajkot",    modal: 1150, min: 1050, max: 1280 }, { mandi: "Junagadh",  modal: 1280, min: 1150, max: 1400 }, { mandi: "Amreli",    modal: 1100, min: 980,  max: 1200 }, { mandi: "Bhavnagar", modal: 1170, min: 1050, max: 1310 }],
  "Sunflower": [{ mandi: "Rajkot",    modal: 5600, min: 5400, max: 5750 }, { mandi: "Gondal",    modal: 5520, min: 5300, max: 5680 }, { mandi: "Junagadh",  modal: 5680, min: 5500, max: 5800 }, { mandi: "Amreli",    modal: 5480, min: 5280, max: 5620 }, { mandi: "Bhavnagar", modal: 5550, min: 5350, max: 5700 }],
  "Groundnut": [{ mandi: "Junagadh",  modal: 6800, min: 6500, max: 6950 }, { mandi: "Rajkot",    modal: 6720, min: 6450, max: 6880 }, { mandi: "Gondal",    modal: 6780, min: 6500, max: 6920 }, { mandi: "Amreli",    modal: 6650, min: 6400, max: 6820 }, { mandi: "Bhavnagar", modal: 6700, min: 6430, max: 6850 }],
  "Cotton":    [{ mandi: "Rajkot",    modal: 7200, min: 6900, max: 7400 }, { mandi: "Gondal",    modal: 7100, min: 6800, max: 7300 }, { mandi: "Junagadh",  modal: 7250, min: 6950, max: 7450 }, { mandi: "Amreli",    modal: 7050, min: 6750, max: 7250 }, { mandi: "Bhavnagar", modal: 7120, min: 6820, max: 7320 }],
  "Maize":     [{ mandi: "Gondal",    modal: 1962, min: 1850, max: 2050 }, { mandi: "Rajkot",    modal: 1920, min: 1820, max: 2010 }, { mandi: "Junagadh",  modal: 1980, min: 1870, max: 2070 }, { mandi: "Amreli",    modal: 1890, min: 1790, max: 1990 }, { mandi: "Bhavnagar", modal: 1940, min: 1840, max: 2030 }],
};

const mandis = ["सभी", "Rajkot", "Gondal", "Junagadh"];
const timeRanges = ["7D", "30D", "90D"];

export default function MarketPage() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [selectedMandi, setSelectedMandi] = useState("सभी");
  const [timeRange, setTimeRange] = useState("30D");
  const [search, setSearch] = useState("");

  const filteredCrops = CROPS.filter(c =>
    (selectedMandi === "सभी" || c.mandi === selectedMandi) &&
    (c.name.includes(search) || c.nameEn.toLowerCase().includes(search.toLowerCase()))
  );

  const chartData = priceHistory[selectedCrop.nameEn] || priceHistory["Wheat"];
  const mandiData = (mandiComparison[selectedCrop.nameEn] || []).sort((a, b) => b.modal - a.modal);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--beige)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-4"
        style={{
          background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-extrabold">मंडी दरें</h1>
            <p className="text-green-200 text-xs font-medium">Market Rates</p>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20">
            <Bell size={18} className="text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" />
          <input
            type="text"
            placeholder="फसल खोजें... Search crop"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
          />
        </div>

        {/* Mandi Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {mandis.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMandi(m)}
              className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: selectedMandi === m ? "white" : "rgba(255,255,255,0.15)",
                color: selectedMandi === m ? "var(--primary-green)" : "rgba(255,255,255,0.85)",
                border: selectedMandi === m ? "none" : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* Price Trend Chart */}
        <motion.div
          key={selectedCrop.nameEn}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCrop.emoji}</span>
                <div>
                  <h2 className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                    {selectedCrop.name} — {selectedCrop.nameEn}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg" style={{ color: "var(--primary-green)" }}>
                      ₹{selectedCrop.price.toLocaleString("en-IN")}/q
                    </span>
                    <span
                      className="text-xs font-bold flex items-center gap-0.5"
                      style={{ color: selectedCrop.change > 0 ? "var(--success)" : "var(--danger)" }}
                    >
                      {selectedCrop.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {selectedCrop.change > 0 ? "+" : ""}{selectedCrop.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {timeRanges.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-black transition-all"
                  style={{
                    background: timeRange === t ? "var(--primary-green)" : "var(--beige)",
                    color: timeRange === t ? "white" : "var(--text-muted)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-44 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: "#888", fontWeight: 600 }} />
                <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E8F5E9", fontSize: 12, fontWeight: 700, color: "#1A1A1A", background: "white" }}
                  formatter={(val: number) => [`₹${val}`, "Price"]}
                />
                <Area
                  type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={2.5}
                  fillOpacity={1} fill="url(#priceGrad)"
                  dot={{ fill: "#FF9800", r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: "#FF9800", r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-center p-2 rounded-xl" style={{ background: "#E8F5E9" }}>
              <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Min Price</p>
              <p className="font-black text-sm" style={{ color: "var(--success)" }}>₹{selectedCrop.minPrice.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: "#FFF3E0" }}>
              <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Max Price</p>
              <p className="font-black text-sm" style={{ color: "var(--orange-dark)" }}>₹{selectedCrop.maxPrice.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </motion.div>

        {/* AI Price Prediction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 24px rgba(255,152,0,0.3)" }}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <Bot size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Star size={10} className="text-yellow-200" />
              <span className="text-[10px] font-black text-yellow-100 uppercase tracking-wider">AI Prediction</span>
            </div>
            <p className="text-white font-bold text-sm leading-snug">
              अगले 7 दिनों में {selectedCrop.name} ₹{Math.round(selectedCrop.price * 1.04).toLocaleString("en-IN")}/q तक पहुंच सकता है
            </p>
          </div>
        </motion.div>

        {/* ── MANDI COMPARISON TABLE ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="section-title text-base">मंडी तुलना</h2>
              <p className="section-subtitle text-[10px]">{selectedCrop.name} · Mandi Price Comparison</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>Live</span>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 px-4 py-3 text-[10px] font-black uppercase tracking-wider"
              style={{ background: "var(--beige-dark)", color: "var(--text-muted)" }}>
              <span>Mandi</span>
              <span className="text-center">Modal ₹</span>
              <span className="text-center">Min ₹</span>
              <span className="text-center">Max ₹</span>
            </div>

            {mandiData.map((row, i) => (
              <motion.div
                key={row.mandi}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-4 px-4 py-3 items-center"
                style={{
                  background: i === 0 ? "#E8F5E9" : i % 2 === 0 ? "white" : "var(--beige)",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <MapPin size={10} style={{ color: i === 0 ? "var(--primary-green)" : "var(--text-muted)" }} />
                  <span className="text-xs font-bold"
                    style={{ color: i === 0 ? "var(--primary-green)" : "var(--text-primary)" }}>
                    {row.mandi}
                  </span>
                  {i === 0 && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: "var(--success)" }}>
                      Best
                    </span>
                  )}
                </div>
                <span className="text-center text-xs font-black"
                  style={{ color: i === 0 ? "var(--primary-green)" : "var(--text-primary)" }}>
                  {row.modal.toLocaleString("en-IN")}
                </span>
                <span className="text-center text-[11px] font-semibold" style={{ color: "var(--danger)" }}>
                  {row.min.toLocaleString("en-IN")}
                </span>
                <span className="text-center text-[11px] font-semibold" style={{ color: "var(--success)" }}>
                  {row.max.toLocaleString("en-IN")}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-center mt-2 font-medium" style={{ color: "var(--text-muted)" }}>
            * Prices per quintal (q) · Updated: Today 10:30 AM
          </p>
        </section>

        {/* Crops List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title text-base">आज के भाव</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>Live</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {filteredCrops.map((crop, i) => (
              <motion.button
                key={crop.nameEn}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCrop(crop)}
                className="w-full card flex items-center justify-between transition-all"
                style={{
                  border: selectedCrop.nameEn === crop.nameEn
                    ? "2px solid var(--primary-green)"
                    : "1px solid var(--border)",
                  background: selectedCrop.nameEn === crop.nameEn ? "#E8F5E9" : "white",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: selectedCrop.nameEn === crop.nameEn ? "white" : "var(--beige)" }}>
                    {crop.emoji}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{crop.name}</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={10} style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{crop.mandi} Mandi</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
                    ₹{crop.price.toLocaleString("en-IN")}/q
                  </p>
                  <div className="flex items-center justify-end gap-0.5">
                    {crop.change > 0
                      ? <TrendingUp size={11} style={{ color: "var(--success)" }} />
                      : <TrendingDown size={11} style={{ color: "var(--danger)" }} />
                    }
                    <span className="text-[10px] font-bold"
                      style={{ color: crop.change > 0 ? "var(--success)" : "var(--danger)" }}>
                      {crop.change > 0 ? "+" : ""}{crop.change}%
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Find Best Mandi */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-3xl font-black text-white text-base flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 24px rgba(255,152,0,0.3)" }}
        >
          <MapPin size={20} />
          सबसे अच्छा मंडी खोजें
        </motion.button>

        {/* Set Price Alert */}
        <div
          className="rounded-3xl p-5"
          style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", boxShadow: "0 8px 32px rgba(46,125,50,0.25)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <h3 className="font-black text-white">Price Alert सेट करें</h3>
          </div>
          <p className="text-green-200 text-sm mb-4">जब दाम बदले, तुरंत SMS और notification पाएं</p>
          <button className="w-full py-3.5 rounded-2xl font-black text-sm"
            style={{ background: "var(--orange)", color: "white" }}>
            🔔 Alert Set करें
          </button>
        </div>
      </div>

      <BottomNav active="/market" />
    </div>
  );
}
