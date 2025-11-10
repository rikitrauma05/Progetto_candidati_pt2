export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/**
 * GET JSON semplice.
 * Se API_BASE è "", userai percorsi relativi (es. "/api/...") che passano dal proxy Next.
 * Se API_BASE è impostata (es. "http://localhost:8080/api"), chiamerai direttamente il backend.
 */
export async function getJson<T = any>(path: string): Promise<T> {
    const url = path.startsWith("http") ? path : API_BASE + path;
    const res = await fetch(url, { cache: "no-store" }); // dati sempre freschi in dev
    if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
}
