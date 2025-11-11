// frontend/services/api.ts

/**
 * URL base per le chiamate API.
 * Se NEXT_PUBLIC_API_BASE è vuoto, usa il proxy definito in next.config.ts.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

/**
 * Costruisce l’URL completo per la fetch.
 * Se il percorso è già assoluto (http://...), lo lascia invariato.
 */
function buildUrl(path: string) {
    return path.startsWith("http") ? path : API_BASE + path;
}

/**
 * Effettua una richiesta GET e restituisce il JSON tipizzato.
 * - Cache: "no-store" per ottenere dati sempre aggiornati in sviluppo.
 * - Lancia un errore se la risposta non è ok.
 */
export async function getJson<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(buildUrl(path), {
        cache: "no-store",
        ...init,
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}
