"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Plus, TrendingUp, Leaf, IndianRupee,
  BookOpen, FlaskConical, Calendar, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";

const crops = [
  {
    name: "गेहूं", nameEn: "Wheat", emoji: "🌾", area: "2 acres",
    sowDate: "Oct 15", harvestDate: "Mar 20",
    stage: "Tillering", progress: 65, health: "good",
    healthLabel: "अच्छा ✓"
  },
  {
    name: "प्याज", nameEn: "Onion", emoji: "🧅", area: "1.5 acres",
    sowDate: "Nov 1", harvestDate: "Feb 15",
    stage: "Bulbing", progress: 80, health: "warn",
    healthLabel: "Monitor ⚠️"
  },
  {
    name: "सूरजमुखी", nameEn: "Sunflower", emoji: "🌻", area: "1 acre",
    sowDate: "Nov 20", harvestDate: "Mar 5",
    stage: "Germination", progress: 30, health: "good",
    healthLabel: "अच्छा ✓"
  },
];

const yieldHistory = [
  { season: "Rabi '22", yield: 18, color: "#4CAF50" },
  { season: "Kharif '22", yield: 14, color: "#FF9800" },
  { season: "Rabi '23", yield: 22, color: "#4CAF50" },
  { season: "Kharif '23", yield: 16, color: "#FF9800" },
  { season: "Rabi '24", yield: 25, color: "#2E7D32" },
];

const logbook = [
  { date: "May 1", activity: "गेहूं में खाद डाली (Urea)", type: "fertilizer", emoji: "🧪" },
  { date: "Apr 28", activity: "प्याज की सिंचाई की गई", type: "irrigation", emoji: "💧" },
  { date: "Apr 25", activity: "कपास में कीटनाशक छिड़का", type: "pesticide", emoji: "🌿" },
];

