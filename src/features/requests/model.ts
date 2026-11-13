import { z } from "zod";
export const methods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;
export const pairSchema = z.object({
  id: z.string(),
  key: z.string().max(500),
  value: z.string().max(10000),
  enabled: z.boolean(),
});
export const requestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  method: z.enum(methods),
  url: z.string().max(10000),
  headers: z.array(pairSchema).max(100),
  body: z.string().max(200000),
  collectionId: z.string().nullable(),
  updatedAt: z.iso.datetime(),
});
export const environmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  variables: z.array(pairSchema).max(100),
});
export const responseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string().max(1000000),
  duration: z.number(),
  size: z.number(),
  truncated: z.boolean(),
});
const collectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
});
export const workspaceSchema = z
  .object({
    version: z.literal(1),
    draft: requestSchema
      .extend({ name: z.string().max(200) })
      .nullable()
      .default(null),
    draftSource: z.string().default(""),
    requests: z.array(requestSchema).max(2000),
    collections: z.array(collectionSchema).max(200),
    environments: z.array(environmentSchema).max(100),
    activeEnvironmentId: z.string().nullable(),
    history: z
      .array(
        z.object({
          id: z.string(),
          request: requestSchema,
          response: responseSchema.nullable(),
          error: z.string().nullable(),
          createdAt: z.iso.datetime(),
        }),
      )
      .max(50),
  })
  .refine(
    (data) =>
      [data.requests, data.collections, data.environments, data.history].every(
        (items) => new Set(items.map((i) => i.id)).size === items.length,
      ),
    "Duplicate IDs",
  );
export type Pair = z.infer<typeof pairSchema>;
export type ApiRequest = z.infer<typeof requestSchema>;
export type ApiResponse = z.infer<typeof responseSchema>;
export type Environment = z.infer<typeof environmentSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export function interpolate(value: string, variables: Pair[]) {
  const map = new Map(
    variables
      .filter((v) => v.enabled && v.key.trim())
      .map((v) => [v.key.trim(), v.value]),
  );
  return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, key: string) => {
    if (!map.has(key)) throw new Error(`Missing variable: ${key}`);
    return map.get(key)!;
  });
}
export function prepareRequest(request: ApiRequest, variables: Pair[]) {
  const url = new URL(interpolate(request.url, variables));
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (url.username || url.password)
    throw new Error("Use an Authorization header instead of URL credentials.");
  const headers = new Headers();
  for (const pair of request.headers) {
    if (pair.enabled && pair.key.trim())
      headers.set(
        interpolate(pair.key, variables),
        interpolate(pair.value, variables),
      );
  }
  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : interpolate(request.body, variables) || undefined;
  return {
    url: url.toString(),
    options: {
      method: request.method,
      headers,
      body,
      credentials: "omit" as const,
    },
  };
}
export function emptyRequest(): ApiRequest {
  return {
    id: crypto.randomUUID(),
    name: "Untitled request",
    method: "GET",
    url: "",
    headers: [
      {
        id: crypto.randomUUID(),
        key: "Accept",
        value: "application/json",
        enabled: true,
      },
    ],
    body: "",
    collectionId: null,
    updatedAt: new Date().toISOString(),
  };
}
export const initialWorkspace: Workspace = {
  version: 1,
  draft: null,
  draftSource: "",
  activeEnvironmentId: "development",
  environments: [
    {
      id: "development",
      name: "Development",
      variables: [
        {
          id: "base",
          key: "baseUrl",
          value: "https://jsonplaceholder.typicode.com",
          enabled: true,
        },
      ],
    },
    {
      id: "staging",
      name: "Staging",
      variables: [
        {
          id: "base-stage",
          key: "baseUrl",
          value: "https://jsonplaceholder.typicode.com",
          enabled: true,
        },
      ],
    },
  ],
  collections: [
    {
      id: "playground",
      name: "The example API",
      description:
        "A friendly place to start. Explore users, posts, and a JSON request body.",
    },
    {
      id: "experiments",
      name: "Little experiments",
      description: "A home for endpoints you’re still figuring out.",
    },
  ],
  requests: [
    {
      id: "get-user",
      name: "Get a user",
      method: "GET",
      url: "{{baseUrl}}/users/1",
      headers: [
        { id: "h1", key: "Accept", value: "application/json", enabled: true },
      ],
      body: "",
      collectionId: "playground",
      updatedAt: "2026-11-13T09:00:00.000Z",
    },
    {
      id: "list-posts",
      name: "List all posts",
      method: "GET",
      url: "{{baseUrl}}/posts?_limit=5",
      headers: [],
      body: "",
      collectionId: "playground",
      updatedAt: "2026-11-12T09:00:00.000Z",
    },
    {
      id: "create-post",
      name: "Create a post",
      method: "POST",
      url: "{{baseUrl}}/posts",
      headers: [
        {
          id: "h2",
          key: "Content-Type",
          value: "application/json",
          enabled: true,
        },
      ],
      body: '{\n  "title": "Something worth building",\n  "body": "A little idea, a lot of possibility.",\n  "userId": 1\n}',
      collectionId: "playground",
      updatedAt: "2026-11-11T09:00:00.000Z",
    },
    {
      id: "get-comments",
      name: "Explore comments",
      method: "GET",
      url: "{{baseUrl}}/comments?postId=1",
      headers: [],
      body: "",
      collectionId: "experiments",
      updatedAt: "2026-11-10T09:00:00.000Z",
    },
  ],
  history: [],
};
