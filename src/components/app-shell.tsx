"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Folder,
  Globe2,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { Logo, Modal, PreferencesControls } from "./ui";
import { usePreferences } from "./preferences";
import { useRequests as useStore } from "@/features/requests/provider";
export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = usePreferences();
  const pathname = usePathname();
  const router = useRouter();
  const store = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  const nav = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: t("Overview", "نمای کلی"),
    },
    {
      path: "/dashboard/workspace",
      icon: Terminal,
      label: t("Request workspace", "محیط درخواست"),
    },
    {
      path: "/dashboard/collections",
      icon: Folder,
      label: t("Collections", "کالکشن‌ها"),
    },
    {
      path: "/dashboard/environments",
      icon: Globe2,
      label: t("Environments", "محیط‌ها"),
    },
    {
      path: "/dashboard/history",
      icon: Clock3,
      label: t("History", "تاریخچه"),
    },
    {
      path: "/dashboard/settings",
      icon: Settings2,
      label: t("Settings", "تنظیمات"),
    },
  ];
  const results = store.data.requests
    .filter((r) =>
      (r.name + " " + r.url).toLowerCase().includes(query.toLowerCase()),
    )
    .map((r) => ({
      id: r.id,
      title: r.name,
      sub: r.method + " " + r.url,
      href: "/dashboard/workspace?id=" + r.id,
    }));
  return (
    <div className="app-shell">
      <button
        className={"menu-overlay " + (menu ? "open" : "")}
        aria-label={t("Close navigation", "بستن فهرست")}
        onClick={() => setMenu(false)}
      />
      <aside className={"sidebar " + (menu ? "open" : "")}>
        <div className="flex justify-between items-start">
          <Logo />
          <button
            className="mobile-menu icon-button"
            onClick={() => setMenu(false)}
            aria-label={t("Close navigation", "بستن فهرست")}
          >
            <X size={17} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-avatar">RL</span>
          <div>
            <p className="text-[11px] font-semibold">
              {t("Personal workspace", "فضای کار شخصی")}
            </p>
            <p className="muted text-[9px]">
              {t("A little space of your own", "یک گوشه برای خودت")}
            </p>
          </div>
        </div>
        <button
          className="button primary w-full mb-4"
          onClick={() => {
            router.push("/dashboard/workspace?new=" + crypto.randomUUID());
            setMenu(false);
          }}
        >
          <Plus size={15} />
          {t("New request", "درخواست جدید")}
        </button>
        <p className="nav-label">{t("WORKSPACE", "فضای کار")}</p>
        <nav aria-label={t("Main navigation", "فهرست اصلی")}>
          {nav.map(({ path, icon: Icon, label }) => (
            <Link
              href={path}
              key={path}
              onClick={() => setMenu(false)}
              aria-current={pathname === path ? "page" : undefined}
              className={"sidebar-link " + (pathname === path ? "active" : "")}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div
          className="mt-8 p-3 rounded-lg"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--line)",
          }}
        >
          <p className="text-[11px] accent-text font-semibold">
            {t("A request worth keeping?", "درخواستی برای نگه داشتن؟")}
          </p>
          <p className="text-[10px] muted mt-2">
            {t(
              "Your work stays on this device. Export a backup to take it with you.",
              "کارت در این دستگاه می‌ماند. برای همراه داشتنش نسخه پشتیبان بگیر.",
            )}
          </p>
          <Link href="/dashboard/settings" className="text-link mt-3">
            {t("Back up workspace", "پشتیبان‌گیری")}
            <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="sidebar-footer">
          <div className="flex items-center gap-2 text-[10px] muted">
            <ShieldCheck size={13} />
            <span>{t("Local-first workspace", "فضای کار با ذخیره محلی")}</span>
            <span className="status-dot ms-auto" />
          </div>
          <p className="text-[9px] muted mt-3">
            {t(
              "No account. No cloud. Just you.",
              "بدون حساب. بدون ابر. فقط تو.",
            )}
          </p>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            <button
              className="mobile-menu icon-button"
              onClick={() => setMenu(true)}
              aria-label={t("Open navigation", "باز کردن فهرست")}
            >
              <Menu size={19} />
            </button>
            <button className="search-trigger" onClick={() => setSearch(true)}>
              <Search size={15} />
              {t("Search your workspace…", "جست‌وجو در فضای کار…")}
              <kbd>⌘ K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge hidden sm:inline-flex">
              <span className="status-dot" />
              {t("Local workspace", "فضای محلی")}
            </span>
            <PreferencesControls />
          </div>
        </header>
        <main className="app-content fade-in">
          {store.error && (
            <div className="notice error" role="alert">
              {t(
                "Browser storage is unavailable, full, or contains invalid data. Changes may only last this session. Export a backup in Settings.",
                "حافظه مرورگر در دسترس نیست، پر شده یا داده نامعتبر دارد. ممکن است تغییرات فقط در این نشست بمانند؛ از تنظیمات پشتیبان بگیر.",
              )}
            </div>
          )}
          {store.ready ? (
            children
          ) : (
            <div className="empty-state" role="status">
              {t("Opening your workspace…", "در حال باز کردن فضای کار…")}
            </div>
          )}
        </main>
      </div>
      <Modal
        open={search}
        onClose={() => setSearch(false)}
        title={t("Find something good", "چیز خوبی پیدا کن")}
      >
        <label className="search-field">
          <Search size={16} />
          <input
            autoFocus
            aria-label={t("Search", "جست‌وجو")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Search by title or content…",
              "جست‌وجو در عنوان یا محتوا…",
            )}
          />
        </label>
        <div className="mt-3 max-h-80 overflow-auto">
          {results.slice(0, 12).map((r) => (
            <Link
              key={r.id}
              href={r.href}
              onClick={() => setSearch(false)}
              className="list-row"
            >
              <span className="row-icon">
                <Terminal size={16} />
              </span>
              <div className="row-copy">
                <h3>{r.title}</h3>
                <p>{r.sub}</p>
              </div>
              <ArrowUpRight size={14} />
            </Link>
          ))}
          {!results.length && (
            <p className="muted text-sm py-10 text-center">
              {t(
                "No matches. Try another thought.",
                "نتیجه‌ای نبود؛ عبارت دیگری امتحان کن.",
              )}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