export default function MyFarmPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"crops" | "finance" | "logbook">("crops");

  // Get from localStorage
  let userData: any = {};
  if (typeof window !== "undefined") {
    try { userData = JSON.parse(localStorage.getItem("krishidhara_user") || "{}"); } catch {}
  }

  const name = userData.name || "Ramesh Patel";
  const village = userData.village || "Rajkot";
  const land = userData.landArea || "4.5";
  const unit = userData.landUnit || "acres";

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--beige)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
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
            <h1 className="text-white text-xl font-extrabold">मेरा खेत</h1>
            <p className="text-green-200 text-xs font-medium">My Farm</p>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20">
            <Plus size={18} className="text-white" />
          </button>
        </div>

        {/* Farm Profile Card */}
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            🏡
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base leading-tight">{name}'s Farm</p>
            <p className="text-green-100 text-xs font-medium">{village} · {land} {unit}</p>
            <p className="text-green-200 text-[10px] mt-0.5">Season: Rabi 2024 · 3 Active Crops</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "कुल क्षेत्र", val: `${land} ${unit}`, emoji: "📐" },
            { label: "Active Crops", val: "3 फसलें", emoji: "🌱" },
            { label: "Season", val: "Rabi 24", emoji: "📅" },
          ].map((s, i) => (
            <div key={i} className="text-center py-2 px-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="text-base mb-0.5">{s.emoji}</div>
              <p className="text-white text-xs font-black leading-tight">{s.val}</p>
              <p className="text-green-200 text-[9px] font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: "crops", label: "🌱 Crops" },
            { key: "finance", label: "💰 Finance" },
            { key: "logbook", label: "📔 Logbook" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className="px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all"
              style={{
                background: activeSection === tab.key ? "var(--primary-green)" : "white",
                color: activeSection === tab.key ? "white" : "var(--text-secondary)",
                border: activeSection === tab.key ? "none" : "1px solid var(--border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* CROPS SECTION */}
        {activeSection === "crops" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {crops.map((crop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card"
                style={{ borderLeft: `4px solid ${crop.health === "good" ? "var(--success)" : "var(--warning)"}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: "var(--beige)" }}>
                      {crop.emoji}
                    </div>
                    <div>
                      <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{crop.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{crop.area} · {crop.nameEn}</p>
                    </div>
                  </div>
                  <span className={crop.health === "good" ? "badge-green px-2 py-1" : "badge-orange px-2 py-1"}>
                    {crop.healthLabel}
                  </span>
                </div>

                {/* Growth Progress */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      Stage: {crop.stage}
                    </span>
                    <span className="text-[11px] font-black" style={{ color: "var(--primary-green)" }}>
                      {crop.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: "var(--beige-dark)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${crop.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background: crop.health === "good"
                          ? "linear-gradient(90deg, #4CAF50, #2E7D32)"
                          : "linear-gradient(90deg, #FF9800, #F57C00)"
                      }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> Sown: {crop.sowDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} /> Harvest: {crop.harvestDate}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Add Crop CTA */}
            <button className="w-full py-4 rounded-3xl font-black text-sm flex items-center justify-center gap-2"
              style={{ background: "var(--beige-dark)", color: "var(--text-secondary)", border: "2px dashed var(--border)" }}>
              <Plus size={18} /> नई फसल जोड़ें / Add New Crop
            </button>

            {/* Soil Testing */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-3xl font-black text-white text-sm flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 20px rgba(255,152,0,0.3)" }}
            >
              <FlaskConical size={18} /> मिट्टी परीक्षण बुक करें
            </motion.button>

            {/* Yield History */}
            <div className="card">
              <h3 className="font-black text-sm mb-3" style={{ color: "var(--text-primary)" }}>
                📊 पिछले Season का उत्पादन (Yield History)
              </h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldHistory} barSize={24}>
                    <XAxis dataKey="season" axisLine={false} tickLine={false}
                      tick={{ fontSize: 8, fill: "#888", fontWeight: 600 }} />
                    <YAxis hide domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #E8F5E9", fontSize: 11, fontWeight: 700 }}
                      formatter={(val: number) => [`${val} q/acre`, "Yield"]}
                    />
                    <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                      {yieldHistory.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* FINANCE SECTION */}
        {activeSection === "finance" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Income/Expense Overview */}
            <div className="card"
              style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)", color: "white" }}>
              <p className="text-green-200 text-xs font-black uppercase tracking-wider mb-3">This Season – Rabi 2024</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Income", val: "₹1,24,500", color: "#69F0AE" },
                  { label: "Expense", val: "₹38,200", color: "#FF6E6E" },
                  { label: "Profit", val: "₹86,300", color: "#FFD740" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{item.label}</p>
                    <p className="font-black text-sm" style={{ color: item.color }}>{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="card">
              <h3 className="font-black text-sm mb-3" style={{ color: "var(--text-primary)" }}>💸 Expense Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Seeds & Inputs", amount: 12500, pct: 33, color: "#FF9800" },
                  { label: "Fertilizers", amount: 9800, pct: 26, color: "#2E7D32" },
                  { label: "Irrigation", amount: 7200, pct: 19, color: "#29B6F6" },
                  { label: "Labor", amount: 8700, pct: 22, color: "#9C27B0" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                      <span className="text-xs font-black" style={{ color: "var(--text-primary)" }}>₹{item.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "var(--beige-dark)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Transaction */}
            <button className="w-full py-4 rounded-3xl font-black text-white text-sm flex items-center justify-center gap-2"
              style={{ background: "var(--orange)" }}>
              <Plus size={18} /> Add Income / Expense Entry
            </button>
          </motion.div>
        )}

        {/* LOGBOOK SECTION */}
        {activeSection === "logbook" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title text-base">Farm Diary</h2>
              <button className="px-4 py-2 rounded-xl text-xs font-black text-white"
                style={{ background: "var(--primary-green)" }}>
                <Plus size={14} className="inline mr-1" />Add Entry
              </button>
            </div>

            <div className="space-y-3">
              {logbook.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "var(--beige)" }}>
                    {entry.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{entry.activity}</p>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{entry.date}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                </motion.div>
              ))}
            </div>

            {/* Crop Calendar */}
            <div className="card"
              style={{ background: "linear-gradient(135deg, #E8F5E9, #C8E6C9)", borderColor: "#4CAF5030" }}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">📅</div>
                <div className="flex-1">
                  <p className="font-black text-sm" style={{ color: "var(--primary-green)" }}>फसल Calendar</p>
                  <p className="text-xs font-medium" style={{ color: "var(--primary-green)", opacity: 0.7 }}>
                    Sowing & harvesting schedule for all crops
                  </p>
                </div>
                <button className="px-3 py-2 rounded-xl text-xs font-black text-white"
                  style={{ background: "var(--primary-green)" }}>
                  View
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav active="/my-farm" />
    </div>
  );
}
