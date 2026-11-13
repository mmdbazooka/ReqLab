import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
const base = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3001";
mkdirSync("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
});
async function capture(
  route,
  name,
  theme = "dark",
  locale = "en",
  mobile = false,
) {
  const page = await browser.newPage({
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    ({ theme, locale }) =>
      localStorage.setItem(
        "reqlab-preferences",
        JSON.stringify({ theme, locale }),
      ),
    { theme, locale },
  );
  await page.goto(base + route);
  await page.getByRole("heading", { level: 1 }).first().waitFor();
  await page.waitForFunction(
    ({ theme, locale }) =>
      document.documentElement.dataset.theme === theme &&
      document.documentElement.lang === locale,
    { theme, locale },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `docs/screenshots/${name}.png`,
    fullPage: true,
  });
  await page.close();
}
try {
  await capture("/", "landing-dark");
  await capture("/", "landing-light", "light");
  await capture("/dashboard", "dashboard-dark");
  await capture("/dashboard", "dashboard-light", "light");
  await capture("/dashboard", "dashboard-fa-light", "light", "fa");
  await capture("/dashboard", "mobile", "dark", "en", true);
} finally {
  await browser.close();
}
