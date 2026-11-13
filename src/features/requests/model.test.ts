import { describe, it, expect } from "vitest";
import {
  interpolate,
  prepareRequest,
  initialWorkspace,
  workspaceSchema,
} from "./model";
const variables = initialWorkspace.environments[0].variables;
describe("request preparation", () => {
  it("interpolates repeated and whitespace-delimited environment variables", () => {
    expect(interpolate("{{ baseUrl }}/{{baseUrl}}", variables)).toBe(
      "https://jsonplaceholder.typicode.com/https://jsonplaceholder.typicode.com",
    );
  });
  it("rejects missing and disabled variables rather than sending unresolved tokens", () => {
    expect(() => interpolate("{{secret}}", variables)).toThrow(
      "Missing variable",
    );
    expect(() =>
      interpolate(
        "{{baseUrl}}",
        variables.map((v) => ({ ...v, enabled: false })),
      ),
    ).toThrow();
  });
  it("prepares headers, URLs and JSON bodies, but strips GET bodies", () => {
    const request = { ...initialWorkspace.requests[0], body: "ignored" };
    const result = prepareRequest(request, variables);
    expect(result.url).toBe("https://jsonplaceholder.typicode.com/users/1");
    expect(result.options.body).toBeUndefined();
    expect(result.options.headers.get("Accept")).toBe("application/json");
    const post = prepareRequest(initialWorkspace.requests[2], variables);
    expect(JSON.parse(post.options.body!).userId).toBe(1);
    expect(post.options.credentials).toBe("omit");
  });
  it("rejects unsafe schemes and credentials embedded in URLs", () => {
    for (const url of [
      "file:///etc/passwd",
      "javascript:alert(1)",
      "https://name:secret@example.com",
    ]) {
      expect(() =>
        prepareRequest({ ...initialWorkspace.requests[0], url }, []),
      ).toThrow();
    }
  });
  it("validates backup versions and unique entity IDs", () => {
    expect(workspaceSchema.safeParse(initialWorkspace).success).toBe(true);
    expect(
      workspaceSchema.safeParse({
        ...initialWorkspace,
        requests: [initialWorkspace.requests[0], initialWorkspace.requests[0]],
      }).success,
    ).toBe(false);
    expect(
      workspaceSchema.safeParse({ ...initialWorkspace, version: 2 }).success,
    ).toBe(false);
  });
});
