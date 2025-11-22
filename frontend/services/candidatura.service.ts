import { getJson, postJson, API_BASE_URL } from "./api";
import type {
    CandidaturaForCandidate,
    CandidaturaForHR,
    CreateCandidaturaRequest,
    UpdateStatoCandidaturaRequest,
} from "@/types/candidatura";
import { useAuthStore } from "@/store/authStore";

/**
 * Helper locale per chiamate PATCH con JSON + Bearer token.
 */
async function patchJson<T, B = unknown>(
    path: string,
    body?: B
): Promise<T> {
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

    if (response.status === 204) {
        return undefined as unknown as T;
    }

    return (await response.json()) as T;
}

/**
 * GET /candidature/mie
 * Lista candidature del candidato loggato.
 */
export function getCandidatureCandidato() {
    return getJson<CandidaturaForCandidate[]>("/candidature/mie");
}

/**
 * POST /candidature
 * Il candidato si candida a una posizione.
 */
export function createCandidatura(payload: CreateCandidaturaRequest) {
    return postJson<void, CreateCandidaturaRequest>("/candidature", payload);
}

/**
 * GET /hr/posizioni/{idPosizione}/candidature
 * Lista candidature per posizione lato HR.
 */
export function getCandidatureByPosizione(idPosizione: number) {
    return getJson<CandidaturaForHR[]>(
        `/hr/posizioni/${idPosizione}/candidature`
    );
}

/**
 * PATCH /hr/candidature/{idCandidatura}/stato
 * Aggiorna lo stato (SCARTATA, COLLOQUIO, ASSUNTO, ...).
 */
export function updateStatoCandidatura(
    idCandidatura: number,
    payload: UpdateStatoCandidaturaRequest
) {
    return patchJson<void, UpdateStatoCandidaturaRequest>(
        `/hr/candidature/${idCandidatura}/stato`,
        payload
    );
}
