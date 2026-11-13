import { prepareRequest, type ApiResponse } from "./model";
/** Stream at most 100 KB. Cancel the reader instead of buffering an unbounded response. */
export async function executeRequest(
  prepared: ReturnType<typeof prepareRequest>,
  controller: AbortController,
  started: number,
): Promise<ApiResponse> {
  const res = await fetch(prepared.url, {
    ...prepared.options,
    signal: controller.signal,
  });
  const reader = res.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let truncated = false;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = 100000 - size;
      if (value.length > remaining) {
        chunks.push(value.slice(0, remaining));
        size += remaining;
        truncated = true;
        await reader.cancel();
        break;
      }
      chunks.push(value);
      size += value.length;
    }
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return {
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries()),
    body: new TextDecoder().decode(bytes),
    duration: Math.round(performance.now() - started),
    size,
    truncated,
  };
}
