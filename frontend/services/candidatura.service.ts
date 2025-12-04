import { getJson, postJson, API_BASE_URL } from "./api";
import type {
    CandidaturaForCandidate,
    CreateCandidaturaRequest,
} from "@/types/candidatura";
import { useAuthStore } from "@/store/authStore";

/**
 * Helper PATCH JSON autenticato.
 */
async function patchJson<T, B = unknown>(path: string, body?: B): Promise<T> {
    const { accessToken } = useAuthStore.getState();

    const headers = new Headers();
    headers.set("Accept", "application/json");

    if (body !== undefined) {
        headers.set("Content-Type", "application/json");
    }
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "PATCH",
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Errore HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as unknown as T;
    }

    return (await response.json()) as T;
}

/**
 * GET /candidature/mie
 * Tutte le candidature del candidato loggato.
 */
export function getCandidatureCandidato() {
    return getJson<CandidaturaForCandidate[]>("/candidature/mie");
}

/**
 * POST /candidature
 * Crea candidatura (solo check preliminare).
 */
export function createCandidatura(payload: CreateCandidaturaRequest) {
    return postJson<void, CreateCandidaturaRequest>("/candidature", payload);
}

/**
 * GET /posizioni/{id}/candidati
 * (Usato nella TOP5 HR)
 */
export function getCandidatiPerPosizione(idPosizione: number) {
    return getJson(`/posizioni/${idPosizione}/candidati`);
}

/**
 * PATCH /candidature/{id}/stato?stato=ACCETTATA / RESPINTA
 * Aggiorna lo stato lato HR.
 */
export function updateStatoCandidatura(
    idCandidatura: number,
    stato: "ACCETTATA" | "RESPINTA"
) {
    return patchJson<void>(
        `/candidature/${idCandidatura}/stato?stato=${stato}`
    );
}
