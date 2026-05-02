"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, ChevronLeft, CheckCircle2, Clock, Truck, Star,
  BadgeCheck, Phone, MessageCircle, IndianRupee, Package,
  ShoppingCart, Search, Filter, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";

const myListings = [
  { id: 1, crop: "गेहूं", cropEn: "Wheat", qty: "50 क्विंटल", price: 2900, status: "active", inquiries: 12, emoji: "🌾", daysAgo: 2 },
  { id: 2, crop: "प्याज", cropEn: "Onion", qty: "20 क्विंटल", price: 1400, status: "pending", inquiries: 5, emoji: "🧅", daysAgo: 5 },
];

const buyers = [
  { id: 1, name: "Rajkot FPO", type: "FPO", crop: "Wheat", offering: 2880, rating: 4.8, reviews: 234, transport: true, verified: true, phone: "+91 98765 43210" },
  { id: 2, name: "Gondal Trader", type: "Trader", crop: "Wheat", offering: 2820, rating: 4.5, reviews: 89, transport: false, verified: true, phone: "+91 87654 32109" },
  { id: 3, name: "Junagadh Exporter", type: "Exporter", crop: "Wheat", offering: 2950, rating: 4.9, reviews: 412, transport: true, verified: true, phone: "+91 76543 21098" },
];

const buyInputs = [
  { name: "DAP Fertilizer", brand: "IFFCO", price: 1350, unit: "50kg bag", emoji: "🧪", category: "Fertilizer", discount: "10% off" },
  { name: "Wheat Seeds (HD-2967)", brand: "NSCL", price: 280, unit: "per kg", emoji: "🌾", category: "Seeds", discount: null },
  { name: "Neem Spray", brand: "Organic India", price: 450, unit: "1L bottle", emoji: "🌿", category: "Organic", discount: "5% off" },
  { name: "Drip Tape", brand: "Jain Irrigation", price: 8500, unit: "per roll", emoji: "💧", category: "Irrigation", discount: null },
  { name: "Power Sprayer", brand: "Honda", price: 4200, unit: "rent/day", emoji: "🔧", category: "Rental", discount: null },
  { name: "Pesticide (Chloro)", brand: "Syngenta", price: 620, unit: "250ml", emoji: "🧴", category: "Pesticide", discount: "8% off" },
];

const inputCategories = ["All", "Seeds", "Fertilizer", "Pesticide", "Organic", "Irrigation", "Rental"];

