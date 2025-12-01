// frontend/services/api.ts

import { useAuthStore } from "@/store/authStore";

// In .env.local metti esattamente:
// NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
    method?: HttpMethod;
}

/**
 * Wrapper generico per le chiamate HTTP.
 *
 * Modifica rispetto all'originale:
 * - se lo status è 409, NON viene lanciata un'eccezione,
 *   ma il body (se presente) viene restituito come risultato.
 */
async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const { accessToken } = useAuthStore.getState();

    const headers = new Headers(options.headers);

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    const isFormData = options.body instanceof FormData;

    if (!isFormData && options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    console.log("[API] request", url, options.method ?? "GET");

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Nessun contenuto
    if (response.status === 204) {
        return undefined as unknown as T;
    }

    // Se NON è ok
    if (!response.ok) {
        // Caso speciale: 409 → NON lancio errore, ritorno il body
        if (response.status === 409) {
            let data: any = undefined;
            try {
                data = await response.json();
            } catch {
                // nessun JSON/nessun body, lascio undefined
            }

            console.warn("[API] HTTP 409 gestito come risposta valida:", url, data);
            return (data as T) ?? ({} as T);
        }

        // Tutti gli altri errori come prima
        let message = `Errore HTTP ${response.status}`;

        try {
            const data = await response.json();
            if (typeof data === "string") {
                message = data;
            } else if ((data as any)?.message) {
                message = (data as any).message;
            }
        } catch {
            // se non è JSON, lascio il messaggio generico
        }

        throw new Error(message);
    }

    // 2xx con body
    return (await response.json()) as T;
}

// Helpers

export function getJson<T>(path: string) {
    return request<T>(path, { method: "GET" });
}

export function postJson<T, B = unknown>(path: string, body?: B) {
    return request<T>(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export function putJson<T, B = unknown>(path: string, body?: B) {
    return request<T>(path, {
        method: "PUT",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export function patchJson<T, B = unknown>(path: string, body?: B) {
    return request<T>(path, {
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

export function deleteJson<T, B = unknown>(path: string, body?: B) {
    return request<T>(path, {
        method: "DELETE",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}
