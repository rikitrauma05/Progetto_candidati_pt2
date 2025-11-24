// frontend/services/test.service.ts

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
    TestCreateRequest,
} from "@/types/test";

// Riesporto per comodità lato componenti
export type { StrutturaTestDto as StrutturaTest };

/**
 * POST /api/test
 * Creazione di un nuovo test (lato HR) con domande + opzioni.
 */
export function createTest(payload: TestCreateRequest) {
    // postJson aggiunge già il prefisso /api, quindi qui usiamo /test
    return postJson<StrutturaTestDto>("/test", payload);
}

/**
 * GET /api/test/disponibili
 * Lista test disponibili per il candidato.
 */
export function getTestDisponibili() {
    return getJson<TestListItem[]>("/test/disponibili");
}

/**
 * GET /api/test/tentativi/miei
 * Storico tentativi del candidato loggato.
 */
export function getTentativiCandidato() {
    return getJson<TentativoListItem[]>("/test/tentativi/miei");
}

/**
 * GET /api/test/{idTest}/struttura
 * Struttura completa del test (intro + domande + opzioni).
 */
export function getStrutturaTest(idTest: number) {
    return getJson<StrutturaTestDto>(`/test/${idTest}/struttura`);
}

/**
 * POST /api/test/{idTest}/tentativi/avvia
 * Avvia un nuovo tentativo di test.
 */
export function avviaTest(idTest: number, body: AvviaTestRequest = {}) {
    return postJson<AvviaTestResponse>(
        `/test/${idTest}/tentativi/avvia`,
        body
    );
}

/**
 * GET /api/test/tentativi/{idTentativo}/domande
 * Domande di un tentativo.
 */
export function getDomandeTentativo(idTentativo: number) {
    return getJson<GetDomandeResponse>(
        `/test/tentativi/${idTentativo}/domande`
    );
}

/**
 * POST /api/test/tentativi/{idTentativo}/risposte
 * Invio risposte e calcolo esito.
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
 * GET /api/test/tentativi/{idTentativo}/risultati
 * Risultato dettagliato del tentativo.
 */
export function getRisultatoTentativo(idTentativo: number) {
    return getJson<RisultatoTentativoDettaglio>(
        `/test/tentativi/${idTentativo}/risultati`
    );
}
