// frontend/services/api.ts

/**
 * URL base per le chiamate API.
 * Se NEXT_PUBLIC_API_BASE è vuoto o solo spazi,
 * usa sempre il proxy locale "/api" (configurato in next.config.ts).
 */
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const API_BASE =
  RAW_BASE && RAW_BASE.trim() !== ""
    ? RAW_BASE.replace(/\/+$/, "")
    : "/api";


function isAbsolute(url: string) {
  return /^https?:\/\//i.test(url);
}

function join(base: string, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`; // es. "/api" + "/posizioni" -> "/api/posizioni"
}

export async function getJson<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = isAbsolute(path) ? path : join(API_BASE, path);
  const res = await fetch(url, { cache: "no-store", ...init });

  if (!res.ok) {
    const raw = await res.text().catch(() => res.statusText);
    const msg =
      raw && raw.startsWith("<!")
        ? `${res.status} ${res.statusText}`
        : raw;

    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
