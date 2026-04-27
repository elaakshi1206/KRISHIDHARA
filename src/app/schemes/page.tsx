"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Landmark, Search, Filter, ChevronLeft, 
  ArrowRight, CheckCircle2, AlertCircle,
  FileText, Info, IndianRupee
} from "lucide-react";
import { motion } from "framer-motion";

const SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000 / Year",
    desc: "Direct income support for landholding farmers. 3 installments of ₹2,000 each.",
    category: "Income",
    deadline: "Open All Year",
    color: "bg-accent-saffron"
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    benefit: "Crop Insurance",
    desc: "Low-premium insurance against natural calamities, pests & diseases.",
    category: "Insurance",
    deadline: "July 31 (Kharif)",
    color: "bg-blue-500"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    benefit: "Loans up to ₹5 Lakh",
    desc: "Low-interest loans for farming and allied activities with simplified process.",
    category: "Credit",
    deadline: "Ongoing",
    color: "bg-green-600"
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchayee Yojana",
    benefit: "Irrigation Support",
    desc: "Financial aid for drip and sprinkler irrigation systems to save water.",
    category: "Irrigation",
    deadline: "Oct 15",
    color: "bg-cyan-500"
  },
  {
    id: "shc",
    name: "Soil Health Card Scheme",
    benefit: "Free Soil Testing",
    desc: "Get scientific recommendations for fertilizer use based on your soil profile.",
    category: "Inputs",
    deadline: "Ongoing",
    color: "bg-amber-600"
  },
  {
    id: "pmkmy",
    name: "PM-KMY Pension Yojana",
    benefit: "₹3,000 / Month",
    desc: "Voluntary and contributory pension scheme for small and marginal farmers.",
    category: "Pension",
    deadline: "Ongoing",
    color: "bg-purple-600"
  }
];

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const router = useRouter();

  const filteredSchemes = SCHEMES.filter(s => 
    (category === "All" || s.category === category) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-extrabold text-slate-800">Govt. Schemes Hub</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search schemes..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-primary-green focus:bg-white transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
          {["All", "Income", "Insurance", "Credit", "Irrigation", "Inputs"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                category === cat 
                ? "bg-primary-green text-white border-primary-green" 
                : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {/* Personalized Banner */}
        <div className="bg-primary-green-light/30 border border-primary-green/10 rounded-3xl p-5 flex gap-4">
          <div className="w-12 h-12 bg-primary-green rounded-2xl flex items-center justify-center text-white shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-green-dark">Smart Eligibility</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Based on your 2-acre land in Maharashtra, you qualify for 4 major schemes. Complete Aadhaar linkage to apply faster.</p>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4 mt-6">
          {filteredSchemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-0 overflow-hidden border-none shadow-md group"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 ${scheme.color} rounded-xl flex items-center justify-center text-white`}>
                    <Landmark size={20} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deadline</span>
                    <p className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                      <AlertCircle size={12} className="text-amber-500" /> {scheme.deadline}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary-green transition-colors">{scheme.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{scheme.desc}</p>
                
                <div className="flex items-center justify-between py-3 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Benefit</span>
                    <p className="text-sm font-black text-primary-green flex items-center gap-0.5">
                      <IndianRupee size={14} strokeWidth={3} /> {scheme.benefit}
                    </p>
                  </div>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 group-active:scale-95 transition-all">
                    Apply Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="bg-slate-900 rounded-[28px] p-5 shadow-2xl flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-accent-gold" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase">My Applications</p>
              <p className="font-bold">2 In-Progress</p>
            </div>
          </div>
          <button className="bg-primary-green text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            Track <ChevronLeft size={14} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