export default function SellBuyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sell" | "buy">("sell");
  const [showNewListing, setShowNewListing] = useState(false);
  const [inputCategory, setInputCategory] = useState("All");
  const [newCrop, setNewCrop] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const filteredInputs = buyInputs.filter(i => inputCategory === "All" || i.category === inputCategory);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--beige)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-4"
        style={{
          background: tab === "sell"
            ? "linear-gradient(160deg, #E65100 0%, #FF9800 100%)"
            : "linear-gradient(160deg, #1B5E20 0%, #2E7D32 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          transition: "background 0.4s ease",
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
            <h1 className="text-white text-xl font-extrabold">
              {tab === "sell" ? "अपनी फसल बेचें" : "खरीदें"}
            </h1>
            <p className="text-white/70 text-xs font-medium">
              {tab === "sell" ? "Sell Your Produce" : "Buy Farm Inputs"}
            </p>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 border border-white/20">
            <ShoppingCart size={18} className="text-white" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl" style={{ background: "rgba(0,0,0,0.2)" }}>
          <button
            onClick={() => setTab("sell")}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "sell" ? "white" : "transparent",
              color: tab === "sell" ? "var(--orange-dark)" : "rgba(255,255,255,0.7)",
            }}
          >
            🌾 बेचें (Sell)
          </button>
          <button
            onClick={() => setTab("buy")}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "buy" ? "white" : "transparent",
              color: tab === "buy" ? "var(--primary-green)" : "rgba(255,255,255,0.7)",
            }}
          >
            🛒 खरीदें (Buy)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "sell" ? (
          <motion.div
            key="sell"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-5 mt-4 space-y-4"
          >
            {/* Create New Listing */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewListing(!showNewListing)}
              className="w-full rounded-3xl p-5 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #FF9800, #F57C00)", boxShadow: "0 6px 24px rgba(255,152,0,0.3)" }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                ➕
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-black text-base">नई लिस्टिंग बनाएं</p>
                <p className="text-orange-100 text-xs font-medium">Create New Listing · Tap to expand</p>
              </div>
              <Plus size={22} className="text-white/70" />
            </motion.button>

            {/* New Listing Form */}
            <AnimatePresence>
              {showNewListing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card space-y-4 overflow-hidden"
                >
                  <h3 className="font-black text-base" style={{ color: "var(--text-primary)" }}>फसल की जानकारी दें</h3>
                  <div>
                    <label className="text-xs font-bold mb-1 block" style={{ color: "var(--text-muted)" }}>फसल का नाम / Crop Name</label>
                    <input type="text" placeholder="जैसे: गेहूं, प्याज, कपास..." value={newCrop}
                      onChange={e => setNewCrop(e.target.value)} className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold mb-1 block" style={{ color: "var(--text-muted)" }}>मात्रा / Quantity (क्विंटल)</label>
                      <input type="number" placeholder="50" value={newQty}
                        onChange={e => setNewQty(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-1 block" style={{ color: "var(--text-muted)" }}>भाव / Price (₹/q)</label>
                      <input type="number" placeholder="2800" value={newPrice}
                        onChange={e => setNewPrice(e.target.value)} className="input-field" />
                    </div>
                  </div>
                  {/* Photo Upload Area */}
                  <div className="rounded-2xl p-4 border-2 border-dashed text-center"
                    style={{ borderColor: "var(--border)", background: "var(--beige)" }}>
                    <div className="text-3xl mb-1">📸</div>
                    <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>फोटो जोड़ें / Add Photo</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Tap to upload from camera or gallery</p>
                  </div>
                  {/* Payment Options */}
                  <div>
                    <label className="text-xs font-bold mb-2 block" style={{ color: "var(--text-muted)" }}>Payment Mode</label>
                    <div className="flex gap-2">
                      {["UPI", "COD", "Bank Transfer"].map(p => (
                        <span key={p} className="badge-green px-3 py-1 rounded-full text-xs font-bold">{p}</span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-2xl font-black text-white text-sm"
                    style={{ background: "var(--orange)" }}>
                    🌾 लिस्टिंग पोस्ट करें
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* My Listings */}
            <section>
              <h2 className="section-title text-base mb-3">मेरी लिस्टिंग</h2>
              <div className="space-y-3">
                {myListings.map(listing => (
                  <motion.div key={listing.id} whileTap={{ scale: 0.99 }} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ background: "var(--beige)" }}>
                          {listing.emoji}
                        </div>
                        <div>
                          <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{listing.crop}</p>
                          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{listing.qty} · ₹{listing.price}/q</p>
                        </div>
                      </div>
                      <span className={listing.status === "active" ? "badge-green px-2 py-1" : "badge-orange px-2 py-1"}>
                        {listing.status === "active" ? "Active ✓" : "Pending ⏳"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={13} style={{ color: "var(--sky-blue-dark)" }} />
                        <span className="text-xs font-bold" style={{ color: "var(--sky-blue-dark)" }}>
                          {listing.inquiries} Buyer inquiries
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "var(--beige)", color: "var(--text-secondary)" }}>Edit</button>
                        <button className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "#FFEBEE", color: "var(--danger)" }}>Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Find Buyers */}
            <section>
              <h2 className="section-title text-base mb-3">Buyers खोजें</h2>
              <div className="space-y-3">
                {buyers.map((buyer, i) => (
                  <motion.div
                    key={buyer.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-base"
                          style={{ background: "linear-gradient(135deg, #2E7D32, #1B5E20)" }}>
                          {buyer.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>{buyer.name}</p>
                            {buyer.verified && <BadgeCheck size={14} style={{ color: "var(--sky-blue-dark)" }} />}
                          </div>
                          <span className="badge-blue px-2 py-0.5 rounded-full text-[10px] font-bold">{buyer.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base" style={{ color: "var(--primary-green)" }}>
                          ₹{buyer.offering.toLocaleString("en-IN")}/q
                        </p>
                        <div className="flex items-center justify-end gap-0.5">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[11px] font-bold" style={{ color: "var(--text-muted)" }}>
                            {buyer.rating} ({buyer.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {buyer.transport && (
                        <div className="flex items-center gap-1 badge-green px-2 py-1 rounded-full">
                          <Truck size={10} />
                          <span className="text-[10px] font-bold">Transport Available</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        <Package size={10} />
                        Buying: {buyer.crop}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                        style={{ background: "var(--primary-green)", color: "white" }}>
                        <Phone size={13} /> Call Now
                      </button>
                      <button className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                        style={{ background: "var(--beige)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                        <MessageCircle size={13} /> Chat
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Transport Booking */}
            <div className="card flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #E1F5FE, #B3E5FC)", borderColor: "#29B6F620" }}>
              <div className="text-3xl">🚛</div>
              <div className="flex-1">
                <p className="font-black text-sm" style={{ color: "var(--sky-blue-dark)" }}>ट्रांसपोर्ट बुक करें</p>
                <p className="text-xs font-medium" style={{ color: "var(--sky-blue-dark)", opacity: 0.7 }}>Book vehicle for crop transport</p>
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-black text-white"
                style={{ background: "var(--sky-blue-dark)" }}>
                Book
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="buy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 mt-4 space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input type="text" placeholder="बीज, खाद, कीटनाशक खोजें..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                style={{ background: "white", border: "1px solid var(--border)" }} />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {inputCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setInputCategory(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
                  style={{
                    background: inputCategory === cat ? "var(--primary-green)" : "white",
                    color: inputCategory === cat ? "white" : "var(--text-secondary)",
                    border: inputCategory === cat ? "none" : "1px solid var(--border)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredInputs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card flex flex-col"
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="font-black text-sm leading-tight mb-0.5" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                  <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>{item.brand} · {item.unit}</p>
                  {item.discount && (
                    <span className="badge-orange text-[9px] mb-1 self-start">{item.discount}</span>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="font-black text-sm" style={{ color: "var(--primary-green)" }}>₹{item.price}</p>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                      style={{ background: "var(--orange)" }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Organic Section Banner */}
            <div className="rounded-3xl p-5 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32)" }}>
              <div className="text-3xl">🌿</div>
              <div className="flex-1">
                <p className="text-white font-black text-sm">Organic Inputs Section</p>
                <p className="text-green-200 text-xs font-medium">100% natural, certified organic products</p>
              </div>
              <button className="px-3 py-2 rounded-xl text-xs font-black text-green-900"
                style={{ background: "var(--yellow-accent)" }}>
                Explore
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="/sell" />
    </div>
  );
}
