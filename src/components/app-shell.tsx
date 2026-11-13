"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Folder,
  Globe2,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  Terminal,
  X,
} from "lucide-react";
import { Logo, Modal, PreferencesControls } from "./ui";
import { usePreferences } from "./preferences";
import { useRequests } from "@/features/requests/provider";
export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = usePreferences();
  const pathname = usePathname();
  const router = useRouter();
  const store = useRequests();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
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
    <div className="lab-shell">
      <header className="lab-header">
        <div className="lab-header-main">
          <div className="lab-brand-group">
            <Logo />
            <span className="lab-header-divider" />
            <div className="lab-workspace-name">
              <span className="lab-avatar">M</span>
              <span>
                {t("Personal", "شخصی")}
                <span className="muted mx-2">/</span>
                {t("Sandbox", "آزمایشگاه")}
              </span>
            </div>
          </div>
          <div className="lab-header-tools">
            <button
              className="lab-search"
              onClick={() => setSearch(true)}
              aria-label={t("Search your workspace", "جست‌وجو در فضای کار")}
            >
              <Search size={15} />
              <span>{t("Find an endpoint…", "جست‌وجوی آدرس…")}</span>
              <kbd>⌘ K</kbd>
            </button>
            <PreferencesControls />
            <button
              className="mobile-menu icon-button"
              aria-label={
                menu
                  ? t("Close navigation", "بستن فهرست")
                  : t("Open navigation", "باز کردن فهرست")
              }
              aria-expanded={menu}
              aria-controls="lab-navigation"
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <div className="lab-navigation-row">
          <nav
            id="lab-navigation"
            className={"lab-nav " + (menu ? "open" : "")}
            aria-label={t("Main navigation", "فهرست اصلی")}
          >
            {nav.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                href={path}
                aria-current={pathname === path ? "page" : undefined}
                className={
                  "lab-nav-link " + (pathname === path ? "active" : "")
                }
                onClick={() => setMenu(false)}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="lab-environment">
            <span className="status-dot" />
            <select
              aria-label={t("Active environment", "محیط فعال")}
              value={store.data.activeEnvironmentId || ""}
              onChange={(e) =>
                store.update((s) => ({
                  ...s,
                  activeEnvironmentId: e.target.value || null,
                }))
              }
            >
              <option value="">{t("No environment", "بدون محیط")}</option>
              {store.data.environments.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} />
          </div>
        </div>
      </header>
      <main className="lab-content fade-in">
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
      <footer className="lab-statusbar">
        <span>
          <span className="status-dot" />
          {t("All data on this device", "همه داده‌ها روی این دستگاه")}
        </span>
        <button
          onClick={() =>
            router.push("/dashboard/workspace?new=" + crypto.randomUUID())
          }
        >
          <Plus size={12} />
          {t("New request", "درخواست جدید")}
        </button>
        <span>
          {t(
            "Built to figure things out.",
            "برای فهمیدن، ساختن و دوباره امتحان کردن.",
          )}
        </span>
      </footer>
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
