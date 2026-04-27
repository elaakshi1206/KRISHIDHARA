"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, BarChart3, TrendingUp, TrendingDown, MapPin } from "lucide-react";

export default function MarketPage() {
  const router = useRouter();

  const prices = [
    { crop: "Wheat", price: "₹2,275/q", trend: "up", change: "+₹25" },
    { crop: "Rice", price: "₹2,183/q", trend: "down", change: "-₹10" },
    { crop: "Maize", price: "₹1,962/q", trend: "up", change: "+₹15" },
    { crop: "Cotton", price: "₹7,020/q", trend: "up", change: "+₹120" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-xl shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Market Prices</h1>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-primary-green" />
            <span className="font-bold">Nearest Mandi: Sangli</span>
          </div>
          <span className="text-xs text-slate-400">Updated 2h ago</span>
        </div>
        
        <div className="space-y-4">
          {prices.map((p, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-800">{p.crop}</p>
                <p className="text-xs text-slate-500">Min: ₹{parseInt(p.price.slice(1)) - 100}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">{p.price}</p>
                <p className={`text-xs font-bold flex items-center justify-end gap-1 ${p.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                  {p.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {p.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card bg-primary-green text-white">
        <h3 className="font-bold mb-1">Price Alert</h3>
        <p className="text-sm opacity-90 mb-4">Get notified when Wheat prices go above ₹2,400</p>
        <button className="bg-white text-primary-green w-full py-3 rounded-xl font-bold text-sm">Set Alert</button>
      </div>
    </div>
  );
}
