import { getJson, postJson, patchJson } from "./api";
import type {
    CandidaturaForCandidate,
    CreateCandidaturaRequest,
} from "@/types/candidatura";

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
        `/candidature/${idCandidatura}/stato?stato=${stato}`,
        {} // corpo vuoto per PATCH
    );
}
