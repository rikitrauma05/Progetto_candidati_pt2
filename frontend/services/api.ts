import { useAuthStore } from "@/store/authStore";
import { refreshToken as callRefreshToken } from "@/services/auth.service";
import type { RefreshTokenResponse } from "@/types/auth";

// Base URL API
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
    method?: HttpMethod;
}

/**
 * Wrapper centrale per tutte le chiamate HTTP
 * - Gestisce automaticamente access token
 * - Rinnova token se scaduto
 * - Ritenta la richiesta originale dopo refresh
 */
async function request<T>(
    path: string,
    options: RequestOptions = {},
    skipTokenCheck: boolean = false
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    if (!skipTokenCheck) {
        await ensureFreshToken();
    }

    const headers = new Headers(options.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");

    const isFormData = options.body instanceof FormData;
    if (!isFormData && options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const currentToken = useAuthStore.getState().accessToken;
    if (!headers.has("Authorization") && currentToken) {
        headers.set("Authorization", `Bearer ${currentToken}`);
    }

    const doFetch = async () => fetch(url, { ...options, headers });

    let response = await doFetch();

    // --- Se il server dice 401 o 403 → tentiamo refresh token e retry ---
    if ((response.status === 401 || response.status === 403)) {
        const authStore = useAuthStore.getState();

        if (!authStore.refreshToken) {
            authStore.logout();
            throw new Error("SESSIONE_SCADUTA_RIFARE_LOGIN");
        }

        try {
            const refreshData: RefreshTokenResponse = await callRefreshToken(authStore.refreshToken);

            // 🔥 AGGIORNATO: usa il nuovo refreshToken se presente
            authStore.setTokens({
                accessToken: refreshData.accessToken,
                refreshToken: refreshData.refreshToken || authStore.refreshToken,
            });

            headers.set("Authorization", `Bearer ${refreshData.accessToken}`);
            response = await doFetch();

            if (response.status === 401 || response.status === 403) {
                authStore.logout();
                throw new Error("SESSIONE_SCADUTA_RIFARE_LOGIN");
            }

        } catch (err) {
            console.error("Refresh token fallito, logout", err);
            const authStore = useAuthStore.getState();
            authStore.logout();
            throw new Error("SESSIONE_SCADUTA_RIFARE_LOGIN");
        }
    }

    // --- Gestione risposta ---
    if (response.status === 204) return undefined as unknown as T;

    if (!response.ok) {
        let message = `HTTP Error ${response.status}`;
        try {
            const data = await response.json();
            if (typeof data === "string") message = data;
            else if ((data as any)?.message) message = (data as any).message;
        } catch {
            // lascio il messaggio generico
        }
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

function isTokenExpiringSoon(): boolean {
    const authStore = useAuthStore.getState();
    const token = authStore.accessToken;

    if (!token) return false;

    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const exp = payload.exp * 1000;
        const now = Date.now();
        const timeLeft = exp - now;
        const isExpiring = timeLeft < 5000;

        return isExpiring;
    } catch (err) {
        console.error("❌ Errore parsing JWT", err);
        return false;
    }
}

async function ensureFreshToken() {

    const authStore = useAuthStore.getState();
    const shouldRefresh = isTokenExpiringSoon();

    console.log("🔍 Checking token...", {
        shouldRefresh,
        hasRefreshToken: !!authStore.refreshToken
    });

    if (shouldRefresh && authStore.refreshToken) {
        try {
            const refreshData = await callRefreshToken(authStore.refreshToken);

            authStore.setTokens({
                accessToken: refreshData.accessToken,
                refreshToken: refreshData.refreshToken || authStore.refreshToken,
            });

        } catch (err) {
            console.error("Proactive refresh failed", err);
            authStore.logout();
            throw new Error("SESSIONE_SCADUTA_RIFARE_LOGIN");
        }
    } else {
        console.log("Skip refresh - token ancora valido");
    }
}

// --- HELPERS ---
export function getJson<T>(path: string) {
    return request<T>(path, { method: "GET" });
}

export function postJson<T, B = unknown>(path: string, body?: B, skipTokenCheck?: boolean) {
    return request<T>(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    }, skipTokenCheck);
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
