// /frontend/services/test.service.ts

import { getJson, postJson } from "./api";

import type {
    TestListItem,
    TentativoListItem,
    AvviaTestRequest,
    AvviaTestResponse,
    GetDomandeResponse,
    InviaRisposteRequest,
    InviaRisposteResponse,
    StrutturaTestDto,
    RisultatoTentativoDettaglio,
} from "@/types/test";

// Riesporto per comodità lato componenti
export type { StrutturaTestDto as StrutturaTest };

/**
 * GET /test/disponibili
 * Ritorna la lista dei test a cui il candidato può accedere.
 */
export function getTestDisponibili() {
    return getJson<TestListItem[]>("/test/disponibili");
}

/**
 * GET /test/tentativi/miei
 * Ritorna lo storico dei tentativi del candidato loggato.
 */
export function getTentativiCandidato() {
    return getJson<TentativoListItem[]>("/test/tentativi/miei");
}

/**
 * GET /test/{idTest}/struttura
 * Carica struttura completa del test (metadata + domande + opzioni).
 */
export function getStrutturaTest(idTest: number) {
    return getJson<StrutturaTestDto>(`/test/${idTest}/struttura`);
}

/**
 * POST /test/{idTest}/tentativi/avvia
 * Avvia un nuovo tentativo.
 */
export function avviaTest(idTest: number, body: AvviaTestRequest = {}) {
    return postJson<AvviaTestResponse>(
        `/test/${idTest}/tentativi/avvia`,
        body
    );
}

/**
 * GET /test/tentativi/{idTentativo}/domande
 * Ottiene le domande relative a un tentativo.
 */
export function getDomandeTentativo(idTentativo: number) {
    return getJson<GetDomandeResponse>(
        `/test/tentativi/${idTentativo}/domande`
    );
}

/**
 * POST /test/tentativi/{idTentativo}/risposte
 * Invia tutte le risposte e ottiene punteggio + esito.
 */
export function inviaRisposte(
    idTentativo: number,
    payload: InviaRisposteRequest
) {
    return postJson<InviaRisposteResponse>(
        `/test/tentativi/${idTentativo}/risposte`,
        payload
    );
}

/**
 * GET /test/tentativi/{idTentativo}/risultati
 * Ottiene i risultati dettagliati del tentativo.
 */
export function getRisultatoTentativo(idTentativo: number) {
    return getJson<RisultatoTentativoDettaglio>(
        `/test/tentativi/${idTentativo}/risultati`
    );
}
