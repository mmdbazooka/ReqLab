import { afterEach, describe, expect, it, vi } from "vitest";
import { executeRequest } from "./client";
import { initialWorkspace, prepareRequest } from "./model";
const prepared = prepareRequest(
  initialWorkspace.requests[0],
  initialWorkspace.environments[0].variables,
);
afterEach(() => vi.unstubAllGlobals());
describe("bounded response streaming", () => {
  it("cancels oversized streams and captures only 100 KB", async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(100001)));
      },
      cancel() {
        cancelled = true;
      },
    });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { "content-type": "text/plain" },
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const result = await executeRequest(
      prepared,
      new AbortController(),
      performance.now(),
    );
    expect(result.truncated).toBe(true);
    expect(result.size).toBe(100000);
    expect(result.body).toHaveLength(100000);
    expect(cancelled).toBe(true);
    expect(fetcher).toHaveBeenCalledWith(
      prepared.url,
      expect.objectContaining({
        credentials: "omit",
        signal: expect.any(AbortSignal),
      }),
    );
  });
  it("preserves non-success responses for inspection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response('{"error":"Invalid input"}', {
          status: 422,
          statusText: "Unprocessable Entity",
        }),
      ),
    );
    const result = await executeRequest(
      prepared,
      new AbortController(),
      performance.now(),
    );
    expect(result.status).toBe(422);
    expect(JSON.parse(result.body).error).toBe("Invalid input");
    expect(result.truncated).toBe(false);
  });
  it("supports responses without a body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    const result = await executeRequest(
      prepared,
      new AbortController(),
      performance.now(),
    );
    expect(result.body).toBe("");
    expect(result.size).toBe(0);
    expect(result.status).toBe(204);
  });
});
