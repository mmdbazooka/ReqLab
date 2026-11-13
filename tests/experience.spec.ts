import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
test("landing, Persian RTL, preferences, and responsive navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Switch to Persian" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("button", { name: "تغییر پوسته" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "تغییر به انگلیسی" }).click();
  await page.getByRole("link", { name: "Open workspace", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/dashboard",
    "/dashboard/workspace",
    "/dashboard/collections",
    "/dashboard/environments",
    "/dashboard/history",
    "/dashboard/settings",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(errors).toEqual([]);
});
test("backup export and validated import", async ({ page }) => {
  await page.goto("/dashboard/settings");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  expect((await downloaded).suggestedFilename()).toContain("reqlab-backup");
  await page.locator('input[type="file"]').setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"bad":true}'),
  });
  await expect(page.getByRole("status")).toContainText("Could not read");
  const file = await downloaded;
  const filePath = await file.path();
  expect(filePath).toBeTruthy();
  const backup = JSON.parse(await readFile(filePath!, "utf8"));
  backup.collections[0].name = "Restored collection";
  await page.locator('input[type="file"]').setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Restore backup", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Workspace updated");
  await page.goto("/dashboard/collections");
  await expect(
    page.getByRole("heading", { name: "Restored collection" }),
  ).toBeVisible();
});

test("corrupt browser data is reported and preserved for recovery", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("reqlab-workspace-v1", "{broken"),
  );
  await page.goto("/dashboard");
  await expect(page.locator(".notice[role=alert]")).toContainText(
    "contains invalid data",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("reqlab-workspace-v1")),
  ).toBe("{broken");
});
