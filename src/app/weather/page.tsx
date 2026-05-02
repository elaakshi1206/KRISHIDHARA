"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Wind, Droplets, Sunrise, Sunset, AlertTriangle, Bug } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";

const forecast = [
  { day: "आज", dayEn: "Today", icon: "☀️", min: 28, max: 34, rain: 5 },
  { day: "सोम", dayEn: "Mon", icon: "⛅", min: 26, max: 33, rain: 20 },
  { day: "मंगल", dayEn: "Tue", icon: "🌧️", min: 22, max: 29, rain: 80 },
  { day: "बुध", dayEn: "Wed", icon: "🌧️", min: 21, max: 28, rain: 75 },
  { day: "गुरु", dayEn: "Thu", icon: "⛅", min: 24, max: 31, rain: 30 },
  { day: "शुक्र", dayEn: "Fri", icon: "☀️", min: 27, max: 35, rain: 8 },
  { day: "शनि", dayEn: "Sat", icon: "☀️", min: 29, max: 36, rain: 5 },
];

const pestAlerts = [
  { pest: "एफिड (Aphid)", risk: "उच्च", riskEn: "High", crop: "कपास", color: "#E53935", bg: "#FFEBEE", reason: "बारिश के बाद नमी बढ़ेगी" },
  { pest: "फंगस (Fungal)", risk: "मध्यम", riskEn: "Medium", crop: "गेहूं", color: "#FF9800", bg: "#FFF3E0", reason: "90%+ humidity expected" },
];

export default function WeatherPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);

  const current = forecast[selectedDay];

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--beige)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #0277BD 0%, #0288D1 50%, #29B6F6 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-extrabold">मौसम पूर्वानुमान</h1>
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-blue-200" />
              <p className="text-blue-100 text-xs font-semibold">Rajkot, Gujarat</p>
            </div>
          </div>
        </div>

        {/* Hero Weather Card */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 text-center mb-4"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <div className="text-6xl mb-2">{current.icon}</div>
          <div className="flex items-end justify-center gap-3 mb-1">
            <span className="text-white text-5xl font-black">{current.max}°C</span>
            <span className="text-blue-200 text-2xl font-bold mb-1">{current.min}°</span>
          </div>
          <p className="text-blue-100 font-semibold text-sm mb-3">
            {selectedDay === 0 ? "आज धूप और गर्मी · Sunny & Hot" : "बारिश की संभावना · Rain Expected"}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <Droplets size={14}/>, val: "68%", label: "Humidity" },
              { icon: <Wind size={14}/>, val: "14km/h", label: "Wind" },
              { icon: <Sunrise size={14}/>, val: "6:12", label: "Sunrise" },
              { icon: <Sunset size={14}/>, val: "19:08", label: "Sunset" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center text-blue-200 mb-1">{item.icon}</div>
                <p className="text-white text-xs font-bold">{item.val}</p>
                <p className="text-blue-200 text-[9px] font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {/* 7-Day Forecast Strip */}
        <section>
          <h2 className="section-title text-base mb-3">7-दिन पूर्वानुमान</h2>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {forecast.map((day, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(i)}
                className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl min-w-[68px] transition-all"
                style={{
                  background: selectedDay === i
                    ? "linear-gradient(135deg, #0288D1, #29B6F6)"
                    : "white",
                  border: selectedDay === i ? "none" : "1px solid var(--border)",
                  boxShadow: selectedDay === i ? "0 4px 16px rgba(41,182,246,0.35)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <p className="text-[10px] font-black"
                  style={{ color: selectedDay === i ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                  {day.day}
                </p>
                <span className="text-xl">{day.icon}</span>
                <p className="text-xs font-black"
                  style={{ color: selectedDay === i ? "white" : "var(--text-primary)" }}>
                  {day.max}°
                </p>
                <p className="text-[10px] font-semibold"
                  style={{ color: selectedDay === i ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                  {day.min}°
                </p>
                {/* Rain indicator */}
                {day.rain > 40 && (
                  <div className="text-[9px] font-black" style={{ color: selectedDay === i ? "#BAE6FD" : "#29B6F6" }}>
                    {day.rain}%💧
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Rainfall Chart */}
        <div className="card">
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
            🌧️ वर्षा संभावना (%) — Rainfall Probability
          </h3>
          <div className="h-36 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast} barSize={20}>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: "#888", fontWeight: 600 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E1F5FE", fontSize: 11, fontWeight: 700 }}
                  formatter={(val: number) => [`${val}%`, "Rain Chance"]}
                />
                {forecast.map((entry, index) => (
                  <Bar key={index} dataKey="rain" radius={[6, 6, 0, 0]}>
                    {forecast.map((_, i) => (
                      <Cell key={i}
                        fill={forecast[i].rain > 60 ? "#0288D1" : forecast[i].rain > 30 ? "#29B6F6" : "#B3E5FC"}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heavy Rain Warning */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl p-4 flex items-start gap-3"
          style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 24px rgba(255,152,0,0.25)" }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-white text-sm">⚠️ भारी वर्षा चेतावनी</p>
            <p className="text-orange-100 text-xs font-medium mt-0.5 leading-relaxed">
              मंगलवार को 80% बारिश की संभावना। खुले में रखी फसल को सुरक्षित करें।
            </p>
            <p className="text-orange-200 text-[10px] font-semibold mt-1">Heavy rain alert – Tuesday, 80% probability</p>
          </div>
        </motion.div>

        {/* Pest Risk Section */}
        <section>
          <h2 className="section-title text-base mb-3">🐛 कीट जोखिम — Pest Risk</h2>
          <div className="space-y-2.5">
            {pestAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card flex items-start gap-3"
                style={{ borderLeft: `4px solid ${alert.color}` }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: alert.bg }}>
                  <Bug size={18} style={{ color: alert.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{alert.pest}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: alert.bg, color: alert.color }}>
                      {alert.risk} Risk
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    Crop: {alert.crop} · {alert.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* UV & Farming Advisory */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "☀️", title: "UV Index", val: "High (8)", color: "#F57F17", bg: "#FFF8E1", tip: "धूप में ज़्यादा न रहें" },
            { icon: "💨", title: "Wind Speed", val: "14 km/h", color: "#0288D1", bg: "#E1F5FE", tip: "Spraying avoid करें" },
          ].map((item, i) => (
            <div key={i} className="card" style={{ background: item.bg, borderColor: `${item.color}20` }}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-[10px] font-semibold" style={{ color: item.color, opacity: 0.7 }}>{item.title}</p>
              <p className="font-black text-sm" style={{ color: item.color }}>{item.val}</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="/weather" />
    </div>
  );
}
