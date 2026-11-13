"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Preferences = { locale: "en" | "fa"; theme: "dark" | "light"; toggleLocale: () => void; toggleTheme: () => void; t: (en: string, fa: string) => string };
const Context = createContext<Preferences | null>(null);
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
 const [locale, setLocale] = useState<"en" | "fa">("en");
 const [theme, setTheme] = useState<"dark" | "light">("dark");
 useEffect(() => { try { const p = JSON.parse(localStorage.getItem("reqlab-preferences") || "{}"); if (p.locale === "fa") setLocale("fa"); if (p.theme === "light") setTheme("light"); } catch { /* Defaults remain usable when browser storage is unavailable. */ } }, []);
 useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = locale === "fa" ? "rtl" : "ltr"; document.documentElement.dataset.theme = theme; }, [locale, theme]);
 const save = (l: "en" | "fa", m: "dark" | "light") => { try { localStorage.setItem("reqlab-preferences", JSON.stringify({ locale: l, theme: m })); } catch { /* Theme and locale still work for this session. */ } };
 return <Context.Provider value={{ locale, theme, toggleLocale: () => { const l = locale === "en" ? "fa" : "en"; setLocale(l); save(l, theme); }, toggleTheme: () => { const m = theme === "dark" ? "light" : "dark"; setTheme(m); save(locale, m); }, t: (en, fa) => locale === "fa" ? fa : en }}>{children}</Context.Provider>;
}
export function usePreferences() { const context = useContext(Context); if (!context) throw new Error("PreferencesProvider is missing"); return context; }
