import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { PreferencesProvider } from "@/components/preferences";
export const metadata: Metadata = { title: { default: "ReqLab — Your APIs. Your workspace.", template: "%s | ReqLab" }, description: "A local-first API testing workspace. Organize collections, manage environments, and inspect every response.", icons: { icon: "/icon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" dir="ltr" data-theme="dark" suppressHydrationWarning><body><PreferencesProvider>{children}</PreferencesProvider></body></html>; }
