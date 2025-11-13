import { getJson, postJson, patchJson } from "./api";
import type {
    CandidaturaForCandidate,
    CandidaturaForHR,
    CreateCandidaturaRequest,
    UpdateStatoCandidaturaRequest,
} from "@/types/candidatura";

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
