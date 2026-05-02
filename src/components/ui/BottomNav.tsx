"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, TrendingUp, ShoppingBag, Leaf, Users } from "lucide-react";

const navItems = [
  { label: "Home", labelHi: "होम", icon: Home, path: "/" },
  { label: "Market", labelHi: "मंडी", icon: TrendingUp, path: "/market" },
  { label: "Buy/Sell", labelHi: "खरीद-बेच", icon: ShoppingBag, path: "/sell" },
  { label: "My Farm", labelHi: "मेरा खेत", icon: Leaf, path: "/my-farm" },
  { label: "Expert", labelHi: "विशेषज्ञ", icon: Users, path: "/chat" },
];

interface BottomNavProps {
  active?: string; // path string
}

export default function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = active || pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur bar */}
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(46,125,50,0.1)",
          boxShadow: "0 -4px 24px rgba(46,125,50,0.08)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 transition-all active:scale-95"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all"
                style={{
                  background: isActive ? "var(--primary-green)" : "transparent",
                  boxShadow: isActive ? "0 4px 12px rgba(46,125,50,0.3)" : "none",
                }}
              >
                <Icon
                  size={20}
                  className="transition-colors"
                  style={{ color: isActive ? "#fff" : "var(--text-muted)" }}
                />
              </div>
              <span
                className="text-[9px] font-bold tracking-wide transition-colors"
                style={{ color: isActive ? "var(--primary-green)" : "var(--text-muted)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
