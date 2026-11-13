import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
const base = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3001";
mkdirSync("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [route, name] of [
    ["/", "landing-dark"],
    ["/dashboard", "dashboard-dark"],
  ]) {
    await page.goto(base + route);
    await page.getByRole("heading", { level: 1 }).first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `docs/screenshots/${name}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Switch to Persian" }).click();
  await page.getByRole("button", { name: "تغییر پوسته" }).click();
  await page.screenshot({
    path: "docs/screenshots/dashboard-fa-light.png",
    fullPage: true,
  });
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  await mobile.emulateMedia({ reducedMotion: "reduce" });
  await mobile.goto(base + "/dashboard");
  await mobile.getByRole("heading", { level: 1 }).waitFor();
  await mobile.evaluate(() => document.fonts.ready);
  await mobile.screenshot({
    path: "docs/screenshots/mobile.png",
    fullPage: true,
  });
} finally {
  await browser.close();
}
