"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Phone, Video, Star, MessageCircle,
  Mic, Camera, Send, Bot, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";

const experts = [
  { name: "Dr. Amit Sharma", specialty: "Crop Disease Specialist", crops: "Wheat, Rice, Pulses", rating: 4.9, reviews: 342, available: true, emoji: "👨‍🔬", lang: "हिं, EN" },
  { name: "Dr. Priya Patel", specialty: "Soil & Fertilizer Expert", crops: "All crops", rating: 4.8, reviews: 218, available: true, emoji: "👩‍🌾", lang: "हिं, गुज, EN" },
  { name: "Mr. Ramesh Gupta", specialty: "Organic Farming Guide", crops: "Vegetables, Fruits", rating: 4.7, reviews: 156, available: false, emoji: "🧑‍🌾", lang: "हिं, EN" },
];

const aiSuggestions = [
  "मेरी फसल की पत्तियां पीली हो रही हैं, क्या करें?",
  "गेहूं में दीमक लग गई है, इलाज बताएं",
  "कौन सी खाद कपास के लिए सबसे अच्छी है?",
  "अगले हफ्ते खेत में पानी देना चाहिए?",
];

export default function ExpertPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"ai" | "experts">("ai");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "ai", text: "नमस्ते! मैं KrishiDhara AI हूं। आपकी फसल, मिट्टी, या मौसम से जुड़ी कोई भी समस्या बताएं — मैं आपकी मदद करूंगा। 🌾" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChatHistory(prev => [
      ...prev,
      { from: "user", text: message },
      { from: "ai", text: "आपका सवाल समझ आया। विशेषज्ञ जल्द ही जवाब देंगे। अभी के लिए: यह समस्या आमतौर पर पानी की कमी या फंगस के कारण होती है। मिट्टी की नमी जांचें और नीम स्प्रे का उपयोग करें। 🌿" },
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen pb-28 flex flex-col" style={{ background: "var(--beige)" }}>
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
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-extrabold">Expert Advisory</h1>
            <p className="text-green-200 text-xs font-medium">AI + Live Agronomists</p>
          </div>
        </div>
        <div className="flex p-1 rounded-2xl" style={{ background: "rgba(0,0,0,0.2)" }}>
          <button onClick={() => setTab("ai")}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{ background: tab === "ai" ? "white" : "transparent", color: tab === "ai" ? "var(--primary-green)" : "rgba(255,255,255,0.75)" }}>
            🤖 AI Crop Doctor
          </button>
          <button onClick={() => setTab("experts")}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{ background: tab === "experts" ? "white" : "transparent", color: tab === "experts" ? "var(--primary-green)" : "rgba(255,255,255,0.75)" }}>
            👨‍🌾 Live Experts
          </button>
        </div>
      </div>

      {tab === "ai" ? (
        <div className="flex flex-col flex-1 px-5 mt-4">
          {/* AI Disease Detection Banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 flex items-center gap-3 mb-4"
            style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 24px rgba(255,152,0,0.25)" }}
          >
            <div className="text-3xl">📸</div>
            <div className="flex-1">
              <p className="text-white font-black text-sm">AI Crop Disease Detection</p>
              <p className="text-orange-100 text-xs font-medium">फसल की फोटो लें — AI बीमारी पहचानेगा</p>
            </div>
            <Camera size={22} className="text-white/80" />
          </motion.div>

          {/* Chat */}
          <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                {msg.from === "ai" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 shrink-0"
                    style={{ background: "var(--primary-green)" }}>
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium"
                  style={{
                    background: msg.from === "user" ? "var(--primary-green)" : "white",
                    color: msg.from === "user" ? "white" : "var(--text-primary)",
                    borderBottomRightRadius: msg.from === "user" ? 4 : 16,
                    borderBottomLeftRadius: msg.from === "ai" ? 4 : 16,
                    border: msg.from === "ai" ? "1px solid var(--border)" : "none",
                  }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
            {aiSuggestions.map((q, i) => (
              <button key={i} onClick={() => setMessage(q)}
                className="px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap"
                style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "white", border: "1px solid var(--border)" }}>
              <Mic size={18} style={{ color: "var(--primary-green)" }} />
            </button>
            <input type="text" placeholder="अपनी समस्या लिखें..."
              value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-3 rounded-2xl text-sm"
              style={{ background: "white", border: "1px solid var(--border)" }} />
            <button onClick={sendMessage}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--primary-green)" }}>
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 mt-4 space-y-4">
          {experts.map((expert, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: "var(--beige)" }}>
                  {expert.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{expert.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${expert.available ? "badge-green" : "badge-orange"}`}>
                      {expert.available ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "var(--primary-green)" }}>{expert.specialty}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {expert.crops} · {expert.lang}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] font-bold" style={{ color: "var(--text-secondary)" }}>
                      {expert.rating} ({expert.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                  style={{ background: "var(--primary-green)", color: "white" }}>
                  <MessageCircle size={13} /> Chat Now
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                  style={{ background: "var(--beige)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <Video size={13} /> Video Call
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                  style={{ background: "var(--beige)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <Phone size={13} /> Call
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav active="/chat" />
    </div>
  );
}
