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

async function request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    init?: RequestInit
): Promise<T> {
    const url = isAbsolute(path) ? path : join(API_BASE, path);

    const res = await fetch(url, {
        cache: "no-store",
        credentials: "include", // cookie/sess. se li usate
        ...init,
        method,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const raw = await res.text().catch(() => res.statusText);
        const msg =
            raw && raw.startsWith("<!")
                ? `${res.status} ${res.statusText}`
                : raw;

        throw new Error(msg || `HTTP ${res.status}`);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
}

// services/api.ts

export async function postFormData<T = unknown>(
    path: string,
    formData: FormData,
    init?: RequestInit
): Promise<T> {
    const url = isAbsolute(path) ? path : join(API_BASE, path);

    const res = await fetch(url, {
        method: "POST",
        body: formData,
        // ATTENZIONE: **NON** mettere Content-Type qui.
        // Il browser aggiunge da solo "multipart/form-data; boundary=..."
        ...init,
    });

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

export async function getJson<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<T> {
    return request<T>("GET", path, undefined, init);
}

export function postJson<T = unknown, B = unknown>(
    path: string,
    body: B,
    init?: RequestInit
): Promise<T> {
    return request<T>("POST", path, body, init);
}

export function putJson<T = unknown, B = unknown>(
    path: string,
    body: B,
    init?: RequestInit
): Promise<T> {
    return request<T>("PUT", path, body, init);
}

export function patchJson<T = unknown, B = unknown>(
    path: string,
    body: B,
    init?: RequestInit
): Promise<T> {
    return request<T>("PATCH", path, body, init);
}

export function deleteJson<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<T> {
    return request<T>("DELETE", path, undefined, init);
}
