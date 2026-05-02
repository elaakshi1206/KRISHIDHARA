"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Landmark, Search, Filter, ChevronLeft, 
  ArrowRight, CheckCircle2, AlertCircle,
  FileText, Info, IndianRupee
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers/LanguageProvider";

const SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000 / Year",
    desc: "Direct income support for landholding farmers. 3 installments of ₹2,000 each.",
    category: "Income",
    deadline: "Open All Year",
    color: "bg-yellow-400"
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    benefit: "Crop Insurance",
    desc: "Low-premium insurance against natural calamities, pests & diseases.",
    category: "Insurance",
    deadline: "July 31 (Kharif)",
    color: "bg-green-500"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    benefit: "Loans up to ₹5 Lakh",
    desc: "Low-interest loans for farming and allied activities with simplified process.",
    category: "Credit",
    deadline: "Ongoing",
    color: "bg-green-700"
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchayee Yojana",
    benefit: "Irrigation Support",
    desc: "Financial aid for drip and sprinkler irrigation systems to save water.",
    category: "Irrigation",
    deadline: "Oct 15",
    color: "bg-yellow-500"
  },
  {
    id: "shc",
    name: "Soil Health Card Scheme",
    benefit: "Free Soil Testing",
    desc: "Get scientific recommendations for fertilizer use based on your soil profile.",
    category: "Inputs",
    deadline: "Ongoing",
    color: "bg-green-600"
  },
  {
    id: "pmkmy",
    name: "PM-KMY Pension Yojana",
    benefit: "₹3,000 / Month",
    desc: "Voluntary and contributory pension scheme for small and marginal farmers.",
    category: "Pension",
    deadline: "Ongoing",
    color: "bg-yellow-600"
  }
];

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const router = useRouter();
  const { t } = useLanguage();

  const categories = ["All", "Income", "Insurance", "Credit", "Irrigation", "Inputs"];

  const filteredSchemes = SCHEMES.filter(s => 
    (category === "All" || s.category === category) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 pb-28">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-20 shadow-sm border-b border-green-100">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-green-50 rounded-xl transition-all border border-green-100">
            <ChevronLeft size={24} className="text-green-700" />
          </button>
          <h1 className="text-2xl font-extrabold text-green-900">{t("schemes.title")}</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
            <input 
              type="text" 
              placeholder={t("schemes.search_placeholder")} 
              className="w-full pl-12 pr-4 py-3 bg-green-50 rounded-2xl border border-green-100 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm font-medium text-green-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-green-600">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2 ${
                category === cat 
                ? "bg-green-600 text-white border-green-600" 
                : "bg-white text-green-600 border-green-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {/* Eligibility Banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 rounded-3xl p-5 flex gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-black text-green-900">{t("schemes.smart_eligibility")}</h3>
            <p className="text-xs text-green-700 font-medium leading-relaxed">{t("schemes.eligibility_desc")}</p>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4">
          {filteredSchemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-[28px] overflow-hidden border border-green-100 shadow-sm group"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 ${scheme.color} rounded-xl flex items-center justify-center text-white`}>
                    <Landmark size={20} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">{t("schemes.deadline")}</span>
                    <p className="text-xs font-black text-green-900 flex items-center justify-end gap-1">
                      <AlertCircle size={12} className="text-yellow-500" /> {scheme.deadline}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-green-900 mb-1 group-hover:text-green-600 transition-colors">{scheme.name}</h3>
                <p className="text-sm text-green-700/80 font-medium mb-4">{scheme.desc}</p>
                
                <div className="flex items-center justify-between py-3 border-t border-green-50">
                  <div>
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">{t("schemes.benefit")}</span>
                    <p className="text-sm font-black text-green-700 flex items-center gap-0.5">
                      <IndianRupee size={14} strokeWidth={3} /> {scheme.benefit}
                    </p>
                  </div>
                  <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 group-active:scale-95 transition-all">
                    {t("common.apply_now")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="bg-green-900 rounded-[28px] p-5 shadow-2xl shadow-green-900/30 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-black uppercase">{t("schemes.my_applications")}</p>
              <p className="font-black">{t("schemes.in_progress")}</p>
            </div>
          </div>
          <button className="bg-yellow-400 text-green-900 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
            {t("common.track")} <ChevronLeft size={14} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
