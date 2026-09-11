import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "sw" | "en";

type LangContextValue = { lang: Lang; setLang: (lang: Lang) => void };

const LangContext = createContext<LangContextValue>({ lang: "sw", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("sw");

  useEffect(() => {
    const stored = window.localStorage.getItem("zavera-lang");
    if (stored === "en" || stored === "sw") setLang(stored);
  }, []);

  const update = (next: Lang) => {
    setLang(next);
    window.localStorage.setItem("zavera-lang", next);
  };

  return <LangContext.Provider value={{ lang, setLang: update }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** t("Kiswahili", "English") — Swahili is the default language. */
export function useT() {
  const { lang } = useLang();
  return (sw: string, en: string) => (lang === "sw" ? sw : en);
}

export const REGISTER_URL = "https://moxeraagencies.com/register?ref=Aurea";
export const SUPPORT_EMAIL = "Missshamii0@gmail.com";
export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb7epIc6WaKubQCrb72f";
