import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
let server: Server;
test.beforeAll(async () => {
  server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.url === "/slow") {
      const timer = setTimeout(() => {
        res.end("slow response");
      }, 1000);
      res.on("close", () => clearTimeout(timer));
      return;
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = req.method === "POST" ? 201 : 200;
      res.end(
        JSON.stringify({
          ok: true,
          method: req.method,
          received: body ? JSON.parse(body) : null,
          header: req.headers["x-workspace"] || null,
        }),
      );
    });
  });
  await new Promise<void>((resolve) =>
    server.listen(4010, "127.0.0.1", resolve),
  );
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((e) => (e ? reject(e) : resolve())),
  );
});
test("save a POST, send an actual CORS request, inspect response and replay history", async ({
  page,
}) => {
  await page.goto("/dashboard/workspace");
  await page
    .getByRole("textbox", { name: "Request name", exact: true })
    .fill("Portfolio echo");
  await page
    .getByRole("combobox", { name: "HTTP method", exact: true })
    .selectOption("POST");
  await page
    .getByRole("textbox", { name: "Request URL", exact: true })
    .fill("http://127.0.0.1:4010/echo");
  await page
    .getByRole("textbox", { name: "Key 1", exact: true })
    .fill("Content-Type");
  await page
    .getByRole("textbox", { name: "Value 1", exact: true })
    .fill("application/json");
  await page.getByRole("tab", { name: "Body", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Request body", exact: true })
    .fill('{"message":"سلام"}');
  await page.getByRole("button", { name: "Save request", exact: true }).click();
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.locator(".response-status")).toContainText("201");
  await expect(page.locator(".code-box")).toContainText('"message": "سلام"');
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Request name", exact: true }),
  ).toHaveValue("Portfolio echo");
  await page.goto("/dashboard/history");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("201");
  await page.getByRole("link", { name: "Replay request" }).click();
  await expect(page.locator(".response-status")).toContainText("201");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.locator(".response-status")).toContainText("201");
  await page.goto("/dashboard/history");
  await expect(page.locator("tbody tr")).toHaveCount(2);
});
test("collections and environments persist, variables resolve, and failures are actionable", async ({
  page,
}) => {
  await page.goto("/dashboard/collections");
  await page
    .getByRole("button", { name: "New collection", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("My portfolio API");
  await page.getByRole("button", { name: "Save collection" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "My portfolio API" }),
  ).toBeVisible();
  await page.goto("/dashboard/environments");
  await page
    .getByRole("button", { name: "New environment", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Local tests");
  await page.getByRole("button", { name: "Create environment" }).click();
  await page.getByRole("button", { name: "Add row", exact: true }).click();
  await page.getByRole("textbox", { name: "Key 1", exact: true }).fill("host");
  await page
    .getByRole("textbox", { name: "Value 1", exact: true })
    .fill("http://127.0.0.1:4010");
  await page
    .getByRole("button", { name: "Use this environment", exact: true })
    .click();
  await page.goto("/dashboard/workspace");
  await page
    .getByRole("textbox", { name: "Request URL", exact: true })
    .fill("{{host}}/test");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.locator(".response-status")).toContainText("200");
  await page
    .getByRole("textbox", { name: "Request URL", exact: true })
    .fill("{{missing}}/test");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.locator(".notice[role=alert]")).toContainText(
    "Missing variable",
  );
  await page.route("http://127.0.0.1:4010/fail", (route) =>
    route.abort("failed"),
  );
  await page
    .getByRole("textbox", { name: "Request URL", exact: true })
    .fill("http://127.0.0.1:4010/fail");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.locator(".notice[role=alert]")).toContainText("CORS");
});

test("an in-flight request can be cancelled and is recorded", async ({
  page,
}) => {
  await page.goto("/dashboard/workspace");
  await page
    .getByRole("textbox", { name: "Request URL", exact: true })
    .fill("http://127.0.0.1:4010/slow");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".notice[role=alert]")).toContainText(
    "Request cancelled",
  );
  await page.goto("/dashboard/history");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Error");
});
