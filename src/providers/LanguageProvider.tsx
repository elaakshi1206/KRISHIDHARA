"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/i18n/locales/en.json";
import hi from "@/i18n/locales/hi.json";
import mr from "@/i18n/locales/mr.json";

export type Language = "en" | "hi" | "mr";

const translations: Record<Language, any> = { en, hi, mr };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("kd_language") as Language | null;
    if (saved && ["en", "hi", "mr"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("kd_language", lang);
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language], key) || getNestedValue(translations["en"], key) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
