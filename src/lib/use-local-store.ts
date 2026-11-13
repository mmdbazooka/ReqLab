"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ZodType } from "zod";
/** Versioned, validated persistence. Corrupt data is never silently written over on mount. */
export function useLocalStore<T>(key: string, initial: T, schema: ZodType<T>) {
 const [data, setData] = useState<T>(initial);
 const [ready, setReady] = useState(false);
 const [error, setError] = useState("");
 const current = useRef(initial);
 useEffect(() => {
  const load = () => { try { const raw = localStorage.getItem(key); const parsed = raw ? schema.parse(JSON.parse(raw)) : initial; current.current = parsed; setData(parsed); setError(""); } catch { setError("storage"); } setReady(true); };
  load(); const sync = (event: StorageEvent) => { if (event.key === key) load(); }; window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync);
 }, [key, initial, schema]);
 const update = useCallback((value: T | ((previous: T) => T)) => {
  const next = typeof value === "function" ? (value as (previous: T) => T)(current.current) : value;
  const valid = schema.safeParse(next); if (!valid.success) { setError("invalid"); return; }
  try { localStorage.setItem(key, JSON.stringify(valid.data)); setError(""); } catch { setError("storage"); }
  current.current = valid.data; setData(valid.data);
 }, [key, schema]);
 return { data, update, ready, error };
}
