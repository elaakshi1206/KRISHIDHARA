"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Cloud, CloudRain, Sun, Wind, MapPin, 
  Scan, BarChart3, TrendingUp, Landmark, 
  MessageSquare, UserCircle, Bell, Search,
  ChevronRight, ArrowUpRight, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { fetchUserDetails } from "@/utils/supabase/profile";

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const hasVisited = localStorage.getItem("krishidhara_visited");
      if (!hasVisited) {
        localStorage.setItem("krishidhara_visited", "true");
        router.push("/splash");
        return;
      }

      const savedData = localStorage.getItem("krishidhara_user");
      if (savedData) {
        setUserData(JSON.parse(savedData));
        return;
      }

      // If no local storage, try fetching from Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        try {
          const profile = await fetchUserDetails(user.id);
          if (profile) {
            const formattedData = {
              name: profile.full_name,
              village: profile.village,
              state: profile.state,
              ...profile.farm_details
            };
            setUserData(formattedData);
            localStorage.setItem("krishidhara_user", JSON.stringify(formattedData));
          } else {
            router.push("/setup");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/splash");
        }
      } else {
        router.push("/splash");
      }
    };

    checkUser();
  }, [router]);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-green-light rounded-2xl flex items-center justify-center border border-primary-green/10 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">KrishiDhara</p>
              <div className="flex items-center gap-1 text-slate-800 font-bold">
                <MapPin size={14} className="text-primary-green" />
                <span>{userData.village}, {userData.state}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => router.push("/profile")} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <UserCircle size={24} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Namaste, {userData.name} 👋
          </h1>
          <p className="text-slate-500 font-medium">Your farm, our insights — together for a better harvest</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Weather Widget */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-primary-green to-primary-green-dark rounded-[32px] p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 scale-150 rotate-12">
            <Sun size={120} />
          </div>
          
          <div className="relative flex justify-between items-start mb-6">
            <div>
              <p className="text-green-100 font-bold uppercase tracking-widest text-xs mb-1">Today's Weather</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold">32°C</span>
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Sunny</div>
              </div>
            </div>
            <Sun size={48} className="text-yellow-300" />
          </div>

          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
            {[
              { label: "Humidity", val: "45%", icon: <CloudRain size={16} /> },
              { label: "Wind", val: "12km/h", icon: <Wind size={16} /> },
              { label: "UV Index", val: "High", icon: <Sun size={16} /> },
              { label: "Forecast", val: "Clear", icon: <Cloud size={16} /> },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center text-white/60 mb-1">{item.icon}</div>
                <p className="text-[10px] text-white/60 font-bold uppercase">{item.label}</p>
                <p className="text-sm font-bold">{item.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: "Monitor", icon: <Scan className="text-blue-500" />, path: "/monitor" },
            { label: "Markets", icon: <TrendingUp className="text-orange-500" />, path: "/market" },
            { label: "Schemes", icon: <Landmark className="text-amber-500" />, path: "/schemes" },
            { label: "Expert", icon: <MessageSquare className="text-purple-500" />, path: "/chat" },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => router.push(action.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-active:scale-95 transition-all">
                {action.icon}
              </div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Main Features Sections */}
        <div className="mt-10 space-y-8">
          {/* Section: Recommended Schemes */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">Govt. Schemes Hub</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sarkari Yojana for you</p>
              </div>
              <button onClick={() => router.push("/schemes")} className="text-primary-green text-sm font-bold flex items-center gap-1">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/schemes")}
                className="card border-l-4 border-l-accent-saffron bg-gradient-to-r from-white to-amber-50/30 p-5 flex items-center gap-4 relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-accent-saffron/10 rounded-2xl flex items-center justify-center text-accent-saffron">
                  <Landmark size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-accent-saffron text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Hot</span>
                    <h3 className="font-bold text-slate-800">PM-KISAN Samman Nidhi</h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-1">Get ₹6,000 annually directly in your bank account.</p>
                  <p className="text-xs text-primary-green font-bold mt-2 flex items-center gap-1">
                    Check Eligibility <ArrowUpRight size={14} />
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 border-l-4 border-l-blue-500">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-3">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">PM Fasal Bima</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Crop Insurance support</p>
                </div>
                <div className="card p-4 border-l-4 border-l-green-500">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mb-3">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">Soil Health</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Free testing cards</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Crop Monitoring */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">Crop Monitoring</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Powered Insights</p>
              </div>
            </div>
            
            <div className="relative h-48 rounded-[32px] overflow-hidden group shadow-lg">
              <Image 
                src="/hero.png" 
                alt="Crop Hero" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg">Analyze Crop Health</h3>
                <p className="text-white/70 text-sm mb-4">Upload a photo to detect pests and diseases instantly using AI.</p>
                <button className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2 w-max">
                  <Scan size={18} /> Scan Now
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        {[
          { label: "Home", icon: <Sun size={24} />, active: true },
          { label: "Monitor", icon: <Scan size={24} />, path: "/monitor" },
          { label: "Schemes", icon: <Landmark size={24} />, path: "/schemes" },
          { label: "Market", icon: <BarChart3 size={24} />, path: "/market" },
          { label: "News", icon: <Plus size={24} />, path: "/news" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => item.path && router.push(item.path)}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-primary-green" : "text-slate-400"}`}
          >
            <div className={`${item.active ? "bg-primary-green-light p-2 rounded-xl" : ""}`}>
              {item.icon}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
