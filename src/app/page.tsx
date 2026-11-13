"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Folder,
  Globe2,
  Layers3,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Logo, PreferencesControls } from "@/components/ui";
import { usePreferences } from "@/components/preferences";
const mind = false;
export default function Landing() {
  const { t } = usePreferences();
  const features = mind
    ? [
        {
          icon: FileText,
          title: t("Less friction. More flow.", "بی‌وقفه بنویس؛ روان فکر کن."),
          text: t(
            "A focused Markdown editor with live preview, task lists, code blocks, and room for your next big idea.",
            "ادیتور Markdown با پیش‌نمایش زنده، فهرست کارها و قطعه‌کد؛ فضایی برای ایده بزرگ بعدی تو.",
          ),
        },
        {
          icon: Network,
          title: t("Find the unexpected.", "ارتباط‌های تازه را کشف کن."),
          text: t(
            "Connect notes with [[wiki links]]. Explore your knowledge graph and discover how your ideas fit together.",
            "یادداشت‌ها را با [[پیوند ویکی]] متصل کن. در گراف دانشت قدم بزن و ارتباط ایده‌ها را ببین.",
          ),
        },
        {
          icon: Search,
          title: t("An idea away. Always.", "هر ایده، در دسترس تو."),
          text: t(
            "Instant search, thoughtful tags, and a personal library. Your next insight is never buried in a folder.",
            "جست‌وجوی فوری، برچسب‌های منظم و کتابخانه شخصی؛ هیچ ایده‌ای میان پوشه‌ها گم نمی‌شود.",
          ),
        },
      ]
    : [
        {
          icon: Terminal,
          title: t("Make every request count.", "هر درخواست، یک قدم جلوتر."),
          text: t(
            "Compose requests with custom headers, JSON bodies, and environment variables. Inspect the details that matter.",
            "درخواست‌ها را با هدر دلخواه، بدنه JSON و متغیرهای محیطی بساز و جزئیات مهم را بررسی کن.",
          ),
        },
        {
          icon: Layers3,
          title: t("A little less chaos.", "نظم بیشتر؛ پیچیدگی کمتر."),
          text: t(
            "Keep your endpoints in collections. Switch environments in a click. Build a workspace that works like you.",
            "آدرس‌های API را در کالکشن‌ها نگه دار و با یک کلیک محیط را عوض کن؛ یک فضای کار مطابق نیاز تو.",
          ),
        },
        {
          icon: Zap,
          title: t("The whole conversation.", "کل ماجرا را ببین."),
          text: t(
            "Formatted JSON, response headers, timing, and request history. Know what happened, then pick up where you left off.",
            "JSON خوانا، هدرهای پاسخ، زمان اجرا و تاریخچه؛ بدان چه اتفاقی افتاده و از همان‌جا ادامه بده.",
          ),
        },
      ];
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-inner">
          <Logo />
          <div className="nav-links">
            <a href="#features">{t("Features", "امکانات")}</a>
            <a href="#how">{t("How it works", "چطور کار می‌کند")}</a>
            <a href="#faq">{t("Good to know", "سؤالات متداول")}</a>
          </div>
          <div className="flex items-center gap-4">
            <PreferencesControls />
            <Link className="button primary" href="/dashboard">
              {t("Open workspace", "ورود به فضای کار")}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <section className="hero fade-in">
          <div className="hero-pill">
            <span className="status-dot" />
            {t(
              "A little space for your next big thing",
              "فضایی برای اتفاق بزرگ بعدی تو",
            )}
            <ChevronRight size={12} />
          </div>
          <h1>
            {mind
              ? t("Your mind is full.", "ذهنت پر از ایده است.")
              : t("Great APIs start with", "APIهای عالی از اینجا")}
            <br />
            <em>
              {mind
                ? t("Give it a little space.", "کمی به آن فضا بده.")
                : t("a better workspace.", "با یک فضای کار بهتر.")}
            </em>
          </h1>
          <p className="hero-description">
            {mind
              ? t(
                  "A quiet home for your notes, ideas, and everything in between. Connect the dots. See the bigger picture. Make room for what’s next.",
                  "خانه‌ای آرام برای یادداشت‌ها، ایده‌ها و هر آنچه در ذهن توست. نقطه‌ها را به هم وصل کن، تصویر بزرگ‌تر را ببین و برای ایده بعدی جا باز کن.",
                )
              : t(
                  "Meet your new API sidekick. Send requests, organize endpoints, and understand every response. All in one beautifully simple, local-first workspace.",
                  "با دستیار تازه API خود آشنا شو. درخواست بفرست، آدرس‌ها را مرتب کن و هر پاسخ را بهتر بفهم؛ همه در یک فضای کار ساده، زیبا و محلی.",
                )}
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="button primary">
              {mind
                ? t("Start connecting ideas", "شروع اتصال ایده‌ها")
                : t("Launch your workspace", "شروع فضای کار")}
              <ArrowRight size={16} />
            </Link>
            <a href="#features" className="button">
              {t("Take a closer look", "نگاه نزدیک‌تر")}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hero-footnote">
            <span className="flex items-center gap-1">
              <Check size={11} />
              {t("No account needed", "بدون نیاز به حساب")}
            </span>
            <span className="flex items-center gap-1">
              <Check size={11} />
              {t("Free & open source", "رایگان و متن‌باز")}
            </span>
            <span className="flex items-center gap-1">
              <Check size={11} />
              {t("Yours. Always.", "همیشه متعلق به تو")}
            </span>
          </div>
          <div className="product-window">
            <div className="window-top">
              <i />
              <i />
              <i />
              <span className="window-title">
                reqlab.workspace / {mind ? "my second brain" : "api playground"}
              </span>
              <LockKeyhole size={10} className="muted" />
            </div>
            <div className="preview-body">
              <aside className="preview-sidebar">
                <div className="mb-5">
                  <Logo />
                </div>
                <p className="eyebrow">{t("YOUR WORKSPACE", "فضای کار تو")}</p>
                {(mind
                  ? [
                      [Layers3, t("Overview", "نمای کلی")],
                      [FileText, t("All notes", "همه یادداشت‌ها")],
                      [Network, t("Knowledge graph", "گراف دانش")],
                      [Folder, t("Library", "کتابخانه")],
                    ]
                  : [
                      [Layers3, t("Overview", "نمای کلی")],
                      [Terminal, t("Request workspace", "محیط درخواست")],
                      [Folder, t("Collections", "کالکشن‌ها")],
                      [Globe2, t("Environments", "محیط‌ها")],
                    ]
                ).map(([Icon, label], i) => {
                  const I = Icon as typeof Layers3;
                  return (
                    <div
                      key={i}
                      className={
                        "preview-nav-item " + (i === 1 ? "active" : "")
                      }
                    >
                      <I size={13} />
                      {label as string}
                    </div>
                  );
                })}
                <div
                  className="mt-8 p-3 rounded-lg"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <span className="accent-text text-[10px]">
                    {t(
                      "A space that’s truly yours",
                      "فضایی که واقعاً برای توست",
                    )}
                  </span>
                  <p className="muted text-[9px] mt-2">
                    {t(
                      "Local-first. Distraction-free.",
                      "ذخیره محلی. بدون حواس‌پرتی.",
                    )}
                  </p>
                </div>
              </aside>
              <div className="preview-main">
                <p className="preview-kicker">
                  {mind
                    ? t(
                        "MY NOTES / EVERYDAY DISCOVERIES",
                        "یادداشت‌ها / کشف‌های روزمره",
                      )
                    : t(
                        "COLLECTIONS / THE EXAMPLE API",
                        "کالکشن‌ها / API نمونه",
                      )}
                </p>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">
                    {mind
                      ? t("A garden of ideas", "باغی از ایده‌ها")
                      : t("Let’s build something.", "بیا چیزی بسازیم.")}
                  </h2>
                  <span className="tag">
                    <span className="status-dot" />
                    {t("Saved locally", "ذخیره محلی")}
                  </span>
                </div>
                {mind ? (
                  <div className="preview-grid">
                    <div className="preview-note">
                      <div className="flex gap-2 mb-4">
                        <span className="tag"># {t("thinking", "تفکر")}</span>
                        <span className="tag">
                          # {t("creativity", "خلاقیت")}
                        </span>
                      </div>
                      <h3>
                        {t(
                          "Good ideas don’t happen alone.",
                          "ایده‌های خوب تنها نیستند.",
                        )}
                      </h3>
                      <p>
                        {t(
                          "Every note is a small seed. Connect it to another, and something new begins to grow.",
                          "هر یادداشت یک بذر کوچک است. آن را به یادداشت دیگری وصل کن تا چیزی تازه رشد کند.",
                        )}
                      </p>
                      <blockquote>
                        {t(
                          "“The more you connect, the more you discover.”",
                          "«هرچه بیشتر پیوند بزنی، بیشتر کشف می‌کنی.»",
                        )}
                      </blockquote>
                      <p>
                        {t("Related to", "مرتبط با")}{" "}
                        <span className="accent-text">
                          [[{t("Creative process", "فرایند خلاقیت")}]]
                        </span>
                      </p>
                    </div>
                    <div className="graph-canvas">
                      <DecorativeGraph />
                      <div className="absolute bottom-3 start-3 badge">
                        <Network size={10} />
                        {t("Your ideas, connected", "ایده‌هایت، متصل به هم")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="request-bar !my-0">
                      <span className="method self-center">GET</span>
                      <span
                        className="mono text-[11px] flex-1 self-center"
                        dir="ltr"
                      >
                        https://jsonplaceholder.typicode.com/users/1
                      </span>
                      <span className="button primary small">
                        {t("Send", "ارسال")}
                        <ArrowRight size={12} />
                      </span>
                    </div>
                    <div className="preview-grid">
                      <div className="preview-note">
                        <p className="eyebrow">
                          {t("REQUEST HEADERS", "هدرهای درخواست")}
                        </p>
                        <div className="flex justify-between mono text-[10px]">
                          <span>Content-Type</span>
                          <span className="muted">application/json</span>
                        </div>
                        <div className="mt-8">
                          <p className="eyebrow">{t("ENVIRONMENT", "محیط")}</p>
                          <span className="tag">
                            <Globe2 size={10} />
                            {t("Development", "توسعه")}
                          </span>
                        </div>
                      </div>
                      <div className="preview-note">
                        <div className="flex justify-between text-[9px] mb-3">
                          <span className="accent-text">200 OK</span>
                          <span className="muted">142 ms · 509 B</span>
                        </div>
                        <pre className="mono text-[11px] leading-7" dir="ltr">
                          {
                            '{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz"\n}'
                          }
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="proof-strip">
          <span>
            <ShieldCheck size={16} />
            {t(
              "Your data stays in your browser",
              "داده‌ها در مرورگر تو می‌مانند",
            )}
          </span>
          <span>
            <Globe2 size={16} />
            {t("English & فارسی", "فارسی و English")}
          </span>
          <span>
            <Sparkles size={16} />
            {t("Light & dark. Your call.", "روشن یا تاریک؛ انتخاب با توست")}
          </span>
        </div>
        <section className="landing-section" id="features">
          <p className="eyebrow">
            {t(
              "THOUGHTFULLY SIMPLE. SURPRISINGLY CAPABLE.",
              "ساده، حساب‌شده و پر از امکان",
            )}
          </p>
          <h2>
            {mind
              ? t(
                  "A second brain. With a little more soul.",
                  "مغز دوم تو؛ با کمی روح بیشتر.",
                )
              : t(
                  "Everything you need. Nothing in your way.",
                  "هرچه نیاز داری؛ بدون هیچ مانعی.",
                )}
          </h2>
          <p className="muted">
            {t(
              "Built for the way you work, with the little details that make a big difference.",
              "ساخته‌شده برای شیوه کار تو، با جزئیات کوچکی که تفاوت بزرگی می‌سازند.",
            )}
          </p>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="feature" key={title}>
                <div className="feature-icon">
                  <Icon size={21} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="landing-section" id="how">
          <p className="eyebrow">
            {t("FROM ZERO TO IN YOUR FLOW", "از شروع تا غرق شدن در کار")}
          </p>
          <h2>
            {t("Less setup. More possibility.", "راه‌اندازی کمتر؛ فرصت بیشتر.")}
          </h2>
          <div className="how-grid">
            {(mind
              ? [
                  [
                    t("Make yourself at home", "اینجا خانه توست"),
                    t(
                      "Open your workspace. No sign-up, no setup, no blank-page anxiety. A few example notes will show you around.",
                      "فضای کار را باز کن؛ بدون ثبت‌نام و تنظیمات. چند یادداشت نمونه راه را نشانت می‌دهند.",
                    ),
                  ],
                  [
                    t("Let your thoughts wander", "به فکرهایت آزادی بده"),
                    t(
                      "Write in Markdown, organize with tags, and link your thoughts with double brackets.",
                      "با Markdown بنویس، با برچسب‌ها مرتب کن و با کروشه دوتایی افکارت را وصل کن.",
                    ),
                  ],
                  [
                    t(
                      "Watch the connections grow",
                      "رشد ارتباط‌ها را تماشا کن",
                    ),
                    t(
                      "Explore the graph, revisit a favorite, or find that one thought with instant search.",
                      "گراف را کاوش کن، به علاقه‌مندی‌ها برگرد یا با جست‌وجوی فوری فکر گمشده‌ات را پیدا کن.",
                    ),
                  ],
                ]
              : [
                  [
                    t("Open. You’re ready.", "باز کن؛ آماده‌ای."),
                    t(
                      "Your workspace is ready in a click. Start with the example collection or make your own.",
                      "فضای کارت با یک کلیک آماده است؛ با کالکشن نمونه شروع کن یا کالکشن خودت را بساز.",
                    ),
                  ],
                  [
                    t("Craft the request", "درخواستت را بساز"),
                    t(
                      "Choose a method, set your URL, and add headers or a JSON body. Variables keep it flexible.",
                      "متد و URL را انتخاب کن، هدر یا بدنه JSON اضافه کن؛ متغیرها همه چیز را منعطف می‌کنند.",
                    ),
                  ],
                  [
                    t("See the full picture", "تصویر کامل را ببین"),
                    t(
                      "Send, inspect, iterate. Save to a collection and replay from history whenever you need.",
                      "ارسال، بررسی، تکرار؛ در کالکشن ذخیره کن و هر زمان خواستی از تاریخچه دوباره اجرا کن.",
                    ),
                  ],
                ]
            ).map(([title, text], i) => (
              <div className="how-step" key={i}>
                <p className="step-number">0{i + 1} —</p>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="landing-section" id="faq">
          <p className="eyebrow">
            {t("A FEW THINGS WORTH KNOWING", "چند نکته که خوب است بدانی")}
          </p>
          <h2>
            {t(
              "Made for you. Kept by you.",
              "برای تو ساخته شده؛ پیش تو می‌ماند.",
            )}
          </h2>
          <div className="faq">
            <details>
              <summary>
                {t("Where does my data live?", "داده‌هایم کجا ذخیره می‌شوند؟")}
              </summary>
              <p>
                {t(
                  "In this browser’s local storage. There is no database, account, or cloud sync. Export a backup from Settings before clearing browser data or switching devices.",
                  "در حافظه محلی همین مرورگر. بدون دیتابیس، حساب یا همگام‌سازی ابری. قبل از پاک کردن داده مرورگر یا تعویض دستگاه، از تنظیمات نسخه پشتیبان بگیر.",
                )}
              </p>
            </details>
            <details>
              <summary>
                {mind
                  ? t(
                      "Can I link and export my notes?",
                      "می‌توانم یادداشت‌ها را وصل و خروجی بگیرم؟",
                    )
                  : t("Can I test any API?", "می‌توانم هر API را تست کنم؟")}
              </summary>
              <p>
                {mind
                  ? t(
                      "Yes. Use [[Note title]] to connect notes and see backlinks. Export your whole workspace as JSON, or download individual notes as Markdown.",
                      "بله. با [[عنوان یادداشت]] پیوند بساز و بک‌لینک‌ها را ببین. کل فضای کار را JSON یا هر یادداشت را Markdown دانلود کن.",
                    )
                  : t(
                      "Requests run directly in your browser, so the API must allow CORS. No server proxy is used. Use a CORS-enabled API, and avoid saving sensitive production credentials on shared devices.",
                      "درخواست مستقیماً از مرورگر اجرا می‌شود و API باید CORS را مجاز کند. پروکسی سرور نداریم. از API سازگار استفاده کن و اطلاعات حساس محیط اصلی را در دستگاه مشترک ذخیره نکن.",
                    )}
              </p>
            </details>
          </div>
        </section>
        <section className="landing-section">
          <div className="cta-panel">
            <div className="hero-pill">
              <Sparkles size={12} />
              {t(
                "YOUR NEXT CHAPTER STARTS HERE",
                "فصل بعدی تو از اینجا شروع می‌شود",
              )}
            </div>
            <h2>
              {mind
                ? t(
                    "Good thoughts deserve a place to grow.",
                    "فکرهای خوب، جایی برای رشد می‌خواهند.",
                  )
                : t(
                    "Less busywork. More building.",
                    "کار تکراری کمتر؛ ساختن بیشتر.",
                  )}
            </h2>
            <p className="muted">
              {t(
                "A fresh workspace is waiting. Make it yours.",
                "یک فضای کار تازه منتظر توست؛ آن را از آن خود کن.",
              )}
            </p>
            <Link href="/dashboard" className="button primary">
              {t("Let’s get started", "بیا شروع کنیم")}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="footer">
        <Logo />
        <span>
          {t(
            "Built for curious minds. Crafted with care.",
            "ساخته‌شده با دقت، برای ذهن‌های کنجکاو.",
          )}
        </span>
        <a
          href="https://github.com/mmdbazooka/ReqLab"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          {t("Find us on GitHub", "کدها در گیت‌هاب")}
          <ArrowUpRight size={14} />
        </a>
      </footer>
    </div>
  );
}
function DecorativeGraph() {
  const nodes = [
    [180, 130, 19],
    [85, 75, 10],
    [270, 65, 12],
    [290, 195, 9],
    [100, 230, 13],
    [55, 155, 7],
    [220, 260, 8],
    [160, 40, 6],
    [320, 125, 6],
    [170, 205, 8],
    [245, 155, 6],
    [45, 255, 5],
  ];
  return (
    <svg viewBox="0 0 360 300" aria-hidden="true">
      {nodes.slice(1).map(([x, y], i) => (
        <line
          key={i}
          x1={i % 3 === 0 ? nodes[4][0] : 180}
          y1={i % 3 === 0 ? nodes[4][1] : 130}
          x2={x}
          y2={y}
          stroke="var(--accent)"
          strokeOpacity=".2"
        />
      ))}
      {nodes.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r + 6} fill="var(--accent)" opacity=".035" />
          <circle
            cx={x}
            cy={y}
            r={r}
            fill={i === 0 ? "var(--accent)" : "var(--surface-3)"}
            stroke="var(--accent)"
            strokeOpacity=".5"
          />
          {i < 5 && (
            <text
              x={x}
              y={y + r + 15}
              fill="var(--muted)"
              fontSize="8"
              textAnchor="middle"
            >
              {
                [
                  "Creative thinking",
                  "Tiny habits",
                  "Inspiration",
                  "Learning",
                  "Design notes",
                ][i]
              }
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
