"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Code2, Globe2, Save, Send, Square } from "lucide-react";
import { useRequests } from "./provider";
import {
  emptyRequest,
  methods,
  prepareRequest,
  type ApiRequest,
  type ApiResponse,
} from "./model";
import { executeRequest } from "./client";
import { KeyValueEditor } from "./key-value-editor";
import { ResponsePanel } from "./response-panel";
import { PageTitle } from "@/components/ui";
import { usePreferences } from "@/components/preferences";
export function RequestWorkspace() {
  const params = useSearchParams();
  const key =
    params.get("id") || params.get("history") || params.get("new") || "default";
  return (
    <WorkspaceEditor
      key={key}
      requestId={params.get("id")}
      historyId={params.get("history")}
      draftKey={key}
    />
  );
}
function WorkspaceEditor({
  requestId,
  historyId,
  draftKey,
}: {
  draftKey: string;
  requestId: string | null;
  historyId: string | null;
}) {
  const { data, update } = useRequests();
  const { t } = usePreferences();
  const historical = data.history.find((h) => h.id === historyId);
  const existing = data.requests.find((r) => r.id === requestId);
  const source = draftKey;
  const [draft, setDraft] = useState<ApiRequest>(
    () =>
      (data.draftSource === source && data.draft) ||
      existing ||
      historical?.request ||
      emptyRequest(),
  );
  const [response, setResponse] = useState<ApiResponse | null>(
    () => historical?.response || null,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("headers");
  const [saved, setSaved] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const environment = data.environments.find(
    (e) => e.id === data.activeEnvironmentId,
  );
  const variables = environment?.variables || [];
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      abortRef.current?.abort();
    };
  }, []);
  const patch = (values: Partial<ApiRequest>) => {
    const next = { ...draft, ...values };
    setDraft(next);
    update((s) => ({ ...s, draft: next, draftSource: source }));
    setSaved(false);
  };
  const save = () => {
    const request = {
      ...draft,
      name: draft.name.trim() || t("Untitled request", "درخواست بدون عنوان"),
      updatedAt: new Date().toISOString(),
    };
    update((s) => ({
      ...s,
      draft: request,
      draftSource: source,
      requests: s.requests.some((r) => r.id === request.id)
        ? s.requests.map((r) => (r.id === request.id ? request : r))
        : [request, ...s.requests],
    }));
    setDraft(request);
    setSaved(true);
  };
  const send = async () => {
    if (busy || abortRef.current) return;
    setError("");
    setResponse(null);
    let prepared: ReturnType<typeof prepareRequest>;
    try {
      prepared = prepareRequest(draft, variables);
    } catch (e) {
      setError(
        t("Check your URL and variables: ", "URL و متغیرها را بررسی کن: ") +
          (e instanceof Error ? e.message : ""),
      );
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    const started = performance.now();
    const timeout = setTimeout(() => controller.abort("timeout"), 30000);
    let result: ApiResponse | null = null;
    let failure: string | null = null;
    try {
      result = await executeRequest(prepared, controller, started);
      if (alive.current) setResponse(result);
    } catch {
      failure = controller.signal.aborted
        ? controller.signal.reason === "timeout"
          ? t(
              "Request timed out after 30 seconds.",
              "پس از ۳۰ ثانیه مهلت درخواست تمام شد.",
            )
          : t("Request cancelled.", "درخواست لغو شد.")
        : t(
            "The browser could not complete this request. Check your connection, URL, TLS certificate, and the API’s CORS policy. No server proxy is used.",
            "مرورگر نتوانست درخواست را کامل کند. اتصال، URL، گواهی TLS و سیاست CORS مقصد را بررسی کن. پروکسی سرور استفاده نمی‌شود.",
          );
      if (alive.current) setError(failure);
    } finally {
      clearTimeout(timeout);
      if (alive.current) {
        setBusy(false);
        update((s) => ({
          ...s,
          history: [
            {
              id: crypto.randomUUID(),
              request: {
                ...draft,
                name:
                  draft.name.trim() ||
                  t("Untitled request", "درخواست بدون عنوان"),
              },
              response: result,
              error: failure,
              createdAt: new Date().toISOString(),
            },
            ...s.history,
          ].slice(0, 10),
        }));
      }
      abortRef.current = null;
    }
  };
  const formatBody = () => {
    try {
      patch({ body: JSON.stringify(JSON.parse(draft.body), null, 2) });
      setError("");
    } catch {
      setError(
        t(
          "This body is not valid JSON. You can still send it as plain text.",
          "این بدنه JSON معتبر نیست؛ همچنان می‌توانی آن را به شکل متن ساده ارسال کنی.",
        ),
      );
    }
  };
  return (
    <>
      <PageTitle
        eyebrow={t("COMPOSE. SEND. UNDERSTAND.", "بساز؛ ارسال کن؛ بفهم.")}
        title={t("A good place to build.", "جایی خوب برای ساختن.")}
        description={t(
          "Your next request starts here. Small details, clear responses.",
          "درخواست بعدی از اینجا شروع می‌شود؛ جزئیات دقیق، پاسخ‌های روشن.",
        )}
        action={
          <button className="button primary" onClick={save}>
            <Save size={14} />
            {saved
              ? t("Saved", "ذخیره شد")
              : t("Save request", "ذخیره درخواست")}
          </button>
        }
      />
      {requestId && !existing && (
        <div className="notice">
          {t(
            "This saved request was not found. You can compose a new one.",
            "درخواست ذخیره‌شده پیدا نشد؛ می‌توانی درخواست تازه بسازی.",
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-48">
          {t("Request name", "نام درخواست")}
          <input
            value={draft.name}
            maxLength={200}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          {t("Collection", "کالکشن")}
          <select
            value={draft.collectionId || ""}
            onChange={(e) => patch({ collectionId: e.target.value || null })}
          >
            <option value="">{t("Unfiled", "بدون کالکشن")}</option>
            {data.collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Environment", "محیط")}
          <select
            value={data.activeEnvironmentId || ""}
            onChange={(e) =>
              update((s) => ({
                ...s,
                activeEnvironmentId: e.target.value || null,
              }))
            }
          >
            <option value="">{t("No environment", "بدون محیط")}</option>
            {data.environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <form
        className="request-bar"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <select
          aria-label={t("HTTP method", "متد HTTP")}
          value={draft.method}
          onChange={(e) =>
            patch({ method: e.target.value as ApiRequest["method"] })
          }
        >
          {methods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <input
          aria-label={t("Request URL", "آدرس درخواست")}
          dir="ltr"
          value={draft.url}
          maxLength={10000}
          onChange={(e) => patch({ url: e.target.value })}
          placeholder="https://api.example.com/resource"
          required
        />
        {busy ? (
          <button
            type="button"
            className="button"
            onClick={() => abortRef.current?.abort()}
          >
            <Square size={13} />
            {t("Cancel", "لغو")}
          </button>
        ) : (
          <button className="button primary" type="submit">
            <Send size={14} />
            {t("Send request", "ارسال درخواست")}
          </button>
        )}
      </form>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <div className="request-workspace">
        <section className="card !p-5">
          <div
            className="tabs mb-6"
            role="tablist"
            aria-label={t("Request configuration", "تنظیمات درخواست")}
          >
            {[
              ["headers", t("Headers", "هدرها")],
              ["body", t("Body", "بدنه")],
            ].map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
              >
                {label}
                {value === "headers" ? (
                  <span className="ms-2 opacity-50">
                    {draft.headers.filter((h) => h.enabled && h.key).length}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          {tab === "headers" ? (
            <KeyValueEditor
              pairs={draft.headers}
              onChange={(headers) => patch({ headers })}
              secret
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="badge">JSON / Text</span>
                <button className="button small" onClick={formatBody}>
                  <Code2 size={12} />
                  {t("Format JSON", "مرتب‌سازی JSON")}
                </button>
              </div>
              {["GET", "HEAD"].includes(draft.method) && (
                <p className="notice">
                  {t(
                    "GET and HEAD requests do not send a body.",
                    "درخواست‌های GET و HEAD بدنه ارسال نمی‌کنند.",
                  )}
                </p>
              )}
              <textarea
                className="request-body"
                aria-label={t("Request body", "بدنه درخواست")}
                value={draft.body}
                maxLength={200000}
                onChange={(e) => patch({ body: e.target.value })}
                placeholder={'{\n  "hello": "world"\n}'}
              />
              <p className="text-[10px] muted mt-3">
                {t(
                  "Set Content-Type: application/json in Headers when sending JSON.",
                  "برای ارسال JSON، هدر Content-Type: application/json را تنظیم کن.",
                )}
              </p>
            </>
          )}
        </section>
        <ResponsePanel busy={busy} response={response} />
      </div>
      <div className="notice mt-5 flex items-start gap-3">
        <Globe2 size={16} className="shrink-0" />
        <span>
          {t(
            "Browser-powered: the API must allow CORS. Variables use {{name}} syntax. The last 10 requests are kept in history; your latest draft is saved automatically.",
            "مبتنی بر مرورگر: API باید CORS را مجاز کند. متغیرها با {{name}} نوشته می‌شوند. ۱۰ درخواست آخر در تاریخچه می‌مانند؛ آخرین پیش‌نویس خودکار ذخیره می‌شود.",
          )}
        </span>
      </div>
    </>
  );
}
