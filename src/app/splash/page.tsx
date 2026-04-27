"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/logo.png"
            alt="KrishiDhara Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold text-primary-green mb-2"
        >
          KrishiDhara
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-slate-500 text-center px-8 text-lg font-medium"
        >
          Empowering Farmers with Knowledge & Insights
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center"
      >
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Loading</p>
      </motion.div>
    </div>
  );
}
