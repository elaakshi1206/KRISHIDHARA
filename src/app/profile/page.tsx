"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, LogOut, Settings, Bell, Shield, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("krishidhara_user");
    if (data) setUser(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("krishidhara_user");
    localStorage.removeItem("krishidhara_visited");
    router.push("/splash");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white p-6 pt-12 pb-10 rounded-b-[40px] shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 bg-slate-50 rounded-xl">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-primary-green-light rounded-3xl flex items-center justify-center text-primary-green">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name || "Farmer Name"}</h2>
            <p className="text-slate-500 font-medium">{user?.village}, {user?.state}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary-green text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Verified Farmer</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {[
          { label: "Account Settings", icon: <Settings size={20} /> },
          { label: "Notification Preferences", icon: <Bell size={20} /> },
          { label: "Privacy & Security", icon: <Shield size={20} /> },
          { label: "Help & Support", icon: <HelpCircle size={20} /> },
        ].map((item, i) => (
          <div key={i} className="card flex items-center justify-between py-4 group active:bg-slate-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-slate-400 group-hover:text-primary-green transition-colors">{item.icon}</div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronLeft size={18} className="rotate-180 text-slate-300" />
          </div>
        ))}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-bold bg-red-50 rounded-2xl mt-8"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
