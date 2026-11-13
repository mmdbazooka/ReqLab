"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  Command,
  Folder,
  Globe2,
  History,
  Terminal,
} from "lucide-react";
import { Logo, PreferencesControls } from "@/components/ui";
import { usePreferences } from "@/components/preferences";

export default function Landing() {
  const { t } = usePreferences();
  const [method, setMethod] = useState<"GET" | "POST">("GET");
  return (
    <div className="reqlab-landing">
      <nav className="rl-nav">
        <Logo />
        <div className="flex items-center gap-4">
          <PreferencesControls />
          <Link href="/dashboard" className="button primary">
            {t("Open workspace", "ورود به فضای کار")}
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>
      <main>
        <section className="rl-hero">
          <div className="rl-hero-copy">
            <span className="rl-product-label">
              <span className="status-dot" />
              {t("YOUR BROWSER. YOUR API LAB.", "مرورگر تو؛ آزمایشگاه API تو.")}
            </span>
            <h1>
              {t("Make the request.", "درخواستت را بفرست.")}
              <br />
              <span>{t("Find the answer.", "جوابت را پیدا کن.")}</span>
              <br />
              {t("Get back to building.", "برگرد سراغ ساختن.")}
            </h1>
            <p>
              {t(
                "The endpoint that’s acting up. The header you forgot. The response that finally makes sense. ReqLab is your workbench for figuring it all out.",
                "آدرسی که درست کار نمی‌کند. هدری که یادت رفته. پاسخی که بالاخره معنایش را می‌فهمی. ReqLab میز کار تو برای سر در آوردن از همه این‌هاست.",
              )}
            </p>
            <div className="rl-hero-actions">
              <Link
                href="/dashboard/workspace?id=get-user"
                className="button primary"
              >
                <Terminal size={15} />
                {t("Let’s test something", "بیا چیزی را تست کنیم")}
                <ArrowRight size={15} />
              </Link>
              <span>{t("No sign-up detour.", "مستقیم برو سر اصل مطلب.")}</span>
            </div>
            <div className="rl-platforms">
              <Command size={13} />
              <span>
                {t(
                  "Works in your browser · EN / FA · Open source",
                  "در مرورگر تو · فارسی / انگلیسی · متن‌باز",
                )}
              </span>
            </div>
          </div>
          <div className="rl-demo">
            <div className="rl-demo-top">
              <span className="rl-demo-mark">
                <Braces size={13} />
              </span>
              <span>scratchpad.http</span>
              <span className="ms-auto">
                {t("EXAMPLE REQUEST", "درخواست نمونه")}
              </span>
            </div>
            <div className="rl-demo-tabs">
              <button
                aria-pressed={method === "GET"}
                onClick={() => setMethod("GET")}
              >
                <span className="method">GET</span>
                {t("Get a user", "دریافت کاربر")}
                {method === "GET" && <span className="rl-active-indicator" />}
              </button>
              <button
                aria-pressed={method === "POST"}
                onClick={() => setMethod("POST")}
              >
                <span className="method post">POST</span>
                {t("Create a post", "ساخت پست")}
                {method === "POST" && <span className="rl-active-indicator" />}
              </button>
            </div>
            <div className="rl-demo-request" dir="ltr">
              <span className={"method " + method.toLowerCase()}>{method}</span>
              <code>
                {method === "GET" ? "{{baseUrl}}/users/1" : "{{baseUrl}}/posts"}
              </code>
              <Link
                href={
                  "/dashboard/workspace?id=" +
                  (method === "GET" ? "get-user" : "create-post")
                }
                aria-label={t("Open this example", "باز کردن این نمونه")}
              >
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rl-demo-response">
              <div className="rl-response-meta">
                <span>
                  <span className="status-dot" />
                  {method === "GET" ? "200 OK" : "201 Created"}
                </span>
                <span>{t("Example JSON response", "نمونه پاسخ JSON")}</span>
                <span>JSON</span>
              </div>
              <div className="rl-numbered-code" dir="ltr">
                {(method === "GET"
                  ? [
                      "{",
                      '  "id": 1,',
                      '  "name": "Leanne Graham",',
                      '  "username": "Bret",',
                      '  "email": "Sincere@april.biz"',
                      "}",
                    ]
                  : [
                      "{",
                      '  "id": 101,',
                      '  "title": "Something worth building",',
                      '  "body": "It starts with a request.",',
                      '  "userId": 1',
                      "}",
                    ]
                ).map((line, i) => (
                  <div key={i}>
                    <span>{i + 1}</span>
                    <code className={i > 0 && i < 5 ? "accent-text" : ""}>
                      {line}
                    </code>
                  </div>
                ))}
              </div>
            </div>
            <div className="rl-demo-foot">
              <span>
                <span className="status-dot" />
                {t("Development", "توسعه")}
              </span>
              <span>
                {t("A familiar starting point.", "یک نقطه شروع آشنا.")}
              </span>
            </div>
          </div>
        </section>
        <div className="rl-workflow-strip" id="workflow">
          <span className="rl-strip-label">
            {t("THE EVERYDAY LOOP", "چرخه هر روز")}
          </span>
          {[
            ["01", t("Compose", "ساختن")],
            ["02", t("Send", "ارسال")],
            ["03", t("Inspect", "بررسی")],
            ["04", t("Try again", "دوباره امتحان کن")],
          ].map(([n, label]) => (
            <span key={n}>
              <small>{n}</small>
              {label}
              <ChevronRight size={13} />
            </span>
          ))}
        </div>
        <section className="rl-features" id="details">
          <div className="rl-section-heading">
            <p className="lab-breadcrumb">
              {t(
                "LESS FUMBLING AROUND. MORE FIGURING IT OUT.",
                "وقت کمتر برای کار تکراری؛ فرصت بیشتر برای کشف",
              )}
            </p>
            <h2>
              {t(
                "The tools you reach for.\nRight where you need them.",
                "ابزارهایی که لازم داری؛\nدقیقاً همان‌جا که باید باشند.",
              )}
            </h2>
          </div>
          <div className="rl-feature-grid">
            {[
              {
                icon: Folder,
                n: "01",
                title: t(
                  "Keep the endpoints together.",
                  "آدرس‌ها را کنار هم نگه دار.",
                ),
                body: t(
                  "Group saved requests into collections. Your API gets a little structure, and you get a little less ‘where did I put that?’",
                  "درخواست‌های ذخیره‌شده را در کالکشن‌ها مرتب کن. کمی نظم برای API؛ کمی کمتر دنبال آدرس‌ها گشتن برای تو.",
                ),
                mini: (
                  <div className="rl-mini-collection">
                    <span>
                      <Folder size={13} />
                      {t("The example API", "API نمونه")}
                    </span>
                    <p>
                      <span className="method">GET</span> /users/1
                    </p>
                    <p>
                      <span className="method post">POST</span> /posts
                    </p>
                  </div>
                ),
              },
              {
                icon: Globe2,
                n: "02",
                title: t(
                  "Change the context, keep the work.",
                  "محیط عوض می‌شود؛ کارت سر جایش است.",
                ),
                body: t(
                  "Use {{variables}} in URLs, headers, and bodies. Switch environments when you need a different address or token.",
                  "در URL، هدر و بدنه از {{متغیرها}} استفاده کن. وقتی آدرس یا توکن دیگری نیاز داری، فقط محیط را عوض کن.",
                ),
                mini: (
                  <div className="rl-mini-env" dir="ltr">
                    <span>baseUrl</span>
                    <ArrowRight size={13} />
                    <code>https://api.example.dev</code>
                  </div>
                ),
              },
              {
                icon: History,
                n: "03",
                title: t(
                  "You’ve seen that response before.",
                  "این پاسخ را قبلاً دیده‌ای.",
                ),
                body: t(
                  "Your recent requests stay in history. Reopen a response, check the timing, and replay the request when you’re ready.",
                  "درخواست‌های اخیر در تاریخچه می‌مانند. پاسخ را دوباره باز کن، زمانش را ببین و هر وقت خواستی بازپخش کن.",
                ),
                mini: (
                  <div className="rl-mini-history">
                    <span>
                      <span className="method">GET</span>/users/1
                    </span>
                    <span>
                      <Check size={12} />
                      200 OK
                    </span>
                  </div>
                ),
              },
            ].map(({ icon: Icon, n, title, body, mini }) => (
              <article key={n} className="rl-feature">
                <div className="rl-feature-title">
                  <Icon size={19} />
                  <span>{n}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                {mini}
              </article>
            ))}
          </div>
        </section>
        <section className="rl-ground-rules">
          <div>
            <p className="lab-breadcrumb">
              {t("A FEW THINGS UP FRONT", "چند نکته، از همین اول")}
            </p>
            <h2>
              {t(
                "Small tool.\nClear boundaries.",
                "ابزاری جمع‌وجور؛\nبا مرزهای روشن.",
              )}
            </h2>
          </div>
          <div>
            {[
              [
                t("Runs from your browser", "از مرورگر تو اجرا می‌شود"),
                t(
                  "Requests go directly to your API. The target must allow CORS; there’s no server proxy. A 30-second timeout and a cancel button keep you in control.",
                  "درخواست مستقیم به API می‌رود و مقصد باید CORS را مجاز کند. پروکسی سرور نداریم؛ محدودیت ۳۰ثانیه‌ای و دکمه لغو در اختیار توست.",
                ),
              ],
              [
                t("Saved on this device", "روی همین دستگاه ذخیره می‌شود"),
                t(
                  "Collections, variables, drafts, and recent runs live in local storage. Export a JSON backup to move them. Keep credentials private — backups include variable values.",
                  "کالکشن‌ها، متغیرها، پیش‌نویس و اجراهای اخیر محلی ذخیره می‌شوند. با JSON جابه‌جایشان کن. اطلاعات محرمانه را خصوصی نگه دار؛ پشتیبان شامل مقادیر متغیرهاست.",
                ),
              ],
              [
                t("Comfortable, however you work", "هرطور راحتی کار کن"),
                t(
                  "English and Persian, RTL and LTR, light and dark. Your settings stay with you between sessions, and the workspace adapts to smaller screens.",
                  "فارسی و انگلیسی، راست‌چین و چپ‌چین، روشن و تاریک. تنظیماتت حفظ می‌شوند و فضای کار با صفحه کوچک هم سازگار است.",
                ),
              ],
            ].map(([title, body]) => (
              <details key={title}>
                <summary>
                  {title}
                  <PlusMark />
                </summary>
                <p>{body}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="rl-last-call">
          <div>
            <span className="lab-breadcrumb">
              {t(
                "ENOUGH READING. LET’S TRY IT.",
                "خواندن کافی است؛ بیا امتحانش کنیم.",
              )}
            </span>
            <h2>
              {t(
                "Your next ‘aha’ is a request away.",
                "یک درخواست تا «آهان، فهمیدم!» بعدی.",
              )}
            </h2>
          </div>
          <Link href="/dashboard" className="button primary">
            {t("Open the lab", "ورود به آزمایشگاه")}
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <footer className="rl-footer">
        <Logo />
        <span>
          {t(
            "Made for the work between ‘it should work’ and ‘it works’.",
            "برای فاصله بین «باید کار کند» تا «کار می‌کند».",
          )}
        </span>
        <a
          href="https://github.com/mmdbazooka/ReqLab"
          target="_blank"
          rel="noreferrer"
        >
          {t("Explore the source", "دیدن کدها")}
          <ArrowUpRight size={12} />
        </a>
      </footer>
    </div>
  );
}
function PlusMark() {
  return (
    <span className="rl-plus-mark" aria-hidden="true">
      +
    </span>
  );
}
