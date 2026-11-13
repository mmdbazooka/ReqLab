"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Folder,
  Plus,
  Terminal,
  Zap,
} from "lucide-react";
import { useRequests } from "@/features/requests/provider";
import { usePreferences } from "@/components/preferences";
import { ArrowLink } from "@/components/ui";

export default function Overview() {
  const { data } = useRequests();
  const { t } = usePreferences();
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const request =
    data.requests.find((r) => r.id === selected) || data.requests[0];
  const environment = data.environments.find(
    (e) => e.id === data.activeEnvironmentId,
  );
  const successful = data.history.filter(
    (h) => h.response && h.response.status < 400,
  ).length;
  return (
    <div className="lab-overview">
      <header className="lab-greeting">
        <div>
          <p className="lab-breadcrumb">
            {t("PERSONAL WORKSPACE", "فضای کار شخصی")}
            <ChevronRight size={11} />
            {t("LAUNCHPAD", "میز شروع")}
          </p>
          <h1>{t("Okay, what are we building?", "خب، امروز چی می‌سازیم؟")}</h1>
          <p className="muted">
            {t(
              "Pick an endpoint. Poke around. See what comes back.",
              "یک آدرس انتخاب کن، کمی کنجکاوی کن و ببین چه پاسخی می‌گیری.",
            )}
          </p>
        </div>
        <button
          className="button primary"
          onClick={() =>
            router.push("/dashboard/workspace?new=" + crypto.randomUUID())
          }
        >
          <Plus size={16} />
          {t("New request", "درخواست جدید")}
        </button>
      </header>
      <div className="lab-metrics">
        <span>
          <Folder size={14} />
          <strong>{data.collections.length}</strong>
          {t("collections", "کالکشن")}
        </span>
        <span>
          <Terminal size={14} />
          <strong>{data.requests.length}</strong>
          {t("saved requests", "درخواست ذخیره‌شده")}
        </span>
        <span>
          <Check size={14} />
          <strong>{successful}</strong>
          {t("successful recent runs", "اجرای موفق اخیر")}
        </span>
        <Link href="/dashboard/history">
          {t("Session history", "تاریخچه نشست")}
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="lab-workbench-grid">
        <section className="lab-panel lab-start-panel">
          <div className="lab-panel-heading">
            <h2>
              <Terminal size={16} />
              {t("The workbench", "میز آزمایش")}
            </h2>
            <span className="lab-label">
              {t("PICK UP & GO", "انتخاب کن و شروع کن")}
            </span>
          </div>
          <div className="lab-workbench">
            <div className="lab-endpoint-list">
              {data.requests.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  className={
                    "lab-endpoint " + (request?.id === r.id ? "selected" : "")
                  }
                  onClick={() => setSelected(r.id)}
                  aria-pressed={request?.id === r.id}
                >
                  <span className={"method " + r.method.toLowerCase()}>
                    {r.method}
                  </span>
                  <span>{r.name}</span>
                  <ChevronRight size={13} />
                </button>
              ))}
              <button
                className="lab-endpoint-add"
                onClick={() =>
                  router.push("/dashboard/workspace?new=" + crypto.randomUUID())
                }
              >
                <Plus size={13} />
                {t("Something new…", "یک چیز تازه…")}
              </button>
            </div>
            <div className="lab-request-preview">
              {request ? (
                <>
                  <div className="lab-file-tab">
                    <Code2 size={13} />
                    {request.name}
                    <span className="lab-tab-dot" />
                  </div>
                  <div className="lab-preview-code">
                    <p className="lab-comment">
                      {t(
                        "// A little curiosity goes a long way.",
                        "// کمی کنجکاوی، کلی کشف تازه.",
                      )}
                    </p>
                    <p className="lab-code-url" dir="ltr">
                      <span
                        className={"method " + request.method.toLowerCase()}
                      >
                        {request.method}
                      </span>
                      {request.url}
                    </p>
                    <div className="lab-header-preview" dir="ltr">
                      {request.headers
                        .filter((h) => h.enabled && h.key)
                        .map((h) => (
                          <p key={h.id}>
                            <span>{h.key}</span>:{" "}
                            {/(authorization|token|secret|key)/i.test(h.key)
                              ? "••••••••"
                              : h.value}
                          </p>
                        ))}
                      {request.body && <pre>{request.body}</pre>}
                    </div>
                  </div>
                  <div className="lab-preview-bottom">
                    <span className="mono muted">
                      <span className="status-dot" />
                      {environment?.name || t("No environment", "بدون محیط")}
                    </span>
                    <Link
                      className="button primary"
                      href={"/dashboard/workspace?id=" + request.id}
                    >
                      {t("Open request", "باز کردن درخواست")}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <Terminal size={25} />
                  <h3>{t("Start with a question.", "با یک سؤال شروع کن.")}</h3>
                  <p className="muted text-xs">
                    {t(
                      "What should your API do? Create your first request and find out.",
                      "API تو قرار است چه کند؟ اولین درخواست را بساز و امتحان کن.",
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <aside className="lab-activity">
          <div className="lab-panel-heading">
            <h2>
              <Clock3 size={15} />
              {t("Just happened", "همین حالا گذشت")}
            </h2>
            <Link
              href="/dashboard/history"
              aria-label={t("View history", "دیدن تاریخچه")}
            >
              <ArrowUpRight size={15} />
            </Link>
          </div>
          {data.history.length ? (
            <div className="lab-activity-feed">
              {data.history.slice(0, 5).map((h) => (
                <Link
                  key={h.id}
                  href={"/dashboard/workspace?history=" + h.id}
                  className="lab-activity-item"
                >
                  <span
                    className={
                      "lab-result-dot " +
                      (h.response && h.response.status < 400
                        ? "success"
                        : "failure")
                    }
                  />
                  <div>
                    <p>{h.request.name}</p>
                    <span className="mono muted">
                      {h.request.method} ·{" "}
                      {h.response?.status || t("Error", "خطا")} ·{" "}
                      {h.response ? h.response.duration + " ms" : "—"}
                    </span>
                  </div>
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="lab-empty-activity">
              <div className="lab-wave" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <h3>{t("Quiet in here. For now.", "فعلاً خبری نیست.")}</h3>
              <p>
                {t(
                  "Your requests leave a trail here. Try an example to get things moving.",
                  "رد درخواست‌هایت اینجا می‌ماند. یک نمونه را امتحان کن تا شروع شود.",
                )}
              </p>
            </div>
          )}
          <div className="lab-tip">
            <Zap size={15} />
            <div>
              <h3>{t("One less thing to type", "یک کار تکراری کمتر")}</h3>
              <p>
                {t(
                  "Put {{baseUrl}} in your URL. Change the environment, not every request.",
                  "{{baseUrl}} را در آدرس بگذار؛ به‌جای تک‌تک درخواست‌ها، فقط محیط را عوض کن.",
                )}
              </p>
              <Link href="/dashboard/environments">
                {t("Set up your variables", "تنظیم متغیرها")}
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <section className="lab-collection-section">
        <div className="lab-panel-heading">
          <h2>{t("Your APIs, in order", "APIهای تو، مرتب و آماده")}</h2>
          <ArrowLink href="/dashboard/collections">
            {t("Manage collections", "مدیریت کالکشن‌ها")}
          </ArrowLink>
        </div>
        <div className="lab-collection-table">
          {data.collections.map((c, i) => (
            <div className="lab-collection-line" key={c.id}>
              <span className="lab-collection-icon">
                <Folder size={19} />
              </span>
              <div className="lab-collection-description">
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
              <div className="lab-collection-methods">
                {[
                  ...new Set(
                    data.requests
                      .filter((r) => r.collectionId === c.id)
                      .map((r) => r.method),
                  ),
                ].map((method) => (
                  <span
                    className={"method " + method.toLowerCase()}
                    key={method}
                  >
                    {method}
                  </span>
                ))}
              </div>
              <span className="muted mono text-xs">
                {String(
                  data.requests.filter((r) => r.collectionId === c.id).length,
                ).padStart(2, "0")}{" "}
                {t("requests", "درخواست")}
              </span>
              <Link
                href="/dashboard/collections"
                className="icon-button"
                aria-label={t("Open collection ", "باز کردن کالکشن ") + c.name}
              >
                <ArrowUpRight size={16} />
              </Link>
              <span className="lab-line-number" aria-hidden="true">
                {i + 1}
              </span>
            </div>
          ))}
          {!data.collections.length && (
            <p className="muted text-sm p-6">
              {t(
                "No collections yet. A little organization starts here.",
                "هنوز کالکشنی نیست؛ نظم از همین‌جا شروع می‌شود.",
              )}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
