"use client";
import { useState } from "react";
import { Clock3, LoaderCircle, Terminal } from "lucide-react";
import { EmptyState, CopyButton } from "@/components/ui";
import { usePreferences } from "@/components/preferences";
import { JsonViewer } from "./json-viewer";
import type { ApiResponse } from "./model";
export function ResponsePanel({
  busy,
  response,
}: {
  busy: boolean;
  response: ApiResponse | null;
}) {
  const { t } = usePreferences();
  const [responseTab, setResponseTab] = useState("body");
  return (
    <section className="card !p-5">
      <div className="section-title">
        <h3 className="!text-sm">{t("Response", "پاسخ")}</h3>
        {response && <CopyButton value={response.body} />}
      </div>
      {busy ? (
        <div className="empty-state" role="status">
          <LoaderCircle size={28} className="accent-text animate-spin" />
          <p className="muted">
            {t(
              "A little patience. Sending your request…",
              "کمی صبر؛ درخواست در حال ارسال است…",
            )}
          </p>
        </div>
      ) : response ? (
        <>
          <div className="response-status mb-5">
            <strong
              style={{
                color: response.status >= 400 ? "#e98191" : undefined,
              }}
            >
              {response.status} {response.statusText}
            </strong>
            <span>
              <Clock3 size={11} className="inline me-1" />
              {response.duration} ms
            </span>
            <span>{(response.size / 1024).toFixed(2)} KB</span>
          </div>
          <div
            className="tabs mb-4"
            role="tablist"
            aria-label={t("Response view", "نمای پاسخ")}
          >
            {[
              ["body", t("Body", "بدنه")],
              ["headers", t("Headers", "هدرها")],
            ].map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={responseTab === value}
                onClick={() => setResponseTab(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {response.truncated && (
            <div className="notice">
              {t(
                "Preview limited to 100 KB to protect browser storage.",
                "برای حفظ فضای مرورگر، پیش‌نمایش به ۱۰۰ کیلوبایت محدود شده است.",
              )}
            </div>
          )}
          {responseTab === "body" ? (
            <JsonViewer
              value={response.body || t("No response body", "پاسخ بدون بدنه")}
            />
          ) : (
            <div className="code-box">
              {Object.entries(response.headers).map(([key, value]) => (
                <p key={key}>
                  <span className="accent-text">{key}</span>: {value}
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Terminal size={25} />}
          title={t("The start of a conversation", "آغاز یک گفت‌وگو")}
          description={t(
            "Send a request and get to know your API. The response will appear right here.",
            "درخواستی بفرست و API خود را بشناس؛ پاسخ همین‌جا ظاهر می‌شود.",
          )}
        />
      )}
    </section>
  );
}
